import { useEffect, useState } from 'react';
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
        if (!data.enabled) return;
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
        borderRadius: 8,
        marginTop: 16,
        display: 'block',
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 3000,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
            }}
            onClick={data.dismissible ? close : undefined}
        >
            <style>{`
                @media (max-width: 600px) {
                    .notice-modal-body { padding: 20px 18px !important; }
                    .notice-modal-title { font-size: clamp(1.1rem, 5vw, 1.6rem) !important; }
                }
            `}</style>
            <div
                style={{
                    position: 'relative',
                    maxHeight: '90vh',
                    width: '100%',
                    maxWidth: 640,
                    overflowY: 'auto',
                    borderRadius: 14,
                    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                    background: data.bgColor,
                    cursor: data.redirectUrl ? 'pointer' : 'default',
                }}
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
                        style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.08)',
                            border: 'none',
                            color: data.titleColor,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                        }}
                    >
                        ×
                    </button>
                )}
                <div className="notice-modal-body" style={{ padding: '24px 28px' }}>
                    <h3
                        className="notice-modal-title"
                        style={{
                            color: data.titleColor,
                            fontSize: `${data.titleSize}px`,
                            fontWeight: 600,
                            lineHeight: 1.2,
                            margin: 0,
                        }}
                    >
                        {data.title}
                    </h3>
                    {data.imageUrl && (
                        <img src={mediaUrl(data.imageUrl)} alt="" style={imageStyle} />
                    )}
                    {data.body && (
                        <div
                            style={{
                                marginTop: 16,
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                                color: data.bodyColor,
                                fontSize: `${data.bodySize}px`,
                            }}
                        >
                            {data.body}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
