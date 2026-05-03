import type { RequestHandler } from 'express';
import * as inquiryService from './inquiry.service.js';
import type {
    InquiryListQuery,
    InquiryNoteCreateInput,
    InquiryUpdateInput,
    PublicInquirySubmitInput,
} from './inquiry.schema.js';

export const submitPublicHandler: RequestHandler<unknown, unknown, PublicInquirySubmitInput> =
    async (req, res, next) => {
        try {
            if (req.body.hp_field) {
                res.status(200).json({ ok: true });
                return;
            }
            const created = await inquiryService.submitPublic(req.body);
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
