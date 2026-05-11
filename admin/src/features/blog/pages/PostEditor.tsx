import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, ImagePlus, Pencil, Trash2 } from 'lucide-react';
import { POST_STATUSES, type PostStatus, type PostUpsertInput } from '@trio/shared/blog';
import { renderTiptap } from '@trio/shared/blog-render';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
    useCategoriesQuery,
    useCreatePostMutation,
    useCreateTagMutation,
    useDeletePostMutation,
    usePostQuery,
    useTagsQuery,
    useUpdatePostMutation,
} from '../hooks';
import { RichTextEditor } from '../RichTextEditor';
import { MediaPicker } from '../MediaPicker';
import { mediaUrl } from '../mediaUrl';
import { toast } from '@/hooks/useToast';
import { cn } from '@/lib/cn';

const AUTOSAVE_MS = 5000;

type Mode = 'edit' | 'preview';

export default function PostEditor() {
    const { id } = useParams();
    const isNew = id === 'new' || !id;
    const nav = useNavigate();

    const query = usePostQuery(isNew ? undefined : id);
    const createMutation = useCreatePostMutation();
    const updateMutation = useUpdatePostMutation(id ?? '');
    const deleteMutation = useDeletePostMutation();

    const categories = useCategoriesQuery();

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState<unknown>(null);
    const [coverId, setCoverId] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<{ url: string; alt: string | null } | null>(
        null,
    );
    const [categoryId, setCategoryId] = useState<string>('');
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [status, setStatus] = useState<PostStatus>('DRAFT');
    const [pickerOpen, setPickerOpen] = useState(false);
    const [mode, setMode] = useState<Mode>('edit');
    const [savedAt, setSavedAt] = useState<Date | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const dirtyRef = useRef(false);

    const prevIdRef = useRef<string | undefined>(id);
    useEffect(() => {
        const prev = prevIdRef.current;
        if (prev === id) return;
        prevIdRef.current = id;
        // Don't reset when transitioning from 'new' to the just-created post id
        // (the local state is the freshly-created post, no need to wipe)
        if (prev === 'new' || !prev) return;
        // When navigating to a different post, reset all editor state
        // so we re-hydrate from the new post's data, not the previous one's.
        setTitle('');
        setSlug('');
        setExcerpt('');
        setContent(null);
        setCoverId(null);
        setCoverPreview(null);
        setCategoryId('');
        setTagIds([]);
        setSeoTitle('');
        setSeoDescription('');
        setStatus('DRAFT');
        setSavedAt(null);
        setHydrated(false);
        dirtyRef.current = false;
    }, [id]);

    useEffect(() => {
        if (isNew || hydrated || !query.data) return;
        const p = query.data;
        setTitle(p.title);
        setSlug(p.slug);
        setExcerpt(p.excerpt ?? '');
        setContent(p.content);
        setCoverId(p.coverMedia?.id ?? null);
        setCoverPreview(
            p.coverMedia
                ? { url: p.coverMedia.thumbUrl ?? p.coverMedia.url, alt: p.coverMedia.alt }
                : null,
        );
        setCategoryId(p.category?.id ?? '');
        setTagIds(p.tags.map((t) => t.id));
        setSeoTitle(p.seoTitle ?? '');
        setSeoDescription(p.seoDescription ?? '');
        setStatus(p.status);
        setHydrated(true);
    }, [isNew, query.data, hydrated]);

    function buildInput(overrideStatus?: PostStatus): PostUpsertInput {
        return {
            title,
            slug: slug || undefined,
            excerpt: excerpt || null,
            content: content ?? {},
            coverMediaId: coverId,
            categoryId: categoryId || null,
            tagIds,
            seoTitle: seoTitle || null,
            seoDescription: seoDescription || null,
            status: overrideStatus ?? status,
        };
    }

    async function save(opts: { silent?: boolean; statusOverride?: PostStatus } = {}): Promise<
        string | null
    > {
        if (!title.trim()) {
            if (!opts.silent) toast.error('Title required');
            return null;
        }
        try {
            if (isNew) {
                const created = await createMutation.mutateAsync(buildInput(opts.statusOverride));
                dirtyRef.current = false;
                setSavedAt(new Date());
                if (opts.statusOverride) setStatus(opts.statusOverride);
                if (!opts.silent)
                    toast.success(opts.statusOverride === 'PUBLISHED' ? 'Published' : 'Created');
                nav(`/blog/${created.id}`, { replace: true });
                return created.id;
            }
            await updateMutation.mutateAsync(buildInput(opts.statusOverride));
            dirtyRef.current = false;
            setSavedAt(new Date());
            if (opts.statusOverride) setStatus(opts.statusOverride);
            if (!opts.silent)
                toast.success(
                    opts.statusOverride === 'PUBLISHED'
                        ? 'Published'
                        : opts.statusOverride === 'DRAFT'
                            ? 'Reverted to draft'
                            : 'Updated',
                );
            return id ?? null;
        } catch (err) {
            if (!opts.silent) {
                const e = err as {
                    response?: { status?: number; data?: { message?: string } };
                    message?: string;
                };
                const status = e?.response?.status;
                const serverMsg = e?.response?.data?.message;
                toast.error(
                    serverMsg ??
                        (status ? `Save failed (HTTP ${status})` : e?.message ?? 'Save failed'),
                );
            }
            return null;
        }
    }

    useEffect(() => {
        if (!dirtyRef.current) return;
        if (isNew && !title.trim()) return;
        const handle = window.setTimeout(() => {
            void save({ silent: true });
        }, AUTOSAVE_MS);
        return () => window.clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, slug, excerpt, content, coverId, categoryId, tagIds, seoTitle, seoDescription]);

    const markDirty = () => {
        dirtyRef.current = true;
    };

    async function publish() {
        await save({ statusOverride: 'PUBLISHED' });
    }

    async function unpublish() {
        await save({ statusOverride: 'DRAFT' });
    }

    if (!isNew && query.isLoading && !query.data) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    const isPublished = status === 'PUBLISHED';
    const saving = createMutation.isPending || updateMutation.isPending;
    const unpublishing = updateMutation.isPending;
    const editorKey = isNew ? 'new' : `post-${id ?? 'pending'}`;
    const editorReady = isNew || hydrated;

    return (
        <>
            <div className="mb-4">
                <PageHeader
                    title={isNew ? 'New post' : title || 'Untitled'}
                    description={
                        savedAt
                            ? `Last saved ${savedAt.toLocaleTimeString()}${isPublished ? ' · Live' : ''}`
                            : isPublished
                                ? 'Live'
                                : 'Drafts auto-save.'
                    }
                    actions={
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => nav('/blog')}>
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                            <Button
                                size="sm"
                                loading={saving}
                                onClick={() => void save()}
                            >
                                {isPublished ? 'Update' : 'Save draft'}
                            </Button>
                            {isPublished ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    loading={unpublishing}
                                    onClick={() => void unpublish()}
                                >
                                    Unpublish
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    loading={saving}
                                    onClick={publish}
                                >
                                    Publish
                                </Button>
                            )}
                        </div>
                    }
                />
                <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold">
                    <ModeTab active={mode === 'edit'} onClick={() => setMode('edit')}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </ModeTab>
                    <ModeTab active={mode === 'preview'} onClick={() => setMode('preview')}>
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                    </ModeTab>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                    {mode === 'edit' ? (
                        <>
                            <Input
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    markDirty();
                                }}
                                placeholder="Post title"
                                className="!h-12 !text-xl !font-semibold"
                            />
                            {editorReady && (
                                <RichTextEditor
                                    key={editorKey}
                                    value={content}
                                    onChange={(v) => {
                                        setContent(v);
                                        markDirty();
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        <PreviewPane
                            title={title}
                            excerpt={excerpt}
                            cover={coverPreview}
                            content={content}
                            categoryName={
                                categories.data?.find((c) => c.id === categoryId)?.name ?? null
                            }
                        />
                    )}
                </div>

                <aside className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <FieldLabel label="Slug">
                                <Input
                                    value={slug}
                                    onChange={(e) => {
                                        setSlug(e.target.value);
                                        markDirty();
                                    }}
                                    placeholder="auto-generated from title"
                                />
                            </FieldLabel>
                            <FieldLabel label="Excerpt">
                                <Textarea
                                    value={excerpt}
                                    onChange={(e) => {
                                        setExcerpt(e.target.value);
                                        markDirty();
                                    }}
                                    rows={3}
                                />
                            </FieldLabel>
                            <FieldLabel label="Status">
                                <Select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value as PostStatus);
                                        markDirty();
                                    }}
                                >
                                    {POST_STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </Select>
                            </FieldLabel>
                            <FieldLabel label="Category">
                                <Select
                                    value={categoryId}
                                    onChange={(e) => {
                                        setCategoryId(e.target.value);
                                        markDirty();
                                    }}
                                >
                                    <option value="">— None —</option>
                                    {(categories.data ?? []).map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </Select>
                            </FieldLabel>
                            <FieldLabel label="Tags">
                                <TagPicker
                                    selectedIds={tagIds}
                                    onChange={(next) => {
                                        setTagIds(next);
                                        markDirty();
                                    }}
                                />
                            </FieldLabel>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Cover image</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-2">
                            {coverPreview && (
                                <img
                                    src={mediaUrl(coverPreview.url)}
                                    alt={coverPreview.alt ?? ''}
                                    className="aspect-video w-full rounded-lg object-cover"
                                />
                            )}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPickerOpen(true)}
                                    className="flex-1"
                                >
                                    <ImagePlus className="h-4 w-4" />
                                    {coverPreview ? 'Replace' : 'Pick image'}
                                </Button>
                                {coverPreview && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setCoverId(null);
                                            setCoverPreview(null);
                                            markDirty();
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>SEO</CardTitle>
                        </CardHeader>
                        <CardBody className="space-y-3">
                            <FieldLabel label="SEO title">
                                <Input
                                    value={seoTitle}
                                    onChange={(e) => {
                                        setSeoTitle(e.target.value);
                                        markDirty();
                                    }}
                                />
                            </FieldLabel>
                            <FieldLabel label="SEO description">
                                <Textarea
                                    value={seoDescription}
                                    onChange={(e) => {
                                        setSeoDescription(e.target.value);
                                        markDirty();
                                    }}
                                    rows={3}
                                />
                            </FieldLabel>
                        </CardBody>
                    </Card>

                    {!isNew && (
                        <Card>
                            <CardBody>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50"
                                    loading={deleteMutation.isPending}
                                    onClick={async () => {
                                        if (!window.confirm('Delete this post? Cannot be undone.'))
                                            return;
                                        await deleteMutation.mutateAsync(id!);
                                        toast.success('Deleted');
                                        nav('/blog');
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete post
                                </Button>
                            </CardBody>
                        </Card>
                    )}
                </aside>
            </div>

            <MediaPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(media) => {
                    setCoverId(media.id);
                    setCoverPreview({ url: media.thumbUrl ?? media.url, alt: media.alt });
                    markDirty();
                    setPickerOpen(false);
                }}
            />
        </>
    );
}

function PreviewPane({
    title,
    excerpt,
    cover,
    content,
    categoryName,
}: {
    title: string;
    excerpt: string;
    cover: { url: string; alt: string | null } | null;
    content: unknown;
    categoryName: string | null;
}) {
    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {cover && (
                <img
                    src={mediaUrl(cover.url)}
                    alt={cover.alt ?? ''}
                    className="aspect-[3/1] w-full object-cover"
                />
            )}
            <div className="px-8 py-8">
                <header className="mb-6 space-y-2">
                    {categoryName && (
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                            {categoryName}
                        </p>
                    )}
                    <h1 className="text-3xl font-semibold leading-tight text-slate-900">
                        {title || 'Untitled post'}
                    </h1>
                    {excerpt && <p className="text-base leading-relaxed text-slate-600">{excerpt}</p>}
                </header>
                <div className="prose prose-slate prose-headings:font-semibold prose-blockquote:border-emerald-500 prose-a:text-emerald-600 prose-strong:text-slate-900 prose-img:rounded-lg max-w-none text-[15px] leading-relaxed">
                    {renderTiptap(content)}
                </div>
            </div>
        </article>
    );
}

function ModeTab({
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
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition',
                active
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900',
            )}
        >
            {children}
        </button>
    );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            {children}
        </label>
    );
}

function TagPicker({
    selectedIds,
    onChange,
}: {
    selectedIds: string[];
    onChange: (next: string[]) => void;
}) {
    const tagsQuery = useTagsQuery();
    const create = useCreateTagMutation();
    const [draft, setDraft] = useState('');
    const list = tagsQuery.data ?? [];

    return (
        <div className="space-y-2">
            <form
                className="flex gap-2"
                onSubmit={async (e) => {
                    e.preventDefault();
                    const name = draft.trim();
                    if (!name) return;
                    try {
                        const created = await create.mutateAsync({ name });
                        setDraft('');
                        onChange([...selectedIds, created.id]);
                    } catch {
                        toast.error('Could not add tag');
                    }
                }}
            >
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Add a new tag and press Enter"
                />
                <Button type="submit" size="sm" loading={create.isPending}>
                    Add
                </Button>
            </form>
            <div className="flex flex-wrap gap-1.5">
                {list.map((t) => {
                    const active = selectedIds.includes(t.id);
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() =>
                                onChange(
                                    active
                                        ? selectedIds.filter((x) => x !== t.id)
                                        : [...selectedIds, t.id],
                                )
                            }
                            className={
                                active
                                    ? 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700'
                                    : 'rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50'
                            }
                        >
                            {t.name}
                        </button>
                    );
                })}
                {list.length === 0 && (
                    <span className="text-xs text-slate-400">
                        No tags yet — add one above.
                    </span>
                )}
            </div>
        </div>
    );
}
