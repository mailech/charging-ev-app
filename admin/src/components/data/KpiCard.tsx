import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Props {
    label: string;
    value: string;
    deltaPct?: number | null;
    deltaSuffix?: string;
    icon: ReactNode;
    iconTone?: 'emerald' | 'blue' | 'amber' | 'violet';
    className?: string;
}

const TONES = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
};

export function KpiCard({
    label,
    value,
    deltaPct,
    deltaSuffix = 'vs last month',
    icon,
    iconTone = 'emerald',
    className,
}: Props) {
    const hasDelta = typeof deltaPct === 'number';
    const positive = (deltaPct ?? 0) >= 0;
    return (
        <div
            className={cn(
                'flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
                className,
            )}
        >
            <span
                className={cn(
                    'grid h-12 w-12 shrink-0 place-items-center rounded-xl',
                    TONES[iconTone],
                )}
            >
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <div className="mt-0.5 flex items-baseline gap-2">
                    <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
                    {hasDelta && (
                        <span
                            className={cn(
                                'inline-flex items-center gap-0.5 text-xs font-medium',
                                positive ? 'text-emerald-600' : 'text-red-600',
                            )}
                        >
                            {positive ? (
                                <ArrowUp className="h-3 w-3" />
                            ) : (
                                <ArrowDown className="h-3 w-3" />
                            )}
                            {Math.abs(deltaPct ?? 0)}%
                        </span>
                    )}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">{deltaSuffix}</p>
            </div>
        </div>
    );
}
