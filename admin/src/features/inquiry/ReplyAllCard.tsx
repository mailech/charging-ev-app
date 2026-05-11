import { useState } from 'react';
import { MailCheck, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/cn';
import { toast } from '@/hooks/useToast';
import { useSettingsQuery, useUpdateSettingsMutation } from '@/features/settings/hooks';
import { useTemplatesQuery } from '@/features/auto-reply/hooks';
import { TemplatesManagerModal } from '@/features/auto-reply/TemplatesManager';

export function ReplyAllCard() {
    const settings = useSettingsQuery();
    const update = useUpdateSettingsMutation();
    const templates = useTemplatesQuery();
    const [open, setOpen] = useState(false);

    const enabled = settings.data?.autoReplyEnabled ?? false;
    const activeTpl = (templates.data ?? []).find((t) => t.active);

    const onToggle = async () => {
        if (!settings.data) return;
        if (!enabled && !activeTpl) {
            toast.error('Activate a template first');
            setOpen(true);
            return;
        }
        try {
            await update.mutateAsync({ autoReplyEnabled: !enabled });
            toast.success(!enabled ? 'Auto-reply enabled' : 'Auto-reply disabled');
        } catch {
            toast.error('Could not update auto-reply');
        }
    };

    return (
        <>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <span
                    className={cn(
                        'grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset',
                        enabled
                            ? 'bg-emerald-50 text-emerald-600 ring-emerald-100'
                            : 'bg-slate-100 text-slate-400 ring-slate-200',
                    )}
                >
                    <MailCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                            Reply All
                        </p>
                        <Toggle checked={enabled} onChange={onToggle} disabled={update.isPending} />
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        {enabled ? 'Auto-reply on' : 'Auto-reply off'}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex max-w-[140px] truncate text-[11px] text-slate-500">
                            <span className="text-slate-400">Active:</span>
                            <span className="ml-1 truncate font-medium text-slate-700">
                                {activeTpl?.name ?? 'none'}
                            </span>
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px]"
                            onClick={() => setOpen(true)}
                        >
                            <Settings2 className="h-3 w-3" />
                            Manage
                        </Button>
                    </div>
                </div>
            </div>

            <TemplatesManagerModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
