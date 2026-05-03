import type { Post, PostListResponse } from '@trio/shared/blog';
import { api } from './axios';

export async function listPublicPosts(params: { page?: number; categoryId?: string; tagId?: string; q?: string } = {}): Promise<PostListResponse> {
    const { data } = await api.get('/api/blog/posts', { params: { ...params, limit: 12 } });
    return data;
}

export async function getPublicPost(slug: string): Promise<Post> {
    const { data } = await api.get(`/api/blog/posts/${slug}`);
    return data;
}

export function mediaUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (/^https?:/.test(url)) return url;
    const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
    return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}
