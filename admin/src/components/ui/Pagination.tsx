import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Props {
    page: number;
    total: number;
    limit: number;
    onChange: (page: number) => void;
    className?: string;
}

function buildPageList(page: number, totalPages: number): (number | 'ellipsis')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const result: (number | 'ellipsis')[] = [1];
    if (page > 3) result.push('ellipsis');
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) result.push(i);
    if (page < totalPages - 2) result.push('ellipsis');
    result.push(totalPages);
    return result;
}

export function Pagination({ page, total, limit, onChange, className }: Props) {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(total, page * limit);
    const pages = buildPageList(page, totalPages);

    return (
        <div className={cn('flex flex-wrap items-center justify-between gap-3 px-1', className)}>
            <p className="text-xs text-slate-500">
                Showing {start} to {end} of {total} results
            </p>
            <nav className="flex items-center gap-1" aria-label="Pagination">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                </button>
                {pages.map((p, idx) =>
                    p === 'ellipsis' ? (
                        <span key={`e${idx}`} className="px-2 text-xs text-slate-400">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            type="button"
                            onClick={() => onChange(p)}
                            aria-current={p === page ? 'page' : undefined}
                            className={cn(
                                'h-8 w-8 rounded-md text-xs font-medium transition',
                                p === page
                                    ? 'bg-emerald-500 text-white'
                                    : 'text-slate-600 hover:bg-slate-100',
                            )}
                        >
                            {p}
                        </button>
                    ),
                )}
                <button
                    type="button"
                    onClick={() => onChange(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
            </nav>
        </div>
    );
}
