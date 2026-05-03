import { motion, useAnimationFrame } from 'framer-motion';
import { useRef, useState } from 'react';
import { BarChart3, ArrowRight } from 'lucide-react';

// Ticker items scrolling at the bottom of the hero
const TICKER = [
    'Fleet size: 240+ EVs',
    'Avg ROI: 18–24% / yr',
    'Vehicles deployed: 3 metros',
    'Daily utilisation: 87%',
    'Capital recovered: avg 28 mo',
    'Partner network: 14 verified',
    'Zero downtime SLA',
    'CO₂ saved: 1,200 t / yr',
];

// Live-ish stat cards in the right panel
const LIVE_STATS = [
    { label: 'Revenue Today',       value: '₹5.8L',  unit: 'est.',      up: true  },
    { label: 'Avg Trip Utilisation',value: '87%',    unit: 'rate',      up: false },
    { label: 'Investor Returns',    value: '21.4%',  unit: 'avg ROI',   up: true  },
];

function PulseDot({ delay = 0 }: { delay?: number }) {
    return (
        <span className="relative inline-flex h-2 w-2">
            <motion.span
                animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay }}
                className="absolute inline-flex h-full w-full rounded-full bg-accent"
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
    );
}

export function LeasingHero() {
    const [tickerX, setTickerX] = useState(0);
    const speedRef = useRef(0.5);

    useAnimationFrame(() => {
        setTickerX((prev) => {
            const next = prev - speedRef.current;
            // Reset when one full cycle done (approximate)
            return next < -2400 ? 0 : next;
        });
    });

    const tickerStr = [...TICKER, ...TICKER]; // doubled for seamless loop

    return (
        <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-background">

            {/* ── GRID OVERLAY ── */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.035]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            {/* ── RADIAL GLOW ── */}
            <div
                className="absolute top-0 left-0 w-[70vw] h-[70vh] pointer-events-none z-0"
                style={{ background: 'radial-gradient(ellipse at 20% 30%, rgba(92,240,158,0.1), transparent 65%)' }}
            />

            {/* ── MAIN BODY ── */}
            <div className="relative z-10 flex flex-col lg:flex-row flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 pt-36 pb-0 gap-12 lg:gap-20">

                {/* ── LEFT: Headline Block ── */}
                <div className="flex-1 flex flex-col justify-center">

                    {/* Status pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-10"
                    >
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5">
                            <PulseDot />
                            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent">Live Operations · 3 Cities</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-secondary/20">
                            <BarChart3 size={11} className="text-textPrimary/40" />
                            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-textPrimary/40">Enterprise Fleet Solutions</span>
                        </div>
                    </motion.div>

                    {/* Main headline */}
                    <div className="overflow-hidden mb-6">
                        <motion.h1
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="font-heading text-[clamp(52px,8vw,110px)] font-bold leading-[0.86] tracking-tight text-textPrimary"
                        >
                            <span className="block">Scale your</span>
                            <span className="block text-accent">fleet.</span>
                        </motion.h1>
                    </div>

                    <div className="overflow-hidden mb-10">
                        <motion.p
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-base md:text-lg text-textPrimary/55 leading-relaxed max-w-md"
                        >
                            Invest capital. We acquire the fleet, run the operations, and share the daily revenue with you — a self-sustaining EV income engine.
                        </motion.p>
                    </div>

                    {/* CTA row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="flex flex-wrap gap-4 items-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="group flex items-center gap-3 px-8 py-4 bg-accent text-background font-black uppercase tracking-widest rounded-full text-xs shadow-[0_0_40px_rgba(92,240,158,0.25)] hover:shadow-[0_0_60px_rgba(92,240,158,0.4)] transition-all duration-300"
                        >
                            Get a Custom Plan
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            className="px-8 py-4 bg-white/5 border border-white/10 text-textPrimary font-bold uppercase tracking-widest rounded-full text-xs hover:bg-white/10 transition-all"
                        >
                            View Fleet Options
                        </motion.button>
                    </motion.div>

                    {/* Mini stat row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex gap-10 mt-16 pt-8 border-t border-white/5"
                    >
                        {[
                            { v: '240+', l: 'EVs Active' },
                            { v: '₹5.8L', l: 'Daily Revenue' },
                            { v: '87%', l: 'Utilisation' },
                        ].map((s) => (
                            <div key={s.l} className="flex flex-col gap-1">
                                <span className="font-heading text-2xl md:text-3xl text-accent">{s.v}</span>
                                <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-textPrimary/35">{s.l}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ── RIGHT: Live Dashboard Panel ── */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:w-[400px] xl:w-[440px] flex flex-col gap-4 pb-20 lg:pt-4"
                >
                    {/* Panel header */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-textPrimary/35">
                            System · Live Dashboard
                        </span>
                        <div className="flex items-center gap-1.5">
                            <PulseDot delay={0.5} />
                            <span className="font-sans text-[9px] text-accent/60 uppercase tracking-widest">Live</span>
                        </div>
                    </div>

                    {/* Stat cards */}
                    {LIVE_STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                            className="group relative p-5 rounded-2xl border border-white/8 bg-secondary/20 hover:border-accent/25 hover:bg-secondary/35 transition-all duration-300 overflow-hidden"
                        >
                            {/* Animated bar background */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: stat.up ? '72%' : '52%' }}
                                transition={{ duration: 1.2, delay: 0.8 + i * 0.15, ease: 'easeOut' }}
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent/40 to-transparent"
                            />

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-sans text-[9px] uppercase tracking-[0.2em] text-textPrimary/35 mb-2">
                                        {stat.label}
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <span className="font-heading text-3xl text-textPrimary">{stat.value}</span>
                                        <span className="font-sans text-[10px] text-textPrimary/35 uppercase mb-1">{stat.unit}</span>
                                    </div>
                                </div>
                                <div className={`
                                    px-2.5 py-1 rounded-full font-sans text-[9px] uppercase tracking-widest
                                    ${stat.up ? 'bg-accent/10 text-accent' : 'bg-white/5 text-textPrimary/40'}
                                `}>
                                    {stat.up ? '↑ trending' : '→ stable'}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Mini chart visual */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="p-5 rounded-2xl border border-white/8 bg-secondary/10 mt-2"
                    >
                        <div className="font-sans text-[9px] uppercase tracking-[0.2em] text-textPrimary/35 mb-4">
                            Revenue · Last 7 days
                        </div>
                        {/* Bar chart */}
                        <div className="flex items-end gap-2 h-16">
                            {[55, 72, 63, 88, 74, 92, 100].map((h, j) => (
                                <motion.div
                                    key={j}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.7, delay: 1.1 + j * 0.07, ease: 'easeOut' }}
                                    className={`flex-1 rounded-sm ${j === 6 ? 'bg-accent' : 'bg-accent/25'}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, j) => (
                                <span key={j} className={`font-sans text-[8px] uppercase ${j === 6 ? 'text-accent' : 'text-textPrimary/20'}`}>{d}</span>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* ── BOTTOM TICKER ── */}
            <div className="relative z-10 border-t border-white/5 bg-secondary/10 py-3 overflow-hidden">
                <motion.div
                    style={{ x: tickerX }}
                    className="flex items-center gap-0 whitespace-nowrap"
                >
                    {tickerStr.map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-6 px-8 font-sans text-[10px] uppercase tracking-[0.18em] text-textPrimary/35">
                            {item}
                            <span className="text-accent/30">·</span>
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
