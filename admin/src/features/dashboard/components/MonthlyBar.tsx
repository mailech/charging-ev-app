import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

interface Props {
    items: { month: string; label: string; count: number }[] | undefined;
    isLoading?: boolean;
}

export function MonthlyBar({ items, isLoading }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Inquiries — last 12 months</CardTitle>
            </CardHeader>
            <CardBody>
                {isLoading ? (
                    <Skeleton className="h-56 w-full" />
                ) : (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={items ?? []}
                                margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    width={28}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#ecfdf5' }}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: '1px solid #e2e8f0',
                                        fontSize: 12,
                                        padding: '6px 10px',
                                    }}
                                    labelStyle={{ color: '#475569', fontWeight: 500 }}
                                />
                                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
