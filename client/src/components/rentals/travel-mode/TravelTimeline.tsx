import { motion } from 'framer-motion';
import { MapPin, Car, CreditCard, PlayCircle } from 'lucide-react';

const steps = [
    { icon: MapPin, title: 'Destination', desc: 'Pick where you want to go.' },
    { icon: Car, title: 'Choose EV', desc: 'Select the perfect ride.' },
    { icon: CreditCard, title: 'Instant Book', desc: 'Reserve in 60 seconds.' },
    { icon: PlayCircle, title: 'Start Trip', desc: 'Unlock with app and drive.' },
];

export function TravelTimeline() {
    return (
        <section className="py-24 px-6 md:px-12 w-full max-w-7xl mx-auto">
            <h2 className="text-4xl font-heading font-black uppercase mb-20 text-center">How It <span className="text-accent">Works</span></h2>
            
            <div className="relative flex flex-col md:flex-row gap-8 justify-between items-start">
                <div className="absolute top-10 left-0 w-full h-px bg-white/5 hidden md:block" />
                
                {steps.map((step, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        viewport={{ once: true }}
                        className="relative z-10 flex-1 flex flex-col items-center text-center p-8 rounded-[2rem] bg-secondary/20 border border-white/5 hover:border-accent/30 transition-colors group"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-accent/10 transition-colors">
                            <step.icon className="text-textPrimary group-hover:text-accent transition-colors" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                        <p className="text-sm text-textPrimary/50 leading-relaxed">{step.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
