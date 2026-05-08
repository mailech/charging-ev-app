import { Router } from 'express';
import { z } from 'zod';
import { validate } from '@/middleware/validate.js';
import * as usersService from './users.service.js';

const listQuerySchema = z.object({
    role: z.enum(['USER', 'ADMIN']).optional(),
});

export const usersAdminRouter: Router = Router();

usersAdminRouter.get('/', validate(listQuerySchema, 'query'), async (req, res, next) => {
    try {
        const query = req.query as z.infer<typeof listQuerySchema>;
        res.json(await usersService.list(query.role));
    } catch (err) {
        next(err);
    }
});
