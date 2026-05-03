import { motion } from 'framer-motion';

const plans = [
    {
        idx: '— 01',
        badge: 'Short Trip',
        hours: '2',
        title: 'Quick errands',
        desc: 'Local travel, supply runs, a fast hop across town and back.',
        dark: false,
    },
    {
        idx: '— 02',
        badge: 'Work Shift',
        hours: '5',
        title: 'Peak deliveries',
        desc: 'Built around the lunch & dinner rush for delivery and rideshare partners.',
        dark: true,
    },
    {
        idx: '— 03',
        badge: 'Half Day',
        hours: '8',
        title: 'Commute & gigs',
        desc: 'Office workdays, part-time gigs, an entire shift covered end to end.',
        dark: false,
    },
    {
        idx: '— 04',
        badge: 'Full Day',
        hours: '24',
        title: 'Weekend & trips',
        desc: "Longer trips, weekend use, anything that doesn't fit the shorter slots.",
        dark: true,
    },
];

export function RentalPlans() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
            >
                <h2 className="font-heading text-[clamp(52px,8vw,120px)] leading-[0.88] uppercase text-textPrimary">
                    Pick a plan that<br />
                    <span className="text-accent">fits your day.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/60 leading-relaxed">
                    Four blocks, one fleet. Most riders start on Short Trip and move up as they take on more shifts.
                </p>
            </motion.div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.badge}
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                        whileHover={{ y: -6 }}
                        className={`
                            relative rounded-3xl p-8 flex flex-col justify-between min-h-[340px] overflow-hidden border transition-all duration-300 cursor-pointer group
                            ${plan.dark
                                ? 'bg-secondary border-white/5 text-textPrimary'
                                : 'bg-secondary/30 border-white/8 text-textPrimary'
                            }
                        `}
                    >
                        {/* Hover accent glow */}
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                        {/* Top row */}
                        <div className="flex justify-between items-start">
                            <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-textPrimary/40">{plan.idx}</span>
                            <span className="font-sans text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/10 text-textPrimary/50">
                                {plan.badge}
                            </span>
                        </div>

                        {/* Hours + Info */}
                        <div>
                            <div className="font-heading leading-none text-accent mt-6 mb-1" style={{ fontSize: 'clamp(72px, 10vw, 96px)' }}>
                                {plan.hours}
                                <sup className="font-sans text-[20px] text-textPrimary/40 align-top ml-2 font-normal">hrs</sup>
                            </div>
                            <h3 className="font-heading text-2xl uppercase tracking-wide mb-2 text-textPrimary">{plan.title}</h3>
                            <p className="text-sm text-textPrimary/50 leading-relaxed">{plan.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
