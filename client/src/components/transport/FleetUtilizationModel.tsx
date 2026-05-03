import { motion } from 'framer-motion';
import { Layers, Users, Navigation, TrendingUp } from 'lucide-react';

const flow = [
    {
        icon: Layers,
        label: 'Fleet',
        sub: 'Acquired via leasing capital',
        color: 'border-accent/40 bg-accent/5 text-accent',
    },
    {
        icon: Users,
        label: 'Employees',
        sub: 'Assigned routes & schedules',
        color: 'border-white/15 bg-secondary/30 text-textPrimary',
    },
    {
        icon: Navigation,
        label: 'Trips',
        sub: 'Daily utilisation tracked',
        color: 'border-white/15 bg-secondary/30 text-textPrimary',
    },
    {
        icon: TrendingUp,
        label: 'Revenue',
        sub: 'Per-trip earnings generated',
        color: 'border-accent/40 bg-accent/8 text-accent',
    },
];

const stats = [
    { label: 'Avg. trips / vehicle / day', value: '14' },
    { label: 'Utilisation rate',           value: '87%' },
    { label: 'Cost per km (EV vs diesel)', value: '↓62%' },
    { label: 'Revenue per vehicle / mo',   value: '₹18K' },
];

export function FleetUtilizationModel() {
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
                <h2 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] text-textPrimary">
                    Fleet utilisation<br />
                    <span className="text-accent">model.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/55 leading-relaxed">
                    Vehicles acquired through investor capital are immediately deployed for corporate transport — generating daily revenue from day one.
                </p>
            </motion.div>

            {/* Flow */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-14">
                {flow.map((node, i) => (
                    <div key={i} className="flex md:flex-col flex-row items-center flex-1 w-full gap-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: i * 0.12 }}
                            whileHover={{ y: -5 }}
                            className={`flex flex-col items-center justify-center text-center p-7 rounded-2xl border w-full min-h-[150px] cursor-default transition-all duration-300 ${node.color}`}
                        >
                            <node.icon size={24} className="mb-3 opacity-80" />
                            <div className="font-heading text-xl uppercase tracking-wide mb-1">{node.label}</div>
                            <div className="text-[11px] opacity-55 leading-snug">{node.sub}</div>
                        </motion.div>

                        {/* Arrow connector */}
                        {i < flow.length - 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + i * 0.12 }}
                                className="flex-shrink-0 flex items-center justify-center w-10 h-10"
                            >
                                <svg viewBox="0 0 40 40" className="w-8 h-8 rotate-90 md:rotate-0">
                                    <motion.path
                                        d="M4 20 L32 20"
                                        stroke="#5cf09e" strokeWidth="1.5" strokeLinecap="round" fill="none"
                                        strokeDasharray="5 3"
                                        animate={{ strokeDashoffset: [0, -16] }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                    />
                                    <path d="M26 14 L34 20 L26 26" stroke="#5cf09e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="p-6 rounded-2xl border border-white/8 bg-secondary/15 flex flex-col gap-2"
                    >
                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-textPrimary/35">{s.label}</span>
                        <span className="font-heading text-2xl text-accent">{s.value}</span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
