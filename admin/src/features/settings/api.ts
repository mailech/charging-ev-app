import type { SiteSetting, SiteSettingUpdateInput } from '@trio/shared/settings';
import { api } from '@/lib/axios';

export async function getSettings(): Promise<SiteSetting> {
    const { data } = await api.get('/api/admin/settings');
    return data;
}

export async function updateSettings(input: SiteSettingUpdateInput): Promise<SiteSetting> {
    const { data } = await api.patch('/api/admin/settings', input);
    return data;
}
