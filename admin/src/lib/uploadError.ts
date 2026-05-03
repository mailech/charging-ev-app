export const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 64 * 1024 * 1024;
export const ALLOWED_VIDEO_MIME = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-matroska',
];

export function preflightFile(f: File, kind: 'image' | 'video' | 'auto' = 'auto'): string | null {
    if (f.size === 0) return 'File is empty';
    const isVideo = f.type.startsWith('video/');
    const isImage = f.type.startsWith('image/');
    if (kind === 'video' && !isVideo) {
        return `Expected a video file; got ${f.type || 'unknown type'}`;
    }
    if (kind === 'image' && !isImage) {
        return `Expected an image file; got ${f.type || 'unknown type'}`;
    }
    if (kind === 'auto' && !isVideo && !isImage) {
        return f.type
            ? `Unsupported type: ${f.type}`
            : 'Unrecognized file type. Use a standard image or video.';
    }
    if (isVideo) {
        if (!ALLOWED_VIDEO_MIME.includes(f.type)) {
            return `Video format ${f.type} not supported. Use mp4, webm, ogg, mov, or mkv.`;
        }
        if (f.size > VIDEO_MAX_BYTES) {
            return `Video is ${(f.size / 1024 / 1024).toFixed(1)} MB; max 64 MB`;
        }
    }
    if (isImage && f.size > IMAGE_MAX_BYTES) {
        return `Image is ${(f.size / 1024 / 1024).toFixed(1)} MB; max 8 MB`;
    }
    return null;
}

export function extractUploadError(err: unknown): string {
    const e = err as {
        response?: { data?: { error?: string }; status?: number };
        message?: string;
        code?: string;
    };
    if (e?.response?.data?.error) return e.response.data.error;
    if (e?.code === 'ERR_NETWORK') return 'Network error — server unreachable';
    if (e?.code === 'ECONNABORTED') return 'Upload timed out — file may be too large or connection too slow';
    if (e?.response?.status === 413) return 'File too large for server';
    if (e?.response?.status === 401) return 'Not authenticated';
    if (e?.response?.status === 403) return 'CSRF or permission error';
    return e?.message ?? 'Upload failed';
}
