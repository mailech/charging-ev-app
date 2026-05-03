import { useRef, useState } from 'react';
import { Trash2, UploadCloud, Image as ImageIcon, Video as VideoIcon, Layers } from 'lucide-react';
import type { Media } from '@trio/shared/blog';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import {
    useDeleteMediaMutation,
    useMediaQuery,
    useUploadMediaMutation,
} from '../hooks';
import { mediaUrl } from '../mediaUrl';
import { toast } from '@/hooks/useToast';
import { extractUploadError, preflightFile } from '@/lib/uploadError';

type Filter = 'ALL' | 'IMAGE' | 'VIDEO';

export default function MediaLibrary() {
    const fileInput = useRef<HTMLInputElement>(null);
    const [filter, setFilter] = useState<Filter>('ALL');
    const query = useMediaQuery(filter === 'ALL' ? undefined : filter);
    const upload = useUploadMediaMutation();
    const remove = useDeleteMediaMutation();

    const handleFiles = async (files: FileList | null) => {
        if (!files) return;
        let okCount = 0;
        for (const f of Array.from(files)) {
            const preErr = preflightFile(f);
            if (preErr) {
                toast.error(`${f.name}: ${preErr}`);
                continue;
            }
            try {
                await upload.mutateAsync({ file: f });
                okCount += 1;
            } catch (err) {
                toast.error(`${f.name}: ${extractUploadError(err)}`);
            }
        }
        if (okCount > 0) toast.success(`${okCount} file${okCount === 1 ? '' : 's'} uploaded`);
    };

    const items = query.data ?? [];

    return (
        <>
            <PageHeader
                title="Media"
                description="Images and videos used across the site."
                actions={
                    <Button
                        size="sm"
                        loading={upload.isPending}
                        onClick={() => fileInput.current?.click()}
                    >
                        <UploadCloud className="h-4 w-4" />
                        Upload
                    </Button>
                }
            />
            <input
                ref={fileInput}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                    void handleFiles(e.target.files);
                    e.target.value = '';
                }}
            />

            <div className="mb-3 inline-flex rounded-lg border border-slate-200 bg-white p-1">
                <FilterTab active={filter === 'ALL'} onClick={() => setFilter('ALL')}>
                    <Layers className="h-3.5 w-3.5" />
                    All
                </FilterTab>
                <FilterTab active={filter === 'IMAGE'} onClick={() => setFilter('IMAGE')}>
                    <ImageIcon className="h-3.5 w-3.5" />
                    Images
                </FilterTab>
                <FilterTab active={filter === 'VIDEO'} onClick={() => setFilter('VIDEO')}>
                    <VideoIcon className="h-3.5 w-3.5" />
                    Videos
                </FilterTab>
            </div>

            <Card>
                <CardBody>
                    {query.isLoading ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Skeleton key={i} className="aspect-square w-full" />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <EmptyState
                            title="No media uploaded"
                            description="Click Upload to add images or videos."
                        />
                    ) : (
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                            {items.map((m) => (
                                <MediaTile
                                    key={m.id}
                                    media={m}
                                    onDelete={() => {
                                        if (window.confirm('Delete this media?'))
                                            remove.mutate(m.id);
                                    }}
                                />
                            ))}
                        </ul>
                    )}
                </CardBody>
            </Card>
        </>
    );
}

function FilterTab({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={
                active
                    ? 'inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm'
                    : 'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900'
            }
        >
            {children}
        </button>
    );
}

function MediaTile({ media, onDelete }: { media: Media; onDelete: () => void }) {
    return (
        <li className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {media.kind === 'VIDEO' ? (
                <video
                    src={mediaUrl(media.url)}
                    className="aspect-square w-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => void e.currentTarget.play()}
                    onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                    }}
                />
            ) : (
                <img
                    src={mediaUrl(media.thumbUrl ?? media.url)}
                    alt={media.alt ?? ''}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                />
            )}
            <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium uppercase text-white">
                {media.kind}
            </span>
            <button
                type="button"
                aria-label="Delete"
                onClick={onDelete}
                className="absolute right-1 top-1 hidden rounded bg-white/90 p-1 text-red-600 hover:bg-white group-hover:block"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </li>
    );
}
