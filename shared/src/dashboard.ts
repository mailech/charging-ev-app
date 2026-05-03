import { z } from 'zod';
import { inquiryStatusSchema, inquirySchema } from './inquiry';

export const dashboardKpisSchema = z.object({
    totalInquiries: z.number(),
    totalDeltaPct: z.number().nullable(),
    dailyVisits: z.number(),
    dailyVisitsDeltaPct: z.number().nullable(),
    monthlyVisits: z.number(),
    monthlyVisitsDeltaPct: z.number().nullable(),
    uniqueVisitors: z.number(),
    uniqueVisitorsDeltaPct: z.number().nullable(),
    responded: z.number(),
    respondedDeltaPct: z.number().nullable(),
});

export const statusBreakdownItemSchema = z.object({
    status: inquiryStatusSchema,
    count: z.number(),
});

export const monthlyInquiryItemSchema = z.object({
    month: z.string(),
    label: z.string(),
    count: z.number(),
});

export const topSourceItemSchema = z.object({
    source: z.string(),
    count: z.number(),
});

export const dailyVisitorItemSchema = z.object({
    day: z.string(),
    label: z.string(),
    count: z.number(),
});

export const topReferrerItemSchema = z.object({
    referrer: z.string(),
    count: z.number(),
});

export const dashboardOverviewSchema = z.object({
    kpis: dashboardKpisSchema,
    byStatus: z.array(statusBreakdownItemSchema),
    monthlyInquiries: z.array(monthlyInquiryItemSchema),
    topSources: z.array(topSourceItemSchema),
    topReferrers: z.array(topReferrerItemSchema),
    dailyVisitors: z.array(dailyVisitorItemSchema),
    recentInquiries: z.array(inquirySchema),
});
export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;
