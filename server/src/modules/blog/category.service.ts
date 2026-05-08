import { prisma } from '@/lib/prisma.js';
import { conflict, notFound } from '@/utils/http-error.js';
import { makeSlug } from '@/lib/slug.js';
import type { CategoryUpsertInput } from '@trio/shared/blog';

const select = { id: true, name: true, slug: true } as const;

export async function list() {
    return prisma.category.findMany({ select, orderBy: { name: 'asc' } });
}

export async function create(input: CategoryUpsertInput) {
    const slug = input.slug ?? makeSlug(input.name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) throw conflict('Category slug already exists');
    return prisma.category.create({ data: { name: input.name, slug }, select });
}

export async function update(id: string, input: CategoryUpsertInput) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw notFound('Category not found');
    const slug = input.slug ?? makeSlug(input.name);
    if (slug !== existing.slug) {
        const clash = await prisma.category.findUnique({ where: { slug } });
        if (clash) throw conflict('Category slug already exists');
    }
    return prisma.category.update({ where: { id }, data: { name: input.name, slug }, select });
}

export async function remove(id: string) {
    await prisma.category.delete({ where: { id } });
    return { ok: true };
}
