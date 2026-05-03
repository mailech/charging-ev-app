import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Zap, Info, ArrowRight, X } from 'lucide-react';

const vehicles = [
    { 
        id: 1, 
        name: 'Trio Urban', 
        tagline: 'Perfect for the city pulse.',
        price: 12, 
        range: 250, 
        battery: 98, 
        acceleration: '6.2s',
        topSpeed: '110 mph',
        image: 'https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
        color: 'rgba(92, 240, 158, 0.2)',
        accent: '#5CF09E'
    },
    { 
        id: 2, 
        name: 'Trio Sport', 
        tagline: 'Unleash pure performance.',
        price: 18, 
        range: 310, 
        battery: 85, 
        acceleration: '3.8s',
        topSpeed: '145 mph',
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
        color: 'rgba(59, 130, 246, 0.2)',
        accent: '#3B82F6'
    },
    { 
        id: 3, 
        name: 'Trio Pro', 
        tagline: 'The ultimate electric companion.',
        price: 22, 
        range: 400, 
        battery: 100, 
        acceleration: '2.9s',
        topSpeed: '162 mph',
        image: 'https://images.unsplash.com/photo-1619767889225-4a2eb91f58b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
        color: 'rgba(168, 85, 247, 0.2)',
        accent: '#A855F7'
    },
];

export function VehicleShowcase() {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const current = vehicles[selectedIdx];

    return (
        <section className="relative py-24 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
            {/* Dynamic Background Glow */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={selectedIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ 
                        background: `radial-gradient(circle at 50% 50%, ${current.color} 0%, transparent 70%)` 
                    }}
                />
            </AnimatePresence>

            <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col lg:flex-row items-center gap-12">
                
                {/* Left Side: Vehicle Selector Tabs */}
                <div className="flex lg:flex-col gap-4 order-2 lg:order-1">
                    {vehicles.map((v, i) => (
                        <motion.button
                            key={v.id}
                            onClick={() => setSelectedIdx(i)}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-6 py-4 rounded-2xl border transition-all duration-300 flex flex-col items-start min-w-[160px] ${
                                selectedIdx === i 
                                ? 'bg-secondary/40 border-accent/50 shadow-[0_0_20px_rgba(92,240,158,0.1)]' 
                                : 'bg-transparent border-white/5 hover:border-white/20'
                            }`}
                        >
                            <span className={`text-xs uppercase tracking-widest mb-1 ${selectedIdx === i ? 'text-accent' : 'text-textPrimary/40'}`}>
                                {v.id.toString().padStart(2, '0')}
                            </span>
                            <span className="font-heading font-bold text-lg">{v.name}</span>
                            {selectedIdx === i && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full"
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Center: Main Vehicle Display */}
                <div className="flex-1 relative flex flex-col items-center order-1 lg:order-2 py-12 lg:py-0">
                    <div className="text-center mb-12">
                        <motion.h2 
                            key={current.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter text-textPrimary"
                        >
                            {current.name}
                        </motion.h2>
                        <motion.p 
                            key={current.tagline}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-textPrimary/60 mt-2 tracking-widest uppercase text-sm font-medium"
                        >
                            {current.tagline}
                        </motion.p>
                    </div>

                    <div className="relative w-full max-w-3xl aspect-[16/9] group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedIdx}
                                initial={{ opacity: 0, x: 100, scale: 0.8, filter: 'blur(20px)' }}
                                animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -100, scale: 0.8, filter: 'blur(20px)' }}
                                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                                className="w-full h-full"
                            >
                                <motion.img 
                                    src={current.image} 
                                    alt={current.name} 
                                    whileHover={{ rotateY: -10, rotateX: 5 }}
                                    className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] cursor-pointer transition-transform duration-700 ease-out"
                                    style={{ perspective: 1000 }}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Floating Specs Panels */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -left-4 top-1/4 backdrop-blur-xl bg-secondary/30 border border-white/10 p-4 rounded-2xl shadow-2xl z-20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                    <Zap size={20} className="text-accent" />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest text-textPrimary/50">Est. Range</div>
                                    <div className="text-xl font-bold font-heading">{current.range} <span className="text-sm font-normal">mi</span></div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="absolute -right-4 bottom-1/4 backdrop-blur-xl bg-secondary/30 border border-white/10 p-4 rounded-2xl shadow-2xl z-20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                    <Battery size={20} className="text-accent" />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest text-textPrimary/50">Battery Cap.</div>
                                    <div className="text-xl font-bold font-heading">{current.battery}%</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom CTA and Compare Toggle */}
                    <div className="mt-16 flex flex-col items-center gap-6">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-12 py-5 bg-accent text-background font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(92,240,158,0.4)] flex items-center gap-3"
                        >
                            Select {current.name}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20 pointer-events-none" />
                        </motion.button>

                        <button 
                            onClick={() => setIsCompareOpen(true)}
                            className="flex items-center gap-2 text-textPrimary/50 hover:text-textPrimary transition-colors text-sm uppercase tracking-widest font-semibold"
                        >
                            <Info size={16} />
                            Quick Compare
                        </button>
                    </div>
                </div>

                {/* Right Side: Quick Stats Overlay */}
                <div className="hidden lg:flex flex-col gap-8 order-3">
                    <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-textPrimary/40 font-bold">Acceleration</div>
                        <div className="text-3xl font-heading font-bold text-textPrimary">{current.acceleration}</div>
                        <div className="text-[10px] text-textPrimary/30 italic">0-60 mph</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-textPrimary/40 font-bold">Top Speed</div>
                        <div className="text-3xl font-heading font-bold text-textPrimary">{current.topSpeed}</div>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <div className="text-4xl font-heading font-black text-accent">${current.price}<span className="text-sm font-normal text-textPrimary/40 uppercase tracking-widest ml-2">/hour</span></div>
                    </div>
                </div>
            </div>

            {/* Compare Modal */}
            <AnimatePresence>
                {isCompareOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] backdrop-blur-2xl bg-background/80 flex items-center justify-center p-6"
                    >
                        <div className="max-w-4xl w-full bg-secondary/40 border border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
                            <button 
                                onClick={() => setIsCompareOpen(false)}
                                className="absolute top-8 right-8 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="text-4xl font-heading font-black uppercase mb-12">Fleet Comparison</h3>

                            <div className="grid grid-cols-4 gap-8">
                                <div className="space-y-8 pt-16">
                                    <div className="text-sm text-textPrimary/40 uppercase tracking-widest font-bold">Model</div>
                                    <div className="text-sm text-textPrimary/40 uppercase tracking-widest font-bold">Range</div>
                                    <div className="text-sm text-textPrimary/40 uppercase tracking-widest font-bold">Acceleration</div>
                                    <div className="text-sm text-textPrimary/40 uppercase tracking-widest font-bold">Price</div>
                                </div>
                                {vehicles.map((v) => (
                                    <div key={v.id} className={`flex flex-col items-center gap-8 p-6 rounded-3xl transition-colors ${v.id === current.id ? 'bg-accent/10 border border-accent/20' : ''}`}>
                                        <div className="font-heading font-bold text-lg">{v.name}</div>
                                        <div className="font-heading text-xl">{v.range} mi</div>
                                        <div className="font-heading text-xl">{v.acceleration}</div>
                                        <div className="font-heading text-2xl text-accent font-black">${v.price}/hr</div>
                                        <button 
                                            onClick={() => { setSelectedIdx(v.id - 1); setIsCompareOpen(false); }}
                                            className="px-6 py-2 bg-white/5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-accent hover:text-background transition-all"
                                        >
                                            Select
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
