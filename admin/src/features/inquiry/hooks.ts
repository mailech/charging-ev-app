import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
    Inquiry,
    InquiryListQuery,
    InquiryNoteCreateInput,
    InquiryUpdateInput,
} from '@trio/shared/inquiry';
import {
    addInquiryNote,
    getInquiry,
    getInquiryCounts,
    getInquiryStats,
    listAdmins,
    listInquiries,
    updateInquiry,
} from './api';

export const inquiryKeys = {
    all: ['inquiries'] as const,
    list: (params: Partial<InquiryListQuery>) => ['inquiries', 'list', params] as const,
    detail: (id: string) => ['inquiries', 'detail', id] as const,
    stats: () => ['inquiries', 'stats'] as const,
    counts: () => ['inquiries', 'counts'] as const,
    admins: () => ['inquiries', 'admins'] as const,
};

export function useInquiriesQuery(params: Partial<InquiryListQuery>) {
    return useQuery({
        queryKey: inquiryKeys.list(params),
        queryFn: () => listInquiries(params),
        staleTime: 30_000,
    });
}

export function useInquiryQuery(id: string | undefined) {
    return useQuery({
        queryKey: inquiryKeys.detail(id ?? ''),
        queryFn: () => getInquiry(id!),
        enabled: Boolean(id),
        staleTime: 30_000,
    });
}

export function useInquiryStatsQuery() {
    return useQuery({
        queryKey: inquiryKeys.stats(),
        queryFn: getInquiryStats,
        staleTime: 60_000,
    });
}

export function useInquiryCountsQuery() {
    return useQuery({
        queryKey: inquiryKeys.counts(),
        queryFn: getInquiryCounts,
        staleTime: 30_000,
    });
}

export function useAdminUsersQuery() {
    return useQuery({
        queryKey: inquiryKeys.admins(),
        queryFn: listAdmins,
        staleTime: 5 * 60_000,
    });
}

export function useUpdateInquiryMutation(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: InquiryUpdateInput) => updateInquiry(id, body),
        onMutate: async (body) => {
            await qc.cancelQueries({ queryKey: inquiryKeys.detail(id) });
            const prev = qc.getQueryData<Inquiry>(inquiryKeys.detail(id));
            if (prev) {
                qc.setQueryData<Inquiry>(inquiryKeys.detail(id), { ...prev, ...body } as Inquiry);
            }
            return { prev };
        },
        onError: (_err, _body, ctx) => {
            if (ctx?.prev) qc.setQueryData(inquiryKeys.detail(id), ctx.prev);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: inquiryKeys.all });
        },
    });
}

export function useAddNoteMutation(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: InquiryNoteCreateInput) => addInquiryNote(id, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: inquiryKeys.detail(id) });
        },
    });
}
