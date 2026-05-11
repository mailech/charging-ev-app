import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { notFound } from '@/utils/http-error';
import type {
    AutoReplyTemplateCreateInput,
    AutoReplyTemplateUpdateInput,
} from './auto-reply.schema.js';

const select = {
    id: true,
    name: true,
    subject: true,
    body: true,
    active: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.AutoReplyTemplateSelect;

export async function list() {
    return prisma.autoReplyTemplate.findMany({
        select,
        orderBy: [{ active: 'desc' }, { updatedAt: 'desc' }],
    });
}

export async function getActive() {
    return prisma.autoReplyTemplate.findFirst({
        where: { active: true },
        select,
    });
}

export async function create(input: AutoReplyTemplateCreateInput) {
    if (input.active) {
        return prisma.$transaction(async (tx) => {
            await tx.autoReplyTemplate.updateMany({
                where: { active: true },
                data: { active: false },
            });
            return tx.autoReplyTemplate.create({
                data: { ...input, active: true },
                select,
            });
        });
    }
    return prisma.autoReplyTemplate.create({ data: input, select });
}

export async function update(id: string, input: AutoReplyTemplateUpdateInput) {
    const existing = await prisma.autoReplyTemplate.findUnique({ where: { id } });
    if (!existing) throw notFound('Template not found');
    return prisma.autoReplyTemplate.update({ where: { id }, data: input, select });
}

export async function activate(id: string) {
    const existing = await prisma.autoReplyTemplate.findUnique({ where: { id } });
    if (!existing) throw notFound('Template not found');
    return prisma.$transaction(async (tx) => {
        await tx.autoReplyTemplate.updateMany({
            where: { active: true, NOT: { id } },
            data: { active: false },
        });
        return tx.autoReplyTemplate.update({
            where: { id },
            data: { active: true },
            select,
        });
    });
}

export async function remove(id: string) {
    const existing = await prisma.autoReplyTemplate.findUnique({ where: { id } });
    if (!existing) throw notFound('Template not found');
    await prisma.autoReplyTemplate.delete({ where: { id } });
}
