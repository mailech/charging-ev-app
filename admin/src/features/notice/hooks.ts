import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { NoticeUpdateInput } from '@trio/shared/notice';
import * as api from './api';

export const noticeKeys = { all: () => ['notice'] as const };

export function useNoticeQuery() {
    return useQuery({ queryKey: noticeKeys.all(), queryFn: api.getNotice });
}

export function useUpdateNoticeMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: NoticeUpdateInput) => api.updateNotice(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: noticeKeys.all() }),
    });
}
