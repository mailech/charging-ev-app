import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useMe } from '@/features/auth/hooks';
import { logout } from '@/features/auth/api';
import { Button } from '@/components/ui/Button';
import { toast } from '@/hooks/useToast';

export function Topbar() {
    const me = useMe();
    const nav = useNavigate();
    const [open, setOpen] = useState(false);

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success('Signed out');
            nav('/login', { replace: true });
        },
    });

    const initial = me.data?.name?.[0] ?? me.data?.email?.[0] ?? 'A';

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div />
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                </button>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-100"
                    >
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                            {initial.toUpperCase()}
                        </span>
                        <span className="hidden text-sm font-medium text-slate-700 sm:block">
                            {me.data?.name ?? me.data?.email ?? 'Admin'}
                        </span>
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                    </button>
                    {open && (
                        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                            <div className="border-b border-slate-100 px-3 py-2 text-xs text-slate-500">
                                {me.data?.email}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start rounded-none"
                                loading={logoutMutation.isPending}
                                onClick={() => logoutMutation.mutate()}
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
