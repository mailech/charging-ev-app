import { cn } from '@/lib/cn';

interface Props {
    checked: boolean;
    onChange: (next: boolean) => void;
    disabled?: boolean;
    'aria-label'?: string;
    size?: 'sm' | 'md';
}

const SIZES = {
    sm: { track: 'h-5 w-9', thumb: 'h-4 w-4', on: 'translate-x-4', off: 'translate-x-0.5' },
    md: { track: 'h-6 w-11', thumb: 'h-5 w-5', on: 'translate-x-5', off: 'translate-x-0.5' },
};

export function Toggle({ checked, onChange, disabled, size = 'sm', ...rest }: Props) {
    const s = SIZES[size];
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                s.track,
                checked ? 'bg-emerald-500' : 'bg-slate-300',
            )}
            {...rest}
        >
            <span
                className={cn(
                    'inline-block transform rounded-full bg-white shadow-sm transition-transform',
                    s.thumb,
                    checked ? s.on : s.off,
                )}
            />
        </button>
    );
}
