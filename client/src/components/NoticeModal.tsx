import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Notice } from '@trio/shared/notice';
import { api } from '../lib/axios';
import { mediaUrl } from '../lib/mediaUrl';

const STORAGE_KEY_DAY = 'notice_dismissed_day';
const STORAGE_KEY_SESSION = 'notice_dismissed_session';

async function fetchNotice(): Promise<Notice | null> {
    try {
        const { data } = await api.get('/api/notice');
        return data as Notice | null;
    } catch {
        return null;
    }
}

function todayStamp(): string {
    return new Date().toISOString().slice(0, 10);
}

function isSuppressed(notice: Notice): boolean {
    if (notice.showFrequency === 'always') return false;
    if (notice.showFrequency === 'once-per-session') {
        return sessionStorage.getItem(STORAGE_KEY_SESSION) === notice.id;
    }
    if (notice.showFrequency === 'once-per-day') {
        return localStorage.getItem(STORAGE_KEY_DAY) === `${notice.id}:${todayStamp()}`;
    }
    return false;
}

function markDismissed(notice: Notice) {
    if (notice.showFrequency === 'once-per-session') {
        sessionStorage.setItem(STORAGE_KEY_SESSION, notice.id);
    } else if (notice.showFrequency === 'once-per-day') {
        localStorage.setItem(STORAGE_KEY_DAY, `${notice.id}:${todayStamp()}`);
    }
}

export function NoticeModal() {
    const { data } = useQuery({
        queryKey: ['notice'],
        queryFn: fetchNotice,
        staleTime: 60_000,
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!data) return;
        if (isSuppressed(data)) return;
        const t = setTimeout(() => setOpen(true), 250);
        return () => clearTimeout(t);
    }, [data]);

    if (!data || !open) return null;

    const close = () => {
        markDismissed(data);
        setOpen(false);
    };

    const onContentClick = (e: React.MouseEvent) => {
        if (!data.redirectUrl) return;
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        window.location.href = data.redirectUrl;
    };

    const imageStyle: React.CSSProperties = {
        width: data.imageWidth ? `${data.imageWidth}px` : 'auto',
        height: data.imageHeight ? `${data.imageHeight}px` : 'auto',
        maxWidth: '100%',
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={data.dismissible ? close : undefined}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl shadow-2xl"
                style={{ background: data.bgColor }}
                onClick={(e) => {
                    e.stopPropagation();
                    onContentClick(e);
                }}
            >
                {data.dismissible && (
                    <button
                        type="button"
                        aria-label="Close notice"
                        onClick={close}
                        className="absolute right-3 top-3 rounded-full bg-black/10 p-1.5 text-current hover:bg-black/20"
                        style={{ color: data.titleColor }}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                <div className="px-6 py-6">
                    <h3
                        className="font-semibold leading-tight"
                        style={{ color: data.titleColor, fontSize: `${data.titleSize}px` }}
                    >
                        {data.title}
                    </h3>
                    {data.imageUrl && (
                        <div
                            className="mt-4 flex"
                            style={{
                                justifyContent:
                                    data.imageAlign === 'left'
                                        ? 'flex-start'
                                        : data.imageAlign === 'right'
                                          ? 'flex-end'
                                          : 'center',
                            }}
                        >
                            <img
                                src={mediaUrl(data.imageUrl)}
                                alt=""
                                className="rounded"
                                style={imageStyle}
                            />
                        </div>
                    )}
                    {data.body && (
                        <div
                            className="mt-4 whitespace-pre-wrap leading-relaxed"
                            style={{ color: data.bodyColor, fontSize: `${data.bodySize}px` }}
                        >
                            {data.body}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
