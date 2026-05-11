import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import { HttpError } from '@/utils/http-error.js';
import { logger } from '@/lib/logger.js';
import { env } from '@/config/env.js';

export const notFoundHandler: RequestHandler = (req, res) => {
    res.status(404).json({ error: 'Not found', path: req.originalUrl });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: err.flatten() });
        return;
    }

    if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message, details: err.details });
        return;
    }

    if (err instanceof MulterError) {
        const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 64 MB)' : err.message;
        res.status(400).json({ error: msg, code: err.code });
        return;
    }

    logger.error({ err }, 'Unhandled error');
    const e = err as { message?: string; name?: string; code?: string; Code?: string };
    const detail = e.Code ?? e.code ?? e.name ?? e.message;
    if (env.NODE_ENV !== 'production' && detail) {
        res.status(500).json({ error: `Internal server error: ${detail}` });
        return;
    }
    res.status(500).json({ error: 'Internal server error' });
};
