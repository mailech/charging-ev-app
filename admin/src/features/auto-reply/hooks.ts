import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
    AutoReplyTemplateCreateInput,
    AutoReplyTemplateUpdateInput,
} from '@trio/shared/auto-reply';
import * as api from './api';

export const autoReplyKeys = {
    all: ['auto-reply'] as const,
    templates: () => ['auto-reply', 'templates'] as const,
};

export function useTemplatesQuery() {
    return useQuery({
        queryKey: autoReplyKeys.templates(),
        queryFn: api.listTemplates,
        staleTime: 30_000,
    });
}

export function useCreateTemplateMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: AutoReplyTemplateCreateInput) => api.createTemplate(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: autoReplyKeys.all }),
    });
}

export function useUpdateTemplateMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: { id: string; input: AutoReplyTemplateUpdateInput }) =>
            api.updateTemplate(vars.id, vars.input),
        onSuccess: () => qc.invalidateQueries({ queryKey: autoReplyKeys.all }),
    });
}

export function useActivateTemplateMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.activateTemplate(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: autoReplyKeys.all }),
    });
}

export function useDeleteTemplateMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteTemplate(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: autoReplyKeys.all }),
    });
}

export function useSendInquiryAutoReplyMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (inquiryId: string) => api.sendInquiryAutoReply(inquiryId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
    });
}
