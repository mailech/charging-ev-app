import { useEffect, useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { AutoReplyTemplate } from '@trio/shared/auto-reply';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { toast } from '@/hooks/useToast';
import { cn } from '@/lib/cn';
import {
    useActivateTemplateMutation,
    useCreateTemplateMutation,
    useDeleteTemplateMutation,
    useTemplatesQuery,
    useUpdateTemplateMutation,
} from './hooks';

interface Props {
    open: boolean;
    onClose: () => void;
}

const EMPTY = { name: '', subject: '', body: '' };

export function TemplatesManagerModal({ open, onClose }: Props) {
    const query = useTemplatesQuery();
    const createM = useCreateTemplateMutation();
    const updateM = useUpdateTemplateMutation();
    const activateM = useActivateTemplateMutation();
    const deleteM = useDeleteTemplateMutation();

    const [editing, setEditing] = useState<AutoReplyTemplate | 'new' | null>(null);
    const [draft, setDraft] = useState(EMPTY);

    useEffect(() => {
        if (!open) {
            setEditing(null);
            setDraft(EMPTY);
        }
    }, [open]);

    useEffect(() => {
        if (editing === 'new') setDraft(EMPTY);
        else if (editing) {
            setDraft({ name: editing.name, subject: editing.subject, body: editing.body });
        }
    }, [editing]);

    const templates = query.data ?? [];
    const isFormOpen = editing !== null;

    const save = async () => {
        if (!draft.name.trim() || !draft.subject.trim() || !draft.body.trim()) {
            toast.error('Name, subject and body are required');
            return;
        }
        try {
            if (editing === 'new') {
                await createM.mutateAsync({
                    name: draft.name.trim(),
                    subject: draft.subject.trim(),
                    body: draft.body.trim(),
                    active: templates.length === 0,
                });
                toast.success('Template created');
            } else if (editing) {
                await updateM.mutateAsync({
                    id: editing.id,
                    input: {
                        name: draft.name.trim(),
                        subject: draft.subject.trim(),
                        body: draft.body.trim(),
                    },
                });
                toast.success('Template updated');
            }
            setEditing(null);
        } catch {
            toast.error('Could not save template');
        }
    };

    const activate = async (id: string) => {
        try {
            await activateM.mutateAsync(id);
            toast.success('Template activated');
        } catch {
            toast.error('Could not activate');
        }
    };

    const remove = async (t: AutoReplyTemplate) => {
        if (!window.confirm(`Delete "${t.name}"?`)) return;
        try {
            await deleteM.mutateAsync(t.id);
            toast.success('Template deleted');
        } catch {
            toast.error('Could not delete');
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Auto-reply templates"
            className="max-w-2xl"
        >
            {isFormOpen ? (
                <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                        Use <code>{'{{name}}'}</code> and <code>{'{{subject}}'}</code> to personalise.
                    </p>
                    <Field label="Template name">
                        <Input
                            value={draft.name}
                            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                            placeholder="e.g. Default acknowledgement"
                        />
                    </Field>
                    <Field label="Subject">
                        <Input
                            value={draft.subject}
                            onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                        />
                    </Field>
                    <Field label="Body">
                        <Textarea
                            rows={8}
                            value={draft.body}
                            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                        />
                    </Field>
                    <div className="flex justify-end gap-2 pt-1">
                        <Button variant="ghost" onClick={() => setEditing(null)}>
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            onClick={save}
                            loading={createM.isPending || updateM.isPending}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            {templates.length} template{templates.length === 1 ? '' : 's'}
                        </p>
                        <Button size="sm" onClick={() => setEditing('new')}>
                            <Plus className="h-4 w-4" />
                            New template
                        </Button>
                    </div>
                    {query.isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ) : templates.length === 0 ? (
                        <EmptyState
                            title="No templates yet"
                            description="Create a template to use as auto-reply or for manual sends."
                            action={
                                <Button size="sm" onClick={() => setEditing('new')}>
                                    <Plus className="h-4 w-4" />
                                    New template
                                </Button>
                            }
                        />
                    ) : (
                        <ul className="space-y-2">
                            {templates.map((t) => (
                                <li
                                    key={t.id}
                                    className={cn(
                                        'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                                        t.active
                                            ? 'border-emerald-200 bg-emerald-50/40'
                                            : 'border-slate-200',
                                    )}
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {t.name}
                                            </p>
                                            {t.active && (
                                                <Badge tone="success" className="text-[10px]">
                                                    <Check className="mr-0.5 h-3 w-3" />
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="mt-0.5 truncate text-xs text-slate-500">
                                            {t.subject}
                                        </p>
                                        <p className="mt-1 line-clamp-2 break-words text-xs text-slate-500">
                                            {t.body}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        {!t.active && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => activate(t.id)}
                                                loading={activateM.isPending}
                                            >
                                                Activate
                                            </Button>
                                        )}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            aria-label="Edit"
                                            onClick={() => setEditing(t)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            aria-label="Delete"
                                            onClick={() => remove(t)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </Modal>
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
