import dns from 'node:dns';
import net from 'node:net';
import { createApp } from '@/app';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

// Prefer IPv4 for DNS — many providers (e.g. Neon over AWS) misbehave on IPv6 in serverless.
dns.setDefaultResultOrder('ipv4first');

// Node's Happy Eyeballs default 250ms per-address timeout is too short for high-latency
// routes to managed Postgres. Give TCP enough time to actually complete.
const setAttemptTimeout = (
    net as unknown as { setDefaultAutoSelectFamilyAttemptTimeout?: (ms: number) => void }
).setDefaultAutoSelectFamilyAttemptTimeout;
setAttemptTimeout?.(5000);

export const app = createApp();
export default app;

const isServerless =
    process.env.VERCEL === '1'

if (!isServerless) {
    const server = app.listen(env.PORT, () => {
        logger.info(`Server listening on http://localhost:${env.PORT}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
            logger.fatal(`Port ${env.PORT} already in use.`);
        } else {
            logger.fatal({ err }, 'Failed to start server');
        }
        process.exit(1);
    });

    const shutdown = async (signal: string) => {
        logger.info(`${signal} received, shutting down…`);
        server.close(() => logger.info('HTTP server closed'));
        try {
            await prisma.$disconnect();
            logger.info('Prisma disconnected');
        } catch {
            /* ignore */
        }
        setTimeout(() => process.exit(0), 500).unref();
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('unhandledRejection', (reason) => {
        logger.error({ reason }, 'Unhandled rejection');
    });
    process.on('uncaughtException', (err) => {
        logger.fatal({ err }, 'Uncaught exception');
        process.exit(1);
    });
}
