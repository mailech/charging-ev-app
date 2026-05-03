import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

type Source = 'body' | 'query' | 'params';

export const validate =
    (schema: ZodSchema, source: Source = 'body'): RequestHandler =>
    (req, _res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) return next(result.error);
        (req as Record<Source, unknown>)[source] = result.data;
        next();
    };
