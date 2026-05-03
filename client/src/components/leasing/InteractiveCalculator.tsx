import { useState, useEffect } from 'react';
import { useSpring } from 'framer-motion';

export function InteractiveCalculator() {
    const [fleetSize, setFleetSize] = useState(5);
    const [duration, setDuration] = useState(24);

    const cost = fleetSize * 450;
    const savings = fleetSize * 800 * (duration / 12);

    const springCost = useSpring(cost);
    const springSavings = useSpring(savings);

    useEffect(() => {
        springCost.set(cost);
        springSavings.set(savings);
    }, [cost, savings, springCost, springSavings]);

    return (
        <section className="py-24 px-6 md:px-12 bg-secondary/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
                <div className="flex-1 space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold uppercase">Fleet ROI <span className="text-accent">Calculator</span></h2>
                        <p className="text-textPrimary/60">Estimate your potential savings and monthly lease costs instantly.</p>
                    </div>

                    <div className="space-y-10">
                        {/* Fleet Size */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-textPrimary/40">Fleet Size</label>
                                <span className="text-2xl font-bold text-accent">{fleetSize} <span className="text-xs text-textPrimary/40 ml-1">Units</span></span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="50" 
                                value={fleetSize} 
                                onChange={(e) => setFleetSize(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-accent cursor-pointer"
                            />
                        </div>

                        {/* Duration */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-textPrimary/40">Lease Duration</label>
                                <span className="text-2xl font-bold text-accent">{duration} <span className="text-xs text-textPrimary/40 ml-1">Months</span></span>
                            </div>
                            <input 
                                type="range" 
                                min="12" 
                                max="60" 
                                step="12"
                                value={duration} 
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-accent cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-xl">
                    <div className="bg-background border border-white/10 rounded-[3rem] p-12 shadow-2xl relative">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 blur-3xl rounded-full" />
                        
                        <div className="space-y-10">
                            <div>
                                <div className="text-[10px] uppercase tracking-widest font-bold text-textPrimary/40 mb-2">Est. Monthly Lease</div>
                                <div className="text-5xl font-bold text-white tracking-tight">
                                    ${cost.toLocaleString()}
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl bg-accent/5 border border-accent/20">
                                <div className="text-[10px] uppercase tracking-widest font-bold text-accent mb-2">Total Savings (Fuel + Maintenance)</div>
                                <div className="text-4xl font-bold text-accent tracking-tight">
                                    ${savings.toLocaleString()}
                                </div>
                            </div>

                            <button className="w-full py-4 bg-white text-background font-black uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors text-[11px]">
                                Request Full Audit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
