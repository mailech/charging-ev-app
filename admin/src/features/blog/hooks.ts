import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
    CategoryUpsertInput,
    PostListQuery,
    PostStatus,
    PostUpsertInput,
    TagUpsertInput,
} from '@trio/shared/blog';
import * as api from './api';

export const blogKeys = {
    posts: (params: Partial<PostListQuery>) => ['blog', 'posts', params] as const,
    post: (id: string) => ['blog', 'post', id] as const,
    categories: () => ['blog', 'categories'] as const,
    tags: () => ['blog', 'tags'] as const,
    media: (kind?: string) => ['blog', 'media', kind ?? 'all'] as const,
};

export function usePostsQuery(params: Partial<PostListQuery>) {
    return useQuery({ queryKey: blogKeys.posts(params), queryFn: () => api.listPosts(params) });
}
export function usePostQuery(id: string | undefined) {
    return useQuery({
        queryKey: blogKeys.post(id ?? ''),
        queryFn: () => api.getPost(id!),
        enabled: Boolean(id),
    });
}
export function useCategoriesQuery() {
    return useQuery({ queryKey: blogKeys.categories(), queryFn: api.listCategories });
}
export function useTagsQuery() {
    return useQuery({ queryKey: blogKeys.tags(), queryFn: api.listTags });
}
export function useMediaQuery(kind?: 'IMAGE' | 'VIDEO' | 'FILE') {
    return useQuery({ queryKey: blogKeys.media(kind), queryFn: () => api.listMedia(kind) });
}

export function useUploadMediaMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ file, alt }: { file: File; alt?: string }) => api.uploadMedia(file, alt),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['blog', 'media'] }),
    });
}
export function useDeleteMediaMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteMedia(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['blog', 'media'] }),
    });
}

export function useCreatePostMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: PostUpsertInput) => api.createPost(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['blog', 'posts'] }),
    });
}
export function useUpdatePostMutation(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: PostUpsertInput) => api.updatePost(id, input),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: blogKeys.post(id) });
            qc.invalidateQueries({ queryKey: ['blog', 'posts'] });
        },
    });
}
export function useSetPostStatusMutation(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (status: PostStatus) => api.setPostStatus(id, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: blogKeys.post(id) });
            qc.invalidateQueries({ queryKey: ['blog', 'posts'] });
        },
    });
}
export function useDeletePostMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deletePost(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['blog', 'posts'] }),
    });
}

export function useCreateCategoryMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: CategoryUpsertInput) => api.createCategory(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.categories() }),
    });
}
export function useUpdateCategoryMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: CategoryUpsertInput }) =>
            api.updateCategory(id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.categories() }),
    });
}
export function useDeleteCategoryMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteCategory(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.categories() }),
    });
}

export function useCreateTagMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: TagUpsertInput) => api.createTag(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.tags() }),
    });
}
export function useUpdateTagMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: TagUpsertInput }) =>
            api.updateTag(id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.tags() }),
    });
}
export function useDeleteTagMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteTag(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: blogKeys.tags() }),
    });
}
