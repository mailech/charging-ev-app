import type { RequestHandler } from 'express';
import { forbidden, unauthorized } from '@/utils/http-error';

export const requireAdmin: RequestHandler = (req, _res, next) => {
    if (!req.user) return next(unauthorized());
    if (req.user.role !== 'ADMIN') return next(forbidden('Admin access required'));
    next();
};
