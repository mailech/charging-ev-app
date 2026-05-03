import { motion } from 'framer-motion';
import { Car, Zap, Building2, CheckCircle2 } from 'lucide-react';

const services = [
    {
        title: "EV Leasing",
        description: "Flexible long-term EV leasing solutions for businesses and individuals.",
        icon: Zap,
        features: ["Low upfront cost", "Maintenance included", "Scalable fleet options"]
    },
    {
        title: "EV Rentals",
        description: "On-demand electric vehicle rentals for short-term usage.",
        icon: Car,
        features: ["Hourly / daily plans", "App-based booking", "Wide vehicle availability"]
    },
    {
        title: "Corporate Transport",
        description: "Smart and sustainable fleet solutions for enterprises.",
        icon: Building2,
        features: ["Employee commute solutions", "Dedicated fleet management", "Cost optimization"]
    }
];

export function ServicesSection() {
    return (
        <section id="services" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center mb-16"
            >
                <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4 text-textPrimary">Our Mobility Services</h2>
                <p className="text-textPrimary/60 max-w-2xl mx-auto text-lg">Comprehensive electric mobility solutions tailored for every journey.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((service, i) => (
                    <motion.div
                        key={service.title}
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.2, duration: 0.6, ease: "easeOut" }}
                        whileHover={{ y: -15, scale: 1.02 }}
                        className="bg-secondary/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl group relative overflow-visible shadow-lg transition-all duration-500"
                    >
                        {/* Hover Glowing Orb Behind Card */}
                        <div className="absolute inset-0 bg-accent/20 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-3xl pointer-events-none" />

                        {/* Internal Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                        
                        <div className="w-14 h-14 rounded-2xl bg-secondary border border-white/5 flex items-center justify-center mb-6 text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-background transition-all duration-500 shadow-md">
                            <service.icon size={28} />
                        </div>
                        
                        <h3 className="text-2xl font-heading font-bold uppercase tracking-tight mb-3 text-textPrimary group-hover:text-accent transition-colors duration-300">{service.title}</h3>
                        <p className="text-textPrimary/70 mb-8 font-sans">{service.description}</p>
                        
                        <ul className="space-y-3">
                            {service.features.map((feature, j) => (
                                <li key={j} className="flex items-start gap-3 text-sm text-textPrimary/80">
                                    <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
