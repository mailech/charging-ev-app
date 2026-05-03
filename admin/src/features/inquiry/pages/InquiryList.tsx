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
    Clock,
    Download,
    MessageSquare,
    Search,
    TrendingUp,
    UserPlus,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { Pagination } from '@/components/ui/Pagination';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable } from '@/components/data/DataTable';
import { KpiCard } from '@/components/data/KpiCard';
import { StatusBadge } from '../StatusBadge';
import { useInquiriesQuery, useInquiryCountsQuery, useInquiryStatsQuery } from '../hooks';
import { buildExportUrl } from '../api';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { InquiryDetailDrawer } from './InquiryDetail';

const TAB_ORDER: (InquiryStatus | 'ALL')[] = ['ALL', ...INQUIRY_STATUSES];

const PAGE_SIZE = 8;

export default function InquiryList() {
    const { id: selectedId } = useParams();
    const nav = useNavigate();

    const [tab, setTab] = useState<InquiryStatus | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

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

    const tabItems = TAB_ORDER.map((value) => ({
        value,
        label: value === 'ALL' ? 'ALL' : value.replace('_', ' '),
        count: counts.data?.[value],
    }));

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
                cell: ({ getValue }) => <StatusBadge status={getValue() as InquiryStatus} />,
            },
            {
                header: 'Assigned To',
                accessorKey: 'assignedTo',
                cell: ({ row }) => {
                    const a = row.original.assignedTo;
                    if (!a) return <span className="text-slate-300">—</span>;
                    const display = a.name ?? a.email;
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar name={a.name} email={a.email} size="xs" />
                            <span className="text-slate-700">
                                {abbreviate(display)}
                            </span>
                        </div>
                    );
                },
            },
            {
                id: 'chevron',
                header: '',
                cell: () => <ChevronRight className="h-4 w-4 text-slate-300" />,
            },
        ],
        [],
    );

    return (
        <>
            <PageHeader
                title="Inquiries"
                description="Track, manage and respond to inquiries from businesses."
            />

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                <KpiCard
                    label="Response Rate"
                    value={
                        stats.data?.responseRatePct != null
                            ? `${stats.data.responseRatePct}%`
                            : '—'
                    }
                    deltaPct={stats.data?.responseRateDeltaPct ?? null}
                    icon={<TrendingUp className="h-5 w-5" />}
                    iconTone="violet"
                />
                <KpiCard
                    label="Avg. Response Time"
                    value={
                        stats.data?.avgResponseHours != null
                            ? formatHours(stats.data.avgResponseHours)
                            : '—'
                    }
                    deltaPct={stats.data?.avgResponseDeltaPct ?? null}
                    icon={<Clock className="h-5 w-5" />}
                    iconTone="amber"
                />
            </div>

            <Card>
                <div className="flex flex-wrap items-center gap-3 px-3 py-3">
                    <Tabs
                        items={tabItems}
                        value={tab}
                        onChange={(v) => {
                            setTab(v);
                            setPage(1);
                        }}
                        className="flex-1 border-b-0"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search by name, email or subject…"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-72 pl-9"
                            />
                        </div>
                        <a
                            href={buildExportUrl({
                                ...(tab !== 'ALL' && { status: tab }),
                                ...(debouncedSearch && { q: debouncedSearch }),
                            })}
                            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </a>
                    </div>
                </div>
                <div className="border-b border-slate-200" />
                <div className="px-2 py-2">
                    <DataTable
                        data={query.data?.items ?? []}
                        columns={columns}
                        isLoading={query.isLoading}
                        onRowClick={(row) => nav(`/inquiries/${row.id}`)}
                        emptyTitle="No inquiries match your filters"
                        className="rounded-none border-0"
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

function fmtNumber(n: number | undefined): string {
    if (n == null) return '—';
    return n.toLocaleString();
}

function formatHours(h: number): string {
    if (h < 1) {
        return `${Math.round(h * 60)}m`;
    }
    const hours = Math.floor(h);
    const minutes = Math.round((h - hours) * 60);
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

function abbreviate(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]!;
    return `${parts[0]} ${parts[parts.length - 1]!.charAt(0).toUpperCase()}.`;
}

