import type { DashboardOverview } from '@trio/shared/dashboard';
import { api } from '@/lib/axios';

export async function getDashboardOverview(): Promise<DashboardOverview> {
    const { data } = await api.get('/api/admin/dashboard/overview');
    return data;
}
