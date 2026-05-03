import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { NoticeUpdateInput } from '@trio/shared/notice';

const select = {
    id: true,
    enabled: true,
    title: true,
    body: true,
    imageUrl: true,
    redirectUrl: true,
    bgColor: true,
    titleColor: true,
    bodyColor: true,
    titleSize: true,
    bodySize: true,
    imageWidth: true,
    imageHeight: true,
    dismissible: true,
    showFrequency: true,
} satisfies Prisma.NoticeSelect;

async function ensureRow() {
    const existing = await prisma.notice.findFirst({ select: { id: true } });
    if (existing) return existing.id;
    const created = await prisma.notice.create({ data: {}, select: { id: true } });
    return created.id;
}

export async function get() {
    const id = await ensureRow();
    return prisma.notice.findUniqueOrThrow({ where: { id }, select });
}

export async function update(input: NoticeUpdateInput) {
    const id = await ensureRow();
    return prisma.notice.update({ where: { id }, data: input, select });
}
