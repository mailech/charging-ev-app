import { motion } from 'framer-motion';

export function RentalsHero() {
    const text = "Rent an EV. Anytime.".split(" ");

    return (
        <section className="relative h-[80vh] w-full flex flex-col justify-center overflow-hidden">
            {/* Background Gradient Flow */}
            <motion.div 
                animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0 opacity-20 bg-[length:200%_200%] bg-gradient-to-r from-background via-accent/20 to-background"
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 mt-16 max-w-5xl mx-auto">
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-6 overflow-hidden">
                    {text.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ y: '100%', opacity: 0, filter: 'blur(10px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="font-heading text-5xl md:text-7xl font-bold uppercase tracking-tight text-textPrimary leading-none"
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-lg md:text-xl text-textPrimary/70 mb-10 max-w-2xl font-sans"
                >
                    Instant electric mobility at your fingertips.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <button className="px-10 py-4 bg-accent text-background font-bold rounded-full text-lg hover:bg-accent/90 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(92,240,158,0.4)]">
                        Book Now
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
