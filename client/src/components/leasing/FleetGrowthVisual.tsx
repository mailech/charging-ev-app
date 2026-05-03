import { motion } from 'framer-motion';
import { Truck, TrendingUp, Shield, Zap, BarChart } from 'lucide-react';

const insights = [
    { icon: TrendingUp, label: "Revenue", value: "+85%", pos: "top-12 left-12" },
    { icon: Zap, label: "Efficiency", value: "98%", pos: "bottom-32 left-24" },
    { icon: Shield, label: "Security", value: "Level 4", pos: "top-24 right-1/4" },
    { icon: BarChart, label: "Expansion", value: "140%", pos: "top-12 right-12" }
];

export function FleetGrowthVisual() {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full overflow-hidden">
            <div className="flex flex-col items-center text-center mb-20 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold uppercase">Scalable <span className="text-accent">Infrastructure</span></h2>
                <p className="text-textPrimary/60 max-w-lg text-sm">Our platform scales alongside your business, ensuring you always have the right fleet size for your demand.</p>
            </div>

            <div className="relative h-[450px] w-full bg-secondary/5 rounded-[3rem] border border-white/5 p-12 flex items-end gap-3 lg:gap-6 shadow-inner">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none opacity-20">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="w-full h-px bg-white/10" />
                    ))}
                </div>

                {[30, 45, 35, 55, 70, 60, 85, 95, 100].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group relative z-10">
                        {/* Animated Fleet Icon */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 + 0.2 }}
                            className="text-accent mb-2 hidden md:block"
                        >
                            <Truck size={12} className={i % 2 === 0 ? "opacity-40" : "opacity-80"} />
                        </motion.div>

                        <motion.div
                            initial={{ height: "5%" }}
                            whileInView={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="w-full rounded-t-2xl bg-gradient-to-t from-accent/10 to-accent relative overflow-hidden shadow-[0_0_20px_rgba(92,240,158,0.1)] group-hover:shadow-[0_0_30px_rgba(92,240,158,0.3)] transition-shadow border-t border-white/20"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </motion.div>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold text-textPrimary/40">Q{i + 1}</span>
                        </div>
                    </div>
                ))}
                
                {/* Floating Small Insight Cards */}
                {insights.map((insight, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (i * 0.2) }}
                        className={`absolute ${insight.pos} bg-white text-background p-3 px-4 rounded-2xl shadow-2xl border border-white/20 hidden md:flex items-center gap-3 z-20`}
                    >
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                            <insight.icon size={14} />
                        </div>
                        <div>
                            <div className="text-[8px] font-bold uppercase opacity-40 leading-none mb-1">{insight.label}</div>
                            <div className="text-sm font-bold leading-none">{insight.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {/* Legend / Info */}
            <div className="mt-12 flex justify-center gap-12">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-accent/20" />
                    <span className="text-[10px] font-bold uppercase text-textPrimary/40">Initial Phase</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-accent" />
                    <span className="text-[10px] font-bold uppercase text-textPrimary/40">Scale Phase</span>
                </div>
            </div>
        </section>
    );
}
