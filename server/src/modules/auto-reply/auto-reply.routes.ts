import { Router, type RequestHandler } from 'express';
import { validate } from '@/middleware/validate';
import {
    autoReplyTemplateCreateSchema,
    autoReplyTemplateUpdateSchema,
    type AutoReplyTemplateCreateInput,
    type AutoReplyTemplateUpdateInput,
} from './auto-reply.schema.js';
import * as service from './auto-reply.service.js';

const listHandler: RequestHandler = async (_req, res, next) => {
    try {
        res.json(await service.list());
    } catch (err) {
        next(err);
    }
};

const createHandler: RequestHandler<unknown, unknown, AutoReplyTemplateCreateInput> = async (
    req,
    res,
    next,
) => {
    try {
        res.status(201).json(await service.create(req.body));
    } catch (err) {
        next(err);
    }
};

const updateHandler: RequestHandler<{ id: string }, unknown, AutoReplyTemplateUpdateInput> = async (
    req,
    res,
    next,
) => {
    try {
        res.json(await service.update(req.params.id, req.body));
    } catch (err) {
        next(err);
    }
};

const activateHandler: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        res.json(await service.activate(req.params.id));
    } catch (err) {
        next(err);
    }
};

const deleteHandler: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        await service.remove(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

export const autoReplyAdminRouter: Router = Router();
autoReplyAdminRouter.get('/templates', listHandler);
autoReplyAdminRouter.post('/templates', validate(autoReplyTemplateCreateSchema), createHandler);
autoReplyAdminRouter.patch(
    '/templates/:id',
    validate(autoReplyTemplateUpdateSchema),
    updateHandler,
);
autoReplyAdminRouter.post('/templates/:id/activate', activateHandler);
autoReplyAdminRouter.delete('/templates/:id', deleteHandler);
