import { z } from 'zod';

export const noticeFrequencySchema = z.enum(['always', 'once-per-session', 'once-per-day']);
export type NoticeFrequency = z.infer<typeof noticeFrequencySchema>;

export const noticeImageAlignSchema = z.enum(['left', 'center', 'right']);
export type NoticeImageAlign = z.infer<typeof noticeImageAlignSchema>;

const colorSchema = z.string().regex(/^#?[0-9a-fA-F]{3,8}$|^rgba?\(/, 'Invalid color').max(64);

export const noticeSchema = z.object({
    id: z.string(),
    enabled: z.boolean(),
    title: z.string(),
    body: z.string(),
    imageUrl: z.string().nullable(),
    redirectUrl: z.string().nullable(),
    bgColor: z.string(),
    titleColor: z.string(),
    bodyColor: z.string(),
    titleSize: z.number().int(),
    bodySize: z.number().int(),
    imageWidth: z.number().int(),
    imageHeight: z.number().int(),
    imageAlign: noticeImageAlignSchema,
    dismissible: z.boolean(),
    showFrequency: noticeFrequencySchema,
});
export type Notice = z.infer<typeof noticeSchema>;

export const noticeUpdateSchema = z.object({
    enabled: z.boolean().optional(),
    title: z.string().min(1).max(200).optional(),
    body: z.string().max(5000).optional(),
    imageUrl: z.string().max(2048).nullable().optional(),
    redirectUrl: z.string().max(2048).nullable().optional(),
    bgColor: colorSchema.optional(),
    titleColor: colorSchema.optional(),
    bodyColor: colorSchema.optional(),
    titleSize: z.number().int().min(8).max(96).optional(),
    bodySize: z.number().int().min(8).max(48).optional(),
    imageWidth: z.number().int().min(0).max(2000).optional(),
    imageHeight: z.number().int().min(0).max(2000).optional(),
    imageAlign: noticeImageAlignSchema.optional(),
    dismissible: z.boolean().optional(),
    showFrequency: noticeFrequencySchema.optional(),
});
export type NoticeUpdateInput = z.infer<typeof noticeUpdateSchema>;

export const NOTICE_DEFAULT: Omit<Notice, 'id'> = {
    enabled: false,
    title: 'Notice',
    body: '',
    imageUrl: null,
    redirectUrl: null,
    bgColor: '#ffffff',
    titleColor: '#0f172a',
    bodyColor: '#334155',
    titleSize: 20,
    bodySize: 14,
    imageWidth: 480,
    imageHeight: 0,
    imageAlign: 'center',
    dismissible: true,
    showFrequency: 'once-per-session',
};
