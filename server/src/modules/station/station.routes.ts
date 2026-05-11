import { Router } from 'express';
import { stationTogglePatchSchema, stationUpsertSchema } from '@trio/shared/station';
import { validate } from '@/middleware/validate';
import * as service from './station.service.js';

export const stationPublicRouter: Router = Router();
stationPublicRouter.get('/', async (_req, res, next) => {
    try {
        res.json(await service.listEnabled());
    } catch (err) {
        next(err);
    }
});

export const stationAdminRouter: Router = Router();

stationAdminRouter.get('/', async (_req, res, next) => {
    try {
        res.json(await service.list());
    } catch (err) {
        next(err);
    }
});

stationAdminRouter.post('/', validate(stationUpsertSchema), async (req, res, next) => {
    try {
        res.status(201).json(await service.create(req.body));
    } catch (err) {
        next(err);
    }
});

stationAdminRouter.patch('/:id', validate(stationUpsertSchema), async (req, res, next) => {
    try {
        res.json(await service.update(String(req.params.id), req.body));
    } catch (err) {
        next(err);
    }
});

stationAdminRouter.patch('/:id/toggle', validate(stationTogglePatchSchema), async (req, res, next) => {
    try {
        res.json(await service.toggle(String(req.params.id), req.body.enabled));
    } catch (err) {
        next(err);
    }
});

stationAdminRouter.delete('/:id', async (req, res, next) => {
    try {
        res.json(await service.remove(String(req.params.id)));
    } catch (err) {
        next(err);
    }
});
