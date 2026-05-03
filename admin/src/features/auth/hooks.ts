import { useQuery } from '@tanstack/react-query';
import { getMe } from './api';

export const ME_QUERY_KEY = ['auth', 'me'] as const;

export function useMe() {
    return useQuery({
        queryKey: ME_QUERY_KEY,
        queryFn: getMe,
        staleTime: 60_000,
        retry: false,
    });
}
