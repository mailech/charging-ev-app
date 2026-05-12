import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';
import {
    INQUIRY_STATUSES,
    type Inquiry,
    type InquiryStatus,
} from '@trio/shared/inquiry';
import {
    ArrowDown,
    ChevronRight,
    Download,
    MessageSquare,
    UserPlus,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { SearchInput } from '@/components/ui/SearchInput';
import { Tabs } from '@/components/ui/Tabs';
import { Pagination } from '@/components/ui/Pagination';
import { DataTable, type RowSelection } from '@/components/data/DataTable';
import { KpiCard } from '@/components/data/KpiCard';
import { ReplyAllCard } from '../ReplyAllCard';
import { InlineStatusSelect } from '../InlineStatusSelect';
import { BulkActionsBar } from '../BulkActionsBar';
import {
    useBulkAutoReplyMutation,
    useBulkDeleteMutation,
    useBulkStatusMutation,
    useInquiriesQuery,
    useInquiryCountsQuery,
    useInquiryStatsQuery,
    useUpdateInquiryMutation,
} from '../hooks';
import { buildExportUrl } from '../api';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { toast } from '@/hooks/useToast';
import { InquiryDetailDrawer } from './InquiryDetail';

const TAB_ORDER: (InquiryStatus | 'ALL')[] = ['ALL', ...INQUIRY_STATUSES];

const PAGE_SIZE = 8;

export default function InquiryList() {
    const { id: selectedId } = useParams();
    const nav = useNavigate();

    const [tab, setTab] = useState<InquiryStatus | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const debouncedSearch = useDebouncedValue(search, 300);

    const params: Partial<Parameters<typeof useInquiriesQuery>[0]> = {
        ...(tab !== 'ALL' && { status: tab }),
        ...(debouncedSearch && { q: debouncedSearch }),
        page,
        limit: PAGE_SIZE,
    };

    const query = useInquiriesQuery(params);
    const stats = useInquiryStatsQuery();
    const counts = useInquiryCountsQuery();

    const bulkStatus = useBulkStatusMutation();
    const bulkDelete = useBulkDeleteMutation();
    const bulkAutoReply = useBulkAutoReplyMutation();

    const tabItems = TAB_ORDER.map((value) => ({
        value,
        label: value === 'ALL' ? 'ALL' : value.replace('_', ' '),
        count: counts.data?.[value],
    }));

    const items = query.data?.items ?? [];

    const rowSelection: RowSelection<Inquiry> = {
        selected,
        getId: (row) => row.id,
        onToggle: (id) =>
            setSelected((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
            }),
        onToggleAll: (rows) =>
            setSelected((prev) => {
                const ids = rows.map((r) => r.id);
                const allOn = ids.every((id) => prev.has(id));
                const next = new Set(prev);
                for (const id of ids) {
                    if (allOn) next.delete(id);
                    else next.add(id);
                }
                return next;
            }),
    };

    const clearSelection = () => setSelected(new Set());

    const onBulkStatus = async (status: InquiryStatus) => {
        try {
            const res = await bulkStatus.mutateAsync({ ids: Array.from(selected), status });
            toast.success(`Updated ${res.count} inquir${res.count === 1 ? 'y' : 'ies'}`);
            clearSelection();
        } catch {
            toast.error('Bulk status update failed');
        }
    };

    const onBulkDelete = async () => {
        if (!window.confirm(`Delete ${selected.size} inquiries? This cannot be undone.`)) return;
        try {
            const res = await bulkDelete.mutateAsync(Array.from(selected));
            toast.success(`Deleted ${res.count} inquir${res.count === 1 ? 'y' : 'ies'}`);
            clearSelection();
        } catch {
            toast.error('Bulk delete failed');
        }
    };

    const onBulkAutoReply = async () => {
        try {
            const res = await bulkAutoReply.mutateAsync(Array.from(selected));
            toast.success(
                `Sent ${res.sent} · skipped ${res.skipped} · failed ${res.failed}`,
            );
            clearSelection();
        } catch (err) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'Bulk auto-reply failed';
            toast.error(msg);
        }
    };

    const columns = useMemo<ColumnDef<Inquiry, unknown>[]>(
        () => [
            {
                header: () => (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                        Date <ArrowDown className="h-3 w-3" />
                    </span>
                ),
                accessorKey: 'createdAt',
                cell: ({ getValue }) => (
                    <span className="text-slate-600">
                        {format(new Date(getValue() as string), 'd MMM yyyy, HH:mm')}
                    </span>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ getValue }) => (
                    <span className="font-medium text-slate-900">{getValue() as string}</span>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: ({ getValue }) => (
                    <span className="text-slate-600">{getValue() as string}</span>
                ),
            },
            {
                header: 'Subject',
                accessorKey: 'subject',
                cell: ({ getValue }) => (
                    <span className="line-clamp-1 max-w-xs text-slate-700">
                        {getValue() as string}
                    </span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => <StatusCell row={row.original} />,
            },
            {
                id: 'chevron',
                header: '',
                cell: () => <ChevronRight className="h-4 w-4 text-slate-300" />,
            },
        ],
        [],
    );

    const busy = bulkStatus.isPending || bulkDelete.isPending || bulkAutoReply.isPending;

    return (
        <>
            <PageHeader
                title="Inquiries"
                description="Track, manage and respond to inquiries from businesses."
            />

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <KpiCard
                    label="Total Inquiries"
                    value={fmtNumber(stats.data?.total)}
                    deltaPct={stats.data?.totalDeltaPct ?? null}
                    icon={<MessageSquare className="h-5 w-5" />}
                    iconTone="emerald"
                />
                <KpiCard
                    label="New Leads"
                    value={fmtNumber(stats.data?.newCount)}
                    deltaPct={stats.data?.newDeltaPct ?? null}
                    icon={<UserPlus className="h-5 w-5" />}
                    iconTone="blue"
                />
                <ReplyAllCard />
            </div>

            <Card>
                <div className="flex flex-wrap items-center gap-3 px-3 py-3">
                    <Tabs
                        items={tabItems}
                        value={tab}
                        onChange={(v) => {
                            setTab(v);
                            setPage(1);
                            clearSelection();
                        }}
                        className="flex-1 border-b-0"
                    />
                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                        <SearchInput
                            placeholder="Search by name, email or subject…"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            wrapperClassName="flex-1 min-w-[200px] sm:w-72 sm:flex-none"
                        />
                        <a
                            href={buildExportUrl({
                                ...(tab !== 'ALL' && { status: tab }),
                                ...(debouncedSearch && { q: debouncedSearch }),
                            })}
                            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export CSV</span>
                            <span className="sm:hidden">CSV</span>
                        </a>
                    </div>
                </div>
                <div className="border-b border-slate-200" />
                {selected.size > 0 && (
                    <div className="px-3 pt-3">
                        <BulkActionsBar
                            count={selected.size}
                            busy={busy}
                            onClear={clearSelection}
                            onSetStatus={onBulkStatus}
                            onDelete={onBulkDelete}
                            onSendAutoReply={onBulkAutoReply}
                        />
                    </div>
                )}
                <div className="px-2 py-2">
                    <DataTable
                        data={items}
                        columns={columns}
                        isLoading={query.isLoading}
                        onRowClick={(row) => nav(`/inquiries/${row.id}`)}
                        emptyTitle="No inquiries match your filters"
                        className="rounded-none border-0"
                        selection={rowSelection}
                    />
                </div>
                <div className="border-t border-slate-200 px-5 py-3">
                    <Pagination
                        page={page}
                        total={query.data?.total ?? 0}
                        limit={PAGE_SIZE}
                        onChange={setPage}
                    />
                </div>
            </Card>

            <InquiryDetailDrawer
                id={selectedId}
                open={Boolean(selectedId)}
                onClose={() => nav('/inquiries')}
            />
        </>
    );
}

function StatusCell({ row }: { row: Inquiry }) {
    const updateMutation = useUpdateInquiryMutation(row.id);
    return (
        <InlineStatusSelect
            value={row.status}
            disabled={updateMutation.isPending}
            onChange={(status) =>
                updateMutation.mutate(
                    { status },
                    {
                        onError: () => toast.error('Could not update status'),
                        onSuccess: () => toast.success('Status updated'),
                    },
                )
            }
        />
    );
}

function fmtNumber(n: number | undefined): string {
    if (n == null) return '—';
    return n.toLocaleString();
}

