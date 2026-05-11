import sharp from 'sharp';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';
import { deleteKey, newKey, publicUrl, putBuffer } from '@/lib/storage.js';
import { badRequest, notFound } from '@/utils/http-error.js';

const VARIANTS = [1600, 800, 400] as const;
const MAX_BYTES = 8 * 1024 * 1024;
const VIDEO_MAX_BYTES = 64 * 1024 * 1024;
const ALLOWED_VIDEO_MIME = new Set([
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-matroska',
]);

interface UploadInput {
    buffer: Buffer;
    mimetype: string;
    originalName: string;
    uploadedById: string;
    alt?: string | null;
}

const mediaSelect = {
    id: true,
    kind: true,
    originalKey: true,
    thumbKey: true,
    variants: true,
    mime: true,
    size: true,
    width: true,
    height: true,
    duration: true,
    alt: true,
    createdAt: true,
} satisfies Prisma.MediaSelect;

type RawMedia = Prisma.MediaGetPayload<{ select: typeof mediaSelect }>;

export async function uploadImage(input: UploadInput) {
    if (!input.mimetype.startsWith('image/')) {
        throw badRequest('Only image uploads supported');
    }
    if (input.buffer.length > MAX_BYTES) {
        throw badRequest('Image larger than 8 MB');
    }

    let meta: sharp.Metadata;
    try {
        meta = await sharp(input.buffer).metadata();
    } catch (err) {
        const e = err as { message?: string };
        throw badRequest(`Could not read image: ${e.message ?? 'unknown'}`);
    }
    const baseName = input.originalName.replace(/\.[a-z0-9]+$/i, '') || 'image';
    const ext = '.webp';

    const originalKey = newKey(`${baseName}${ext}`);
    let originalBuf: Buffer;
    try {
        originalBuf = await sharp(input.buffer).rotate().webp({ quality: 90 }).toBuffer();
    } catch (err) {
        const e = err as { message?: string };
        throw badRequest(`Image conversion failed: ${e.message ?? 'unknown'}`);
    }
    try {
        await putBuffer(originalKey, originalBuf, 'image/webp');
    } catch (err) {
        const e = err as { name?: string; message?: string; Code?: string };
        const detail = e.Code ?? e.name ?? e.message ?? 'unknown';
        throw badRequest(`Storage upload failed: ${detail}`);
    }

    const variants: { key: string; width: number | null; height: number | null }[] = [];
    for (const w of VARIANTS) {
        if (meta.width && meta.width <= w) continue;
        const key = newKey(`${baseName}${ext}`, `${w}`);
        const out = await sharp(input.buffer)
            .rotate()
            .resize({ width: w, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer();
        try {
            await putBuffer(key, out, 'image/webp');
        } catch (err) {
            const e = err as { name?: string; message?: string; Code?: string };
            const detail = e.Code ?? e.name ?? e.message ?? 'unknown';
            throw badRequest(`Storage upload failed (variant ${w}): ${detail}`);
        }
        const m = await sharp(out).metadata();
        variants.push({ key, width: m.width ?? null, height: m.height ?? null });
    }

    const thumbKey = newKey(`${baseName}${ext}`, 'thumb');
    const thumbBuf = await sharp(input.buffer)
        .rotate()
        .resize({ width: 240, height: 240, fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();
    try {
        await putBuffer(thumbKey, thumbBuf, 'image/webp');
    } catch (err) {
        const e = err as { name?: string; message?: string; Code?: string };
        const detail = e.Code ?? e.name ?? e.message ?? 'unknown';
        throw badRequest(`Storage upload failed (thumb): ${detail}`);
    }

    return prisma.media.create({
        data: {
            kind: 'IMAGE',
            originalKey,
            thumbKey,
            variants,
            mime: 'image/webp',
            size: originalBuf.length,
            width: meta.width ?? null,
            height: meta.height ?? null,
            alt: input.alt ?? null,
            uploadedById: input.uploadedById,
        },
        select: mediaSelect,
    });
}

export async function uploadVideo(input: UploadInput) {
    if (!input.mimetype.startsWith('video/')) {
        throw badRequest(`Unsupported file type: ${input.mimetype || 'unknown'}`);
    }
    if (!ALLOWED_VIDEO_MIME.has(input.mimetype)) {
        throw badRequest(
            `Video format ${input.mimetype} not supported. Allowed: mp4, webm, ogg, mov, mkv`,
        );
    }
    if (input.buffer.length === 0) {
        throw badRequest('Video file is empty');
    }
    if (input.buffer.length > VIDEO_MAX_BYTES) {
        const sizeMb = (input.buffer.length / (1024 * 1024)).toFixed(1);
        const limitMb = (VIDEO_MAX_BYTES / (1024 * 1024)).toFixed(0);
        throw badRequest(`Video is ${sizeMb} MB; max allowed is ${limitMb} MB`);
    }
    const key = newKey(input.originalName);
    try {
        await putBuffer(key, input.buffer, input.mimetype);
    } catch (err) {
        const e = err as { name?: string; message?: string; Code?: string };
        const detail = e.Code ?? e.name ?? e.message ?? 'unknown';
        throw badRequest(`Storage upload failed: ${detail}`);
    }
    return prisma.media.create({
        data: {
            kind: 'VIDEO',
            originalKey: key,
            thumbKey: null,
            variants: [],
            mime: input.mimetype,
            size: input.buffer.length,
            width: null,
            height: null,
            alt: input.alt ?? null,
            uploadedById: input.uploadedById,
        },
        select: mediaSelect,
    });
}

export async function list(kind?: 'IMAGE' | 'VIDEO' | 'FILE', limit = 60) {
    return prisma.media.findMany({
        where: kind ? { kind } : undefined,
        select: mediaSelect,
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}

export async function remove(id: string) {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw notFound('Media not found');
    await prisma.media.delete({ where: { id } });
    await deleteKey(media.originalKey);
    if (media.thumbKey) await deleteKey(media.thumbKey);
    for (const v of (media.variants as { key: string }[]) ?? []) {
        await deleteKey(v.key);
    }
    return { ok: true };
}

export function shapeMedia(m: RawMedia) {
    const variants =
        (m.variants as { key: string; width: number | null; height: number | null }[]) ?? [];
    return {
        id: m.id,
        kind: m.kind,
        url: publicUrl(m.originalKey),
        thumbUrl: m.thumbKey ? publicUrl(m.thumbKey) : null,
        variants: variants.map((v) => ({
            key: publicUrl(v.key),
            width: v.width,
            height: v.height,
        })),
        mime: m.mime,
        size: m.size,
        width: m.width,
        height: m.height,
        alt: m.alt,
        createdAt: m.createdAt,
    };
}
