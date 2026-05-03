import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Battery, ChevronRight, X, Calendar } from 'lucide-react';

const destinations = [
    {
        id: 1,
        title: "Coastal Drive",
        type: "Weekend Trip",
        distance: "120 mi",
        range: "310 mi",
        suitability: 98,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        route: "Highway 1 > Pebble Beach > Big Sur",
        time: "2h 30m"
    },
    {
        id: 2,
        title: "Mountain Escape",
        type: "Road Trip",
        distance: "240 mi",
        range: "400 mi",
        suitability: 92,
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        route: "Skyline Pass > Bear Valley > Peaks",
        time: "4h 15m"
    },
    {
        id: 3,
        title: "Urban Explorer",
        type: "City Ride",
        distance: "45 mi",
        range: "250 mi",
        suitability: 100,
        image: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        route: "Downtown > Arts District > Bridge",
        time: "1h 10m"
    }
];

export function DestinationGrid() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const selected = destinations.find(d => d.id === selectedId);

    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Choose your <span className="text-accent">destination</span></h2>
                    <p className="text-textPrimary/60 max-w-lg">Hand-picked routes optimized for the ultimate electric vehicle experience.</p>
                </div>
                <div className="flex gap-4">
                    {['All', 'City', 'Weekend', 'Long Trip'].map(filter => (
                        <button key={filter} className="px-6 py-2 rounded-full border border-white/10 text-sm font-semibold hover:border-accent/50 transition-colors">
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((dest) => (
                    <motion.div
                        key={dest.id}
                        layoutId={`card-${dest.id}`}
                        onClick={() => setSelectedId(dest.id)}
                        whileHover={{ y: -5 }}
                        className="group relative h-[360px] rounded-[2rem] overflow-hidden cursor-pointer bg-secondary/30 border border-white/5"
                    >
                        <img src={dest.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={dest.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                        
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                            <span className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest">{dest.type}</span>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/90 text-background text-[10px] font-black uppercase">
                                <Battery size={12} /> {dest.suitability}% Suitability
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 transition-transform duration-500 group-hover:-translate-y-4">
                            <h3 className="text-3xl font-heading font-bold mb-2">{dest.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-textPrimary/60 mb-6">
                                <div className="flex items-center gap-1.5"><Navigation size={14} className="text-accent" /> {dest.distance}</div>
                                <div className="flex items-center gap-1.5"><Calendar size={14} className="text-accent" /> {dest.time}</div>
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest"
                            >
                                View Route Details <ChevronRight size={16} />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Mini Itinerary Panel */}
            <AnimatePresence>
                {selectedId && selected && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
                            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                            exit={{ opacity: 0, scale: 0.9, y: "-40%", x: "-50%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-1/2 left-1/2 w-[95%] max-w-lg bg-secondary rounded-[2rem] border border-white/10 overflow-hidden z-[101] shadow-2xl"
                        >
                            <img src={selected.image} className="w-full h-40 object-cover" alt={selected.title} />
                            <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white"><X size={16} /></button>
                            
                            <div className="p-8 text-left">
                                <h3 className="text-2xl font-heading font-bold mb-6">{selected.title} Itinerary</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 font-bold text-xs">1</div>
                                        <div>
                                            <div className="font-bold text-lg">Pick up your EV</div>
                                            <p className="text-textPrimary/60 text-sm">Downtown Charging Hub - 9:00 AM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 font-bold text-xs">2</div>
                                        <div>
                                            <div className="font-bold text-lg">Route: {selected.route}</div>
                                            <p className="text-textPrimary/60 text-sm">Smooth highways with fast-charging stops every 40 miles.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 font-bold text-xs">3</div>
                                        <div>
                                            <div className="font-bold text-lg">Arrival at {selected.title}</div>
                                            <p className="text-textPrimary/60 text-sm">Estimated arrival around 12:00 PM.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-10 p-6 rounded-2xl bg-accent/5 border border-accent/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold uppercase text-accent">Range Analysis</span>
                                        <span className="text-xs font-bold text-accent">Safe Zone</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden mb-2">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1 }} className="h-full bg-accent rounded-full" />
                                    </div>
                                    <p className="text-[10px] text-textPrimary/40">You can reach this destination with 65% battery remaining.</p>
                                </div>

                                <button className="w-full mt-8 py-4 bg-accent text-background font-black uppercase tracking-widest rounded-full hover:bg-accent/90 transition-colors">
                                    Book This Trip
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
