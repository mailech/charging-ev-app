import { z } from 'zod';

export const slideKindSchema = z.enum(['IMAGE', 'VIDEO']);
export type SlideKind = z.infer<typeof slideKindSchema>;

export const carouselTransitionSchema = z.enum(['FADE', 'SLIDE']);
export type CarouselTransition = z.infer<typeof carouselTransitionSchema>;

export const carouselSlideSchema = z.object({
    id: z.string(),
    kind: slideKindSchema,
    enabled: z.boolean(),
    mediaUrl: z.string(),
    order: z.number().int(),
    durationMs: z.number().int().nullable(),
    headline: z.string().nullable(),
    sub: z.string().nullable(),
    ctaLabel: z.string().nullable(),
    ctaHref: z.string().nullable(),
    textColor: z.string().nullable(),
    overlayOpacity: z.number().int().min(0).max(100),
});
export type CarouselSlide = z.infer<typeof carouselSlideSchema>;

export const carouselSchema = z.object({
    id: z.string(),
    name: z.string(),
    enabled: z.boolean(),
    autoplay: z.boolean(),
    loop: z.boolean(),
    swipe: z.boolean(),
    showArrows: z.boolean(),
    showDots: z.boolean(),
    transition: carouselTransitionSchema,
    defaultDurationMs: z.number().int().min(500).max(60000),
    slides: z.array(carouselSlideSchema),
});
export type Carousel = z.infer<typeof carouselSchema>;

export const carouselUpdateSchema = z.object({
    enabled: z.boolean().optional(),
    autoplay: z.boolean().optional(),
    loop: z.boolean().optional(),
    swipe: z.boolean().optional(),
    showArrows: z.boolean().optional(),
    showDots: z.boolean().optional(),
    transition: carouselTransitionSchema.optional(),
    defaultDurationMs: z.number().int().min(500).max(60000).optional(),
});
export type CarouselUpdateInput = z.infer<typeof carouselUpdateSchema>;

export const slideUpsertSchema = z.object({
    kind: slideKindSchema,
    enabled: z.boolean().optional(),
    mediaUrl: z.string().min(1).max(2048),
    order: z.number().int().min(0).max(999).optional(),
    durationMs: z.number().int().min(500).max(60000).nullable().optional(),
    headline: z.string().max(200).nullable().optional(),
    sub: z.string().max(500).nullable().optional(),
    ctaLabel: z.string().max(80).nullable().optional(),
    ctaHref: z.string().max(2048).nullable().optional(),
    textColor: z.string().max(32).nullable().optional(),
    overlayOpacity: z.number().int().min(0).max(100).optional(),
});

export const slideTogglePatchSchema = z.object({
    enabled: z.boolean(),
});
export type SlideTogglePatch = z.infer<typeof slideTogglePatchSchema>;
export type SlideUpsertInput = z.infer<typeof slideUpsertSchema>;

export const slideReorderSchema = z.object({
    ids: z.array(z.string().min(1)).min(1),
});
export type SlideReorderInput = z.infer<typeof slideReorderSchema>;
