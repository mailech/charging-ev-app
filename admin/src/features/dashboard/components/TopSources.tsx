import { useMemo } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface Props {
    items: { source: string; count: number }[] | undefined;
    isLoading?: boolean;
}

export function TopSources({ items, isLoading }: Props) {
    const max = useMemo(
        () => (items?.length ? Math.max(...items.map((i) => i.count)) : 0),
        [items],
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top sources</CardTitle>
            </CardHeader>
            <CardBody>
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </div>
                ) : !items || items.length === 0 ? (
                    <EmptyState
                        title="No source data yet"
                        description="Sources appear once inquiries start flowing in."
                    />
                ) : (
                    <ul className="space-y-3">
                        {items.map((it) => {
                            const pct = max === 0 ? 0 : Math.round((it.count / max) * 100);
                            return (
                                <li key={it.source} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium capitalize text-slate-700">
                                            {it.source}
                                        </span>
                                        <span className="tabular-nums text-slate-500">
                                            {it.count}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-emerald-500 transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </CardBody>
        </Card>
    );
}
