import { Truck, Users, Briefcase, Car } from 'lucide-react';

const cases = [
    { icon: Truck, title: "Logistics", desc: "Last-mile delivery fleets optimized for city operations." },
    { icon: Briefcase, title: "Corporate", desc: "Premium transport for employees and executive staff." },
    { icon: Users, title: "Ride Services", desc: "Scalable solutions for modern ride-sharing providers." },
    { icon: Car, title: "Delivery", desc: "Hyper-local courier services with zero emission goals." }
];

export function LeasingUseCases() {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <h2 className="text-3xl font-heading font-black uppercase mb-16 text-center">Built for Every <span className="text-accent">Industry</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cases.map((item, i) => (
                    <div key={i} className="p-10 rounded-[2.5rem] bg-secondary/10 border border-white/5 hover:bg-secondary/20 transition-colors">
                        <item.icon className="text-accent mb-6" size={32} />
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-sm text-textPrimary/50 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
