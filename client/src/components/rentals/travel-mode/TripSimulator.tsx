import { motion } from 'framer-motion';
import { Battery, Zap } from 'lucide-react';

export function TripSimulator() {
    return (
        <section className="py-24 px-6 md:px-12 w-full bg-secondary/10 overflow-hidden relative">
            {/* Background Map Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="flex-1 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-heading font-black uppercase leading-none">Smart Trip <br/><span className="text-accent">Simulation</span></h2>
                    <p className="text-xl text-textPrimary/70 max-w-xl">Our intelligent system calculates the perfect EV match and charging stops for your journey.</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 p-6 rounded-3xl bg-secondary/30 border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent"><Zap size={24} /></div>
                            <div>
                                <div className="text-sm font-bold uppercase text-textPrimary/40 mb-1">Range Confidence</div>
                                <div className="text-2xl font-bold">100% Reachable</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 p-6 rounded-3xl bg-secondary/30 border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent"><Battery size={24} /></div>
                            <div>
                                <div className="text-sm font-bold uppercase text-textPrimary/40 mb-1">Battery Remaining</div>
                                <div className="text-2xl font-bold">64% on Arrival</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-xl aspect-square relative bg-secondary/20 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                    <iframe 
                        src="/IndiaMapAnimation.html" 
                        title="India Network Map" 
                        className="absolute inset-0 w-full h-full border-none outline-none block opacity-80"
                        scrolling="no"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20 pointer-events-none" />
                    
                    {/* Minimal Status Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl"
                        >
                            <div className="text-[10px] uppercase tracking-widest text-textPrimary/40 mb-1 font-bold">Trip Analysis</div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <span className="text-sm font-bold text-accent">Simulating Route...</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
