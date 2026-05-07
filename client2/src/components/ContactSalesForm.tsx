import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
    publicInquirySubmitSchema,
    type PublicInquirySubmitInput,
} from '@trio/shared/inquiry';
import { api } from '../lib/axios';

const ACCENT = '#00FF88';
const CARD = '#151B18';
const TEXT = '#F5F7F6';
const TEXT_DIM = '#8C948F';

const INQUIRY_TYPES = [
    'Fleet Charging Partnership',
    'Station Installation',
    'Individual Charging Plan',
    'Other',
];

async function submitInquiry(input: PublicInquirySubmitInput) {
    const { data } = await api.post('/api/inquiries', input);
    return data;
}

interface ContactSalesFormProps {
    open: boolean;
    onClose: () => void;
}

export function ContactSalesForm({ open, onClose }: ContactSalesFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PublicInquirySubmitInput>({
        resolver: zodResolver(publicInquirySubmitSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        },
        mode: 'onTouched',
    });

    const mutation = useMutation({
        mutationFn: submitInquiry,
        onSuccess: () => {
            toast.success('Inquiry received', {
                description: "We'll be in touch within one business day.",
            });
            reset();
            onClose();
        },
        onError: (err: unknown) => {
            const status = (err as { response?: { status?: number } }).response?.status;
            toast.error(
                status === 429
                    ? 'Too many requests. Try again in a minute.'
                    : 'Could not submit. Please try again shortly.',
            );
        },
    });

    const onSubmit = handleSubmit(
        (values) => mutation.mutate({ ...values, hp_field: '' }),
        (formErrors) => {
            // Validation failed — surface the first error so the user gets feedback
            const first = Object.values(formErrors).find((e) => e?.message)?.message;
            toast.error(first ? String(first) : 'Please fill in all required fields');
            // eslint-disable-next-line no-console
            console.warn('Inquiry validation errors:', formErrors);
        },
    );

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 2000,
                        background: 'rgba(5, 7, 6, 0.96)',
                        backdropFilter: 'blur(32px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 40,
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 40,
                            right: 40,
                            background: 'none',
                            border: 'none',
                            color: TEXT_DIM,
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e: any) => (e.target.style.color = TEXT)}
                        onMouseLeave={(e: any) => (e.target.style.color = TEXT_DIM)}
                    >
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            width: '100%',
                            maxWidth: 1000,
                            display: 'grid',
                            gridTemplateColumns: '1fr 1.1fr',
                            gap: 60,
                        }}
                    >
                        {/* Left: info column */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '6px 12px',
                                    background: 'rgba(0, 255, 136, 0.08)',
                                    border: '1px solid rgba(0, 255, 136, 0.2)',
                                    borderRadius: 99,
                                    width: 'fit-content',
                                    marginBottom: 32,
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={ACCENT}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span
                                    style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        color: ACCENT,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    Talk to us
                                </span>
                            </div>

                            <h2
                                style={{
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    color: '#fff',
                                    lineHeight: 1.1,
                                    marginBottom: 20,
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                Let's electrify <br />
                                <span style={{ color: ACCENT }}>your fleet.</span>
                            </h2>

                            <p
                                style={{
                                    fontSize: '1rem',
                                    color: TEXT_DIM,
                                    lineHeight: 1.6,
                                    marginBottom: 40,
                                    maxWidth: 380,
                                }}
                            >
                                Whether you're scaling rentals, leasing for a growing business, or
                                moving employees daily — share what you need and our team will plan
                                the route forward.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {[
                                    {
                                        icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
                                        label: 'EMAIL',
                                        value: 'hello@trio.ev',
                                    },
                                    {
                                        icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
                                        label: 'WHATSAPP',
                                        value: '+91 98xxx xxxxx',
                                    },
                                    {
                                        icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
                                        label: 'HQ',
                                        value: 'Bengaluru, India',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        style={{ display: 'flex', alignItems: 'center', gap: 20 }}
                                    >
                                        <div
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: '50%',
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: ACCENT,
                                            }}
                                        >
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d={item.icon}></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    color: TEXT_DIM,
                                                    letterSpacing: '0.1em',
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '1rem',
                                                    color: TEXT,
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {item.value}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: form */}
                        <form
                            onSubmit={onSubmit}
                            noValidate
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 24,
                                padding: 32,
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 24,
                                    marginBottom: 24,
                                }}
                            >
                                <Field label="NAME" error={errors.name?.message}>
                                    <input
                                        placeholder="Your full name"
                                        style={inputStyle}
                                        {...register('name')}
                                    />
                                </Field>
                                <Field label="EMAIL" error={errors.email?.message}>
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        style={inputStyle}
                                        {...register('email')}
                                    />
                                </Field>
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <Field label="PHONE" optional error={errors.phone?.message}>
                                    <input
                                        placeholder="+91 98xxx xxxxx"
                                        style={inputStyle}
                                        {...register('phone')}
                                    />
                                </Field>
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <Field label="INQUIRY TYPE" error={errors.subject?.message}>
                                    <select
                                        style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                                        defaultValue=""
                                        {...register('subject')}
                                    >
                                        <option value="" disabled style={{ background: CARD, color: TEXT }}>
                                            Select type
                                        </option>
                                        {INQUIRY_TYPES.map((t) => (
                                            <option key={t} value={t} style={{ background: CARD, color: TEXT }}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <Field label="MESSAGE" error={errors.message?.message}>
                                    <textarea
                                        placeholder="A few details about your needs..."
                                        style={{ ...inputStyle, minHeight: 120, resize: 'none' }}
                                        {...register('message')}
                                    />
                                </Field>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', color: TEXT_DIM }}>
                                    We respond within one business day. No spam, ever.
                                </div>
                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="btn-accent"
                                    style={{
                                        padding: '14px 28px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        opacity: mutation.isPending ? 0.6 : 1,
                                        cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {mutation.isPending ? 'Sending…' : 'Send inquiry'}
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="7" y1="17" x2="17" y2="7"></line>
                                        <polyline points="7 7 17 7 17 17"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: '14px 18px',
    color: TEXT,
    outline: 'none',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
};

function Field({
    label,
    optional,
    error,
    children,
}: {
    label: string;
    optional?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label
                style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: TEXT_DIM,
                    letterSpacing: '0.05em',
                }}
            >
                {label}
                {optional && (
                    <span style={{ opacity: 0.5, fontWeight: 400, marginLeft: 6 }}>optional</span>
                )}
            </label>
            {children}
            {error && (
                <span style={{ fontSize: '0.7rem', color: '#ff7373' }}>
                    {error}
                </span>
            )}
        </div>
    );
}
