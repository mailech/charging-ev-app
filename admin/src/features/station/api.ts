import type { Station, StationUpsertInput } from '@trio/shared/station';
import { api } from '@/lib/axios';

export async function listStations(): Promise<Station[]> {
    const { data } = await api.get('/api/admin/stations');
    return data;
}

export async function createStation(input: StationUpsertInput): Promise<Station> {
    const { data } = await api.post('/api/admin/stations', input);
    return data;
}

export async function updateStation(id: string, input: StationUpsertInput): Promise<Station> {
    const { data } = await api.patch(`/api/admin/stations/${id}`, input);
    return data;
}

export async function toggleStation(id: string, enabled: boolean): Promise<Station> {
    const { data } = await api.patch(`/api/admin/stations/${id}/toggle`, { enabled });
    return data;
}

export async function deleteStation(id: string): Promise<void> {
    await api.delete(`/api/admin/stations/${id}`);
}
