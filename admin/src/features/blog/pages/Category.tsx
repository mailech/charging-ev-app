import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
    useCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
} from '../hooks';
import { toast } from '@/hooks/useToast';

export default function Category() {
    return (
        <>
            <PageHeader
                title="Categories"
                description="Group blog posts into top-level categories. Tags are managed inline from the post editor."
            />
            <CategoriesPanel />
        </>
    );
}

function CategoriesPanel() {
    const list = useCategoriesQuery();
    const create = useCreateCategoryMutation();
    const remove = useDeleteCategoryMutation();
    const [name, setName] = useState('');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
                <form
                    className="flex gap-2"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!name.trim()) return;
                        try {
                            await create.mutateAsync({ name: name.trim() });
                            setName('');
                            toast.success('Category added');
                        } catch {
                            toast.error('Could not add category');
                        }
                    }}
                >
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="New category"
                    />
                    <Button type="submit" size="sm" loading={create.isPending}>
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>
                </form>
                {(list.data ?? []).length === 0 ? (
                    <EmptyState title="No categories yet" />
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {(list.data ?? []).map((c) => (
                            <li key={c.id} className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{c.name}</p>
                                    <p className="text-xs text-slate-500">/{c.slug}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm(`Delete "${c.name}"?`))
                                            remove.mutate(c.id);
                                    }}
                                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                    aria-label="Delete category"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardBody>
        </Card>
    );
}
