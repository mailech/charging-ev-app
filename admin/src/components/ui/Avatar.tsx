import { cn } from '@/lib/cn';

const PALETTE = [
    'bg-emerald-100 text-emerald-700',
    'bg-blue-100 text-blue-700',
    'bg-amber-100 text-amber-700',
    'bg-violet-100 text-violet-700',
    'bg-rose-100 text-rose-700',
    'bg-teal-100 text-teal-700',
    'bg-sky-100 text-sky-700',
];

function hash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
}

interface Props {
    name?: string | null;
    email?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
}

const SIZES = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
};

export function Avatar({ name, email, size = 'sm', className }: Props) {
    const seed = (name ?? email ?? '?').trim();
    const initial = seed.charAt(0).toUpperCase() || '?';
    const tone = PALETTE[hash(seed) % PALETTE.length];
    return (
        <span
            className={cn(
                'grid shrink-0 place-items-center rounded-full font-semibold',
                SIZES[size],
                tone,
                className,
            )}
            aria-label={seed}
        >
            {initial}
        </span>
    );
}
