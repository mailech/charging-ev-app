import { motion } from 'framer-motion';

const audiences = [
    {
        idx: '— 01',
        title: 'Part-time\nearners',
        desc: 'Picking up extra income on the side without buying or leasing a vehicle.',
        icon: (
            <svg className="w-12 h-12 text-accent" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="24" r="16" />
                <path d="M24 14v10l7 4" />
            </svg>
        ),
    },
    {
        idx: '— 02',
        title: 'Office\nworkers',
        desc: 'Evening errands, late commutes, the occasional weekday detour to get stuff done.',
        icon: (
            <svg className="w-12 h-12 text-accent" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="8" y="10" width="32" height="28" rx="2" />
                <path d="M8 18h32M16 26h8M16 30h6" />
            </svg>
        ),
    },
    {
        idx: '— 03',
        title: 'Personal\ntravel & trips',
        desc: 'Weekend getaways, family outings, road trips and out-of-town visits — without the cost of owning a car.',
        icon: (
            <svg className="w-12 h-12 text-accent" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 36 L20 14 L28 24 L34 18 L40 36 Z" />
                <circle cx="32" cy="14" r="3" />
                <path d="M6 40h36" />
            </svg>
        ),
    },
];

export function RentalAudience() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
            >
                <h2 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] uppercase text-textPrimary">
                    Who it's <span className="text-accent">for.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/60 leading-relaxed">
                    Hourly rentals work best if you need short-term transport without committing to a full day.
                </p>
            </motion.div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {audiences.map((aud, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
                        whileHover={{ y: -6 }}
                        className="group relative bg-secondary/30 border border-white/8 rounded-3xl p-9 min-h-[260px] flex flex-col justify-between overflow-hidden transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                        {aud.icon}

                        <div>
                            <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-textPrimary/40">{aud.idx}</span>
                            <h4 className="font-heading text-3xl uppercase leading-tight mt-2 mb-3 text-textPrimary whitespace-pre-line">
                                {aud.title}
                            </h4>
                            <p className="text-sm text-textPrimary/55 leading-relaxed">{aud.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
