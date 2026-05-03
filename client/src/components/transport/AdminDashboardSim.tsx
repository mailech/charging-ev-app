import { motion } from 'framer-motion';
import { Activity, Clock, Zap, Target } from 'lucide-react';

export function AdminDashboardSim() {
    return (
        <section className="py-24 px-6 md:px-12 bg-secondary/5 border-y border-white/5 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-3xl md:text-5xl font-heading uppercase mb-4 tracking-tighter">System <span className="text-accent">Orchestration</span></h2>
                    <p className="text-textPrimary/40 max-w-xl mx-auto text-sm">Real-time telemetry and predictive analytics for your entire corporate fleet.</p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    {/* Main HUD Visual (Left) */}
                    <div className="flex-1 relative w-full max-w-lg aspect-square">
                        <div className="absolute inset-0 rounded-full border border-white/5 bg-secondary/10 flex items-center justify-center">
                            {/* Inner Rotating Ring */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-[80%] h-[80%] rounded-full border-2 border-dashed border-accent/20"
                            />
                            {/* Stats Centerpiece */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2">Fleet Utility</div>
                                <div className="text-7xl font-bold tracking-tighter">96.4<span className="text-3xl opacity-40">%</span></div>
                                <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase text-accent tracking-widest">Optimized</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Satellites Stats */}
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="absolute top-0 -left-4 p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl z-20"
                        >
                            <Activity className="text-accent mb-4" size={20} />
                            <div className="text-2xl font-bold">84</div>
                            <div className="text-[9px] font-bold uppercase text-textPrimary/40 tracking-widest">Active Units</div>
                        </motion.div>

                        <motion.div 
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="absolute bottom-0 -right-4 p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl z-20"
                        >
                            <Target className="text-blue-400 mb-4" size={20} />
                            <div className="text-2xl font-bold">1,240</div>
                            <div className="text-[9px] font-bold uppercase text-textPrimary/40 tracking-widest">Completed Trips</div>
                        </motion.div>
                    </div>

                    {/* Data Insights (Right) */}
                    <div className="flex-1 w-full space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[2.5rem] bg-secondary/20 border border-white/5 hover:border-accent/30 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                                    <Clock size={20} />
                                </div>
                                <div className="text-2xl font-bold mb-1">4.2m</div>
                                <div className="text-[10px] font-bold uppercase text-textPrimary/40 tracking-widest">Avg. Response Time</div>
                                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} className="h-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
                                </div>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-secondary/20 border border-white/5 hover:border-yellow-400/30 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                                    <Zap size={20} />
                                </div>
                                <div className="text-2xl font-bold mb-1">-32%</div>
                                <div className="text-[10px] font-bold uppercase text-textPrimary/40 tracking-widest">Energy Overhead</div>
                                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} whileInView={{ width: '65%' }} className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                </div>
                            </div>
                        </div>

                        {/* Interactive Analysis HUD */}
                        <div className="p-10 rounded-[3rem] bg-background border border-white/10 relative overflow-hidden group shadow-2xl">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <div className="text-xs font-bold uppercase text-accent tracking-[0.2em] mb-1">System Load Analysis</div>
                                    <div className="text-xs text-textPrimary/40">AI-Predictive Pathfinding enabled.</div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent text-[9px] font-bold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    REAL-TIME
                                </div>
                            </div>
                            <div className="h-[120px] flex items-end gap-2">
                                {[30, 45, 35, 55, 70, 60, 85, 95].map((h, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        transition={{ duration: 1, delay: i * 0.05 }}
                                        className="flex-1 bg-accent/20 rounded-t-lg group-hover:bg-accent/40 transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_10px_#5CF09E]" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
