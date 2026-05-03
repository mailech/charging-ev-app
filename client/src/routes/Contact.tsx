import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, MapPin, MessageCircle, Send, Sparkles } from 'lucide-react';
import {
    publicInquirySubmitSchema,
    type PublicInquirySubmitInput,
} from '@trio/shared/inquiry';
import { api } from '@/lib/axios';

async function submitInquiry(input: PublicInquirySubmitInput) {
    const { data } = await api.post('/api/inquiries', input);
    return data;
}

const inputClass =
    'w-full rounded-lg bg-secondary/60 border border-white/10 px-4 py-3 text-sm text-textPrimary placeholder:text-textPrimary/40 transition focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/30 disabled:opacity-50';

export function Contact() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<PublicInquirySubmitInput>({
        resolver: zodResolver(publicInquirySubmitSchema),
        defaultValues: { name: '', email: '', phone: '', subject: '', message: '', hp_field: '' },
        mode: 'onTouched',
    });

    const mutation = useMutation({
        mutationFn: submitInquiry,
        onSuccess: () => {
            toast.success('Inquiry received', {
                description: "We'll be in touch within one business day.",
            });
            reset();
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

    return (
        <section className="relative min-h-screen overflow-hidden bg-background pt-32 pb-24">
            <div className="pointer-events-none absolute -top-40 left-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-accent/5 blur-[120px]" />

            <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.2fr] md:px-12">
                <motion.aside
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-secondary/50 px-3 py-1.5 backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs font-sans uppercase tracking-widest text-textPrimary/80">
                            Talk to us
                        </span>
                    </div>
                    <h1 className="font-heading text-4xl font-bold leading-tight text-textPrimary md:text-5xl">
                        Let's electrify your{' '}
                        <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                            fleet.
                        </span>
                    </h1>
                    <p className="max-w-md text-base leading-relaxed text-textPrimary/70">
                        Whether you're scaling rentals, leasing for a growing business, or
                        moving employees daily — share what you need and our team will plan
                        the route forward.
                    </p>

                    <ul className="space-y-4 pt-4">
                        <ContactItem
                            icon={<Mail className="h-4 w-4" />}
                            label="Email"
                            value="hello@trio.ev"
                        />
                        <ContactItem
                            icon={<MessageCircle className="h-4 w-4" />}
                            label="WhatsApp"
                            value="+91 98xxx xxxxx"
                        />
                        <ContactItem
                            icon={<MapPin className="h-4 w-4" />}
                            label="HQ"
                            value="Bengaluru, India"
                        />
                    </ul>
                </motion.aside>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                >
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-accent/20 via-transparent to-transparent blur-2xl" />
                    <form
                        onSubmit={handleSubmit((values) => mutation.mutate(values))}
                        noValidate
                        className="space-y-5 rounded-2xl border border-white/10 bg-secondary/40 p-6 backdrop-blur-xl md:p-8"
                    >
                        <input
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            className="absolute h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
                            {...register('hp_field')}
                        />

                        <div className="grid gap-5 sm:grid-cols-2">
                            <FieldRow label="Name" error={errors.name?.message}>
                                <input
                                    className={inputClass}
                                    {...register('name')}
                                    placeholder="Your full name"
                                />
                            </FieldRow>
                            <FieldRow label="Email" error={errors.email?.message}>
                                <input
                                    className={inputClass}
                                    type="email"
                                    {...register('email')}
                                    placeholder="you@company.com"
                                />
                            </FieldRow>
                        </div>

                        <FieldRow label="Phone" optional error={errors.phone?.message}>
                            <input
                                className={inputClass}
                                {...register('phone')}
                                placeholder="+91 98xxx xxxxx"
                            />
                        </FieldRow>

                        <FieldRow label="Subject" error={errors.subject?.message}>
                            <input
                                className={inputClass}
                                {...register('subject')}
                                placeholder="What's this about?"
                            />
                        </FieldRow>

                        <FieldRow label="Message" error={errors.message?.message}>
                            <textarea
                                className={`${inputClass} min-h-[140px] resize-y`}
                                {...register('message')}
                                placeholder="A few details about your needs…"
                            />
                        </FieldRow>

                        <div className="flex flex-col-reverse items-start justify-between gap-3 pt-2 sm:flex-row sm:items-center">
                            <p className="text-xs text-textPrimary/50">
                                We respond within one business day. No spam, ever.
                            </p>
                            <button
                                type="submit"
                                disabled={mutation.isPending || !isValid}
                                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-background transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {mutation.isPending ? 'Sending…' : 'Send inquiry'}
                                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}

function ContactItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <li className="flex items-center gap-4">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-secondary/60 text-accent">
                {icon}
            </span>
            <div>
                <p className="text-xs uppercase tracking-widest text-textPrimary/50">{label}</p>
                <p className="text-sm font-medium text-textPrimary">{value}</p>
            </div>
        </li>
    );
}

function FieldRow({
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
        <label className="block space-y-1.5">
            <span className="flex items-baseline gap-2 text-xs font-medium uppercase tracking-widest text-textPrimary/70">
                {label}
                {optional && (
                    <span className="text-[10px] normal-case tracking-normal text-textPrimary/40">
                        optional
                    </span>
                )}
            </span>
            {children}
            {error && <span className="block text-xs text-red-400">{error}</span>}
        </label>
    );
}
