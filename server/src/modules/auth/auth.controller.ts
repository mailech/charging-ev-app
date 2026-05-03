import type { RequestHandler } from 'express';
import * as authService from './auth.service.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';
import { ADMIN_SESSION_COOKIE } from '@/middleware/auth';
import { env } from '@/config/env';

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function setSessionCookie(res: Parameters<RequestHandler>[1], token: string) {
    res.cookie(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE_MS,
    });
}

function clearSessionCookie(res: Parameters<RequestHandler>[1]) {
    res.clearCookie(ADMIN_SESSION_COOKIE, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    });
}

export const registerHandler: RequestHandler<unknown, unknown, RegisterInput> = async (
    req,
    res,
    next,
) => {
    try {
        const result = await authService.register(req.body);
        if (result.user.role === 'ADMIN') setSessionCookie(res, result.token);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const loginHandler: RequestHandler<unknown, unknown, LoginInput> = async (
    req,
    res,
    next,
) => {
    try {
        const result = await authService.login(req.body);
        if (result.user.role === 'ADMIN') setSessionCookie(res, result.token);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const meHandler: RequestHandler = async (req, res, next) => {
    try {
        res.json(await authService.me(req.user!.sub));
    } catch (err) {
        next(err);
    }
};

export const logoutHandler: RequestHandler = (_req, res) => {
    clearSessionCookie(res);
    res.json({ ok: true });
};

export const csrfHandler: RequestHandler = (_req, res) => {
    res.json({ token: res.locals.csrfToken });
};
