import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

interface Props {
    items: { day: string; label: string; count: number }[] | undefined;
    isLoading?: boolean;
}

export function UniqueVisitorsLine({ items, isLoading }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Unique visitors — last 30 days</CardTitle>
            </CardHeader>
            <CardBody>
                {isLoading ? (
                    <Skeleton className="h-56 w-full" />
                ) : (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={items ?? []}
                                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="uvFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    interval="preserveStartEnd"
                                    minTickGap={20}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    width={28}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#10b981', strokeOpacity: 0.4 }}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: '1px solid #e2e8f0',
                                        fontSize: 12,
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#uvFill)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
