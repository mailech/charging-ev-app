import type {
    Category,
    CategoryUpsertInput,
    Media,
    Post,
    PostListQuery,
    PostListResponse,
    PostStatus,
    PostUpsertInput,
    Tag,
    TagUpsertInput,
} from '@trio/shared/blog';
import { api } from '@/lib/axios';

export async function listMedia(kind?: 'IMAGE' | 'VIDEO' | 'FILE'): Promise<Media[]> {
    const { data } = await api.get('/api/admin/media', { params: kind ? { kind } : undefined });
    return data;
}

export async function uploadMedia(
    file: File,
    alt?: string,
    onProgress?: (pct: number) => void,
): Promise<Media> {
    const fd = new FormData();
    fd.append('file', file);
    if (alt) fd.append('alt', alt);
    const { data } = await api.post('/api/admin/media/upload', fd, {
        timeout: 5 * 60 * 1000,
        onUploadProgress: (evt) => {
            if (!onProgress || !evt.total) return;
            onProgress(Math.round((evt.loaded / evt.total) * 100));
        },
    });
    return data;
}

export async function deleteMedia(id: string): Promise<void> {
    await api.delete(`/api/admin/media/${id}`);
}

export async function listCategories(): Promise<Category[]> {
    const { data } = await api.get('/api/admin/blog/categories');
    return data;
}
export async function createCategory(input: CategoryUpsertInput): Promise<Category> {
    const { data } = await api.post('/api/admin/blog/categories', input);
    return data;
}
export async function updateCategory(id: string, input: CategoryUpsertInput): Promise<Category> {
    const { data } = await api.patch(`/api/admin/blog/categories/${id}`, input);
    return data;
}
export async function deleteCategory(id: string): Promise<void> {
    await api.delete(`/api/admin/blog/categories/${id}`);
}

export async function listTags(): Promise<Tag[]> {
    const { data } = await api.get('/api/admin/blog/tags');
    return data;
}
export async function createTag(input: TagUpsertInput): Promise<Tag> {
    const { data } = await api.post('/api/admin/blog/tags', input);
    return data;
}
export async function updateTag(id: string, input: TagUpsertInput): Promise<Tag> {
    const { data } = await api.patch(`/api/admin/blog/tags/${id}`, input);
    return data;
}
export async function deleteTag(id: string): Promise<void> {
    await api.delete(`/api/admin/blog/tags/${id}`);
}

export async function listPosts(params: Partial<PostListQuery>): Promise<PostListResponse> {
    const { data } = await api.get('/api/admin/blog/posts', { params });
    return data;
}
export async function getPost(id: string): Promise<Post> {
    const { data } = await api.get(`/api/admin/blog/posts/${id}`);
    return data;
}
export async function createPost(input: PostUpsertInput): Promise<Post> {
    const { data } = await api.post('/api/admin/blog/posts', input);
    return data;
}
export async function updatePost(id: string, input: PostUpsertInput): Promise<Post> {
    const { data } = await api.patch(`/api/admin/blog/posts/${id}`, input);
    return data;
}
export async function setPostStatus(id: string, status: PostStatus): Promise<Post> {
    const { data } = await api.post(`/api/admin/blog/posts/${id}/status`, { status });
    return data;
}
export async function deletePost(id: string): Promise<void> {
    await api.delete(`/api/admin/blog/posts/${id}`);
}
