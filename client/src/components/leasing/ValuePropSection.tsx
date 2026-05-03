import { motion } from 'framer-motion';
import { TrendingDown, Zap, ShieldCheck, Layers } from 'lucide-react';

const benefits = [
    {
        icon: TrendingDown,
        title: "Lower Operating Cost",
        desc: "Save up to 40% on monthly overhead compared to traditional diesel fleets."
    },
    {
        icon: Zap,
        title: "Zero Fuel Dependency",
        desc: "Shield your business from fluctuating fuel prices with stable electric costs."
    },
    {
        icon: ShieldCheck,
        title: "Maintenance Included",
        desc: "Full service and maintenance coverage included in your monthly lease."
    },
    {
        icon: Layers,
        title: "Scalable Fleet",
        desc: "Add or remove vehicles as your business needs evolve without capital risk."
    }
];

export function ValuePropSection() {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-[2rem] bg-secondary/20 border border-white/5 hover:border-accent/20 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                            <item.icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                        <p className="text-sm text-textPrimary/50 leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

        </section>
    );
}
