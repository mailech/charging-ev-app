import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            onClick={onClose}
        >
            <div
                className={cn(
                    'relative w-full max-w-lg rounded-xl bg-white shadow-xl',
                    className,
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                <div className="px-5 py-4">{children}</div>
            </div>
        </div>
    );
}
