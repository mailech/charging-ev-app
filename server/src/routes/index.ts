import { Router } from 'express';
import { authRouter } from '@/modules/auth/auth.routes.js';
import {
    inquiryAdminRouter,
    inquiryPublicRouter,
} from '@/modules/inquiry/inquiry.routes.js';
import { usersAdminRouter } from '@/modules/users/users.routes.js';
import { dashboardAdminRouter } from '@/modules/dashboard/dashboard.routes.js';
import { mediaAdminRouter } from '@/modules/media/media.routes.js';
import { blogAdminRouter, blogPublicRouter } from '@/modules/blog/blog.routes.js';
import { trackRouter } from '@/modules/track/track.routes.js';
import { carouselAdminRouter, carouselPublicRouter } from '@/modules/carousel/carousel.routes.js';
import { noticeAdminRouter, noticePublicRouter } from '@/modules/notice/notice.routes.js';
import { requireAuth } from '@/middleware/auth.js';
import { requireAdmin } from '@/middleware/requireAdmin.js';
import { requireCsrf } from '@/middleware/csrf.js';

export const apiRouter: Router = Router();

apiRouter.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/track', trackRouter);
apiRouter.use('/inquiries', inquiryPublicRouter);
apiRouter.use('/blog', blogPublicRouter);
apiRouter.use('/carousel', carouselPublicRouter);
apiRouter.use('/notice', noticePublicRouter);

const adminRouter: Router = Router();
adminRouter.use(requireAuth, requireAdmin, requireCsrf);
adminRouter.use('/inquiries', inquiryAdminRouter);
adminRouter.use('/users', usersAdminRouter);
adminRouter.use('/dashboard', dashboardAdminRouter);
adminRouter.use('/media', mediaAdminRouter);
adminRouter.use('/blog', blogAdminRouter);
adminRouter.use('/carousel', carouselAdminRouter);
adminRouter.use('/notice', noticeAdminRouter);

apiRouter.use('/admin', adminRouter);
