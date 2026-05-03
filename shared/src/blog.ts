import { z } from 'zod';

export const postStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export type PostStatus = z.infer<typeof postStatusSchema>;

export const POST_STATUSES: PostStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

export const mediaKindSchema = z.enum(['IMAGE', 'VIDEO', 'FILE']);
export type MediaKind = z.infer<typeof mediaKindSchema>;

export const mediaVariantSchema = z.object({
    key: z.string(),
    width: z.number().nullable(),
    height: z.number().nullable(),
});

export const mediaSchema = z.object({
    id: z.string(),
    kind: mediaKindSchema,
    url: z.string(),
    thumbUrl: z.string().nullable(),
    variants: z.array(mediaVariantSchema),
    mime: z.string(),
    size: z.number(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    alt: z.string().nullable(),
    createdAt: z.string(),
});
export type Media = z.infer<typeof mediaSchema>;

export const categoryUpsertSchema = z.object({
    name: z.string().min(1).max(80),
    slug: z
        .string()
        .min(1)
        .max(80)
        .regex(/^[a-z0-9-]+$/)
        .optional(),
});
export type CategoryUpsertInput = z.infer<typeof categoryUpsertSchema>;

export const categorySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
});
export type Category = z.infer<typeof categorySchema>;

export const tagUpsertSchema = z.object({
    name: z.string().min(1).max(40),
    slug: z
        .string()
        .min(1)
        .max(40)
        .regex(/^[a-z0-9-]+$/)
        .optional(),
});
export type TagUpsertInput = z.infer<typeof tagUpsertSchema>;

export const tagSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
});
export type Tag = z.infer<typeof tagSchema>;

export const postUpsertSchema = z.object({
    title: z.string().min(1).max(200),
    slug: z
        .string()
        .min(1)
        .max(200)
        .regex(/^[a-z0-9-]+$/)
        .optional(),
    excerpt: z.string().max(500).nullable().optional(),
    content: z.unknown(),
    status: postStatusSchema.optional(),
    coverMediaId: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    tagIds: z.array(z.string()).optional(),
    seoTitle: z.string().max(200).nullable().optional(),
    seoDescription: z.string().max(500).nullable().optional(),
});
export type PostUpsertInput = z.infer<typeof postUpsertSchema>;

export const postListQuerySchema = z.object({
    status: postStatusSchema.optional(),
    q: z.string().max(200).optional(),
    categoryId: z.string().optional(),
    tagId: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
});
export type PostListQuery = z.infer<typeof postListQuerySchema>;

export const postSummarySchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    excerpt: z.string().nullable(),
    status: postStatusSchema,
    coverMedia: mediaSchema.nullable(),
    category: categorySchema.nullable(),
    tags: z.array(tagSchema),
    publishedAt: z.string().nullable(),
    readingMinutes: z.number(),
    author: z.object({ id: z.string(), name: z.string().nullable(), email: z.string() }).nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export type PostSummary = z.infer<typeof postSummarySchema>;

export const postSchema = postSummarySchema.extend({
    content: z.unknown(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
});
export type Post = z.infer<typeof postSchema>;

export const postListResponseSchema = z.object({
    items: z.array(postSummarySchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
});
export type PostListResponse = z.infer<typeof postListResponseSchema>;
