import { motion } from 'framer-motion';
import { Clock, MapPin, Shield, Calendar } from 'lucide-react';

const features = [
    {
        icon: Calendar,
        title: 'Daily Office Commute',
        desc: 'Fixed morning and evening shuttle routes covering office campuses, residential zones and transit hubs. Employees never miss a ride.',
        tag: '— Commute',
    },
    {
        icon: MapPin,
        title: 'Route Optimisation',
        desc: 'AI-powered dynamic routing adjusts in real time based on traffic, demand and vehicle availability. Every minute saved is a cost saved.',
        tag: '— Smart Routing',
    },
    {
        icon: Clock,
        title: 'Fixed Schedules',
        desc: 'Predictable, published timetables so employees can plan their day. Shift-wise scheduling for IT, BPO and manufacturing operations.',
        tag: '— Scheduling',
    },
    {
        icon: Shield,
        title: 'Safe & Reliable Rides',
        desc: 'Trained drivers, real-time tracking, SOS button, and live monitoring for every trip. Full-stack safety built into every vehicle.',
        tag: '— Safety',
    },
];

export function EmployeeTransportFeatures() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
            >
                <h2 className="font-heading text-[clamp(36px,5vw,72px)] leading-[0.9] uppercase text-textPrimary">
                    Built for<br />
                    <span className="text-accent">employee transport.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/55 leading-relaxed">
                    Every feature is designed around the needs of HR, operations and the employees themselves.
                </p>
            </motion.div>

            {/* 2×2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.6, delay: i * 0.12 }}
                        whileHover={{ y: -5 }}
                        className="group relative flex gap-6 p-8 rounded-3xl border border-white/8 bg-secondary/15 hover:border-accent/30 hover:bg-secondary/30 transition-all duration-300 overflow-hidden"
                    >
                        {/* Left accent bar */}
                        <motion.div
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                            className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent/40 origin-top rounded-r-full"
                        />

                        {/* Icon */}
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-all duration-300">
                            <f.icon size={20} />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-2">
                            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-textPrimary/35">{f.tag}</span>
                            <h3 className="font-heading text-xl uppercase leading-tight text-textPrimary">{f.title}</h3>
                            <p className="text-sm text-textPrimary/50 leading-relaxed">{f.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
