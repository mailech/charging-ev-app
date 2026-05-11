import { Router } from 'express';
import { siteSettingUpdateSchema } from '@trio/shared/settings';
import { validate } from '@/middleware/validate';
import * as service from './settings.service.js';

export const settingsPublicRouter: Router = Router();
settingsPublicRouter.get('/', async (_req, res, next) => {
    try {
        const s = await service.get();
        res.json({
            registeredAddress: s.registeredAddress,
            officeAddress: s.officeAddress,
            phone: s.phone,
            email: s.email,
            contactCtaUrl: s.contactCtaUrl,
            socials: s.socials.filter((x) => x.enabled !== false),
        });
    } catch (err) {
        next(err);
    }
});

export const settingsAdminRouter: Router = Router();
settingsAdminRouter.get('/', async (_req, res, next) => {
    try {
        res.json(await service.get());
    } catch (err) {
        next(err);
    }
});
settingsAdminRouter.patch('/', validate(siteSettingUpdateSchema), async (req, res, next) => {
    try {
        res.json(await service.update(req.body));
    } catch (err) {
        next(err);
    }
});
