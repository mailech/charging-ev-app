import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';
import { NoticeModal } from '../components/NoticeModal';
import { trackPageView } from '@/lib/track';

export function RootLayout() {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location.pathname, location.search]);

    return (
        <div className="min-h-full flex flex-col relative bg-background">
            <ScrollToTop />
            <NoticeModal />
            <Navbar />
            <main className="flex-1 w-full overflow-x-hidden">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
