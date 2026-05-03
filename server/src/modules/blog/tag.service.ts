import { prisma } from '@/lib/prisma';
import { conflict, notFound } from '@/utils/http-error';
import { makeSlug } from '@/lib/slug';
import type { TagUpsertInput } from '@trio/shared/blog';

const select = { id: true, name: true, slug: true } as const;

export async function list() {
    return prisma.tag.findMany({ select, orderBy: { name: 'asc' } });
}

export async function create(input: TagUpsertInput) {
    const slug = input.slug ?? makeSlug(input.name);
    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) throw conflict('Tag slug already exists');
    return prisma.tag.create({ data: { name: input.name, slug }, select });
}

export async function update(id: string, input: TagUpsertInput) {
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) throw notFound('Tag not found');
    const slug = input.slug ?? makeSlug(input.name);
    if (slug !== existing.slug) {
        const clash = await prisma.tag.findUnique({ where: { slug } });
        if (clash) throw conflict('Tag slug already exists');
    }
    return prisma.tag.update({ where: { id }, data: { name: input.name, slug }, select });
}

export async function remove(id: string) {
    await prisma.tag.delete({ where: { id } });
    return { ok: true };
}
