import { useState, useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';

// Revenue per vehicle per month (₹)
const REVENUE_PER_VEHICLE = 18000;
const EXPENSE_RATIO = 0.42; // 42% operational cost

function useAnimatedNumber(target: number, duration = 600) {
    const [display, setDisplay] = useState(target);
    const prevTarget = useRef(target);

    useEffect(() => {
        const controls = animate(prevTarget.current, target, {
            duration: duration / 1000,
            ease: 'easeOut',
            onUpdate: (v) => setDisplay(Math.round(v)),
        });
        prevTarget.current = target;
        return controls.stop;
    }, [target, duration]);

    return display;
}

export function EarningsSimulator() {
    const [investment, setInvestment] = useState(500000);   // ₹5 lakh default
    const [vehicles, setVehicles]     = useState(3);

    const monthlyGross   = vehicles * REVENUE_PER_VEHICLE;
    const monthlyExpense = Math.round(monthlyGross * EXPENSE_RATIO);
    const monthlyNet     = monthlyGross - monthlyExpense;
    const annualReturns  = monthlyNet * 12;
    const roi            = Math.round((annualReturns / investment) * 100);

    const dispMonthly = useAnimatedNumber(monthlyNet);
    const dispAnnual  = useAnimatedNumber(annualReturns);
    const dispRoi     = useAnimatedNumber(roi);

    const fmt = (n: number) =>
        '₹' + n.toLocaleString('en-IN');

    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
            >
                <h2 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] uppercase text-textPrimary">
                    Simulate your<br />
                    <span className="text-accent">earnings.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/60 leading-relaxed">
                    Adjust capital and fleet size to see projected returns in real time. Numbers are based on actual operational data.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ── LEFT: Inputs ── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="p-8 md:p-10 rounded-3xl border border-white/8 bg-secondary/15 flex flex-col gap-10"
                >
                    <div className="space-y-2">
                        <h3 className="font-heading text-lg uppercase text-textPrimary">Your Inputs</h3>
                        <p className="text-xs text-textPrimary/45">Drag the sliders to model your scenario.</p>
                    </div>

                    {/* Investment Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="font-sans text-[10px] uppercase tracking-[0.18em] text-textPrimary/40">
                                Investment Amount
                            </label>
                            <span className="font-heading text-2xl text-accent">{fmt(investment)}</span>
                        </div>
                        <input
                            type="range"
                            min={100000}
                            max={5000000}
                            step={50000}
                            value={investment}
                            onChange={(e) => setInvestment(Number(e.target.value))}
                            className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-accent cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-textPrimary/30 font-sans">
                            <span>₹1L</span><span>₹50L</span>
                        </div>
                    </div>

                    {/* Vehicles Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="font-sans text-[10px] uppercase tracking-[0.18em] text-textPrimary/40">
                                Number of Vehicles
                            </label>
                            <span className="font-heading text-2xl text-accent">{vehicles} <span className="text-sm font-normal text-textPrimary/40">EVs</span></span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={30}
                            step={1}
                            value={vehicles}
                            onChange={(e) => setVehicles(Number(e.target.value))}
                            className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-accent cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-textPrimary/30 font-sans">
                            <span>1 EV</span><span>30 EVs</span>
                        </div>
                    </div>

                    {/* Assumptions note */}
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/15 text-[10px] text-textPrimary/45 font-sans leading-relaxed">
                        Assumes ₹18,000 gross revenue/vehicle/month · 42% operational cost ratio · Excluding taxes
                    </div>
                </motion.div>

                {/* ── RIGHT: Outputs ── */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="flex flex-col gap-5"
                >
                    {/* Monthly earnings */}
                    <div className="flex-1 p-8 md:p-10 rounded-3xl border border-white/8 bg-secondary/15 flex flex-col justify-between">
                        <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-textPrimary/40 mb-4 block">
                            Monthly Net Earnings
                        </span>
                        <motion.div
                            key={dispMonthly}
                            className="font-heading text-[clamp(36px,6vw,64px)] leading-none text-accent"
                        >
                            {fmt(dispMonthly)}
                        </motion.div>
                        <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${Math.min((monthlyNet / 200000) * 100, 100)}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="h-full bg-accent rounded-full"
                            />
                        </div>
                    </div>

                    {/* Annual returns */}
                    <div className="flex-1 p-8 md:p-10 rounded-3xl border border-accent/20 bg-accent/5 flex flex-col justify-between">
                        <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-accent/60 mb-4 block">
                            Annual Returns
                        </span>
                        <motion.div className="font-heading text-[clamp(36px,6vw,64px)] leading-none text-accent">
                            {fmt(dispAnnual)}
                        </motion.div>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="font-heading text-2xl text-accent">{dispRoi}%</div>
                            <span className="text-xs text-textPrimary/40 font-sans uppercase tracking-widest">ROI</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="py-5 rounded-2xl bg-accent text-background font-black uppercase tracking-widest text-sm hover:bg-accent/90 transition-colors"
                    >
                        Get a Detailed Projection
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
