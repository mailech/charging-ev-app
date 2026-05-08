import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma.js';

const userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
} satisfies Prisma.UserSelect;

export async function list(role?: 'USER' | 'ADMIN') {
    return prisma.user.findMany({
        where: role ? { role } : undefined,
        select: userSelect,
        orderBy: { createdAt: 'desc' },
    });
}
