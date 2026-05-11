import { useRef } from 'react';
import { Trash2, UploadCloud } from 'lucide-react';
import type { Media } from '@trio/shared/blog';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
    useDeleteMediaMutation,
    useMediaQuery,
    useUploadMediaMutation,
} from './hooks';
import { mediaUrl } from './mediaUrl';
import { toast } from '@/hooks/useToast';
import { extractUploadError } from '@/lib/uploadError';

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (media: Media) => void;
}

export function MediaPicker({ open, onClose, onSelect }: Props) {
    const fileInput = useRef<HTMLInputElement>(null);
    const query = useMediaQuery('IMAGE');
    const upload = useUploadMediaMutation();
    const remove = useDeleteMediaMutation();

    const handleFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        let successes = 0;
        for (const file of Array.from(files)) {
            try {
                await upload.mutateAsync({ file });
                successes++;
            } catch (err) {
                toast.error(`Upload failed: ${file.name} — ${extractUploadError(err)}`);
            }
        }
        if (successes > 0) toast.success(`Upload complete: ${successes} file(s)`);
    };

    return (
        <Modal open={open} onClose={onClose} title="Media library" className="max-w-3xl">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Select an image to insert, or upload new.
                    </p>
                    <Button
                        size="sm"
                        onClick={() => fileInput.current?.click()}
                        loading={upload.isPending}
                    >
                        <UploadCloud className="h-4 w-4" />
                        Upload
                    </Button>
                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            void handleFiles(e.target.files);
                            e.target.value = '';
                        }}
                    />
                </div>
                {query.isLoading ? (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="aspect-square w-full" />
                        ))}
                    </div>
                ) : (query.data ?? []).length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                        No media yet. Upload an image to begin.
                    </p>
                ) : (
                    <ul className="grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
                        {(query.data ?? []).map((m) => (
                            <li
                                key={m.id}
                                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                            >
                                <button
                                    type="button"
                                    onClick={() => onSelect(m)}
                                    className="block aspect-square w-full"
                                >
                                    <img
                                        src={mediaUrl(m.thumbUrl ?? m.url)}
                                        alt={m.alt ?? ''}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Delete media"
                                    onClick={() => {
                                        if (window.confirm('Delete this image?')) {
                                            remove.mutate(m.id);
                                        }
                                    }}
                                    className="absolute right-1 top-1 hidden rounded bg-white/90 p-1 text-red-600 hover:bg-white group-hover:block"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Modal>
    );
}
