import { motion } from 'framer-motion';

// const whyItems = [
//     {
//         slot: 'a',
//         idx: '— 01',
//         title: 'Pay only for what you use.',
//         desc: '',
//         span: 'col-span-1 md:col-span-2 row-span-1 md:row-span-2',
//         bg: 'bg-accent',
//         textColor: 'text-[#0a0a0a]',
//         idxColor: 'text-black/40',
//         bigTitle: true,
//     },
//     {
//         slot: 'b',
//         idx: '— 02',
//         title: 'Earn while you ride',
//         desc: 'Take on deliveries or rideshare shifts.',
//         span: 'col-span-1 md:col-span-2',
//         bg: 'bg-secondary/40',
//         textColor: 'text-textPrimary',
//         idxColor: 'text-textPrimary/40',
//         bigTitle: false,
//     },
//     {
//         slot: 'c',
//         idx: '— 03',
//         title: 'No ownership stress',
//         desc: 'No EMI, insurance, or maintenance.',
//         span: 'col-span-1 md:col-span-2',
//         bg: 'bg-secondary border border-white/5',
//         textColor: 'text-textPrimary',
//         idxColor: 'text-textPrimary/30',
//         bigTitle: false,
//     },
//     {
//         slot: 'd',
//         idx: '— 04',
//         title: 'Eco-friendly',
//         desc: 'Zero fuel costs. Zero emissions.',
//         span: 'col-span-1 md:col-span-2',
//         bg: 'bg-secondary/40',
//         textColor: 'text-textPrimary',
//         idxColor: 'text-textPrimary/40',
//         bigTitle: false,
//     },
//     {
//         slot: 'e',
//         idx: '— 05',
//         title: 'Fully flexible',
//         desc: 'Rent on your schedule — day or night.',
//         span: 'col-span-1 md:col-span-2',
//         bg: 'bg-secondary border border-white/5',
//         textColor: 'text-textPrimary',
//         idxColor: 'text-textPrimary/30',
//         bigTitle: false,
//     },
// ];

export function RentalWhyHourly() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8"
            >
                <h2 className="font-heading text-[clamp(36px,5vw,68px)] leading-[0.9] uppercase text-textPrimary">
                    Why hourly<br />
                    <span className="text-accent">rentals work.</span>
                </h2>
                <p className="md:max-w-[300px] text-sm text-textPrimary/60 leading-relaxed">
                    Five concrete reasons riders and earners are choosing Trio over ownership.
                </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8">
                {/* Big green tile */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7 }}
                    className="col-span-1 sm:col-span-2 md:col-span-2 row-span-1 md:row-span-2 bg-accent rounded-3xl p-10 flex flex-col justify-between min-h-[240px] md:min-h-[460px] overflow-hidden relative group"
                >
                    <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-black/45">— 01</span>
                    <h4 className="font-heading text-[clamp(32px,5vw,48px)] uppercase leading-tight text-[#0a0a0a]">
                        Pay only for what you use.
                    </h4>
                </motion.div>

                {/* Other tiles */}
                {[
                    { idx: '— 02', title: 'Earn while you ride', desc: 'Take on deliveries or rideshare shifts.', bg: 'bg-secondary/40 border border-white/8' },
                    { idx: '— 03', title: 'No ownership stress', desc: 'No EMI, insurance, or maintenance.', bg: 'bg-secondary border border-white/5' },
                    { idx: '— 04', title: 'Eco-friendly', desc: 'Zero fuel costs. Zero emissions.', bg: 'bg-secondary/40 border border-white/8' },
                    { idx: '— 05', title: 'Fully flexible', desc: 'Rent on your schedule — day or night.', bg: 'bg-secondary border border-white/5' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                        whileHover={{ y: -4 }}
                        className={`col-span-1 sm:col-span-1 md:col-span-2 rounded-3xl p-10 flex flex-col justify-between min-h-[220px] ${item.bg} transition-transform duration-300`}
                    >
                        <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-textPrimary/40">{item.idx}</span>
                        <div className="flex flex-col gap-3">
                            <h4 className="font-heading text-2xl uppercase leading-tight text-textPrimary">{item.title}</h4>
                            <p className="text-sm text-textPrimary/50 leading-relaxed">{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
