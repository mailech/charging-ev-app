import { useEffect, useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import type { SiteSetting, SocialLink, SocialPlatform } from '@trio/shared/settings';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { toast } from '@/hooks/useToast';
import { useSettingsQuery, useUpdateSettingsMutation } from '../hooks';

const PLATFORMS: SocialPlatform[] = [
    'instagram',
    'facebook',
    'linkedin',
    'twitter',
    'youtube',
    'whatsapp',
    'tiktok',
    'pinterest',
    'website',
    'other',
];

export default function SettingsManager() {
    const query = useSettingsQuery();
    const update = useUpdateSettingsMutation();
    const [draft, setDraft] = useState<SiteSetting | null>(null);

    useEffect(() => {
        if (query.data) setDraft(query.data);
    }, [query.data]);

    if (query.isLoading || !draft) {
        return (
            <>
                <PageHeader title="Site settings" description="Footer addresses, contact, socials." />
                <div className="flex h-40 items-center justify-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            </>
        );
    }

    const set = <K extends keyof SiteSetting>(key: K, value: SiteSetting[K]) =>
        setDraft({ ...draft, [key]: value });

    const updateSocial = (i: number, patch: Partial<SocialLink>) => {
        const next = draft.socials.slice();
        next[i] = { ...next[i], ...patch };
        set('socials', next);
    };

    const addSocial = () =>
        set('socials', [
            ...draft.socials,
            { platform: 'instagram', url: '', enabled: true },
        ]);

    const removeSocial = (i: number) =>
        set('socials', draft.socials.filter((_, idx) => idx !== i));

    const save = async () => {
        try {
            await update.mutateAsync({
                registeredAddress: draft.registeredAddress,
                officeAddress: draft.officeAddress,
                phone: draft.phone,
                email: draft.email,
                contactCtaUrl: draft.contactCtaUrl,
                socials: draft.socials.filter((s) => s.url.trim().length > 0),
            });
            toast.success('Settings saved');
        } catch {
            toast.error('Could not save settings');
        }
    };

    return (
        <>
            <PageHeader
                title="Site settings"
                description="Edit footer addresses, contact info, and social media links."
            />

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        <Field label="Registered address">
                            <Textarea
                                rows={3}
                                value={draft.registeredAddress}
                                onChange={(e) => set('registeredAddress', e.target.value)}
                            />
                        </Field>
                        <Field label="Office address">
                            <Textarea
                                rows={3}
                                value={draft.officeAddress}
                                onChange={(e) => set('officeAddress', e.target.value)}
                            />
                        </Field>
                        <Field label="Phone">
                            <Input
                                value={draft.phone}
                                onChange={(e) => set('phone', e.target.value)}
                                placeholder="+91 ..."
                            />
                        </Field>
                        <Field label="Email">
                            <Input
                                type="email"
                                value={draft.email}
                                onChange={(e) => set('email', e.target.value)}
                                placeholder="info@example.com"
                            />
                        </Field>
                        <Field label="Contact button link">
                            <Input
                                value={draft.contactCtaUrl}
                                onChange={(e) => set('contactCtaUrl', e.target.value)}
                                placeholder="/contact"
                            />
                        </Field>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Social links</CardTitle>
                    </CardHeader>
                    <CardBody className="space-y-3">
                        {draft.socials.length === 0 && (
                            <p className="text-sm text-slate-500">No socials yet. Add one below.</p>
                        )}
                        {draft.socials.map((s, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-[140px_1fr_auto_auto] items-center gap-2"
                            >
                                <Select
                                    value={s.platform}
                                    onChange={(e) =>
                                        updateSocial(i, {
                                            platform: e.target.value as SocialPlatform,
                                        })
                                    }
                                >
                                    {PLATFORMS.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </Select>
                                <Input
                                    placeholder="https://…"
                                    value={s.url}
                                    onChange={(e) => updateSocial(i, { url: e.target.value })}
                                />
                                <label className="flex items-center gap-1 text-xs text-slate-600">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-emerald-600"
                                        checked={s.enabled !== false}
                                        onChange={(e) =>
                                            updateSocial(i, { enabled: e.target.checked })
                                        }
                                    />
                                    on
                                </label>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeSocial(i)}
                                    aria-label="Remove"
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                        <Button size="sm" variant="outline" onClick={addSocial}>
                            <Plus className="h-4 w-4" />
                            Add social
                        </Button>
                    </CardBody>
                </Card>
            </div>

            <div className="mt-4">
                <Button onClick={save} loading={update.isPending}>
                    <Save className="h-4 w-4" />
                    Save settings
                </Button>
            </div>
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
