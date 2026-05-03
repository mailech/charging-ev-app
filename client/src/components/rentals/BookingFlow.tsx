import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Car } from 'lucide-react';

export function BookingFlow() {
    const [step, setStep] = useState(1);
    const steps = ['Select', 'Time', 'Confirm'];

    return (
        <section className="py-24 px-6 max-w-4xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12 text-center text-textPrimary">Quick Booking</h2>
            
            {/* Progress Bar */}
            <div className="flex justify-between items-center mb-12 relative max-w-lg mx-auto">
                <div className="absolute left-0 right-0 top-5 -translate-y-1/2 h-1 bg-white/10 z-0" />
                <motion.div 
                    className="absolute left-0 top-5 -translate-y-1/2 h-1 bg-accent z-0"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step - 1) / 2) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
                
                {steps.map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                        <motion.div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= i + 1 ? 'bg-accent text-background shadow-[0_0_15px_#5CF09E]' : 'bg-secondary text-textPrimary/50 border border-white/10'}`}
                        >
                            {i + 1}
                        </motion.div>
                        <span className={`text-xs uppercase tracking-wider font-semibold ${step >= i + 1 ? 'text-accent' : 'text-textPrimary/50'}`}>{s}</span>
                    </div>
                ))}
            </div>

            {/* Steps Content */}
            <div className="bg-secondary/20 border border-white/5 rounded-3xl p-8 min-h-[350px] flex flex-col justify-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1" 
                            initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }} 
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                            exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }} 
                            className="flex flex-col items-center text-center"
                        >
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse" />
                                <Car size={64} className="text-accent relative z-10" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">Select your EV</h3>
                            <p className="text-textPrimary/60 mb-8 max-w-xs">Choose from our premium fleet of smart electric vehicles.</p>
                            <button onClick={() => setStep(2)} className="px-10 py-4 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)]">Continue</button>
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div 
                            key="step2" 
                            initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }} 
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                            exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }} 
                            className="flex flex-col items-center text-center"
                        >
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse" />
                                <Clock size={64} className="text-accent relative z-10" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">Pick a Time</h3>
                            <p className="text-textPrimary/60 mb-8 max-w-xs">Select your pickup and drop-off schedule.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-full font-medium transition-colors">Back</button>
                                <button onClick={() => setStep(3)} className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-all hover:scale-105 active:scale-95">Continue</button>
                            </div>
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div 
                            key="step3" 
                            initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }} 
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
                            exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }} 
                            className="flex flex-col items-center text-center"
                        >
                            <div className="relative mb-6">
                                <motion.div 
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.5, opacity: 0.2 }}
                                    className="absolute inset-0 bg-accent blur-3xl rounded-full"
                                />
                                <CheckCircle2 size={64} className="text-accent relative z-10" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2">Ready to Go!</h3>
                            <p className="text-textPrimary/60 mb-8 max-w-xs">Your vehicle is reserved and waiting for you.</p>
                            <button onClick={() => setStep(1)} className="px-10 py-4 bg-accent text-background rounded-full font-bold hover:bg-accent/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(92,240,158,0.4)]">Book Another</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
