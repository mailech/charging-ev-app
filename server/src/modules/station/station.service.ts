import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { notFound } from '@/utils/http-error';
import type { StationUpsertInput } from '@trio/shared/station';

const select = {
    id: true,
    name: true,
    state: true,
    lat: true,
    lon: true,
    enabled: true,
    order: true,
} satisfies Prisma.StationSelect;

export async function list() {
    return prisma.station.findMany({
        select,
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
}

export async function listEnabled() {
    return prisma.station.findMany({
        where: { enabled: true },
        select,
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
}

export async function create(input: StationUpsertInput) {
    const last = await prisma.station.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
    });
    const order = input.order ?? (last ? last.order + 1 : 0);
    return prisma.station.create({
        data: {
            name: input.name,
            state: input.state,
            lat: input.lat,
            lon: input.lon,
            enabled: input.enabled ?? true,
            order,
        },
        select,
    });
}

export async function update(id: string, input: StationUpsertInput) {
    const existing = await prisma.station.findUnique({ where: { id } });
    if (!existing) throw notFound('Station not found');
    return prisma.station.update({
        where: { id },
        data: {
            name: input.name,
            state: input.state,
            lat: input.lat,
            lon: input.lon,
            enabled: input.enabled ?? existing.enabled,
            order: input.order ?? existing.order,
        },
        select,
    });
}

export async function toggle(id: string, enabled: boolean) {
    const existing = await prisma.station.findUnique({ where: { id } });
    if (!existing) throw notFound('Station not found');
    return prisma.station.update({ where: { id }, data: { enabled }, select });
}

export async function remove(id: string) {
    await prisma.station.delete({ where: { id } });
    return { ok: true };
}
