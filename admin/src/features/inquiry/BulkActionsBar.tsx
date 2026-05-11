import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Sparkles, Trash2, X } from 'lucide-react';
import { INQUIRY_STATUSES, type InquiryStatus } from '@trio/shared/inquiry';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/cn';

interface Props {
    count: number;
    onClear: () => void;
    onSetStatus: (status: InquiryStatus) => void;
    onDelete: () => void;
    onSendAutoReply: () => void;
    busy?: boolean;
}

export function BulkActionsBar({
    count,
    onClear,
    onSetStatus,
    onDelete,
    onSendAutoReply,
    busy,
}: Props) {
    const [statusOpen, setStatusOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!statusOpen) return;
        const onDoc = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setStatusOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setStatusOpen(false);
        };
        window.addEventListener('mousedown', onDoc);
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('mousedown', onDoc);
            window.removeEventListener('keydown', onKey);
        };
    }, [statusOpen]);

    return (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50/40 px-3 py-2 shadow-[0_1px_2px_rgba(16,185,129,0.08)]">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-semibold text-white tabular-nums">
                    {count}
                </span>
                selected
            </span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
                <div className="relative" ref={ref}>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatusOpen((v) => !v)}
                        disabled={busy}
                    >
                        Set status
                        <ChevronDown
                            className={cn(
                                'h-3 w-3 transition-transform',
                                statusOpen && 'rotate-180',
                            )}
                        />
                    </Button>
                    {statusOpen && (
                        <ul
                            role="menu"
                            className="absolute right-0 top-full z-30 mt-1 min-w-[180px] overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg"
                        >
                            {INQUIRY_STATUSES.map((s) => (
                                <li key={s}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStatusOpen(false);
                                            onSetStatus(s);
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50"
                                    >
                                        <StatusBadge status={s} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <Button size="sm" variant="outline" onClick={onSendAutoReply} disabled={busy}>
                    <Sparkles className="h-3.5 w-3.5" />
                    Send auto-reply
                </Button>
                <Button size="sm" variant="outline" onClick={onDelete} disabled={busy}>
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    Delete
                </Button>
                <Button size="sm" variant="ghost" onClick={onClear} disabled={busy}>
                    <X className="h-3.5 w-3.5" />
                    Clear
                </Button>
            </div>
        </div>
    );
}
