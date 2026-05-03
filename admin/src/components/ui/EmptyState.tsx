import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface Props {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/40 px-6 py-12 text-center">
            <div className="rounded-full bg-white p-3 text-slate-400 shadow-sm">
                {icon ?? <Inbox className="h-6 w-6" />}
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                {description && (
                    <p className="mt-1 text-sm text-slate-500">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}
