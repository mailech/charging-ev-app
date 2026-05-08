import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '@/middleware/validate.js';
import { prisma } from '@/lib/prisma.js';
import { logger } from '@/lib/logger.js';

const trackBodySchema = z.object({
    path: z.string().min(1).max(512),
    referrer: z.string().max(512).optional().nullable(),
});

const trackLimiter = rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

function makeVisitorId(ip: string, ua: string): string {
    return crypto.createHash('sha256').update(`${ip}|${ua}`).digest('hex').slice(0, 32);
}

export const trackRouter: Router = Router();

trackRouter.post('/', trackLimiter, validate(trackBodySchema), (req, res) => {
    const { path, referrer } = req.body as z.infer<typeof trackBodySchema>;
    const ip = (req.ip ?? '').slice(0, 64) || '';
    const ua = (req.get('user-agent') ?? '').slice(0, 200) || '';
    prisma.visit
        .create({
            data: {
                path: path.slice(0, 200),
                ip: ip || null,
                ua: ua || null,
                referrer: referrer ? referrer.slice(0, 200) : null,
                visitorId: ip || ua ? makeVisitorId(ip, ua) : null,
            },
        })
        .catch((err) => logger.warn({ err }, 'track visit failed'));
    res.status(204).end();
});
