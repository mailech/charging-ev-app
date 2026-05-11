import type {
    AutoReplyTemplate,
    AutoReplyTemplateCreateInput,
    AutoReplyTemplateUpdateInput,
} from '@trio/shared/auto-reply';
import { api } from '@/lib/axios';

export async function listTemplates(): Promise<AutoReplyTemplate[]> {
    const { data } = await api.get('/api/admin/auto-reply/templates');
    return data;
}

export async function createTemplate(
    input: AutoReplyTemplateCreateInput,
): Promise<AutoReplyTemplate> {
    const { data } = await api.post('/api/admin/auto-reply/templates', input);
    return data;
}

export async function updateTemplate(
    id: string,
    input: AutoReplyTemplateUpdateInput,
): Promise<AutoReplyTemplate> {
    const { data } = await api.patch(`/api/admin/auto-reply/templates/${id}`, input);
    return data;
}

export async function activateTemplate(id: string): Promise<AutoReplyTemplate> {
    const { data } = await api.post(`/api/admin/auto-reply/templates/${id}/activate`);
    return data;
}

export async function deleteTemplate(id: string): Promise<void> {
    await api.delete(`/api/admin/auto-reply/templates/${id}`);
}

export async function sendInquiryAutoReply(inquiryId: string) {
    const { data } = await api.post(`/api/admin/inquiries/${inquiryId}/send-auto-reply`);
    return data;
}
