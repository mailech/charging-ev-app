import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
    if (transporter) return transporter;
    if (!env.SMTP_HOST || !env.SMTP_PORT) return null;

    transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: Boolean(env.SMTP_SECURE),
        auth:
            env.SMTP_USER && env.SMTP_PASS
                ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
                : undefined,
    });
    return transporter;
}

export interface SendMailInput {
    to: string;
    subject: string;
    text: string;
    replyTo?: string;
}

export async function sendMail(input: SendMailInput): Promise<{ messageId: string | null }> {
    const t = getTransporter();
    const from = env.SMTP_FROM ?? env.SMTP_USER;

    if (!t || !from) {
        logger.warn(
            { to: input.to, subject: input.subject },
            'SMTP not configured — mail not sent (logging payload only)',
        );
        return { messageId: null };
    }

    const info = await t.sendMail({
        from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        replyTo: input.replyTo,
    });

    return { messageId: info.messageId ?? null };
}

export function isMailerConfigured(): boolean {
    return Boolean(env.SMTP_HOST && env.SMTP_PORT && (env.SMTP_FROM || env.SMTP_USER));
}
