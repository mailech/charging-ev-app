import {
    LayoutDashboard,
    Inbox,
    Newspaper,
    Image as ImageIcon,
    Tags,
    Settings,
    GalleryHorizontal,
    Megaphone,
    type LucideIcon,
} from 'lucide-react';

export interface NavItem {
    label: string;
    to: string;
    icon: LucideIcon;
    end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    { label: 'Overview', to: '/overview', icon: LayoutDashboard, end: true },
    { label: 'Inquiries', to: '/inquiries', icon: Inbox },
    { label: 'Blog', to: '/blog', icon: Newspaper },
    { label: 'Media', to: '/media', icon: ImageIcon },
    { label: 'Carousel', to: '/carousel', icon: GalleryHorizontal },
    { label: 'Notice', to: '/notice', icon: Megaphone },
    { label: 'Category', to: '/category', icon: Tags },
    { label: 'Settings', to: '/settings', icon: Settings },
];
