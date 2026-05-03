import { useMemo } from 'react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface Props {
    items: { referrer: string; count: number }[] | undefined;
    isLoading?: boolean;
}

export function TopReferrers({ items, isLoading }: Props) {
    const max = useMemo(
        () => (items?.length ? Math.max(...items.map((i) => i.count)) : 0),
        [items],
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Where visitors come from</CardTitle>
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
                        title="No referrer data yet"
                        description="Referrers appear once visitors arrive from external sites."
                    />
                ) : (
                    <ul className="space-y-3">
                        {items.map((it) => {
                            const pct = max === 0 ? 0 : Math.round((it.count / max) * 100);
                            return (
                                <li key={it.referrer} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="truncate font-medium text-slate-700">
                                            {it.referrer}
                                        </span>
                                        <span className="tabular-nums text-slate-500">
                                            {it.count}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-blue-500 transition-all"
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
