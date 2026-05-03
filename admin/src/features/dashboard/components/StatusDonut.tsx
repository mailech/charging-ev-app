import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { InquiryStatus } from '@trio/shared/inquiry';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const COLORS: Record<InquiryStatus, string> = {
    NEW: '#10b981',
    IN_REVIEW: '#f59e0b',
    RESPONDED: '#3b82f6',
    CLOSED: '#94a3b8',
};

const LABELS: Record<InquiryStatus, string> = {
    NEW: 'New',
    IN_REVIEW: 'In review',
    RESPONDED: 'Responded',
    CLOSED: 'Closed',
};

interface Props {
    items: { status: InquiryStatus; count: number }[] | undefined;
    isLoading?: boolean;
}

export function StatusDonut({ items, isLoading }: Props) {
    const data = useMemo(() => items ?? [], [items]);
    const total = useMemo(() => data.reduce((s, d) => s + d.count, 0), [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Inquiries by status</CardTitle>
            </CardHeader>
            <CardBody>
                {isLoading ? (
                    <Skeleton className="h-56 w-full" />
                ) : (
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <div className="relative h-48 w-48 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="count"
                                        nameKey="status"
                                        innerRadius={56}
                                        outerRadius={80}
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                    >
                                        {data.map((d) => (
                                            <Cell key={d.status} fill={COLORS[d.status]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-semibold text-slate-900">
                                    {total}
                                </span>
                                <span className="text-[11px] uppercase tracking-wider text-slate-400">
                                    Total
                                </span>
                            </div>
                        </div>
                        <ul className="flex-1 space-y-3 text-sm">
                            {data.map((d) => {
                                const pct = total === 0 ? 0 : Math.round((d.count / total) * 100);
                                return (
                                    <li
                                        key={d.status}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{ background: COLORS[d.status] }}
                                            />
                                            <span className="text-slate-700">
                                                {LABELS[d.status]}
                                            </span>
                                        </span>
                                        <span className="text-slate-500 tabular-nums">
                                            {d.count}{' '}
                                            <span className="text-slate-400">({pct}%)</span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
