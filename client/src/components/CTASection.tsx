import { motion } from 'framer-motion';

export function CTASection() {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/5" />
            
            {/* Breathing Gradient Orb */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-accent/20 blur-[150px] rounded-full pointer-events-none" 
            />
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8 text-textPrimary leading-tight"
                >
                    Power your <span className="text-accent relative inline-block">
                        journey
                        <motion.span 
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
                            className="absolute -bottom-2 left-0 w-full h-2 bg-accent origin-left rounded-full"
                        />
                    </span> with EV
                </motion.h2>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row justify-center gap-6 mt-12"
                >
                    <button className="px-10 py-5 bg-accent text-background font-bold rounded-full text-xl hover:bg-accent/90 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(92,240,158,0.4)] active:scale-95">
                        Get Started
                    </button>
                    <button className="px-10 py-5 bg-secondary/60 backdrop-blur-md border border-white/10 text-textPrimary font-bold rounded-full text-xl hover:bg-secondary transition-all hover:scale-105 active:scale-95 shadow-xl">
                        Contact Sales
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
