import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Save, Image as ImageIcon, X } from 'lucide-react';
import type { Notice, NoticeFrequency } from '@trio/shared/notice';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { MediaPicker } from '@/features/blog/MediaPicker';
import { toast } from '@/hooks/useToast';
import { useNoticeQuery, useUpdateNoticeMutation } from '../hooks';
import { NoticePreview } from '../NoticePreview';

const FREQ: NoticeFrequency[] = ['always', 'once-per-session', 'once-per-day'];

export default function NoticeManager() {
    const query = useNoticeQuery();
    const update = useUpdateNoticeMutation();
    const [draft, setDraft] = useState<Notice | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        if (query.data) setDraft(query.data);
    }, [query.data]);

    if (query.isLoading || !draft) {
        return (
            <>
                <PageHeader title="Startup notice" description="Popup shown on the public site." />
                <div className="flex h-40 items-center justify-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            </>
        );
    }

    const set = <K extends keyof Notice>(key: K, value: Notice[K]) =>
        setDraft({ ...draft, [key]: value });

    const save = async () => {
        try {
            await update.mutateAsync({
                enabled: draft.enabled,
                title: draft.title,
                body: draft.body,
                imageUrl: draft.imageUrl,
                redirectUrl: draft.redirectUrl,
                bgColor: draft.bgColor,
                titleColor: draft.titleColor,
                bodyColor: draft.bodyColor,
                titleSize: draft.titleSize,
                bodySize: draft.bodySize,
                imageWidth: draft.imageWidth,
                imageHeight: draft.imageHeight,
                dismissible: draft.dismissible,
                showFrequency: draft.showFrequency,
            });
            toast.success('Notice saved');
        } catch {
            toast.error('Could not save notice');
        }
    };

    return (
        <>
            <PageHeader
                title="Startup notice"
                description="A popup shown to visitors on first load. Disabled until you turn it on."
            />

            <div
                className={
                    draft.enabled
                        ? 'mb-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3'
                        : 'mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'
                }
            >
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        Notice is {draft.enabled ? 'live' : 'disabled'}
                    </p>
                    <p className="text-xs text-slate-500">
                        {draft.enabled
                            ? 'Public site will show this popup on load.'
                            : 'No popup will be shown until enabled.'}
                    </p>
                </div>
                <Button
                    size="sm"
                    variant={draft.enabled ? 'ghost' : 'primary'}
                    onClick={async () => {
                        const next = !draft.enabled;
                        set('enabled', next);
                        try {
                            await update.mutateAsync({ enabled: next });
                            toast.success(next ? 'Notice enabled' : 'Notice disabled');
                        } catch {
                            toast.error('Could not toggle notice');
                            set('enabled', !next);
                        }
                    }}
                    loading={update.isPending}
                >
                    {draft.enabled ? (
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

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Content</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        <Field label="Title">
                            <Input
                                value={draft.title}
                                onChange={(e) => set('title', e.target.value)}
                            />
                        </Field>
                        <Field label="Body">
                            <Textarea
                                rows={5}
                                value={draft.body}
                                onChange={(e) => set('body', e.target.value)}
                            />
                        </Field>
                        <Field label="Image">
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setPickerOpen(true)}
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    {draft.imageUrl ? 'Change' : 'Pick image'}
                                </Button>
                                {draft.imageUrl && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => set('imageUrl', null)}
                                    >
                                        <X className="h-4 w-4" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <Input
                                className="mt-2"
                                placeholder="Or paste image URL"
                                value={draft.imageUrl ?? ''}
                                onChange={(e) =>
                                    set('imageUrl', e.target.value || null)
                                }
                            />
                        </Field>
                        <Field label="Redirect URL (optional, click target)">
                            <Input
                                placeholder="https://… or /blog/post"
                                value={draft.redirectUrl ?? ''}
                                onChange={(e) =>
                                    set('redirectUrl', e.target.value || null)
                                }
                            />
                        </Field>
                        <Field label="Show frequency">
                            <Select
                                value={draft.showFrequency}
                                onChange={(e) =>
                                    set('showFrequency', e.target.value as NoticeFrequency)
                                }
                            >
                                {FREQ.map((f) => (
                                    <option key={f} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <label className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                            <span className="text-sm text-slate-700">Dismissible</span>
                            <input
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer accent-emerald-600"
                                checked={draft.dismissible}
                                onChange={(e) => set('dismissible', e.target.checked)}
                            />
                        </label>
                    </CardBody>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Style</CardTitle>
                        </CardHeader>
                        <CardBody className="grid grid-cols-2 gap-3">
                            <Color label="Background" value={draft.bgColor} onChange={(v) => set('bgColor', v)} />
                            <Color label="Title color" value={draft.titleColor} onChange={(v) => set('titleColor', v)} />
                            <Color label="Body color" value={draft.bodyColor} onChange={(v) => set('bodyColor', v)} />
                            <Number label="Title size (px)" value={draft.titleSize} min={8} max={96} onChange={(v) => set('titleSize', v)} />
                            <Number label="Body size (px)" value={draft.bodySize} min={8} max={48} onChange={(v) => set('bodySize', v)} />
                            <Number label="Image width (px, 0=auto)" value={draft.imageWidth} min={0} max={2000} onChange={(v) => set('imageWidth', v)} />
                            <Number label="Image height (px, 0=auto)" value={draft.imageHeight} min={0} max={2000} onChange={(v) => set('imageHeight', v)} />
                        </CardBody>
                    </Card>

                    <NoticePreview notice={draft} />

                    <Button onClick={save} loading={update.isPending}>
                        <Save className="h-4 w-4" />
                        Save notice
                    </Button>
                </div>
            </div>

            <MediaPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(m) => {
                    set('imageUrl', m.url);
                    setPickerOpen(false);
                }}
            />
        </>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-1">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            {children}
        </label>
    );
}

function Color({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value.startsWith('#') ? value : '#ffffff'}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-9 w-10 cursor-pointer rounded border border-slate-300"
                />
                <Input value={value} onChange={(e) => onChange(e.target.value)} />
            </div>
        </label>
    );
}

function Number({
    label,
    value,
    min,
    max,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
}) {
    return (
        <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            <Input
                type="number"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(globalThis.Number(e.target.value))}
            />
        </label>
    );
}
