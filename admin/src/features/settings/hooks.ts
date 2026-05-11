import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SiteSettingUpdateInput } from '@trio/shared/settings';
import * as api from './api';

export const settingsKeys = { all: () => ['site-settings'] as const };

export function useSettingsQuery() {
    return useQuery({ queryKey: settingsKeys.all(), queryFn: api.getSettings });
}

export function useUpdateSettingsMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: SiteSettingUpdateInput) => api.updateSettings(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.all() }),
    });
}
