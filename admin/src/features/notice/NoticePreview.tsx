import type { Notice } from '@trio/shared/notice';
import { mediaUrl } from '@/features/blog/mediaUrl';

export function NoticePreview({ notice }: { notice: Notice }) {
    const imageStyle: React.CSSProperties = {
        width: notice.imageWidth ? `${notice.imageWidth}px` : 'auto',
        height: notice.imageHeight ? `${notice.imageHeight}px` : 'auto',
        maxWidth: '100%',
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                Live preview
            </p>
            <div className="rounded-lg shadow-lg" style={{ background: notice.bgColor }}>
                <div className="px-6 py-5">
                    <h3
                        className="font-semibold leading-tight"
                        style={{ color: notice.titleColor, fontSize: `${notice.titleSize}px` }}
                    >
                        {notice.title || 'Notice'}
                    </h3>
                    {notice.imageUrl && (
                        <div
                            className="mt-3 flex"
                            style={{
                                justifyContent:
                                    notice.imageAlign === 'left'
                                        ? 'flex-start'
                                        : notice.imageAlign === 'right'
                                          ? 'flex-end'
                                          : 'center',
                            }}
                        >
                            <img
                                src={mediaUrl(notice.imageUrl)}
                                alt=""
                                className="rounded"
                                style={imageStyle}
                            />
                        </div>
                    )}
                    {notice.body && (
                        <div
                            className="mt-3 whitespace-pre-wrap leading-relaxed"
                            style={{ color: notice.bodyColor, fontSize: `${notice.bodySize}px` }}
                        >
                            {notice.body}
                        </div>
                    )}
                    {notice.redirectUrl && (
                        <p className="mt-3 text-xs text-slate-500">
                            Click → <span className="font-mono">{notice.redirectUrl}</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
