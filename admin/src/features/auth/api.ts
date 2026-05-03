import type { LoginInput, User } from '@trio/shared/auth';
import { api } from '@/lib/axios';

export async function login(input: LoginInput): Promise<{ user: User; token: string }> {
    const { data } = await api.post('/api/auth/login', input);
    return data;
}

export async function logout(): Promise<void> {
    await api.post('/api/auth/logout');
}

export async function getMe(): Promise<User> {
    const { data } = await api.get('/api/auth/me');
    return data;
}
