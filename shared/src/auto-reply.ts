import { z } from 'zod';

export const autoReplyTemplateSchema = z.object({
    id: z.string(),
    name: z.string(),
    subject: z.string(),
    body: z.string(),
    active: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export type AutoReplyTemplate = z.infer<typeof autoReplyTemplateSchema>;

export const autoReplyTemplateCreateSchema = z.object({
    name: z.string().min(1).max(120),
    subject: z.string().min(1).max(200),
    body: z.string().min(1).max(20000),
    active: z.boolean().optional(),
});
export type AutoReplyTemplateCreateInput = z.infer<typeof autoReplyTemplateCreateSchema>;

export const autoReplyTemplateUpdateSchema = z.object({
    name: z.string().min(1).max(120).optional(),
    subject: z.string().min(1).max(200).optional(),
    body: z.string().min(1).max(20000).optional(),
});
export type AutoReplyTemplateUpdateInput = z.infer<typeof autoReplyTemplateUpdateSchema>;
