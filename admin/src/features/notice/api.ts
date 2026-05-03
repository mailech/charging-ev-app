import type { Notice, NoticeUpdateInput } from '@trio/shared/notice';
import { api } from '@/lib/axios';

export async function getNotice(): Promise<Notice> {
    const { data } = await api.get('/api/admin/notice');
    return data;
}

export async function updateNotice(input: NoticeUpdateInput): Promise<Notice> {
    const { data } = await api.patch('/api/admin/notice', input);
    return data;
}
