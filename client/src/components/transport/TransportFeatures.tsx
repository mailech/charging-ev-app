import { motion } from 'framer-motion';
import { ShieldCheck, Building2, Smile, Star } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: "Women's Safety",
        desc: "Verified drivers, live tracking, SOS button and in-app emergency contacts. Safe pickups and drop-offs at every hour of the day.",
    },
    {
        icon: Building2,
        title: "Corporate Commute",
        desc: "Fixed morning and evening shuttle runs for IT parks, BPO campuses and manufacturing units. Shift-wise scheduling, zero delays.",
    },
    {
        icon: Smile,
        title: "Commute Sanity",
        desc: "No crowded buses. No auto-haggling. Just calm, air-conditioned EV rides that make the daily commute something employees look forward to.",
    },
    {
        icon: Star,
        title: "Premium Reliability",
        desc: "99.2% on-time rate backed by a dedicated ops team. Every route is monitored, every vehicle tracked — from first mile to last.",
    },
];

export function TransportFeatures() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
            >
                <h2 className="font-heading text-[clamp(36px,5vw,64px)] leading-[0.9] text-textPrimary">
                    Journeys that<br />
                    <span className="text-accent">matter.</span>
                </h2>
                <p className="md:max-w-[280px] text-sm text-textPrimary/55 leading-relaxed">
                    Every feature is built around the people inside the vehicle — not just the route.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-3xl bg-secondary/15 border border-white/8 hover:border-accent/30 hover:bg-secondary/25 transition-all flex gap-6 items-start group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all shrink-0">
                            <f.icon size={22} />
                        </div>
                        <div>
                            <h3 className="font-heading text-xl mb-2">{f.title}</h3>
                            <p className="text-sm text-textPrimary/50 leading-relaxed">{f.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
