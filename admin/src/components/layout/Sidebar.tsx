import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Zap } from 'lucide-react';
import { NAV_ITEMS } from '@/routes/nav';
import { cn } from '@/lib/cn';

interface Props {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: Props) {
    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onMobileClose?.();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [mobileOpen, onMobileClose]);

    return (
        <>
            <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
                <Brand />
                <Nav onItemClick={undefined} />
            </aside>

            <div
                aria-hidden={!mobileOpen}
                onClick={onMobileClose}
                className={cn(
                    'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden',
                    mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            />
            <aside
                role="dialog"
                aria-modal="true"
                aria-hidden={!mobileOpen}
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-2xl transition-transform lg:hidden',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="mb-2 flex items-center justify-between">
                    <Brand />
                    <button
                        type="button"
                        onClick={onMobileClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100"
                        aria-label="Close menu"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <Nav onItemClick={onMobileClose} />
            </aside>
        </>
    );
}

function Brand() {
    return (
        <div className="mb-8 flex items-center gap-2 px-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500 text-white">
                <Zap className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold text-slate-900">Trio Charging</span>
        </div>
    );
}

function Nav({ onItemClick }: { onItemClick: (() => void) | undefined }) {
    return (
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={onItemClick}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                            )
                        }
                    >
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </NavLink>
                );
            })}
        </nav>
    );
}
