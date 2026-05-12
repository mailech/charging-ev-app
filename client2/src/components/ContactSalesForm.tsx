import { useEffect, useState } from 'react';
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
const BG = '#0B0F0D';
const SURFACE = '#111715';
const CARD = '#151B18';
const BORDER = 'rgba(0,255,136,0.08)';
const BORDER_STRONG = 'rgba(0,255,136,0.18)';
const TEXT = '#F5F7F6';
const TEXT_DIM = '#8C948F';

function useIsMobile(breakpoint = 1024) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < breakpoint);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [breakpoint]);
    return isMobile;
}

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
    const isMobile = useIsMobile(1024);
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

    if (isMobile) {
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
                            background: BG,
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto',
                        }}
                    >
                        {/* Top bar */}
                        <div style={{ position: 'sticky', top: 0, zIndex: 5, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `linear-gradient(180deg, ${BG} 70%, transparent)`, borderBottom: `1px solid ${BORDER}` }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 11px', background: 'rgba(0,255,136,0.08)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99 }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                                <span style={{ fontSize: '0.58rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.18em' }}>TALK TO US</span>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, color: TEXT, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            style={{ padding: '20px 20px 40px', flex: 1 }}
                        >
                            {/* Ambient blob */}
                            <div style={{ position: 'absolute', top: 60, right: '-25%', width: 320, height: 320, background: `radial-gradient(circle, ${ACCENT}1c, transparent 65%)`, borderRadius: '50%', pointerEvents: 'none' }} />

                            {/* Hero */}
                            <div style={{ marginBottom: 28, position: 'relative' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: TEXT, lineHeight: 1.05, marginBottom: 12, letterSpacing: '-0.035em' }}>
                                    Let's electrify <br /><span style={{ color: ACCENT }}>your fleet.</span>
                                </h2>
                                <p style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
                                    Scaling rentals, leasing for a growing business, or moving employees daily — share what you need and we'll plan the route forward.
                                </p>
                            </div>

                            {/* Quick contact — minimal inline rows */}
                            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 26, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
                                {[
                                    { value: 'hello@trio.ev', href: 'mailto:hello@trio.ev', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
                                    { value: '+91 98xxx xxxxx', href: 'https://wa.me/91', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg> },
                                    { value: 'Bengaluru, India', href: null, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> },
                                ].map((opt, i) => {
                                    const inner = (
                                        <>
                                            <span style={{ color: ACCENT, display: 'flex', flexShrink: 0 }}>{opt.icon}</span>
                                            <span style={{ flex: 1, fontSize: '0.85rem', color: TEXT, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{opt.value}</span>
                                            {opt.href && (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TEXT_DIM} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
                                            )}
                                        </>
                                    );
                                    const styleObj: React.CSSProperties = {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        padding: '12px 4px',
                                        textDecoration: 'none',
                                        borderBottom: i < 2 ? `1px solid ${BORDER}` : 'none',
                                    };
                                    return opt.href ? (
                                        <a key={i} href={opt.href} style={styleObj}>{inner}</a>
                                    ) : (
                                        <div key={i} style={styleObj}>{inner}</div>
                                    );
                                })}
                            </div>

                            {/* Divider with label */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                                <div style={{ flex: 1, height: 1, background: BORDER }} />
                                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.16em' }}>OR SEND A MESSAGE</span>
                                <div style={{ flex: 1, height: 1, background: BORDER }} />
                            </div>

                            {/* Form */}
                            <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <Field label="NAME" error={errors.name?.message}>
                                    <input placeholder="Your full name" style={inputStyleMobile} {...register('name')} />
                                </Field>
                                <Field label="EMAIL" error={errors.email?.message}>
                                    <input type="email" placeholder="you@company.com" style={inputStyleMobile} {...register('email')} />
                                </Field>
                                <Field label="PHONE" optional error={errors.phone?.message}>
                                    <input placeholder="+91 98xxx xxxxx" style={inputStyleMobile} {...register('phone')} />
                                </Field>
                                <Field label="INQUIRY TYPE" error={errors.subject?.message}>
                                    <select style={{ ...inputStyleMobile, cursor: 'pointer', appearance: 'none' }} defaultValue="" {...register('subject')}>
                                        <option value="" disabled style={{ background: CARD, color: TEXT }}>Select type</option>
                                        {INQUIRY_TYPES.map((t) => (
                                            <option key={t} value={t} style={{ background: CARD, color: TEXT }}>{t}</option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="MESSAGE" error={errors.message?.message}>
                                    <textarea placeholder="A few details about your needs..." style={{ ...inputStyleMobile, minHeight: 110, resize: 'none' }} {...register('message')} />
                                </Field>

                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="btn-accent"
                                    style={{ marginTop: 10, padding: '15px 24px', fontSize: '0.92rem', fontWeight: 700, justifyContent: 'center', width: '100%', opacity: mutation.isPending ? 0.6 : 1 }}
                                >
                                    {mutation.isPending ? 'Sending…' : 'Send inquiry'}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                                </button>

                                <div style={{ fontSize: '0.7rem', color: TEXT_DIM, textAlign: 'center', marginTop: 4 }}>
                                    We respond within one business day. No spam, ever.
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="contact-modal-backdrop"
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
                    <style>{`
                        @media (max-width: 1024px) {
                            .contact-modal-backdrop { padding: 16px !important; align-items: flex-start !important; padding-top: 60px !important; }
                            .form-container-grid {
                                grid-template-columns: 1fr !important;
                                gap: 28px !important;
                                padding: 0 !important;
                                max-height: 90vh;
                                overflow-y: auto;
                            }
                            .info-col { text-align: left; align-items: stretch; }
                            .info-col h2 { font-size: 2rem !important; margin-bottom: 16px !important; }
                            .info-col p { max-width: 100% !important; margin-bottom: 24px !important; font-size: 0.95rem !important; }
                            .contact-items { align-items: stretch !important; gap: 14px !important; }
                            .contact-items > div { gap: 14px !important; }
                            .form-card { padding: 20px !important; border-radius: 18px !important; }
                            .form-grid-inner { grid-template-columns: 1fr !important; gap: 16px !important; }
                            .form-footer { flex-direction: column !important; gap: 16px !important; align-items: stretch !important; }
                            .form-footer .btn-accent { justify-content: center; width: 100%; }
                            .close-btn { top: 12px !important; right: 12px !important; }
                            .close-btn svg { width: 24px !important; height: 24px !important; }
                        }
                        @media (max-width: 600px) {
                            .info-col h2 { font-size: 1.6rem !important; }
                        }
                    `}</style>
                    <button
                        type="button"
                        className="close-btn"
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
                        className="form-container-grid"
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
                            className="info-col"
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

                            <div className="contact-items" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                            className="form-card"
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 24,
                                padding: 32,
                                position: 'relative',
                            }}
                        >
                            <div
                                className="form-grid-inner"
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
                                className="form-footer"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 24,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', color: TEXT_DIM, flex: '1 1 220px', minWidth: 0 }}>
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
                                        flexShrink: 0,
                                        whiteSpace: 'nowrap',
                                        opacity: mutation.isPending ? 0.6 : 1,
                                        cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    <span>{mutation.isPending ? 'Sending…' : 'Send inquiry'}</span>
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

const inputStyleMobile: React.CSSProperties = {
    width: '100%',
    background: SURFACE,
    border: `1px solid ${BORDER_STRONG}`,
    borderRadius: 12,
    padding: '13px 14px',
    color: TEXT,
    outline: 'none',
    fontSize: '0.92rem',
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
