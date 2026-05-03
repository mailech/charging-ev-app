import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminShell() {
    return (
        <div className="flex h-full bg-slate-50">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto px-6 pb-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
