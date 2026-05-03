import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, ChevronRight } from 'lucide-react';
import type { Inquiry } from '@trio/shared/inquiry';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/features/inquiry/StatusBadge';

interface Props {
    items: Inquiry[] | undefined;
    isLoading?: boolean;
}

export function RecentInquiries({ items, isLoading }: Props) {
    const nav = useNavigate();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent inquiries</CardTitle>
                <Link
                    to="/inquiries"
                    className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </CardHeader>
            <CardBody className="px-0 py-0">
                {isLoading ? (
                    <div className="space-y-2 p-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : !items || items.length === 0 ? (
                    <div className="p-5">
                        <EmptyState title="No inquiries yet" />
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {items.map((it) => (
                            <li
                                key={it.id}
                                onClick={() => nav(`/inquiries/${it.id}`)}
                                className="flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
                            >
                                <Avatar name={it.name} email={it.email} size="sm" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-sm font-medium text-slate-900">
                                            {it.name}
                                        </p>
                                        <span className="text-xs text-slate-400">
                                            {format(new Date(it.createdAt), 'd MMM, HH:mm')}
                                        </span>
                                    </div>
                                    <p className="truncate text-xs text-slate-500">{it.subject}</p>
                                </div>
                                <StatusBadge status={it.status} />
                                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                            </li>
                        ))}
                    </ul>
                )}
            </CardBody>
        </Card>
    );
}
