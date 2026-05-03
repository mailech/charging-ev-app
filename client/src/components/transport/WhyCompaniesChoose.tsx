import { motion } from 'framer-motion';
import { IndianRupee, Leaf, Activity, Layers } from 'lucide-react';

const reasons = [
    {
        icon: IndianRupee,
        title: 'Lower Transport Cost',
        desc: 'EV operating cost is 62% lower than diesel. No fluctuating fuel prices. Fixed, predictable monthly spend for HR and finance teams.',
        stat: '62%',
        statLabel: 'Cost reduction vs diesel',
        accent: true,
    },
    {
        icon: Leaf,
        title: 'Sustainable Solution',
        desc: 'Zero tailpipe emissions. Every trip reduces your company\'s Scope 3 carbon footprint — ESG reporting made easy.',
        stat: '0',
        statLabel: 'Emissions per km',
        accent: false,
    },
    {
        icon: Activity,
        title: 'Reliable Operations',
        desc: '99.2% on-time rate. Real-time tracking, dedicated ops team and SLA-backed service agreements for enterprise clients.',
        stat: '99.2%',
        statLabel: 'On-time rate',
        accent: false,
    },
    {
        icon: Layers,
        title: 'Scalable Fleet',
        desc: 'Start with 5 vehicles. Scale to 500. Fleet size adjusts to employee headcount, shift patterns and seasonal demand.',
        stat: '5→500',
        statLabel: 'Fleet range',
        accent: false,
    },
];

export function WhyCompaniesChoose() {
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
                    Why companies<br />
                    <span className="text-accent">choose Trio.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/55 leading-relaxed">
                    Four structural advantages that make Trio the preferred corporate mobility partner.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reasons.map((r, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, delay: i * 0.12 }}
                        whileHover={{ y: -8 }}
                        className={`
                            group relative rounded-3xl p-8 flex flex-col justify-between min-h-[280px]
                            border transition-all duration-400 overflow-hidden cursor-default
                            ${r.accent
                                ? 'bg-accent border-accent'
                                : 'bg-secondary/20 border-white/8 hover:border-accent/30'
                            }
                        `}
                    >
                        {/* Hover glow */}
                        {!r.accent && (
                            <div className="absolute inset-0 bg-accent/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                        )}

                        {/* Icon */}
                        <div className={`
                            w-11 h-11 rounded-xl flex items-center justify-center mb-6
                            ${r.accent ? 'bg-black/15 text-background' : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-background'}
                            transition-all duration-300
                        `}>
                            <r.icon size={20} />
                        </div>

                        <div className="flex-1 flex flex-col gap-3">
                            <h3 className={`font-heading text-xl uppercase leading-tight ${r.accent ? 'text-background' : 'text-textPrimary'}`}>
                                {r.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${r.accent ? 'text-background/65' : 'text-textPrimary/50'}`}>
                                {r.desc}
                            </p>
                        </div>

                        <div className={`mt-8 pt-6 border-t ${r.accent ? 'border-black/15' : 'border-white/8'}`}>
                            <div className={`font-heading text-3xl ${r.accent ? 'text-background' : 'text-accent'}`}>{r.stat}</div>
                            <div className={`text-[10px] font-mono uppercase tracking-[0.15em] mt-1 ${r.accent ? 'text-background/50' : 'text-textPrimary/35'}`}>
                                {r.statLabel}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
