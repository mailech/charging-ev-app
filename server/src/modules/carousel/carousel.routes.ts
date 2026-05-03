import { Router } from 'express';
import {
    carouselUpdateSchema,
    slideReorderSchema,
    slideTogglePatchSchema,
    slideUpsertSchema,
} from '@trio/shared/carousel';
import { validate } from '@/middleware/validate';
import * as service from './carousel.service.js';

export const carouselPublicRouter: Router = Router();
carouselPublicRouter.get('/', async (_req, res, next) => {
    try {
        const carousel = await service.getDefault();
        res.json({
            ...carousel,
            slides: carousel.slides.filter((s) => s.enabled),
        });
    } catch (err) {
        next(err);
    }
});

export const carouselAdminRouter: Router = Router();

carouselAdminRouter.get('/', async (_req, res, next) => {
    try {
        res.json(await service.getDefault());
    } catch (err) {
        next(err);
    }
});

carouselAdminRouter.patch('/', validate(carouselUpdateSchema), async (req, res, next) => {
    try {
        res.json(await service.update(req.body));
    } catch (err) {
        next(err);
    }
});

carouselAdminRouter.post('/slides', validate(slideUpsertSchema), async (req, res, next) => {
    try {
        res.status(201).json(await service.addSlide(req.body));
    } catch (err) {
        next(err);
    }
});

carouselAdminRouter.patch('/slides/:id', validate(slideUpsertSchema), async (req, res, next) => {
    try {
        res.json(await service.updateSlide(String(req.params.id), req.body));
    } catch (err) {
        next(err);
    }
});

carouselAdminRouter.patch('/slides/:id/toggle', validate(slideTogglePatchSchema), async (req, res, next) => {
    try {
        res.json(await service.toggleSlide(String(req.params.id), req.body.enabled));
    } catch (err) {
        next(err);
    }
});

carouselAdminRouter.delete('/slides/:id', async (req, res, next) => {
    try {
        res.json(await service.removeSlide(String(req.params.id)));
    } catch (err) {
        next(err);
    }
});

carouselAdminRouter.post('/slides/reorder', validate(slideReorderSchema), async (req, res, next) => {
    try {
        res.json(await service.reorder(req.body));
    } catch (err) {
        next(err);
    }
});
