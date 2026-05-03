import type { RequestHandler } from 'express';
import * as mediaService from './media.service.js';
import { badRequest } from '@/utils/http-error';
import { logger } from '@/lib/logger';
import { HttpError } from '@/utils/http-error';

export const uploadHandler: RequestHandler = async (req, res, next) => {
    try {
        if (!req.file) throw badRequest('No file uploaded (field name: "file")');
        const isVideo = req.file.mimetype.startsWith('video/');
        const payload = {
            buffer: req.file.buffer,
            mimetype: req.file.mimetype,
            originalName: req.file.originalname,
            uploadedById: req.user!.sub,
            alt: typeof req.body?.alt === 'string' ? req.body.alt : null,
        };
        const created = isVideo
            ? await mediaService.uploadVideo(payload)
            : await mediaService.uploadImage(payload);
        res.status(201).json(mediaService.shapeMedia(created));
    } catch (err) {
        if (!(err instanceof HttpError)) {
            logger.error(
                {
                    err,
                    file: req.file
                        ? {
                              name: req.file.originalname,
                              mime: req.file.mimetype,
                              size: req.file.size,
                          }
                        : null,
                },
                'media upload failed',
            );
        }
        next(err);
    }
};

export const listHandler: RequestHandler = async (req, res, next) => {
    try {
        const kind = (req.query.kind as 'IMAGE' | 'VIDEO' | 'FILE' | undefined) ?? undefined;
        const items = await mediaService.list(kind);
        res.json(items.map(mediaService.shapeMedia));
    } catch (err) {
        next(err);
    }
};

export const deleteHandler: RequestHandler<{ id: string }> = async (req, res, next) => {
    try {
        res.json(await mediaService.remove(String(req.params.id)));
    } catch (err) {
        next(err);
    }
};
