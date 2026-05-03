import type {
    Inquiry,
    InquiryCounts,
    InquiryListQuery,
    InquiryListResponse,
    InquiryNote,
    InquiryNoteCreateInput,
    InquiryStats,
    InquiryUpdateInput,
} from '@trio/shared/inquiry';
import { api } from '@/lib/axios';

export async function listInquiries(
    params: Partial<InquiryListQuery>,
): Promise<InquiryListResponse> {
    const { data } = await api.get('/api/admin/inquiries', { params });
    return data;
}

export async function getInquiry(id: string): Promise<Inquiry> {
    const { data } = await api.get(`/api/admin/inquiries/${id}`);
    return data;
}

export async function updateInquiry(id: string, body: InquiryUpdateInput): Promise<Inquiry> {
    const { data } = await api.patch(`/api/admin/inquiries/${id}`, body);
    return data;
}

export async function addInquiryNote(
    id: string,
    body: InquiryNoteCreateInput,
): Promise<InquiryNote> {
    const { data } = await api.post(`/api/admin/inquiries/${id}/notes`, body);
    return data;
}

export async function getInquiryStats(): Promise<InquiryStats> {
    const { data } = await api.get('/api/admin/inquiries/stats');
    return data;
}

export async function getInquiryCounts(): Promise<InquiryCounts> {
    const { data } = await api.get('/api/admin/inquiries/counts');
    return data;
}

export function buildExportUrl(params: Pick<InquiryListQuery, 'status' | 'q' | 'assignedToId'>) {
    const usp = new URLSearchParams();
    if (params.status) usp.set('status', params.status);
    if (params.q) usp.set('q', params.q);
    if (params.assignedToId) usp.set('assignedToId', params.assignedToId);
    const qs = usp.toString();
    const base = api.defaults.baseURL ?? '';
    return `${base}/api/admin/inquiries/export${qs ? `?${qs}` : ''}`;
}

export interface AdminUser {
    id: string;
    name: string | null;
    email: string;
    role: 'USER' | 'ADMIN';
}

export async function listAdmins(): Promise<AdminUser[]> {
    const { data } = await api.get('/api/admin/users', { params: { role: 'ADMIN' } });
    return data;
}
