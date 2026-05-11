import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
    Inquiry,
    InquiryListQuery,
    InquiryListResponse,
    InquiryNoteCreateInput,
    InquiryReplyCreateInput,
    InquiryUpdateInput,
} from '@trio/shared/inquiry';
import type { InquiryStatus } from '@trio/shared/inquiry';
import {
    addInquiryNote,
    bulkAutoReply,
    bulkDelete,
    bulkUpdateStatus,
    getInquiry,
    getInquiryCounts,
    getInquiryStats,
    listAdmins,
    listInquiries,
    sendInquiryReply,
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
            await qc.cancelQueries({ queryKey: inquiryKeys.all });

            const prevDetail = qc.getQueryData<Inquiry>(inquiryKeys.detail(id));
            if (prevDetail) {
                qc.setQueryData<Inquiry>(
                    inquiryKeys.detail(id),
                    { ...prevDetail, ...body } as Inquiry,
                );
            }

            const listSnapshots: [readonly unknown[], InquiryListResponse | undefined][] = [];
            const lists = qc.getQueriesData<InquiryListResponse>({
                queryKey: ['inquiries', 'list'],
            });
            for (const [key, data] of lists) {
                listSnapshots.push([key, data]);
                if (!data) continue;
                qc.setQueryData<InquiryListResponse>(key, {
                    ...data,
                    items: data.items.map((it) =>
                        it.id === id ? ({ ...it, ...body } as Inquiry) : it,
                    ),
                });
            }

            return { prevDetail, listSnapshots };
        },
        onError: (_err, _body, ctx) => {
            if (ctx?.prevDetail) {
                qc.setQueryData(inquiryKeys.detail(id), ctx.prevDetail);
            }
            for (const [key, data] of ctx?.listSnapshots ?? []) {
                qc.setQueryData(key, data);
            }
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

export function useSendReplyMutation(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: InquiryReplyCreateInput) => sendInquiryReply(id, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: inquiryKeys.all });
        },
    });
}

export function useBulkStatusMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: { ids: string[]; status: InquiryStatus }) =>
            bulkUpdateStatus(vars.ids, vars.status),
        onSuccess: () => qc.invalidateQueries({ queryKey: inquiryKeys.all }),
    });
}

export function useBulkDeleteMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => bulkDelete(ids),
        onSuccess: () => qc.invalidateQueries({ queryKey: inquiryKeys.all }),
    });
}

export function useBulkAutoReplyMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => bulkAutoReply(ids),
        onSuccess: () => qc.invalidateQueries({ queryKey: inquiryKeys.all }),
    });
}
