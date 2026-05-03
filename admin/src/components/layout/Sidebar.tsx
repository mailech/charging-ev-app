import { NavLink } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { NAV_ITEMS } from '@/routes/nav';
import { cn } from '@/lib/cn';

export function Sidebar() {
    return (
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
            <div className="mb-8 flex items-center gap-2 px-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500 text-white">
                    <Zap className="h-4 w-4" />
                </span>
                <span className="text-lg font-semibold text-slate-900">Trio</span>
            </div>
            <nav className="flex-1 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
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
        </aside>
    );
}
