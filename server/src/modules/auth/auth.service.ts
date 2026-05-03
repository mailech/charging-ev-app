import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/utils/jwt';
import { conflict, unauthorized } from '@/utils/http-error';
import type { LoginInput, RegisterInput } from './auth.schema.js';

const userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true,
} as const;

export async function register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw conflict('Email already registered');

    const password = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
        data: { email: input.email, password, name: input.name },
        select: userSelect,
    });

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    return { user, token };
}

export async function login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw unauthorized('Invalid credentials');

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) throw unauthorized('Invalid credentials');

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        token,
    };
}

export async function me(userId: string) {
    return prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: userSelect,
    });
}
