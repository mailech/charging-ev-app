import { useState } from 'react';
import { BookOpen, Edit2, Loader2, MapPin, Plus, Trash2, Youtube } from 'lucide-react';
import type { Station, StationUpsertInput } from '@trio/shared/station';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from '@/hooks/useToast';
import {
    useCreateStationMutation,
    useDeleteStationMutation,
    useStationsQuery,
    useToggleStationMutation,
    useUpdateStationMutation,
} from '../hooks';

const EMPTY_DRAFT: StationUpsertInput = {
    name: '',
    state: '',
    lat: 0,
    lon: 0,
    enabled: true,
};

export default function StationsManager() {
    const query = useStationsQuery();
    const createM = useCreateStationMutation();
    const updateM = useUpdateStationMutation();
    const toggleM = useToggleStationMutation();
    const deleteM = useDeleteStationMutation();

    const [editing, setEditing] = useState<Station | null>(null);
    const [draftOpen, setDraftOpen] = useState(false);
    const [draft, setDraft] = useState<StationUpsertInput>(EMPTY_DRAFT);

    const openCreate = () => {
        setEditing(null);
        setDraft(EMPTY_DRAFT);
        setDraftOpen(true);
    };

    const openEdit = (s: Station) => {
        setEditing(s);
        setDraft({
            name: s.name,
            state: s.state,
            lat: s.lat,
            lon: s.lon,
            enabled: s.enabled,
            order: s.order,
        });
        setDraftOpen(true);
    };

    const submit = async () => {
        if (!draft.name.trim() || !draft.state.trim()) {
            toast.error('Name + state required');
            return;
        }
        try {
            if (editing) {
                await updateM.mutateAsync({ id: editing.id, input: draft });
                toast.success('Station updated');
            } else {
                await createM.mutateAsync(draft);
                toast.success('Station added');
            }
            setDraftOpen(false);
        } catch {
            toast.error('Could not save station');
        }
    };

    const remove = async (s: Station) => {
        if (!window.confirm(`Delete ${s.name}?`)) return;
        try {
            await deleteM.mutateAsync(s.id);
            toast.success('Station deleted');
        } catch {
            toast.error('Could not delete');
        }
    };

    const stations = query.data ?? [];

    return (
        <>
            <PageHeader
                title="Stations"
                description="Charging-station markers shown on the public India map."
                actions={
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Add station
                    </Button>
                }
            />

            {query.isLoading ? (
                <div className="flex h-40 items-center justify-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            ) : stations.length === 0 ? (
                <EmptyState
                    icon={<MapPin className="h-6 w-6" />}
                    title="No stations yet"
                    description="Add the first station to show it on the public map."
                    action={
                        <Button onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            Add station
                        </Button>
                    }
                />
            ) : (
                <Card>
                    <CardBody className="p-0">
                        <table className="w-full text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">State</th>
                                    <th className="px-4 py-3">Lat</th>
                                    <th className="px-4 py-3">Lon</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stations.map((s) => (
                                    <tr key={s.id} className="border-b border-slate-100">
                                        <td className="px-4 py-3 font-medium text-slate-900">
                                            {s.name}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{s.state}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {s.lat.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {s.lon.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleM.mutate({
                                                        id: s.id,
                                                        enabled: !s.enabled,
                                                    })
                                                }
                                            >
                                                <Badge
                                                    tone={s.enabled ? 'success' : 'muted'}
                                                    className="cursor-pointer"
                                                >
                                                    {s.enabled ? 'Enabled' : 'Disabled'}
                                                </Badge>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="inline-flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => openEdit(s)}
                                                    aria-label="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => remove(s)}
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            )}

            <Modal
                open={draftOpen}
                onClose={() => setDraftOpen(false)}
                title={editing ? 'Edit station' : 'Add station'}
            >
                <div className="space-y-3">
                    <Field label="Name (e.g., Kolkata)">
                        <Input
                            value={draft.name}
                            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        />
                    </Field>
                    <Field label="State (e.g., West Bengal)">
                        <Input
                            value={draft.state}
                            onChange={(e) => setDraft({ ...draft, state: e.target.value })}
                        />
                    </Field>
                    <div className="rounded-md border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs text-slate-600">
                        <p className="font-medium text-slate-700">
                            Need help getting coordinates?
                        </p>
                        <p className="mt-0.5">
                            On Google Maps, right-click a place → click the first row to copy
                            "lat, lon". Or follow a tutorial:
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3">
                            <a
                                href="https://support.google.com/maps/answer/18539"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                Blog tutorial
                            </a>
                            <a
                                href="https://www.youtube.com/results?search_query=how+to+get+latitude+longitude+google+maps"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
                            >
                                <Youtube className="h-3.5 w-3.5" />
                                YouTube tutorial
                            </a>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Latitude (-90 .. 90)">
                            <Input
                                type="number"
                                step="any"
                                value={draft.lat}
                                onChange={(e) =>
                                    setDraft({ ...draft, lat: Number(e.target.value) })
                                }
                            />
                        </Field>
                        <Field label="Longitude (-180 .. 180)">
                            <Input
                                type="number"
                                step="any"
                                value={draft.lon}
                                onChange={(e) =>
                                    setDraft({ ...draft, lon: Number(e.target.value) })
                                }
                            />
                        </Field>
                    </div>
                    <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                        <span className="text-sm text-slate-700">Enabled</span>
                        <input
                            type="checkbox"
                            className="h-4 w-4 cursor-pointer accent-emerald-600"
                            checked={draft.enabled !== false}
                            onChange={(e) =>
                                setDraft({ ...draft, enabled: e.target.checked })
                            }
                        />
                    </label>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setDraftOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={submit}
                            loading={createM.isPending || updateM.isPending}
                        >
                            {editing ? 'Save' : 'Add'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-1">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            {children}
        </label>
    );
}
