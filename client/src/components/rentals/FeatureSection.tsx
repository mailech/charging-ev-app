import { motion } from 'framer-motion';
import { Smartphone, Zap, Leaf, DollarSign } from 'lucide-react';

const features = [
    { icon: Zap, title: 'Instant Booking', desc: 'Book and drive in under 60 seconds.' },
    { icon: Smartphone, title: 'App Unlock', desc: 'Your phone is the key to every vehicle.' },
    { icon: Leaf, title: 'Zero Emissions', desc: '100% electric, 0% carbon footprint.' },
    { icon: DollarSign, title: 'Affordable', desc: 'Pay only for what you use.' },
];

export function FeatureSection() {
    return (
        <section className="py-24 px-6 md:px-12 w-full bg-secondary/10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((f, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="p-8 rounded-3xl bg-secondary/30 border border-white/5 hover:border-accent/30 transition-colors group"
                    >
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                            <f.icon className="text-textPrimary group-hover:text-accent transition-colors" size={24} />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                        <p className="text-sm text-textPrimary/60 leading-relaxed">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
