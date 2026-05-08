import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';
import { notFound } from '@/utils/http-error.js';
import type {
    CarouselUpdateInput,
    SlideReorderInput,
    SlideUpsertInput,
} from '@trio/shared/carousel';

const slideSelect = {
    id: true,
    kind: true,
    enabled: true,
    mediaUrl: true,
    order: true,
    durationMs: true,
    headline: true,
    sub: true,
    ctaLabel: true,
    ctaHref: true,
    textColor: true,
    overlayOpacity: true,
} satisfies Prisma.CarouselSlideSelect;

const carouselSelect = {
    id: true,
    name: true,
    enabled: true,
    autoplay: true,
    loop: true,
    swipe: true,
    showArrows: true,
    showDots: true,
    transition: true,
    defaultDurationMs: true,
    slides: { select: slideSelect, orderBy: { order: 'asc' } },
} satisfies Prisma.CarouselSelect;

async function ensureDefault() {
    const existing = await prisma.carousel.findUnique({ where: { name: 'default' } });
    if (existing) return existing.id;
    const created = await prisma.carousel.create({
        data: { name: 'default' },
        select: { id: true },
    });
    return created.id;
}

export async function getDefault() {
    await ensureDefault();
    const carousel = await prisma.carousel.findUniqueOrThrow({
        where: { name: 'default' },
        select: carouselSelect,
    });
    return carousel;
}

export async function update(input: CarouselUpdateInput) {
    await ensureDefault();
    return prisma.carousel.update({
        where: { name: 'default' },
        data: input,
        select: carouselSelect,
    });
}

export async function addSlide(input: SlideUpsertInput) {
    const id = await ensureDefault();
    const last = await prisma.carouselSlide.findFirst({
        where: { carouselId: id },
        orderBy: { order: 'desc' },
        select: { order: true },
    });
    const order = input.order ?? (last ? last.order + 1 : 0);
    return prisma.carouselSlide.create({
        data: {
            carouselId: id,
            kind: input.kind,
            enabled: input.enabled ?? true,
            mediaUrl: input.mediaUrl,
            order,
            durationMs: input.durationMs ?? null,
            headline: input.headline ?? null,
            sub: input.sub ?? null,
            ctaLabel: input.ctaLabel ?? null,
            ctaHref: input.ctaHref ?? null,
            textColor: input.textColor ?? null,
            overlayOpacity: input.overlayOpacity ?? 40,
        },
        select: slideSelect,
    });
}

export async function updateSlide(slideId: string, input: SlideUpsertInput) {
    const existing = await prisma.carouselSlide.findUnique({ where: { id: slideId } });
    if (!existing) throw notFound('Slide not found');
    return prisma.carouselSlide.update({
        where: { id: slideId },
        data: {
            kind: input.kind,
            enabled: input.enabled ?? existing.enabled,
            mediaUrl: input.mediaUrl,
            order: input.order ?? existing.order,
            durationMs: input.durationMs ?? null,
            headline: input.headline ?? null,
            sub: input.sub ?? null,
            ctaLabel: input.ctaLabel ?? null,
            ctaHref: input.ctaHref ?? null,
            textColor: input.textColor ?? null,
            overlayOpacity: input.overlayOpacity ?? existing.overlayOpacity,
        },
        select: slideSelect,
    });
}

export async function toggleSlide(slideId: string, enabled: boolean) {
    const existing = await prisma.carouselSlide.findUnique({ where: { id: slideId } });
    if (!existing) throw notFound('Slide not found');
    return prisma.carouselSlide.update({
        where: { id: slideId },
        data: { enabled },
        select: slideSelect,
    });
}

export async function removeSlide(slideId: string) {
    await prisma.carouselSlide.delete({ where: { id: slideId } });
    return { ok: true };
}

export async function reorder(input: SlideReorderInput) {
    const id = await ensureDefault();
    await prisma.$transaction(
        input.ids.map((slideId, i) =>
            prisma.carouselSlide.update({
                where: { id: slideId },
                data: { order: i, carouselId: id },
            }),
        ),
    );
    return getDefault();
}
