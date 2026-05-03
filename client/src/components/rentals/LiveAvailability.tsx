import { motion } from 'framer-motion';

export function LiveAvailability() {
    return (
        <section className="py-24 px-6 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-textPrimary">Live Availability</h2>
                <p className="text-xl text-textPrimary/60 leading-relaxed">See vehicles moving in real-time. Our dynamic map shows exactly where your next ride is.</p>
                <div className="flex gap-6">
                    <div className="flex items-center gap-3 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#5CF09E]" /> Available</div>
                    <div className="flex items-center gap-3 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-textPrimary/30" /> In Use</div>
                </div>
            </div>
            
            <div className="flex-1 w-full relative h-[500px] bg-secondary/20 border border-white/10 rounded-[2rem] overflow-hidden flex items-center justify-center">
                <iframe 
                    src="/IndiaMapAnimation.html" 
                    title="India Live Availability" 
                    className="absolute inset-0 w-full h-full border-none outline-none block opacity-80"
                    scrolling="no"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />
                
                {/* Simulated Real-time Status Overlay */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 shadow-lg"
                    >
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#5CF09E]" />
                        <span className="text-xs font-bold text-textPrimary">245 Available Now</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
