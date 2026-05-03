import type { ReactNode } from 'react';
import { useFormContext, get } from 'react-hook-form';
import { cn } from '@/lib/cn';

interface FieldProps {
    name: string;
    label?: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export function Field({ name, label, description, children, className }: FieldProps) {
    const {
        formState: { errors },
    } = useFormContext();
    const error = get(errors, name);

    return (
        <div className={cn('space-y-1.5', className)}>
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            {children}
            {description && !error && (
                <p className="text-xs text-slate-500">{description}</p>
            )}
            {error?.message && (
                <p className="text-xs text-red-600">{String(error.message)}</p>
            )}
        </div>
    );
}
