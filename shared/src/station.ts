import { z } from 'zod';

export const stationSchema = z.object({
    id: z.string(),
    name: z.string(),
    state: z.string(),
    lat: z.number(),
    lon: z.number(),
    enabled: z.boolean(),
    order: z.number().int(),
});
export type Station = z.infer<typeof stationSchema>;

export const stationUpsertSchema = z.object({
    name: z.string().min(1).max(120),
    state: z.string().min(1).max(120),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    enabled: z.boolean().optional(),
    order: z.number().int().min(0).max(9999).optional(),
});
export type StationUpsertInput = z.infer<typeof stationUpsertSchema>;

export const stationTogglePatchSchema = z.object({
    enabled: z.boolean(),
});
export type StationTogglePatch = z.infer<typeof stationTogglePatchSchema>;
