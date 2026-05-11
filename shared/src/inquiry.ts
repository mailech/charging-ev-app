import { z } from 'zod';

export const inquiryStatusSchema = z.enum(['NEW', 'IN_REVIEW', 'RESPONDED', 'CLOSED']);
export type InquiryStatus = z.infer<typeof inquiryStatusSchema>;

export const INQUIRY_STATUSES: InquiryStatus[] = [
    'NEW',
    'IN_REVIEW',
    'RESPONDED',
    'CLOSED',
];

export const publicInquirySubmitSchema = z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(200),
    phone: z.string().max(40).optional().or(z.literal('')),
    subject: z.string().min(1).max(200),
    message: z.string().min(1).max(5000),
    hp_field: z.string().max(0).optional(),
});
export type PublicInquirySubmitInput = z.infer<typeof publicInquirySubmitSchema>;

export const inquiryListQuerySchema = z.object({
    status: inquiryStatusSchema.optional(),
    q: z.string().max(200).optional(),
    assignedToId: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(8),
});
export type InquiryListQuery = z.infer<typeof inquiryListQuerySchema>;

export const inquiryCountsSchema = z.object({
    ALL: z.number(),
    NEW: z.number(),
    IN_REVIEW: z.number(),
    RESPONDED: z.number(),
    CLOSED: z.number(),
});
export type InquiryCounts = z.infer<typeof inquiryCountsSchema>;

export const inquiryStatsSchema = z.object({
    total: z.number(),
    totalDeltaPct: z.number().nullable(),
    newCount: z.number(),
    newDeltaPct: z.number().nullable(),
    responseRatePct: z.number(),
    responseRateDeltaPct: z.number().nullable(),
    avgResponseHours: z.number().nullable(),
    avgResponseDeltaPct: z.number().nullable(),
});
export type InquiryStats = z.infer<typeof inquiryStatsSchema>;

export const inquiryUpdateSchema = z.object({
    status: inquiryStatusSchema.optional(),
    assignedToId: z.string().nullable().optional(),
});
export type InquiryUpdateInput = z.infer<typeof inquiryUpdateSchema>;

export const inquiryNoteCreateSchema = z.object({
    body: z.string().min(1).max(5000),
});
export type InquiryNoteCreateInput = z.infer<typeof inquiryNoteCreateSchema>;

export const inquiryBulkIdsSchema = z.object({
    ids: z.array(z.string().min(1)).min(1).max(500),
});
export type InquiryBulkIdsInput = z.infer<typeof inquiryBulkIdsSchema>;

export const inquiryBulkStatusSchema = z.object({
    ids: z.array(z.string().min(1)).min(1).max(500),
    status: inquiryStatusSchema,
});
export type InquiryBulkStatusInput = z.infer<typeof inquiryBulkStatusSchema>;

export const inquiryBulkResultSchema = z.object({
    sent: z.number(),
    skipped: z.number(),
    failed: z.number(),
});
export type InquiryBulkResult = z.infer<typeof inquiryBulkResultSchema>;

export const inquiryReplyCreateSchema = z.object({
    subject: z.string().min(1).max(200),
    body: z.string().min(1).max(20000),
});
export type InquiryReplyCreateInput = z.infer<typeof inquiryReplyCreateSchema>;

export const inquiryReplySchema = z.object({
    id: z.string(),
    subject: z.string(),
    body: z.string(),
    authorId: z.string(),
    author: z
        .object({
            id: z.string(),
            name: z.string().nullable(),
            email: z.string(),
        })
        .nullable()
        .optional(),
    sentAt: z.string(),
});
export type InquiryReply = z.infer<typeof inquiryReplySchema>;

export const inquiryNoteSchema = z.object({
    id: z.string(),
    body: z.string(),
    authorId: z.string(),
    author: z
        .object({
            id: z.string(),
            name: z.string().nullable(),
            email: z.string(),
        })
        .nullable()
        .optional(),
    createdAt: z.string(),
});
export type InquiryNote = z.infer<typeof inquiryNoteSchema>;

export const inquirySchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    subject: z.string(),
    message: z.string(),
    status: inquiryStatusSchema,
    source: z.string().nullable(),
    assignedToId: z.string().nullable(),
    assignedTo: z
        .object({ id: z.string(), name: z.string().nullable(), email: z.string() })
        .nullable()
        .optional(),
    notes: z.array(inquiryNoteSchema).optional(),
    replies: z.array(inquiryReplySchema).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export type Inquiry = z.infer<typeof inquirySchema>;

export const inquiryListResponseSchema = z.object({
    items: z.array(inquirySchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
});
export type InquiryListResponse = z.infer<typeof inquiryListResponseSchema>;
