import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badge = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    {
        variants: {
            tone: {
                neutral: 'bg-slate-100 text-slate-700',
                info: 'bg-blue-50 text-blue-700',
                success: 'bg-emerald-50 text-emerald-700',
                warning: 'bg-amber-50 text-amber-700',
                danger: 'bg-red-50 text-red-700',
                muted: 'bg-slate-100 text-slate-500',
            },
        },
        defaultVariants: { tone: 'neutral' },
    },
);

export interface BadgeProps
    extends HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badge> {}

export function Badge({ className, tone, ...rest }: BadgeProps) {
    return <span className={cn(badge({ tone }), className)} {...rest} />;
}
