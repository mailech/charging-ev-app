import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { INQUIRY_STATUSES, type InquiryStatus } from '@trio/shared/inquiry';
import { cn } from '@/lib/cn';

interface Props {
    value: InquiryStatus;
    onChange: (next: InquiryStatus) => void;
    disabled?: boolean;
}

const TONES: Record<InquiryStatus, { pill: string; ring: string; dot: string }> = {
    NEW: {
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
        ring: 'focus-visible:ring-emerald-300',
        dot: 'bg-emerald-500',
    },
    IN_REVIEW: {
        pill: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
        ring: 'focus-visible:ring-amber-300',
        dot: 'bg-amber-500',
    },
    RESPONDED: {
        pill: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        ring: 'focus-visible:ring-blue-300',
        dot: 'bg-blue-500',
    },
    CLOSED: {
        pill: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200',
        ring: 'focus-visible:ring-slate-300',
        dot: 'bg-slate-400',
    },
};

const LABELS: Record<InquiryStatus, string> = {
    NEW: 'New',
    IN_REVIEW: 'In Review',
    RESPONDED: 'Responded',
    CLOSED: 'Closed',
};

export function InlineStatusSelect({ value, onChange, disabled }: Props) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);

    useLayoutEffect(() => {
        if (!open || !buttonRef.current) return;
        const update = () => {
            const rect = buttonRef.current!.getBoundingClientRect();
            setPos({
                top: rect.bottom + 4,
                left: rect.left,
                width: Math.max(rect.width, 180),
            });
        };
        update();
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onDoc = (e: MouseEvent) => {
            const t = e.target as Node;
            if (buttonRef.current?.contains(t)) return;
            if (menuRef.current?.contains(t)) return;
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('mousedown', onDoc);
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('mousedown', onDoc);
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const tone = TONES[value];

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((v) => !v);
                }}
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                    tone.pill,
                    tone.ring,
                )}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} />
                {LABELS[value]}
                <ChevronDown
                    className={cn(
                        'h-3 w-3 opacity-70 transition-transform',
                        open && 'rotate-180',
                    )}
                />
            </button>
            {open &&
                pos &&
                createPortal(
                    <ul
                        ref={menuRef}
                        role="listbox"
                        style={{
                            position: 'fixed',
                            top: pos.top,
                            left: pos.left,
                            minWidth: pos.width,
                            zIndex: 1000,
                        }}
                        className="overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-black/5"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {INQUIRY_STATUSES.map((s) => {
                            const active = s === value;
                            const sTone = TONES[s];
                            return (
                                <li key={s}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={active}
                                        onClick={() => {
                                            if (!active) onChange(s);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs transition-colors',
                                            active
                                                ? 'bg-slate-50 font-semibold'
                                                : 'hover:bg-slate-50',
                                        )}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'h-1.5 w-1.5 rounded-full',
                                                    sTone.dot,
                                                )}
                                            />
                                            <span className="text-slate-700">{LABELS[s]}</span>
                                        </span>
                                        {active && (
                                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>,
                    document.body,
                )}
        </>
    );
}
