import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

export function TravelHero() {
    return (
        <section className="relative h-[80vh] w-full flex items-center overflow-hidden">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                    className="w-full h-full object-cover opacity-60 scale-105" 
                    alt="Scenic EV Road Trip"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <MapPin className="text-accent" size={20} />
                        <span className="text-sm font-semibold uppercase tracking-widest text-accent">Experience Modern Travel</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-black leading-[0.9] mb-6 text-textPrimary">
                        Explore More.<br />
                        <span className="text-accent">Drive Electric.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-textPrimary/80 mb-10 leading-relaxed font-sans max-w-xl">
                        Weekend getaways and daily rides powered by EVs. Discover your next adventure with zero emissions.
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-4 bg-accent text-background font-bold uppercase tracking-widest rounded-full hover:bg-accent/90 transition-all hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(92,240,158,0.2)] text-xs">
                            Start Your Journey
                        </button>
                        <button className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-textPrimary font-bold uppercase tracking-widest rounded-full hover:bg-white/10 transition-all flex items-center gap-2 group text-xs">
                            View Destinations
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
            >
                <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Discover</span>
            </motion.div>
        </section>
    );
}
