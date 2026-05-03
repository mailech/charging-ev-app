import { Router } from 'express';
import multer from 'multer';
import { deleteHandler, listHandler, uploadHandler } from './media.controller.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 64 * 1024 * 1024 },
});

export const mediaAdminRouter: Router = Router();

mediaAdminRouter.get('/', listHandler);
mediaAdminRouter.post('/upload', upload.single('file'), uploadHandler);
mediaAdminRouter.delete('/:id', deleteHandler);
