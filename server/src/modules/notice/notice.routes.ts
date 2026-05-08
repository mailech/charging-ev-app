import { Router } from 'express';
import { noticeUpdateSchema } from '@trio/shared/notice';
import { validate } from '@/middleware/validate.js';
import * as service from './notice.service.js';

export const noticePublicRouter: Router = Router();
noticePublicRouter.get('/', async (_req, res, next) => {
    try {
        const notice = await service.get();
        if (!notice.enabled) {
            res.json(null);
            return;
        }
        res.json(notice);
    } catch (err) {
        next(err);
    }
});

export const noticeAdminRouter: Router = Router();
noticeAdminRouter.get('/', async (_req, res, next) => {
    try {
        res.json(await service.get());
    } catch (err) {
        next(err);
    }
});
noticeAdminRouter.patch('/', validate(noticeUpdateSchema), async (req, res, next) => {
    try {
        res.json(await service.update(req.body));
    } catch (err) {
        next(err);
    }
});
