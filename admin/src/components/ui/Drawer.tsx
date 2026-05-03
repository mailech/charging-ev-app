import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    width?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    footer?: ReactNode;
}

const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

export function Drawer({
    open,
    onClose,
    title,
    width = 'md',
    children,
    footer,
}: DrawerProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    return (
        <>
            <div
                aria-hidden={!open}
                className={cn(
                    'fixed inset-0 z-40 bg-slate-900/30 transition-opacity',
                    open ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                onClick={onClose}
            />
            <aside
                role="dialog"
                aria-modal="true"
                className={cn(
                    'fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-xl transition-transform',
                    widths[width],
                    open ? 'translate-x-0' : 'translate-x-full',
                )}
            >
                <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                    <div className="min-w-0 flex-1">{title}</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="-mt-1 rounded p-1 text-slate-500 hover:bg-slate-100"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
                {footer && (
                    <footer className="border-t border-slate-100 px-5 py-3">{footer}</footer>
                )}
            </aside>
        </>
    );
}
