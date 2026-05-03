import { useEffect, useRef, useState } from 'react';
import {
    ArrowDown,
    ArrowUp,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Loader2,
    Pencil,
    Plus,
    Save,
    Trash2,
    Video,
} from 'lucide-react';
import type {
    Carousel,
    CarouselSlide,
    CarouselTransition,
    SlideKind,
    SlideUpsertInput,
} from '@trio/shared/carousel';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { MediaPicker } from '@/features/blog/MediaPicker';
import { mediaUrl } from '@/features/blog/mediaUrl';
import { toast } from '@/hooks/useToast';
import {
    useAddSlideMutation,
    useCarouselQuery,
    useDeleteSlideMutation,
    useReorderSlidesMutation,
    useToggleSlideMutation,
    useUpdateCarouselMutation,
    useUpdateSlideMutation,
} from '../hooks';
import { uploadVideoFile } from '../api';
import { extractUploadError, preflightFile } from '@/lib/uploadError';

const TRANSITIONS: CarouselTransition[] = ['SLIDE', 'FADE'];

export default function CarouselManager() {
    const query = useCarouselQuery();
    const updateCarousel = useUpdateCarouselMutation();
    const reorder = useReorderSlidesMutation();
    const remove = useDeleteSlideMutation();
    const toggle = useToggleSlideMutation();
    const [editorOpen, setEditorOpen] = useState(false);
    const [editing, setEditing] = useState<CarouselSlide | null>(null);

    const carousel = query.data;

    if (query.isLoading || !carousel) {
        return (
            <>
                <PageHeader title="Hero carousel" description="Manage homepage hero slides." />
                <div className="flex h-40 items-center justify-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            </>
        );
    }

    const moveSlide = (idx: number, dir: -1 | 1) => {
        const next = [...carousel.slides];
        const target = idx + dir;
        if (target < 0 || target >= next.length) return;
        [next[idx], next[target]] = [next[target]!, next[idx]!];
        reorder.mutate({ ids: next.map((s) => s.id) });
    };

    return (
        <>
            <PageHeader
                title="Hero carousel"
                description="Add image or video slides shown on the public site. If empty, the default hero video plays."
            />

            <div
                className={
                    carousel.enabled
                        ? 'mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3'
                        : 'mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'
                }
            >
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        Carousel is {carousel.enabled ? 'live' : 'disabled'}
                    </p>
                    <p className="text-xs text-slate-500">
                        {carousel.enabled
                            ? 'Public site shows this carousel.'
                            : 'Public site falls back to the default hero video.'}
                    </p>
                </div>
                <Button
                    size="sm"
                    variant={carousel.enabled ? 'ghost' : 'primary'}
                    onClick={() => updateCarousel.mutate({ enabled: !carousel.enabled })}
                    loading={updateCarousel.isPending}
                >
                    {carousel.enabled ? (
                        <>
                            <EyeOff className="h-4 w-4" />
                            Disable
                        </>
                    ) : (
                        <>
                            <Eye className="h-4 w-4" />
                            Enable
                        </>
                    )}
                </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Slides</CardTitle>
                        <Button
                            size="sm"
                            onClick={() => {
                                setEditing(null);
                                setEditorOpen(true);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            Add slide
                        </Button>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        {carousel.slides.length === 0 ? (
                            <EmptyState
                                title="No slides yet"
                                description="The default hero video will play until a slide is added."
                            />
                        ) : (
                            <ul className="space-y-3">
                                {carousel.slides.map((slide, idx) => (
                                    <li
                                        key={slide.id}
                                        className={
                                            slide.enabled
                                                ? 'flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3'
                                                : 'flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 opacity-60'
                                        }
                                    >
                                        <div className="flex h-16 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                                            {slide.kind === 'IMAGE' ? (
                                                <img
                                                    src={mediaUrl(slide.mediaUrl)}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Video className="h-6 w-6 text-slate-400" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-slate-900">
                                                {slide.headline ?? `Slide ${idx + 1}`}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">
                                                {slide.kind} · {slide.durationMs ?? carousel.defaultDurationMs}ms
                                                {!slide.enabled && ' · hidden'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggle.mutate({
                                                        id: slide.id,
                                                        enabled: !slide.enabled,
                                                    })
                                                }
                                                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-700"
                                                aria-label={slide.enabled ? 'Disable slide' : 'Enable slide'}
                                                title={slide.enabled ? 'Disable' : 'Enable'}
                                            >
                                                {slide.enabled ? (
                                                    <Eye className="h-4 w-4" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4" />
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveSlide(idx, -1)}
                                                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                                                disabled={idx === 0}
                                                aria-label="Move up"
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveSlide(idx, 1)}
                                                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                                                disabled={idx === carousel.slides.length - 1}
                                                aria-label="Move down"
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditing(slide);
                                                    setEditorOpen(true);
                                                }}
                                                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-700"
                                                aria-label="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (window.confirm('Delete this slide?'))
                                                        remove.mutate(slide.id);
                                                }}
                                                className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                aria-label="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardBody>
                </Card>

                <SettingsPanel carousel={carousel} onSave={(input) => updateCarousel.mutate(input)} />
            </div>

            <SlideEditor
                open={editorOpen}
                onClose={() => setEditorOpen(false)}
                slide={editing}
            />
        </>
    );
}

function SettingsPanel({
    carousel,
    onSave,
}: {
    carousel: Carousel;
    onSave: (input: Partial<Carousel>) => void;
}) {
    const [autoplay, setAutoplay] = useState(carousel.autoplay);
    const [loop, setLoop] = useState(carousel.loop);
    const [swipe, setSwipe] = useState(carousel.swipe);
    const [showArrows, setShowArrows] = useState(carousel.showArrows);
    const [showDots, setShowDots] = useState(carousel.showDots);
    const [transition, setTransition] = useState<CarouselTransition>(carousel.transition);
    const [defaultDurationMs, setDefaultDurationMs] = useState(carousel.defaultDurationMs);

    useEffect(() => {
        setAutoplay(carousel.autoplay);
        setLoop(carousel.loop);
        setSwipe(carousel.swipe);
        setShowArrows(carousel.showArrows);
        setShowDots(carousel.showDots);
        setTransition(carousel.transition);
        setDefaultDurationMs(carousel.defaultDurationMs);
    }, [carousel]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
                <Toggle label="Autoplay" value={autoplay} onChange={setAutoplay} />
                <Toggle label="Loop" value={loop} onChange={setLoop} />
                <Toggle label="Swipe (drag/touch)" value={swipe} onChange={setSwipe} />
                <Toggle label="Show prev/next arrows" value={showArrows} onChange={setShowArrows} />
                <Toggle label="Show dots" value={showDots} onChange={setShowDots} />
                <label className="block space-y-1">
                    <span className="text-xs font-medium text-slate-600">Transition</span>
                    <Select
                        value={transition}
                        onChange={(e) => setTransition(e.target.value as CarouselTransition)}
                    >
                        {TRANSITIONS.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </Select>
                </label>
                <label className="block space-y-1">
                    <span className="text-xs font-medium text-slate-600">
                        Default slide duration (ms)
                    </span>
                    <Input
                        type="number"
                        min={500}
                        max={60000}
                        step={250}
                        value={defaultDurationMs}
                        onChange={(e) => setDefaultDurationMs(Number(e.target.value))}
                    />
                </label>
                <Button
                    size="sm"
                    onClick={() =>
                        onSave({
                            autoplay,
                            loop,
                            swipe,
                            showArrows,
                            showDots,
                            transition,
                            defaultDurationMs,
                        })
                    }
                >
                    <Save className="h-4 w-4" />
                    Save settings
                </Button>
            </CardBody>
        </Card>
    );
}

function Toggle({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2">
            <span className="text-sm text-slate-700">{label}</span>
            <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-emerald-600"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
            />
        </label>
    );
}

function SlideEditor({
    open,
    onClose,
    slide,
}: {
    open: boolean;
    onClose: () => void;
    slide: CarouselSlide | null;
}) {
    const add = useAddSlideMutation();
    const update = useUpdateSlideMutation();
    const [kind, setKind] = useState<SlideKind>(slide?.kind ?? 'IMAGE');
    const [enabled, setEnabled] = useState<boolean>(slide?.enabled ?? true);
    const [mediaUrlValue, setMediaUrlValue] = useState(slide?.mediaUrl ?? '');
    const [headline, setHeadline] = useState(slide?.headline ?? '');
    const [sub, setSub] = useState(slide?.sub ?? '');
    const [ctaLabel, setCtaLabel] = useState(slide?.ctaLabel ?? '');
    const [ctaHref, setCtaHref] = useState(slide?.ctaHref ?? '');
    const [textColor, setTextColor] = useState(slide?.textColor ?? '#ffffff');
    const [overlayOpacity, setOverlayOpacity] = useState(slide?.overlayOpacity ?? 40);
    const [durationMs, setDurationMs] = useState<number | ''>(slide?.durationMs ?? '');
    const [pickerOpen, setPickerOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);
    const fileInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        setKind(slide?.kind ?? 'IMAGE');
        setEnabled(slide?.enabled ?? true);
        setMediaUrlValue(slide?.mediaUrl ?? '');
        setHeadline(slide?.headline ?? '');
        setSub(slide?.sub ?? '');
        setCtaLabel(slide?.ctaLabel ?? '');
        setCtaHref(slide?.ctaHref ?? '');
        setTextColor(slide?.textColor ?? '#ffffff');
        setOverlayOpacity(slide?.overlayOpacity ?? 40);
        setDurationMs(slide?.durationMs ?? '');
    }, [open, slide]);

    const submit = async () => {
        if (!mediaUrlValue.trim()) {
            toast.error('Pick or upload media first');
            return;
        }
        const input: SlideUpsertInput = {
            kind,
            enabled,
            mediaUrl: mediaUrlValue,
            headline: headline || null,
            sub: sub || null,
            ctaLabel: ctaLabel || null,
            ctaHref: ctaHref || null,
            textColor: textColor || null,
            overlayOpacity,
            durationMs: durationMs === '' ? null : Number(durationMs),
        };
        try {
            if (slide) {
                await update.mutateAsync({ id: slide.id, input });
                toast.success('Slide updated');
            } else {
                await add.mutateAsync(input);
                toast.success('Slide added');
            }
            onClose();
        } catch {
            toast.error('Could not save slide');
        }
    };

    const handleVideoFile = async (file: File) => {
        const preErr = preflightFile(file, 'video');
        if (preErr) {
            toast.error(preErr);
            return;
        }
        try {
            setUploading(true);
            setUploadPct(0);
            const { url } = await uploadVideoFile(file, setUploadPct);
            setMediaUrlValue(url);
            setKind('VIDEO');
            toast.success('Video uploaded');
        } catch (err) {
            toast.error(extractUploadError(err));
        } finally {
            setUploading(false);
            setUploadPct(0);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={slide ? 'Edit slide' : 'New slide'}
            className="max-w-2xl"
        >
            <div className="space-y-3 p-5">
                <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                    <span className="text-sm text-slate-700">Slide enabled (visible on public site)</span>
                    <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer accent-emerald-600"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                    />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-slate-600">Type</span>
                        <Select value={kind} onChange={(e) => setKind(e.target.value as SlideKind)}>
                            <option value="IMAGE">Image</option>
                            <option value="VIDEO">Video</option>
                        </Select>
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-slate-600">
                            Duration (ms, blank = default)
                        </span>
                        <Input
                            type="number"
                            min={500}
                            max={60000}
                            value={durationMs}
                            onChange={(e) =>
                                setDurationMs(e.target.value === '' ? '' : Number(e.target.value))
                            }
                        />
                    </label>
                </div>

                <div>
                    <p className="text-xs font-medium text-slate-600">Media</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                        {kind === 'IMAGE' ? (
                            <Button size="sm" variant="ghost" onClick={() => setPickerOpen(true)}>
                                <ImageIcon className="h-4 w-4" />
                                Pick image
                            </Button>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => fileInput.current?.click()}
                                    loading={uploading}
                                >
                                    <Video className="h-4 w-4" />
                                    Upload video
                                </Button>
                                <input
                                    ref={fileInput}
                                    type="file"
                                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) void handleVideoFile(f);
                                        e.target.value = '';
                                    }}
                                />
                                {uploading && (
                                    <div className="flex w-full items-center gap-2">
                                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-emerald-500 transition-all"
                                                style={{ width: `${uploadPct}%` }}
                                            />
                                        </div>
                                        <span className="w-10 text-right text-xs tabular-nums text-slate-500">
                                            {uploadPct}%
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <Input
                        className="mt-2"
                        placeholder="Or paste a URL"
                        value={mediaUrlValue}
                        onChange={(e) => setMediaUrlValue(e.target.value)}
                    />
                    {mediaUrlValue && (
                        <div className="mt-2 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                            {kind === 'IMAGE' ? (
                                <img
                                    src={mediaUrl(mediaUrlValue)}
                                    alt=""
                                    className="h-40 w-full object-cover"
                                />
                            ) : (
                                <video
                                    src={mediaUrl(mediaUrlValue)}
                                    className="h-40 w-full object-cover"
                                    muted
                                    loop
                                    autoPlay
                                />
                            )}
                        </div>
                    )}
                </div>

                <Input
                    placeholder="Headline (optional)"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                />
                <Textarea
                    rows={2}
                    placeholder="Subtitle (optional)"
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                />
                <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                        placeholder="CTA label (optional)"
                        value={ctaLabel}
                        onChange={(e) => setCtaLabel(e.target.value)}
                    />
                    <Input
                        placeholder="CTA href (e.g. /rentals)"
                        value={ctaHref}
                        onChange={(e) => setCtaHref(e.target.value)}
                    />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-slate-600">Text color</span>
                        <Input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-slate-600">
                            Overlay opacity ({overlayOpacity}%)
                        </span>
                        <Input
                            type="range"
                            min={0}
                            max={100}
                            value={overlayOpacity}
                            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                        />
                    </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={submit} loading={add.isPending || update.isPending}>
                        Save
                    </Button>
                </div>
            </div>

            <MediaPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(m) => {
                    setMediaUrlValue(m.url);
                    setKind('IMAGE');
                    setPickerOpen(false);
                }}
            />
        </Modal>
    );
}
