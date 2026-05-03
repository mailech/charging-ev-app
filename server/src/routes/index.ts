import { Router } from 'express';
import { authRouter } from '@/modules/auth/auth.routes';
import {
    inquiryAdminRouter,
    inquiryPublicRouter,
} from '@/modules/inquiry/inquiry.routes';
import { usersAdminRouter } from '@/modules/users/users.routes';
import { dashboardAdminRouter } from '@/modules/dashboard/dashboard.routes';
import { mediaAdminRouter } from '@/modules/media/media.routes';
import { blogAdminRouter, blogPublicRouter } from '@/modules/blog/blog.routes';
import { trackRouter } from '@/modules/track/track.routes';
import { carouselAdminRouter, carouselPublicRouter } from '@/modules/carousel/carousel.routes';
import { noticeAdminRouter, noticePublicRouter } from '@/modules/notice/notice.routes';
import { requireAuth } from '@/middleware/auth';
import { requireAdmin } from '@/middleware/requireAdmin';
import { requireCsrf } from '@/middleware/csrf';

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
