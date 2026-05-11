import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminShell() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="flex h-full min-h-screen bg-slate-50">
            <Sidebar
                mobileOpen={mobileSidebarOpen}
                onMobileClose={() => setMobileSidebarOpen(false)}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar onOpenSidebar={() => setMobileSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto px-3 pb-6 sm:px-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
