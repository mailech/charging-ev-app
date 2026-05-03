import { motion } from 'framer-motion';
import { Shield, Smartphone, PiggyBank, Leaf } from 'lucide-react';

const features = [
    { icon: Smartphone, title: "Smart Fleet Management", desc: "Control and monitor your vehicles via our centralized dashboard." },
    { icon: Shield, title: "Real-time Tracking", desc: "Advanced GPS tracking with predictive maintenance alerts." },
    { icon: PiggyBank, title: "Cost Efficiency", desc: "Reduce total cost of ownership by up to 40% compared to ICE vehicles." },
    { icon: Leaf, title: "Sustainable Mobility", desc: "Zero emissions. 100% powered by clean energy where available." }
];

// Duplicate features to allow seamless infinite scrolling
const doubledFeatures = [...features, ...features, ...features];

export function FeatureHighlights() {
    return (
        <section id="features" className="py-24 border-y border-white/5 bg-secondary/10 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            
            <motion.div
                className="flex gap-16 w-max"
                animate={{ x: [0, -1000] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear",
                    },
                }}
            >
                {doubledFeatures.map((feat, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-6 min-w-[350px] bg-secondary/30 backdrop-blur-sm px-8 py-6 rounded-3xl border border-white/5 hover:border-accent/30 transition-colors"
                    >
                        <div className="p-4 bg-background border border-white/10 rounded-2xl text-accent shrink-0 shadow-[0_0_15px_rgba(92,240,158,0.15)]">
                            <feat.icon size={28} />
                        </div>
                        <div>
                            <h4 className="font-heading font-bold text-xl mb-1 text-textPrimary tracking-wide">{feat.title}</h4>
                            <p className="text-sm text-textPrimary/60 leading-relaxed font-sans">{feat.desc}</p>
                        </div>
                    </div>
                ))}
            </motion.div>
        </section>
    );
}
