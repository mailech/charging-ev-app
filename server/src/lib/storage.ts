import crypto from 'node:crypto';
import path from 'node:path';
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@/config/env';

const s3 = new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: env.S3_FORCE_PATH_STYLE,
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
});

const BUCKET = env.S3_BUCKET;

function safeExt(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    if (!/^\.[a-z0-9]{1,8}$/.test(ext)) return '';
    return ext;
}

export function newKey(originalName: string, suffix?: string): string {
    const ext = safeExt(originalName);
    const id = crypto.randomBytes(12).toString('hex');
    const yyyy = new Date().getUTCFullYear();
    const mm = String(new Date().getUTCMonth() + 1).padStart(2, '0');
    return `uploads/${yyyy}/${mm}/${id}${suffix ? `-${suffix}` : ''}${ext}`;
}

export async function putBuffer(
    key: string,
    body: Buffer,
    contentType: string,
    cacheControl = 'public, max-age=31536000, immutable',
): Promise<void> {
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: body,
            ContentType: contentType,
            CacheControl: cacheControl,
        }),
    );
}

export async function deleteKey(key: string): Promise<void> {
    if (!key) return;
    try {
        await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    } catch {
        /* ignore */
    }
}

export function publicUrl(key: string): string {
    if (!key) return '';
    if (env.S3_PUBLIC_URL) {
        return `${env.S3_PUBLIC_URL.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
    }
    if (env.S3_ENDPOINT) {
        const base = env.S3_ENDPOINT.replace(/\/$/, '');
        return env.S3_FORCE_PATH_STYLE
            ? `${base}/${BUCKET}/${key}`
            : `${base.replace(/^https?:\/\//, (m) => `${m}${BUCKET}.`)}/${key}`;
    }
    return `https://${BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${key}`;
}

export async function signedDownloadUrl(key: string, expiresInSec = 60 * 60): Promise<string> {
    return getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: BUCKET, Key: key }),
        { expiresIn: expiresInSec },
    );
}

export async function signedUploadUrl(
    key: string,
    contentType: string,
    expiresInSec = 60 * 5,
): Promise<string> {
    return getSignedUrl(
        s3,
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            ContentType: contentType,
        }),
        { expiresIn: expiresInSec },
    );
}
