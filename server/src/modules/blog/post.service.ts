import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { conflict, notFound } from '@/utils/http-error';
import { calcReadingMinutes, makeSlug } from '@/lib/slug';
import { shapeMedia } from '@/modules/media/media.service';
import type { PostListQuery, PostStatus, PostUpsertInput } from '@trio/shared/blog';

const summarySelect = {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    status: true,
    coverMedia: {
        select: {
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
        },
    },
    category: { select: { id: true, name: true, slug: true } },
    tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
    publishedAt: true,
    readingMinutes: true,
    author: { select: { id: true, name: true, email: true } },
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.PostSelect;

const fullSelect = {
    ...summarySelect,
    content: true,
    seoTitle: true,
    seoDescription: true,
} satisfies Prisma.PostSelect;

type RawPost = Prisma.PostGetPayload<{ select: typeof fullSelect }>;

function shapePost<T extends Pick<RawPost, 'tags' | 'coverMedia'> & Record<string, unknown>>(p: T) {
    return {
        ...p,
        coverMedia: p.coverMedia ? shapeMedia(p.coverMedia) : null,
        tags: p.tags.map((pt) => pt.tag),
    };
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
    const root = makeSlug(base);
    let slug = root;
    let i = 2;
    while (true) {
        const existing = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
        if (!existing || existing.id === ignoreId) return slug;
        slug = `${root}-${i++}`;
    }
}

export async function list(query: PostListQuery, opts: { onlyPublished?: boolean } = {}) {
    const { status, q, categoryId, tagId, page, limit } = query;
    const where: Prisma.PostWhereInput = {
        ...(opts.onlyPublished
            ? { status: 'PUBLISHED', publishedAt: { lte: new Date() } }
            : status && { status }),
        ...(categoryId && { categoryId }),
        ...(tagId && { tags: { some: { tagId } } }),
        ...(q && {
            OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { excerpt: { contains: q, mode: 'insensitive' } },
            ],
        }),
    };

    const [items, total] = await Promise.all([
        prisma.post.findMany({
            where,
            select: summarySelect,
            orderBy: opts.onlyPublished
                ? [{ publishedAt: 'desc' }]
                : [{ updatedAt: 'desc' }],
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.post.count({ where }),
    ]);

    return { items: items.map(shapePost), total, page, limit };
}

export async function getByIdAdmin(id: string) {
    const p = await prisma.post.findUnique({ where: { id }, select: fullSelect });
    if (!p) throw notFound('Post not found');
    return shapePost(p);
}

export async function getBySlugPublic(slug: string) {
    const p = await prisma.post.findUnique({ where: { slug }, select: fullSelect });
    if (!p || p.status !== 'PUBLISHED' || !p.publishedAt || p.publishedAt > new Date()) {
        throw notFound('Post not found');
    }
    return shapePost(p);
}

export async function create(authorId: string, input: PostUpsertInput) {
    const slug = await uniqueSlug(input.slug ?? input.title);
    const reading = calcReadingMinutes(input.content);
    const status = input.status ?? 'DRAFT';
    return prisma.post
        .create({
            data: {
                authorId,
                slug,
                title: input.title,
                excerpt: input.excerpt ?? null,
                content: (input.content ?? {}) as Prisma.InputJsonValue,
                status,
                coverMediaId: input.coverMediaId ?? null,
                categoryId: input.categoryId ?? null,
                seoTitle: input.seoTitle ?? null,
                seoDescription: input.seoDescription ?? null,
                readingMinutes: reading,
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                tags: input.tagIds?.length
                    ? { create: input.tagIds.map((tagId) => ({ tagId })) }
                    : undefined,
            },
            select: fullSelect,
        })
        .then(shapePost);
}

export async function update(id: string, input: PostUpsertInput) {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) throw notFound('Post not found');
    const data: Prisma.PostUpdateInput = {
        title: input.title,
        excerpt: input.excerpt ?? null,
        content: (input.content ?? {}) as Prisma.InputJsonValue,
        coverMedia: input.coverMediaId
            ? { connect: { id: input.coverMediaId } }
            : input.coverMediaId === null
              ? { disconnect: true }
              : undefined,
        category: input.categoryId
            ? { connect: { id: input.categoryId } }
            : input.categoryId === null
              ? { disconnect: true }
              : undefined,
        seoTitle: input.seoTitle ?? null,
        seoDescription: input.seoDescription ?? null,
        readingMinutes: calcReadingMinutes(input.content),
    };

    if (input.slug && input.slug !== existing.slug) {
        const candidate = await uniqueSlug(input.slug, existing.id);
        if (candidate !== input.slug) throw conflict('Slug already in use');
        data.slug = candidate;
    } else if (!existing.slug && input.title) {
        data.slug = await uniqueSlug(input.title, existing.id);
    }

    if (input.status && input.status !== existing.status) {
        data.status = input.status;
        if (input.status === 'PUBLISHED' && !existing.publishedAt) {
            data.publishedAt = new Date();
        }
    }

    if (input.tagIds) {
        await prisma.postTag.deleteMany({ where: { postId: id } });
        if (input.tagIds.length) {
            await prisma.postTag.createMany({
                data: input.tagIds.map((tagId) => ({ postId: id, tagId })),
            });
        }
    }

    return prisma.post.update({ where: { id }, data, select: fullSelect }).then(shapePost);
}

export async function changeStatus(id: string, status: PostStatus) {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) throw notFound('Post not found');
    return prisma.post
        .update({
            where: { id },
            data: {
                status,
                publishedAt:
                    status === 'PUBLISHED'
                        ? (existing.publishedAt ?? new Date())
                        : existing.publishedAt,
            },
            select: fullSelect,
        })
        .then(shapePost);
}

export async function remove(id: string) {
    await prisma.post.delete({ where: { id } });
    return { ok: true };
}
