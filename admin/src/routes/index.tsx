/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AdminShell } from '@/components/layout/AdminShell';
import { AuthGuard } from '@/features/auth/AuthGuard';

const Login = lazy(() => import('@/features/auth/pages/Login'));
const Overview = lazy(() => import('@/features/dashboard/pages/Overview'));
const InquiryList = lazy(() => import('@/features/inquiry/pages/InquiryList'));
const PostList = lazy(() => import('@/features/blog/pages/PostList'));
const PostEditor = lazy(() => import('@/features/blog/pages/PostEditor'));
const MediaLibrary = lazy(() => import('@/features/blog/pages/MediaLibrary'));
const CategoryPage = lazy(() => import('@/features/blog/pages/Category'));
const CarouselManager = lazy(() => import('@/features/carousel/pages/CarouselManager'));
const NoticeManager = lazy(() => import('@/features/notice/pages/NoticeManager'));
const Placeholder = lazy(() => import('./Placeholder'));

function PageFallback() {
    return (
        <div className="flex h-full items-center justify-center text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
        </div>
    );
}

function withSuspense(node: ReactNode) {
    return <Suspense fallback={<PageFallback />}>{node}</Suspense>;
}

export const router = createBrowserRouter([
    {
        path: '/login',
        element: withSuspense(<Login />),
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <AdminShell />
            </AuthGuard>
        ),
        children: [
            { index: true, element: <Navigate to="/overview" replace /> },
            { path: 'overview', element: withSuspense(<Overview />) },
            { path: 'inquiries', element: withSuspense(<InquiryList />) },
            { path: 'inquiries/:id', element: withSuspense(<InquiryList />) },
            { path: 'blog', element: withSuspense(<PostList />) },
            { path: 'blog/new', element: withSuspense(<PostEditor />) },
            { path: 'blog/:id', element: withSuspense(<PostEditor />) },
            { path: 'media', element: withSuspense(<MediaLibrary />) },
            { path: 'category', element: withSuspense(<CategoryPage />) },
            { path: 'taxonomy', element: <Navigate to="/category" replace /> },
            { path: 'carousel', element: withSuspense(<CarouselManager />) },
            { path: 'notice', element: withSuspense(<NoticeManager />) },
            {
                path: 'settings',
                element: withSuspense(<Placeholder title="Settings" />),
            },
            { path: '*', element: <Navigate to="/overview" replace /> },
        ],
    },
]);
