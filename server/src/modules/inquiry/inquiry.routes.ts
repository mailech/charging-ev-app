import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '@/middleware/validate';
import {
    inquiryBulkIdsSchema,
    inquiryBulkStatusSchema,
    inquiryListQuerySchema,
    inquiryNoteCreateSchema,
    inquiryReplyCreateSchema,
    inquiryUpdateSchema,
    publicInquirySubmitSchema,
} from './inquiry.schema.js';
import {
    addNoteHandler,
    bulkAutoReplyHandler,
    bulkDeleteHandler,
    bulkStatusHandler,
    countsHandler,
    detailHandler,
    exportCsvHandler,
    listHandler,
    sendAutoReplyHandler,
    sendReplyHandler,
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
inquiryAdminRouter.patch(
    '/bulk-status',
    validate(inquiryBulkStatusSchema),
    bulkStatusHandler,
);
inquiryAdminRouter.post(
    '/bulk-auto-reply',
    validate(inquiryBulkIdsSchema),
    bulkAutoReplyHandler,
);
inquiryAdminRouter.delete('/bulk', validate(inquiryBulkIdsSchema), bulkDeleteHandler);
inquiryAdminRouter.get('/', validate(inquiryListQuerySchema, 'query'), listHandler);
inquiryAdminRouter.get('/:id', detailHandler);
inquiryAdminRouter.patch('/:id', validate(inquiryUpdateSchema), updateHandler);
inquiryAdminRouter.post('/:id/notes', validate(inquiryNoteCreateSchema), addNoteHandler);
inquiryAdminRouter.post('/:id/replies', validate(inquiryReplyCreateSchema), sendReplyHandler);
inquiryAdminRouter.post('/:id/send-auto-reply', sendAutoReplyHandler);
