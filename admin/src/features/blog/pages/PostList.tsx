import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';
import { POST_STATUSES, type PostStatus, type PostSummary } from '@trio/shared/blog';
import { ChevronRight, Plus, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Pagination } from '@/components/ui/Pagination';
import { DataTable } from '@/components/data/DataTable';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { usePostsQuery } from '../hooks';
import { mediaUrl } from '../mediaUrl';
import { cn } from '@/lib/cn';

const TAB_ORDER: (PostStatus | 'ALL')[] = ['ALL', ...POST_STATUSES];
const PAGE_SIZE = 12;

const STATUS_TONES: Record<PostStatus, string> = {
    DRAFT: 'bg-slate-100 text-slate-600',
    PUBLISHED: 'bg-emerald-50 text-emerald-700',
    ARCHIVED: 'bg-amber-50 text-amber-700',
};

export default function PostList() {
    const nav = useNavigate();
    const [tab, setTab] = useState<PostStatus | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debounced = useDebouncedValue(search, 300);

    const params = {
        ...(tab !== 'ALL' && { status: tab }),
        ...(debounced && { q: debounced }),
        page,
        limit: PAGE_SIZE,
    };
    const query = usePostsQuery(params);

    const tabItems = TAB_ORDER.map((value) => ({
        value,
        label: value === 'ALL' ? 'ALL' : value,
    }));

    const columns = useMemo<ColumnDef<PostSummary, unknown>[]>(
        () => [
            {
                header: 'Post',
                accessorKey: 'title',
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        {row.original.coverMedia ? (
                            <img
                                src={mediaUrl(
                                    row.original.coverMedia.thumbUrl ?? row.original.coverMedia.url,
                                )}
                                alt=""
                                className="h-10 w-14 shrink-0 rounded object-cover"
                            />
                        ) : (
                            <div className="h-10 w-14 shrink-0 rounded bg-slate-100" />
                        )}
                        <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">
                                {row.original.title}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                /{row.original.slug}
                            </p>
                        </div>
                    </div>
                ),
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: ({ row }) =>
                    row.original.category ? (
                        <span className="text-slate-700">{row.original.category.name}</span>
                    ) : (
                        <span className="text-slate-300">—</span>
                    ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ getValue }) => {
                    const status = getValue() as PostStatus;
                    return (
                        <span
                            className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider',
                                STATUS_TONES[status],
                            )}
                        >
                            {status}
                        </span>
                    );
                },
            },
            {
                header: 'Updated',
                accessorKey: 'updatedAt',
                cell: ({ getValue }) => (
                    <span className="text-slate-600">
                        {format(new Date(getValue() as string), 'd MMM yyyy')}
                    </span>
                ),
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
                title="Blog"
                description="Write, schedule and publish posts."
                actions={
                    <Link to="/blog/new">
                        <Button size="sm">
                            <Plus className="h-4 w-4" />
                            New post
                        </Button>
                    </Link>
                }
            />
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
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search posts…"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-72 pl-9"
                        />
                    </div>
                </div>
                <div className="border-b border-slate-200" />
                <div className="px-2 pb-2">
                    <DataTable
                        data={query.data?.items ?? []}
                        columns={columns}
                        isLoading={query.isLoading}
                        onRowClick={(row) => nav(`/blog/${row.id}`)}
                        emptyTitle="No posts yet"
                        emptyDescription="Create a draft to get started."
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
        </>
    );
}
