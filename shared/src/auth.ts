import { z } from 'zod';

export const roleSchema = z.enum(['USER', 'ADMIN']);
export type Role = z.infer<typeof roleSchema>;

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable(),
    role: roleSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(200),
    name: z.string().min(1).max(120).optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const authResponseSchema = z.object({
    user: userSchema,
    token: z.string().optional(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;
