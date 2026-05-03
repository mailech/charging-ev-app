import { cn } from '@/lib/cn';

interface TabItem<T extends string> {
    value: T;
    label: string;
    count?: number;
}

interface Props<T extends string> {
    items: TabItem<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

export function Tabs<T extends string>({ items, value, onChange, className }: Props<T>) {
    return (
        <div
            role="tablist"
            className={cn('flex items-center gap-6 border-b border-slate-200', className)}
        >
            {items.map((item) => {
                const active = item.value === value;
                const hasCount = typeof item.count === 'number';
                return (
                    <button
                        key={item.value}
                        role="tab"
                        aria-selected={active}
                        type="button"
                        onClick={() => onChange(item.value)}
                        className={cn(
                            'group relative -mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 pt-1 text-xs font-semibold uppercase tracking-wider transition-colors',
                            active
                                ? 'border-emerald-500 text-emerald-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800',
                        )}
                    >
                        {item.label}
                        {hasCount && (
                            <span
                                className={cn(
                                    'inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums transition-colors',
                                    active
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700',
                                )}
                            >
                                {item.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
