import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function RentalCTA() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8 }}
                className="relative bg-accent rounded-[2rem] p-10 md:p-16 overflow-hidden"
            >
                {/* Background decoration — crosshair */}
                <svg
                    className="absolute right-6 top-6 w-28 h-28 md:w-40 md:h-40 opacity-25 text-[#0a0a0a] pointer-events-none"
                    viewBox="0 0 200 200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="100" cy="100" r="80" />
                    <circle cx="100" cy="100" r="56" />
                    <circle cx="100" cy="100" r="32" />
                    <line x1="20"  y1="100" x2="180" y2="100" />
                    <line x1="100" y1="20"  x2="100" y2="180" />
                </svg>

                {/* Two-column layout */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
                    {/* Headline — reduced */}
                    <h3 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] uppercase text-[#0a0a0a] max-w-[600px]">
                        Ready to ride?{' '}
                        <span className="text-black/40">
                            Book an EV now &amp; get affordable transport whenever you need it.
                        </span>
                    </h3>

                    {/* CTA block */}
                    <div className="flex flex-col items-start gap-4 shrink-0">
                        <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-black/50">
                            — Available now · 3 metros
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-3 bg-[#0a0a0a] text-white px-7 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-[#0a0a0a] transition-all duration-300 group"
                        >
                            Book your EV
                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
