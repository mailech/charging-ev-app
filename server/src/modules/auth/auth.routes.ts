import { Router } from 'express';
import { validate } from '@/middleware/validate';
import { requireAuth } from '@/middleware/auth';
import { issueCsrfToken } from '@/middleware/csrf';
import { loginSchema, registerSchema } from './auth.schema.js';
import {
    csrfHandler,
    loginHandler,
    logoutHandler,
    meHandler,
    registerHandler,
} from './auth.controller.js';

export const authRouter: Router = Router();

authRouter.get('/csrf', issueCsrfToken, csrfHandler);
authRouter.post('/register', validate(registerSchema), registerHandler);
authRouter.post('/login', validate(loginSchema), loginHandler);
authRouter.post('/logout', logoutHandler);
authRouter.get('/me', requireAuth, meHandler);
