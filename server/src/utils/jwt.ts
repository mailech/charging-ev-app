import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Role } from '@trio/shared/auth';
import { env } from '@/config/env';

export type JwtPayload = {
    sub: string;
    email: string;
    role: Role;
};

export function signToken(payload: JwtPayload, options?: SignOptions) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
        ...options,
    });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
