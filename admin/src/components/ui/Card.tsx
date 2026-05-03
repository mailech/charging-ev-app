import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...rest }, ref) => (
        <div
            ref={ref}
            className={cn(
                'rounded-xl border border-slate-200 bg-white shadow-sm',
                className,
            )}
            {...rest}
        />
    ),
);
Card.displayName = 'Card';

export const CardHeader = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4',
            className,
        )}
        {...rest}
    />
);

export const CardTitle = ({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('text-base font-semibold text-slate-900', className)} {...rest} />
);

export const CardBody = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('px-5 py-4', className)} {...rest} />
);
