import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useMe } from './hooks';

export function AuthGuard({ children }: { children: ReactNode }) {
    const me = useMe();
    const location = useLocation();

    if (me.isLoading) {
        return (
            <div className="flex h-full items-center justify-center text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
            </div>
        );
    }

    if (!me.data || me.data.role !== 'ADMIN') {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}
