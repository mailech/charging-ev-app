import { motion } from 'framer-motion';

const nodes = [
    { id: 'capital', label: 'Capital', sub: 'Client Investment', col: 0 },
    { id: 'fleet', label: 'Fleet', sub: 'EV Vehicles', col: 1 },
    { id: 'ops', label: 'Operations', sub: 'Deploy & Run', col: 2 },
    { id: 'revenue', label: 'Revenue', sub: 'Daily Earnings', col: 3 },
    { id: 'returns', label: 'Returns', sub: 'Client Profit Share', col: 4 },
];

const stats = [
    { label: 'Avg. Daily Revenue / Vehicle', value: '₹2,400' },
    { label: 'Fleet Utilisation Rate', value: '87%' },
    { label: 'Avg. Annual ROI', value: '18–24%' },
    { label: 'Capital Recovery Period', value: '28 mo' },
];


export function RevenueEngine() {
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
                <h2 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] text-textPrimary">
                    The revenue<br />
                    <span className="text-accent">engine.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/60 leading-relaxed">
                    A self-sustaining system — capital flows in, operations generate revenue, returns flow back to you.
                </p>
            </motion.div>

            {/* Flow Diagram */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative p-8 md:p-12 rounded-3xl border border-white/8 bg-secondary/10 overflow-hidden mb-12"
            >
                {/* Background grid */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                />

                {/* Nodes */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    {nodes.map((node, i) => (
                        <div key={node.id} className="flex md:flex-col items-center gap-3 md:gap-0 flex-1 w-full">
                            {/* Node card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                whileHover={{ scale: 1.06 }}
                                className={`
                                    relative flex flex-col items-center justify-center text-center
                                    w-full md:w-full min-h-[110px] rounded-2xl border p-5 cursor-default
                                    transition-all duration-300
                                    ${node.id === 'returns'
                                        ? 'bg-accent border-accent text-background'
                                        : node.id === 'capital'
                                            ? 'bg-secondary border-accent/30 text-textPrimary'
                                            : 'bg-secondary/40 border-white/8 text-textPrimary hover:border-accent/30'
                                    }
                                `}
                            >
                                <span className="font-sans text-[9px] uppercase tracking-[0.2em] opacity-50 mb-1">
                                    0{i + 1}
                                </span>
                                <div className={`font-heading text-xl ${node.id === 'returns' ? 'text-background' : 'text-textPrimary'}`}>
                                    {node.label}
                                </div>
                                <div className={`text-[10px] mt-1 ${node.id === 'returns' ? 'text-background/60' : 'text-textPrimary/45'}`}>
                                    {node.sub}
                                </div>

                                {/* Pulse on returns node */}
                                {node.id === 'returns' && (
                                    <motion.div
                                        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-2xl border-2 border-accent pointer-events-none"
                                    />
                                )}
                            </motion.div>

                            {/* Arrow between nodes */}
                            {i < nodes.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
                                    className="flex-shrink-0 flex items-center justify-center md:w-10 md:h-10 w-8 h-8"
                                >
                                    {/* Animated flowing arrow */}
                                    <svg viewBox="0 0 40 40" className="w-8 h-8 md:w-10 md:h-10 rotate-90 md:rotate-0">
                                        <motion.path
                                            d="M2 20 L34 20"
                                            stroke="#5cf09e"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            fill="none"
                                            strokeDasharray="6 4"
                                            animate={{ strokeDashoffset: [0, -20] }}
                                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                        />
                                        <path d="M30 14 L38 20 L30 26" stroke="#5cf09e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Live stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="p-6 rounded-2xl border border-white/8 bg-secondary/20 flex flex-col gap-2"
                    >
                        <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-textPrimary/40">{s.label}</span>
                        <span className="font-heading text-2xl text-accent">{s.value}</span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
