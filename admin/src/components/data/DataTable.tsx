import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/cn';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T, unknown>[];
    isLoading?: boolean;
    onRowClick?: (row: T) => void;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
}

export function DataTable<T>({
    data,
    columns,
    isLoading,
    onRowClick,
    emptyTitle = 'Nothing here yet',
    emptyDescription,
    className,
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

    return (
        <div className={cn('overflow-hidden rounded-xl border border-slate-200 bg-white', className)}>
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
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
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className={cn(
                                'transition-colors',
                                onRowClick && 'cursor-pointer hover:bg-slate-50',
                            )}
                            onClick={() => onRowClick?.(row.original)}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-3 text-slate-700">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
