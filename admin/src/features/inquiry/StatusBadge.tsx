import { cn } from '@/lib/cn';
import type { InquiryStatus } from '@trio/shared/inquiry';

const TONES: Record<InquiryStatus, string> = {
    NEW: 'bg-emerald-50 text-emerald-700',
    IN_REVIEW: 'bg-amber-50 text-amber-700',
    RESPONDED: 'bg-blue-50 text-blue-700',
    CLOSED: 'bg-slate-100 text-slate-500',
};

const LABELS: Record<InquiryStatus, string> = {
    NEW: 'NEW',
    IN_REVIEW: 'IN REVIEW',
    RESPONDED: 'RESPONDED',
    CLOSED: 'CLOSED',
};

export function StatusBadge({ status, className }: { status: InquiryStatus; className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider',
                TONES[status],
                className,
            )}
        >
            {LABELS[status]}
        </span>
    );
}
