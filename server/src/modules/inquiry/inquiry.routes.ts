import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '@/middleware/validate';
import {
    inquiryListQuerySchema,
    inquiryNoteCreateSchema,
    inquiryUpdateSchema,
    publicInquirySubmitSchema,
} from './inquiry.schema.js';
import {
    addNoteHandler,
    countsHandler,
    detailHandler,
    exportCsvHandler,
    listHandler,
    statsHandler,
    submitPublicHandler,
    updateHandler,
} from './inquiry.controller.js';

const submitLimiter = rateLimit({
    windowMs: 60_000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

export const inquiryPublicRouter: Router = Router();
inquiryPublicRouter.post(
    '/',
    submitLimiter,
    validate(publicInquirySubmitSchema),
    submitPublicHandler,
);

export const inquiryAdminRouter: Router = Router();
inquiryAdminRouter.get('/stats', statsHandler);
inquiryAdminRouter.get('/counts', countsHandler);
inquiryAdminRouter.get('/export', exportCsvHandler);
inquiryAdminRouter.get('/', validate(inquiryListQuerySchema, 'query'), listHandler);
inquiryAdminRouter.get('/:id', detailHandler);
inquiryAdminRouter.patch('/:id', validate(inquiryUpdateSchema), updateHandler);
inquiryAdminRouter.post('/:id/notes', validate(inquiryNoteCreateSchema), addNoteHandler);
