import type { RequestHandler } from 'express';
import { verifyToken, type JwtPayload } from '@/utils/jwt';
import { unauthorized } from '@/utils/http-error';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const ADMIN_SESSION_COOKIE = 'admin_session';

function readToken(req: Parameters<RequestHandler>[0]): string | null {
    const cookieToken = req.cookies?.[ADMIN_SESSION_COOKIE];
    if (typeof cookieToken === 'string' && cookieToken.length > 0) return cookieToken;

    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) return header.slice(7);

    return null;
}

export const requireAuth: RequestHandler = (req, _res, next) => {
    const token = readToken(req);
    if (!token) return next(unauthorized('Missing authentication'));

    try {
        req.user = verifyToken(token);
        next();
    } catch {
        next(unauthorized('Invalid or expired token'));
    }
};
