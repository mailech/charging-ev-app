import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/cn';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export interface RowSelection<T> {
    selected: Set<string>;
    getId: (row: T) => string;
    onToggle: (id: string) => void;
    onToggleAll: (rows: T[]) => void;
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T, unknown>[];
    isLoading?: boolean;
    onRowClick?: (row: T) => void;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
    selection?: RowSelection<T>;
}

export function DataTable<T>({
    data,
    columns,
    isLoading,
    onRowClick,
    emptyTitle = 'Nothing here yet',
    emptyDescription,
    className,
    selection,
}: DataTableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return <EmptyState title={emptyTitle} description={emptyDescription} />;
    }

    const allVisibleSelected =
        selection !== undefined &&
        data.length > 0 &&
        data.every((row) => selection.selected.has(selection.getId(row)));

    const someVisibleSelected =
        selection !== undefined &&
        !allVisibleSelected &&
        data.some((row) => selection.selected.has(selection.getId(row)));

    return (
        <div className={cn('overflow-hidden rounded-xl border border-slate-200 bg-white', className)}>
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                            {selection && (
                                <th className="w-10 px-3 py-3">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer accent-emerald-600"
                                        checked={allVisibleSelected}
                                        ref={(el) => {
                                            if (el) el.indeterminate = someVisibleSelected;
                                        }}
                                        onChange={() => selection.onToggleAll(data)}
                                        aria-label="Select all"
                                    />
                                </th>
                            )}
                            {hg.headers.map((h) => (
                                <th key={h.id} className="px-4 py-3 font-medium">
                                    {h.isPlaceholder
                                        ? null
                                        : flexRender(h.column.columnDef.header, h.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {table.getRowModel().rows.map((row) => {
                        const id = selection?.getId(row.original);
                        const checked = id ? selection!.selected.has(id) : false;
                        return (
                            <tr
                                key={row.id}
                                className={cn(
                                    'transition-colors',
                                    onRowClick && 'cursor-pointer hover:bg-slate-50',
                                    checked && 'bg-emerald-50/30',
                                )}
                                onClick={() => onRowClick?.(row.original)}
                            >
                                {selection && id && (
                                    <td
                                        className="w-10 px-3 py-3"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 cursor-pointer accent-emerald-600"
                                            checked={checked}
                                            onChange={() => selection.onToggle(id)}
                                            aria-label="Select row"
                                        />
                                    </td>
                                )}
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-4 py-3 text-slate-700">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
