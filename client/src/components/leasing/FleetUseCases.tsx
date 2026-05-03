import { motion } from 'framer-motion';
import { Building2, Users, Navigation } from 'lucide-react';

const useCases = [
    {
        icon: Building2,
        tag: '— Corporate Transport',
        title: 'Enterprise Fleet Operations',
        desc: 'Leased EVs serve as the backbone of corporate shuttle and last-mile transport networks for large companies. Vehicles are tracked, managed and optimised for maximum coverage and efficiency.',
        metrics: [
            { label: 'Avg. Daily Trips', value: '12–18' },
            { label: 'Coverage Area',    value: '40 km'  },
        ],
        highlight: true,
    },
    {
        icon: Users,
        tag: '— Employee Commute',
        title: 'Staff Mobility Services',
        desc: 'Scheduled pick-up and drop-off routes for employee commutes. Vehicles are deployed in fixed shifts — morning, afternoon and evening — with predictable utilisation.',
        metrics: [
            { label: 'Shift Coverage', value: '3× /day'  },
            { label: 'Utilisation',    value: '85%+'      },
        ],
        highlight: false,
    },
    {
        icon: Navigation,
        tag: '— Mobility Operations',
        title: 'Urban Mobility Network',
        desc: 'Vehicles integrated into Trio\'s broader mobility platform — serving on-demand urban transport, delivery partnerships and shared mobility contracts.',
        metrics: [
            { label: 'Platform Type',  value: 'Multi-use' },
            { label: 'Revenue Model',  value: 'Per-km'    },
        ],
        highlight: false,
    },
];

export function FleetUseCases() {
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
                    How the fleet<br />
                    <span className="text-accent">is used.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/60 leading-relaxed">
                    Every leased vehicle is deployed in one or more of these operations — generating daily revenue.
                </p>
            </motion.div>

            {/* Use Case Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {useCases.map((uc, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, delay: i * 0.14 }}
                        whileHover={{ y: -6 }}
                        className={`
                            group relative rounded-3xl p-8 flex flex-col gap-6 border overflow-hidden
                            transition-all duration-300
                            ${uc.highlight
                                ? 'bg-secondary border-accent/30 hover:border-accent/60'
                                : 'bg-secondary/20 border-white/8 hover:border-accent/25'
                            }
                        `}
                    >
                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-accent/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                        {/* Icon + tag */}
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all duration-300">
                                <uc.icon size={20} />
                            </div>
                            <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-textPrimary/40">
                                {uc.tag}
                            </span>
                        </div>

                        {/* Title + desc */}
                        <div className="flex flex-col gap-3 flex-1">
                            <h3 className="font-heading text-xl uppercase leading-tight text-textPrimary">
                                {uc.title}
                            </h3>
                            <p className="text-sm text-textPrimary/50 leading-relaxed">{uc.desc}</p>
                        </div>

                        {/* Metrics */}
                        <div className={`flex gap-6 pt-6 border-t ${uc.highlight ? 'border-white/8' : 'border-white/5'}`}>
                            {uc.metrics.map((m, j) => (
                                <div key={j} className="flex flex-col gap-1">
                                    <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-textPrimary/35">{m.label}</span>
                                    <span className="font-heading text-lg text-accent">{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
