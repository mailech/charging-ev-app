import { motion } from 'framer-motion';
import { Banknote, Truck, Zap, TrendingUp, BadgeDollarSign } from 'lucide-react';

const steps = [
    {
        n: '01',
        icon: Banknote,
        title: 'Client Invests Capital',
        desc: 'You commit a capital amount. No ongoing EMI — a single structured investment.',
    },
    {
        n: '02',
        icon: Truck,
        title: 'Fleet is Acquired',
        desc: 'Trio sources and acquires EV vehicles via vetted third-party partners.',
    },
    {
        n: '03',
        icon: Zap,
        title: 'Vehicles Deployed',
        desc: 'EVs are put into active operations — corporate transport, commute, mobility services.',
    },
    {
        n: '04',
        icon: TrendingUp,
        title: 'Revenue Generated Daily',
        desc: 'Each vehicle earns daily. Utilisation data, route data and earnings are tracked.',
    },
    {
        n: '05',
        icon: BadgeDollarSign,
        title: 'Client Earns Returns',
        desc: 'Profits are calculated and shared with you on a structured, predictable cycle.',
    },
];

export function LeasingFlowSteps() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
            >
                <h2 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] uppercase text-textPrimary">
                    How leasing<br />
                    <span className="text-accent">actually works.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/60 leading-relaxed">
                    A capital-backed model where your investment drives an EV fleet — and the fleet drives your returns.
                </p>
            </motion.div>

            {/* Step Flow — horizontal cards with proper spacing */}
            <div className="relative flex flex-col lg:flex-row items-stretch gap-5">
                {steps.map((step, i) => (
                    <div key={i} className="flex lg:flex-col items-stretch lg:items-center flex-1 relative">

                        {/* Connector line between steps (desktop) */}
                        {i < steps.length - 1 && (
                            <motion.div
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                                className="hidden lg:block absolute top-[38px] left-[calc(50%+40px)] right-[-10px] h-px bg-gradient-to-r from-accent/50 to-accent/10 origin-left z-0"
                            />
                        )}

                        {/* Vertical connector (mobile) */}
                        {i < steps.length - 1 && (
                            <motion.div
                                initial={{ scaleY: 0 }}
                                whileInView={{ scaleY: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                                className="lg:hidden absolute left-[38px] top-[76px] bottom-[-20px] w-px bg-gradient-to-b from-accent/40 to-transparent origin-top z-0"
                            />
                        )}

                        {/* Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.6, delay: i * 0.12 }}
                            whileHover={{ y: -6 }}
                            className="relative z-10 flex lg:flex-col items-start gap-5 lg:gap-5 p-7 mb-5 lg:mb-0 rounded-2xl border border-white/8 bg-secondary/20 hover:border-accent/30 hover:bg-secondary/35 transition-all duration-300 group w-full h-full"
                        >
                            {/* Icon + number */}
                            <div className="flex flex-row lg:flex-col items-center lg:items-start gap-3 shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all duration-300">
                                    <step.icon size={18} />
                                </div>
                                <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-accent/60">
                                    {step.n}
                                </span>
                            </div>

                            {/* Text */}
                            <div className="flex-1 flex flex-col gap-2">
                                <h4 className="font-heading text-base uppercase tracking-wide text-textPrimary leading-tight">
                                    {step.title}
                                </h4>
                                <p className="text-xs text-textPrimary/50 leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
}
