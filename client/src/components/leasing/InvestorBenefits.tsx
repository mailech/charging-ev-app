import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Leaf, Layers } from 'lucide-react';

const benefits = [
    {
        icon: TrendingUp,
        title: 'Predictable Returns',
        desc: 'Structured profit-sharing gives you visibility into monthly and annual earnings. No surprises.',
        stat: '18–24%',
        statLabel: 'Avg. Annual ROI',
        accent: true,
    },
    {
        icon: ShieldCheck,
        title: 'Asset-Backed Model',
        desc: 'Your capital is backed by real, deployed EV assets — not paper. Each vehicle is an earning unit.',
        stat: '100%',
        statLabel: 'Asset Coverage',
        accent: false,
    },
    {
        icon: Leaf,
        title: 'EV Growth Market',
        desc: 'India\'s EV market is growing at 49% CAGR. Investing now means riding the wave at the right time.',
        stat: '49%',
        statLabel: 'Market CAGR',
        accent: false,
    },
    {
        icon: Layers,
        title: 'Scalable Investment',
        desc: 'Start with a single vehicle. Scale to a fleet. Your investment grows with operational demand.',
        stat: '1→50+',
        statLabel: 'Vehicles',
        accent: false,
    },
];

export function InvestorBenefits() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
            >
                <h2 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] uppercase text-textPrimary">
                    Why investors<br />
                    <span className="text-accent">choose Trio.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/60 leading-relaxed">
                    Four structural advantages that make Trio's leasing model a premium investment opportunity.
                </p>
            </motion.div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((b, i) => (
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
                            ${b.accent
                                ? 'bg-accent border-accent'
                                : 'bg-secondary/25 border-white/8 hover:border-accent/30'
                            }
                        `}
                    >
                        {/* Hover glow */}
                        {!b.accent && (
                            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                        )}

                        {/* Icon */}
                        <div className={`
                            w-11 h-11 rounded-xl flex items-center justify-center mb-6
                            ${b.accent ? 'bg-black/15 text-background' : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-background'}
                            transition-all duration-300
                        `}>
                            <b.icon size={20} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col gap-3">
                            <h3 className={`font-heading text-xl uppercase leading-tight ${b.accent ? 'text-background' : 'text-textPrimary'}`}>
                                {b.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${b.accent ? 'text-background/65' : 'text-textPrimary/50'}`}>
                                {b.desc}
                            </p>
                        </div>

                        {/* Stat */}
                        <div className={`mt-8 pt-6 border-t ${b.accent ? 'border-black/15' : 'border-white/8'}`}>
                            <div className={`font-heading text-3xl ${b.accent ? 'text-background' : 'text-accent'}`}>
                                {b.stat}
                            </div>
                            <div className={`text-[10px] font-sans uppercase tracking-[0.18em] mt-1 ${b.accent ? 'text-background/50' : 'text-textPrimary/35'}`}>
                                {b.statLabel}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
