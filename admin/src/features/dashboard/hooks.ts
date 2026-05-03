import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from './api';

export const dashboardKeys = {
    overview: () => ['dashboard', 'overview'] as const,
};

export function useDashboardOverviewQuery() {
    return useQuery({
        queryKey: dashboardKeys.overview(),
        queryFn: getDashboardOverview,
        staleTime: 60_000,
    });
}
