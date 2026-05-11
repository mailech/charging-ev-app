import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { StationUpsertInput } from '@trio/shared/station';
import * as api from './api';

export const stationKeys = { all: () => ['stations'] as const };

export function useStationsQuery() {
    return useQuery({ queryKey: stationKeys.all(), queryFn: api.listStations });
}

export function useCreateStationMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input: StationUpsertInput) => api.createStation(input),
        onSuccess: () => qc.invalidateQueries({ queryKey: stationKeys.all() }),
    });
}

export function useUpdateStationMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: StationUpsertInput }) =>
            api.updateStation(id, input),
        onSuccess: () => qc.invalidateQueries({ queryKey: stationKeys.all() }),
    });
}

export function useToggleStationMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
            api.toggleStation(id, enabled),
        onSuccess: () => qc.invalidateQueries({ queryKey: stationKeys.all() }),
    });
}

export function useDeleteStationMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteStation(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: stationKeys.all() }),
    });
}
