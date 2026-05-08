import type { RequestHandler } from 'express';
import crypto from 'node:crypto';
import { env } from '@/config/env.js';
import { forbidden } from '@/utils/http-error.js';

export const CSRF_COOKIE = 'csrf_token';
export const CSRF_HEADER = 'x-csrf-token';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function cookieOptions() {
    const isProd = env.NODE_ENV === 'production';
    return {
        httpOnly: false,
        secure: isProd,
        sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
        path: '/',
    };
}

export const issueCsrfToken: RequestHandler = (req, res, next) => {
    let token = req.cookies?.[CSRF_COOKIE];
    if (!token) {
        token = crypto.randomBytes(32).toString('hex');
        res.cookie(CSRF_COOKIE, token, cookieOptions());
    }
    res.locals.csrfToken = token;
    next();
};

export const requireCsrf: RequestHandler = (req, _res, next) => {
    if (SAFE_METHODS.has(req.method)) return next();

    const cookieToken = req.cookies?.[CSRF_COOKIE];
    if (!cookieToken) return next();

    const headerToken = req.header(CSRF_HEADER);
    if (!headerToken || headerToken !== cookieToken) {
        return next(forbidden('Invalid CSRF token'));
    }
    next();
};
