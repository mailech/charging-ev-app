import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { apiRouter } from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/error';

export function createApp() {
    const app = express();

    app.disable('x-powered-by');
    app.set('trust proxy', 1);
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: 'cross-origin' },
        }),
    );
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(pinoHttp({ logger }));

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', uptime: process.uptime() });
    });

    app.use('/api', apiRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
