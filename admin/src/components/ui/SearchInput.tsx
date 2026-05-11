import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { Input } from './Input';
import { cn } from '@/lib/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, Props>(
    ({ wrapperClassName, className, ...rest }, ref) => (
        <div className={cn('relative', wrapperClassName)}>
            <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            />
            <Input ref={ref} className={cn('pl-9', className)} {...rest} />
        </div>
    ),
);
SearchInput.displayName = 'SearchInput';
