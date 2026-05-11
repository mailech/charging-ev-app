import type { RequestHandler } from 'express';
import * as inquiryService from './inquiry.service.js';
import * as settingsService from '@/modules/settings/settings.service.js';
import * as autoReplyService from '@/modules/auto-reply/auto-reply.service.js';
import { sendMail, isMailerConfigured } from '@/lib/mailer';
import { logger } from '@/lib/logger';
import { badRequest } from '@/utils/http-error';
import type {
    InquiryBulkIdsInput,
    InquiryBulkStatusInput,
    InquiryListQuery,
    InquiryNoteCreateInput,
    InquiryReplyCreateInput,
    InquiryUpdateInput,
    PublicInquirySubmitInput,
} from './inquiry.schema.js';

function renderTemplate(tpl: string, vars: Record<string, string>): string {
    return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? '');
}

function fireAutoReply(input: PublicInquirySubmitInput) {
    void (async () => {
        try {
            if (!isMailerConfigured()) return;
            const cfg = await settingsService.getAutoReply();
            if (!cfg.enabled) return;
            const tpl = await autoReplyService.getActive();
            if (!tpl) return;
            const vars = { name: input.name, subject: input.subject, email: input.email };
            await sendMail({
                to: input.email,
                subject: renderTemplate(tpl.subject, vars),
                text: renderTemplate(tpl.body, vars),
            });
        } catch (err) {
            logger.warn({ err, to: input.email }, 'Auto-reply failed');
        }
    })();
}

export const submitPublicHandler: RequestHandler<unknown, unknown, PublicInquirySubmitInput> =
    async (req, res, next) => {
        try {
            if (req.body.hp_field) {
                res.status(200).json({ ok: true });
                return;
            }
            const created = await inquiryService.submitPublic(req.body);
            fireAutoReply(req.body);
            res.status(201).json({ id: created.id, createdAt: created.createdAt });
        } catch (err) {
            next(err);
        }
    };

export const listHandler: RequestHandler = async (req, res, next) => {
    try {
        res.json(await inquiryService.list(req.query as unknown as InquiryListQuery));
    } catch (err) {
        next(err);
    }
};

export const detailHandler: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        res.json(await inquiryService.getById(req.params.id));
    } catch (err) {
        next(err);
    }
};

export const updateHandler: RequestHandler<{ id: string }, unknown, InquiryUpdateInput> = async (
    req,
    res,
    next,
) => {
    try {
        res.json(await inquiryService.update(req.params.id, req.body));
    } catch (err) {
        next(err);
    }
};

export const addNoteHandler: RequestHandler<{ id: string }, unknown, InquiryNoteCreateInput> =
    async (req, res, next) => {
        try {
            res.status(201).json(
                await inquiryService.addNote(req.params.id, req.user!.sub, req.body),
            );
        } catch (err) {
            next(err);
        }
    };

export const sendReplyHandler: RequestHandler<{ id: string }, unknown, InquiryReplyCreateInput> =
    async (req, res, next) => {
        try {
            res.status(201).json(
                await inquiryService.sendReply(req.params.id, req.user!.sub, req.body),
            );
        } catch (err) {
            next(err);
        }
    };

export const sendAutoReplyHandler: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        if (!isMailerConfigured()) {
            throw badRequest('Email is not configured on the server');
        }
        const tpl = await autoReplyService.getActive();
        if (!tpl) {
            throw badRequest('No active auto-reply template');
        }
        const inquiry = await inquiryService.getById(req.params.id);
        const vars = { name: inquiry.name, subject: inquiry.subject, email: inquiry.email };
        const reply = await inquiryService.sendReply(req.params.id, req.user!.sub, {
            subject: renderTemplate(tpl.subject, vars),
            body: renderTemplate(tpl.body, vars),
        });
        res.status(201).json(reply);
    } catch (err) {
        next(err);
    }
};

export const bulkStatusHandler: RequestHandler<unknown, unknown, InquiryBulkStatusInput> = async (
    req,
    res,
    next,
) => {
    try {
        const result = await inquiryService.bulkUpdateStatus(req.body.ids, req.body.status);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const bulkDeleteHandler: RequestHandler<unknown, unknown, InquiryBulkIdsInput> = async (
    req,
    res,
    next,
) => {
    try {
        const result = await inquiryService.bulkDelete(req.body.ids);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const bulkAutoReplyHandler: RequestHandler<unknown, unknown, InquiryBulkIdsInput> = async (
    req,
    res,
    next,
) => {
    try {
        if (!isMailerConfigured()) {
            throw badRequest('Email is not configured on the server');
        }
        const tpl = await autoReplyService.getActive();
        if (!tpl) {
            throw badRequest('No active auto-reply template');
        }

        let sent = 0;
        let skipped = 0;
        let failed = 0;

        for (const id of req.body.ids) {
            try {
                const inquiry = await inquiryService.getById(id);
                const vars = {
                    name: inquiry.name,
                    subject: inquiry.subject,
                    email: inquiry.email,
                };
                await inquiryService.sendReply(id, req.user!.sub, {
                    subject: renderTemplate(tpl.subject, vars),
                    body: renderTemplate(tpl.body, vars),
                });
                sent += 1;
            } catch (err) {
                logger.warn({ err, inquiryId: id }, 'Bulk auto-reply: send failed');
                if ((err as { status?: number })?.status === 404) skipped += 1;
                else failed += 1;
            }
        }

        res.json({ sent, skipped, failed });
    } catch (err) {
        next(err);
    }
};

export const statsHandler: RequestHandler = async (_req, res, next) => {
    try {
        res.json(await inquiryService.getStats());
    } catch (err) {
        next(err);
    }
};

export const countsHandler: RequestHandler = async (_req, res, next) => {
    try {
        res.json(await inquiryService.getCounts());
    } catch (err) {
        next(err);
    }
};

export const exportCsvHandler: RequestHandler = async (req, res, next) => {
    try {
        const csv = await inquiryService.exportCsv(
            req.query as unknown as Pick<InquiryListQuery, 'status' | 'q' | 'assignedToId'>,
        );
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="inquiries.csv"');
        res.send(csv);
    } catch (err) {
        next(err);
    }
};
