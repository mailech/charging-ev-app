import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const loop = [
    { label: 'Investment',   sub: 'Capital from investors',       accent: true  },
    { label: 'Fleet',        sub: 'EVs acquired via leasing',     accent: false },
    { label: 'Transport',    sub: 'Corporate commute operations',  accent: false },
    { label: 'Revenue',      sub: 'Daily earnings per vehicle',   accent: false },
    { label: 'Growth',       sub: 'Returns fund more fleet',      accent: true  },
];

export function LeasingTransportConnection() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-14 gap-8"
            >
                <h2 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] uppercase text-textPrimary">
                    Leasing powers<br />
                    <span className="text-accent">transport.</span>
                </h2>
                <p className="md:max-w-[340px] text-sm text-textPrimary/55 leading-relaxed">
                    Corporate transport is the revenue engine that makes the leasing model work. Every trip generates returns for the investor — creating a self-reinforcing growth loop.
                </p>
            </motion.div>

            {/* Loop visual */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative p-8 md:p-12 rounded-3xl border border-white/8 bg-secondary/10 overflow-hidden mb-10"
            >
                {/* Grid bg */}
                <div
                    className="absolute inset-0 opacity-[0.035] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />

                {/* Nodes row */}
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-0">
                    {loop.map((node, i) => (
                        <div key={i} className="flex md:flex-col items-center flex-1 w-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.13 }}
                                whileHover={{ scale: 1.07 }}
                                className={`
                                    flex flex-col items-center justify-center text-center px-4 py-6 w-full min-h-[120px] rounded-2xl border cursor-default transition-all duration-300
                                    ${node.accent
                                        ? 'bg-accent border-accent text-background'
                                        : 'bg-secondary/35 border-white/10 text-textPrimary hover:border-accent/30'}
                                `}
                            >
                                <div className={`font-heading text-xl uppercase mb-1 ${node.accent ? 'text-background' : 'text-textPrimary'}`}>
                                    {node.label}
                                </div>
                                <div className={`text-[11px] leading-snug ${node.accent ? 'text-background/55' : 'text-textPrimary/40'}`}>
                                    {node.sub}
                                </div>

                                {/* Pulse on accent nodes */}
                                {node.accent && (
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                                        transition={{ duration: 2.2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-2xl border-2 border-accent pointer-events-none"
                                    />
                                )}
                            </motion.div>

                            {/* Arrow between nodes */}
                            {i < loop.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.25 + i * 0.13 }}
                                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
                                >
                                    <svg viewBox="0 0 40 40" className="w-7 h-7 rotate-90 md:rotate-0">
                                        <motion.path
                                            d="M4 20 L32 20"
                                            stroke="#5cf09e" strokeWidth="1.5" strokeLinecap="round" fill="none"
                                            strokeDasharray="5 3"
                                            animate={{ strokeDashoffset: [0, -16] }}
                                            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                                        />
                                        <path d="M27 14 L35 20 L27 26" stroke="#5cf09e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Closing loop arrow (Growth → Investment) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="hidden md:flex items-center justify-center mt-4 gap-2"
                >
                    <div className="flex-1 h-px bg-gradient-to-r from-accent/10 via-accent/30 to-accent/10" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent/50 px-3">self-reinforcing growth loop</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-accent/10 via-accent/30 to-accent/10" />
                </motion.div>
            </motion.div>

            {/* Explainer two-col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="p-8 rounded-3xl border border-accent/20 bg-accent/5 flex flex-col gap-4"
                >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/60">— Leasing enables it</span>
                    <h3 className="font-heading text-2xl uppercase text-textPrimary">Capital → Fleet creation</h3>
                    <p className="text-sm text-textPrimary/55 leading-relaxed">
                        Investor capital funds the acquisition of EV vehicles. Without leasing, there is no fleet. The leasing model is the foundation of the entire operation.
                    </p>
                    <Link to="/leasing">
                        <motion.button
                            whileHover={{ x: 4 }}
                            className="flex items-center gap-2 text-accent font-mono text-[10px] uppercase tracking-[0.18em] mt-2 group"
                        >
                            Learn about leasing <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="p-8 rounded-3xl border border-white/8 bg-secondary/15 flex flex-col gap-4"
                >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-textPrimary/35">— Transport generates it</span>
                    <h3 className="font-heading text-2xl uppercase text-textPrimary">Operations → Revenue flow</h3>
                    <p className="text-sm text-textPrimary/55 leading-relaxed">
                        Corporate transport contracts provide the daily revenue stream. Each vehicle generates ₹18K/month on average — revenue that flows directly back to investors as structured returns.
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="font-heading text-2xl text-accent">₹18K</span>
                        <span className="text-xs text-textPrimary/35 font-mono uppercase tracking-widest">avg / vehicle / mo</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
