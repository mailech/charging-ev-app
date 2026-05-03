import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Clock, ArrowRight, Check, MapPin } from 'lucide-react';

export function FloatingBookingPanel() {
    const [step, setStep] = useState(1);

    return (
        <section className="py-24 px-6 max-w-4xl mx-auto w-full">
            <div className="bg-secondary/30 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        className="h-full bg-accent"
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <h2 className="text-3xl font-heading font-bold uppercase">Instant <span className="text-accent">Booking</span></h2>
                    <div className="flex items-center gap-4">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step >= s ? 'bg-accent text-background border-accent' : 'border-white/10 text-white/20'}`}>
                                {step > s ? <Check size={14} /> : s}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="min-h-[250px] flex items-center">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-textPrimary/40 ml-4">Destination</label>
                                    <div className="relative">
                                        <input type="text" placeholder="Where are you going?" className="w-full h-16 bg-black/40 rounded-2xl border border-white/5 px-6 focus:border-accent/50 outline-none transition-colors" />
                                        <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 text-textPrimary/20" size={20} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-textPrimary/40 ml-4">Travel Date</label>
                                    <div className="relative">
                                        <input type="text" placeholder="Pick a date" className="w-full h-16 bg-black/40 rounded-2xl border border-white/5 px-6 focus:border-accent/50 outline-none transition-colors" />
                                        <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-textPrimary/20" size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-textPrimary/40 ml-4">Duration</label>
                                    <div className="relative">
                                        <select className="w-full h-16 bg-black/40 rounded-2xl border border-white/5 px-6 focus:border-accent/50 outline-none transition-colors appearance-none">
                                            <option>1 Day</option>
                                            <option>Weekend</option>
                                            <option>1 Week</option>
                                        </select>
                                        <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-textPrimary/20" size={20} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-widest text-textPrimary/40 ml-4">Passengers</label>
                                    <div className="relative">
                                        <select className="w-full h-16 bg-black/40 rounded-2xl border border-white/5 px-6 focus:border-accent/50 outline-none transition-colors appearance-none">
                                            <option>1-2 People</option>
                                            <option>3-4 People</option>
                                            <option>5+ People</option>
                                        </select>
                                        <Users className="absolute right-6 top-1/2 -translate-y-1/2 text-textPrimary/20" size={20} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full text-center py-8"
                            >
                                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-accent mx-auto mb-6 shadow-[0_0_30px_rgba(92,240,158,0.2)]">
                                    <Check size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">You're All Set!</h3>
                                <p className="text-textPrimary/60 mb-8">Best Match: Trio Sport selected for your Mountain Escape.</p>
                                <button onClick={() => setStep(1)} className="px-10 py-4 bg-accent text-background font-black uppercase tracking-widest rounded-full">Download Ticket</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {step < 3 && (
                    <div className="mt-12 flex justify-end">
                        <button 
                            onClick={() => setStep(prev => prev + 1)}
                            className="px-10 py-5 bg-accent text-background font-black uppercase tracking-widest rounded-full flex items-center gap-3 hover:bg-accent/90 transition-all hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(92,240,158,0.2)]"
                        >
                            Next Step <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
