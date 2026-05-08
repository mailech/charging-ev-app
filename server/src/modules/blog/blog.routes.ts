import { Router } from 'express';
import { z } from 'zod';
import {
    categoryUpsertSchema,
    postListQuerySchema,
    postStatusSchema,
    postUpsertSchema,
    tagUpsertSchema,
} from '@trio/shared/blog';
import { validate } from '@/middleware/validate.js';
import * as categoryService from './category.service.js';
import * as tagService from './tag.service.js';
import * as postService from './post.service.js';

export const blogAdminRouter: Router = Router();

blogAdminRouter.get('/categories', async (_req, res, next) => {
    try {
        res.json(await categoryService.list());
    } catch (err) {
        next(err);
    }
});
blogAdminRouter.post('/categories', validate(categoryUpsertSchema), async (req, res, next) => {
    try {
        res.status(201).json(await categoryService.create(req.body));
    } catch (err) {
        next(err);
    }
});
blogAdminRouter.patch('/categories/:id', validate(categoryUpsertSchema), async (req, res, next) => {
    try {
        res.json(await categoryService.update(String(req.params.id), req.body));
    } catch (err) {
        next(err);
    }
});
blogAdminRouter.delete('/categories/:id', async (req, res, next) => {
    try {
        res.json(await categoryService.remove(String(req.params.id)));
    } catch (err) {
        next(err);
    }
});

blogAdminRouter.get('/tags', async (_req, res, next) => {
    try {
        res.json(await tagService.list());
    } catch (err) {
        next(err);
    }
});
blogAdminRouter.post('/tags', validate(tagUpsertSchema), async (req, res, next) => {
    try {
        res.status(201).json(await tagService.create(req.body));
    } catch (err) {
        next(err);
    }
});
blogAdminRouter.patch('/tags/:id', validate(tagUpsertSchema), async (req, res, next) => {
    try {
        res.json(await tagService.update(String(req.params.id), req.body));
    } catch (err) {
        next(err);
    }
});
blogAdminRouter.delete('/tags/:id', async (req, res, next) => {
    try {
        res.json(await tagService.remove(String(req.params.id)));
    } catch (err) {
        next(err);
    }
});

blogAdminRouter.get(
    '/posts',
    validate(postListQuerySchema, 'query'),
    async (req, res, next) => {
        try {
            res.json(await postService.list(req.query as never));
        } catch (err) {
            next(err);
        }
    },
);
blogAdminRouter.get('/posts/:id', async (req, res, next) => {
    try {
        res.json(await postService.getByIdAdmin(String(req.params.id)));
    } catch (err) {
        next(err);
    }
});
blogAdminRouter.post('/posts', validate(postUpsertSchema), async (req, res, next) => {
    try {
        res.status(201).json(await postService.create(req.user!.sub, req.body));
    } catch (err) {
        next(err);
    }
});
blogAdminRouter.patch('/posts/:id', validate(postUpsertSchema), async (req, res, next) => {
    try {
        res.json(await postService.update(String(req.params.id), req.body));
    } catch (err) {
        next(err);
    }
});

const statusBodySchema = z.object({ status: postStatusSchema });
blogAdminRouter.post(
    '/posts/:id/status',
    validate(statusBodySchema),
    async (req, res, next) => {
        try {
            res.json(await postService.changeStatus(String(req.params.id), req.body.status));
        } catch (err) {
            next(err);
        }
    },
);
blogAdminRouter.delete('/posts/:id', async (req, res, next) => {
    try {
        res.json(await postService.remove(String(req.params.id)));
    } catch (err) {
        next(err);
    }
});

export const blogPublicRouter: Router = Router();
blogPublicRouter.get('/categories', async (_req, res, next) => {
    try {
        res.json(await categoryService.list());
    } catch (err) {
        next(err);
    }
});
blogPublicRouter.get('/tags', async (_req, res, next) => {
    try {
        res.json(await tagService.list());
    } catch (err) {
        next(err);
    }
});
blogPublicRouter.get(
    '/posts',
    validate(postListQuerySchema, 'query'),
    async (req, res, next) => {
        try {
            res.json(await postService.list(req.query as never, { onlyPublished: true }));
        } catch (err) {
            next(err);
        }
    },
);
blogPublicRouter.get('/posts/:slug', async (req, res, next) => {
    try {
        res.json(await postService.getBySlugPublic(String(req.params.slug)));
    } catch (err) {
        next(err);
    }
});
