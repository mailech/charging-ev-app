import { motion, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function useCount(target: number, duration = 1400) {
    const [val, setVal] = useState(0);
    const ran = useRef(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !ran.current) {
                ran.current = true;
                const ctrl = animate(0, target, {
                    duration: duration / 1000,
                    ease: 'easeOut',
                    onUpdate: (v) => setVal(Math.round(v)),
                });
                return () => ctrl.stop();
            }
        }, { threshold: 0.3 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return { val, ref };
}

const metrics = [
    { label: 'Active Vehicles',  target: 242,  suffix: '',   prefix: '',  color: 'text-accent' },
    { label: 'Trips per Day',    target: 3180, suffix: '',   prefix: '',  color: 'text-textPrimary' },
    { label: 'Cost Savings',     target: 62,   suffix: '%',  prefix: '',  color: 'text-accent' },
    { label: 'Efficiency Score', target: 94,   suffix: '%',  prefix: '',  color: 'text-textPrimary' },
];

const liveTrips = [
    { from: 'HQ Tower A', to: 'Tech Park B', status: 'In Transit',   pct: 68 },
    { from: 'Koramangala',to: 'Whitefield',  status: 'Boarding',     pct: 12 },
    { from: 'HSR Layout', to: 'Electronic City', status: 'Completed', pct: 100 },
    { from: 'MG Road',    to: 'Outer Ring Rd',   status: 'Scheduled', pct: 0   },
];

export function EfficiencyDashboard() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
            >
                <h2 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] uppercase text-textPrimary">
                    Efficiency<br />
                    <span className="text-accent">dashboard.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/55 leading-relaxed">
                    Live operational metrics across the fleet — updated continuously through Trio's operations platform.
                </p>
            </motion.div>

            {/* Metric counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                {metrics.map((m, i) => {
                    const { val, ref } = useCount(m.target, 1200 + i * 150);
                    return (
                        <motion.div
                            key={i}
                            ref={ref}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: i * 0.1 }}
                            className="p-7 rounded-2xl border border-white/8 bg-secondary/15 flex flex-col gap-2 relative overflow-hidden"
                        >
                            {/* Animated bottom bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.min((m.target / (m.target > 100 ? m.target : 100)) * 100, 100)}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                                className="absolute bottom-0 left-0 h-0.5 bg-accent/40"
                            />
                            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-textPrimary/35">{m.label}</span>
                            <span className={`font-heading text-4xl ${m.color}`}>
                                {m.prefix}{val.toLocaleString('en-IN')}{m.suffix}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Live trip list */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="rounded-3xl border border-white/8 bg-secondary/10 overflow-hidden"
            >
                {/* Panel header */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-accent"
                        />
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Live Trip Feed</span>
                    </div>
                    <span className="font-mono text-[9px] text-textPrimary/25 uppercase tracking-widest">Today · {new Date().toLocaleDateString('en-IN')}</span>
                </div>

                {/* Trip rows */}
                {liveTrips.map((trip, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                        className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 px-8 py-5 border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors"
                    >
                        {/* Route */}
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                            <span className="text-sm text-textPrimary/80 truncate">{trip.from}</span>
                            <svg width="20" height="8" viewBox="0 0 20 8" className="shrink-0 opacity-40">
                                <path d="M0 4 L16 4 M13 1 L18 4 L13 7" stroke="#5cf09e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                            </svg>
                            <span className="text-sm text-textPrimary/80 truncate">{trip.to}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="flex-1 flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${trip.pct}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${trip.pct === 100 ? 'bg-accent/40' : 'bg-accent'}`}
                                />
                            </div>
                            <span className="font-mono text-[9px] text-textPrimary/35 w-8 text-right">{trip.pct}%</span>
                        </div>

                        {/* Status badge */}
                        <div className={`
                            shrink-0 px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-widest
                            ${trip.status === 'In Transit' ? 'bg-accent/15 text-accent' :
                              trip.status === 'Completed'  ? 'bg-white/5 text-textPrimary/40' :
                              trip.status === 'Boarding'   ? 'bg-yellow-500/10 text-yellow-400' :
                              'bg-white/5 text-textPrimary/25'}
                        `}>
                            {trip.status}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
