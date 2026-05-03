import { motion } from 'framer-motion';
import { TreePine, Zap, Users, ShieldCheck, TrendingUp } from 'lucide-react';

export function About() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-background min-h-screen"
        >
            {/* SECTION 1: HERO */}
            <section className="relative pt-40 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-heading font-bold text-textPrimary mb-6 tracking-tight"
                    >
                        Our Commitment to <span className="text-accent">Communities</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-textPrimary/60 max-w-3xl mx-auto font-sans leading-relaxed"
                    >
                        Empowering local communities through clean technology and sustainable practices.
                    </motion.p>
                </div>
            </section>

            {/* SECTION 2: VISION & MISSION */}
            <section className="py-24 px-6 bg-secondary/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl"
                        >
                            <img
                                src="/sustainability.png"
                                alt="Sustainability"
                                className="w-full h-[500px] object-cover"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-4xl font-heading font-bold text-textPrimary mb-6 flex items-center gap-4">
                                    <div className="w-12 h-1 bg-accent rounded-full" />
                                    Our Vision
                                </h2>
                                <p className="text-lg text-textPrimary/50 leading-relaxed font-sans">
                                    Trio envisions a world where every ride and every delivery contributes to a healthier planet. Our vision is to eliminate pollution and carbon emissions by creating a fully electric ecosystem for both personal mobility and logistics. We aspire to lead the transformation of the automotive and logistics industries, making sustainable, smart, and connected transportation accessible to all. By combining innovation, responsibility, and care for nature, we aim to build a future where progress and the environment move together in harmony.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 items-center flex-row-reverse">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <h2 className="text-4xl font-heading font-bold text-textPrimary mb-6 flex items-center gap-4">
                                <div className="w-12 h-1 bg-accent rounded-full" />
                                Our Mission
                            </h2>
                            <p className="text-lg text-textPrimary/50 leading-relaxed font-sans mb-8">
                                At Trio, our mission is to redefine the way people move and businesses operate. We are committed to:
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Developing electric cars that are eco-friendly, stylish, reliable, and affordable for everyday use.",
                                    "Revolutionizing logistics with 100% electric fleets that reduce congestion, minimize noise, and lower emissions.",
                                    "Supporting sustainability by adopting green practices in design, manufacturing, and operations for healthier cities.",
                                    "Driving innovation through smart technology, renewable energy integration, and continuous performance improvements.",
                                    "Empowering communities by raising awareness about eco-friendly mobility and promoting nature-first choices.",
                                    "Building a connected future where technology, people, and the environment coexist seamlessly."
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 text-textPrimary/70 group">
                                        <div className="mt-1.5 shrink-0 w-5 h-5 rounded-full border border-accent/30 flex items-center justify-center group-hover:bg-accent transition-colors">
                                            <ShieldCheck size={12} className="text-accent group-hover:text-background" />
                                        </div>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-8 text-textPrimary/50 font-sans italic border-l-2 border-accent/30 pl-6 py-2">
                                Our purpose is clear: to protect nature, reduce pollution, and create a sustainable legacy where clean mobility becomes the heartbeat of modern living.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl"
                        >
                            <img
                                src="/energy.png"
                                alt="Energy"
                                className="w-full h-[600px] object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: OUR STORY */}
            <section className="py-32 px-6 bg-secondary/10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-heading font-bold text-textPrimary mb-4">Our <span className="text-accent">Story</span></h2>
                        <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
                    </motion.div>

                    <div className="space-y-8 text-lg text-textPrimary/60 font-sans leading-[1.8]">
                        <p>
                            Our journey began in the world of IT and telecom, where one of our founders worked on designing revenue models for Vodafone across Greece, Albania, and the UK. While building systems that directly impacted millions of customers, a realization struck — technology was advancing, but the hidden cost was environmental damage caused by emissions, vibrations, and unsustainable operations.
                        </p>
                        <p>
                            With a background in Computer Science and years of experience in telecom, the seed of an idea was planted: how can technology and business models be re-imagined to serve both people and the planet? This vision led to an entrepreneurial journey beginning in 2018, exploring eco-friendly solutions and sustainability-driven startups.
                        </p>
                        <p>
                            In 2022, the concept of clean transportation took shape. Starting small in Pune with just two leased vehicles, we tested the market, even driving the cars ourselves to understand a driver's real challenges. Those early months gave us invaluable insights into operations, payment irregularities, and the struggles drivers face daily. From there, we expanded to Kolkata, scaling our fleet and building strong foundations.
                        </p>

                        <div className="py-12 text-center">
                            <h3 className="text-3xl md:text-4xl font-heading font-bold text-accent tracking-tight leading-tight italic">
                                "We're not just offering transport — we're driving a transition to greener, smarter mobility for all."
                            </h3>
                        </div>

                        <p>
                            In July 2024, after two years of groundwork, we officially registered Trio Evolution India Pvt. Ltd. — named to represent the three founders who came together from IT, transportation, and mechanical engineering backgrounds. Though one co-founder eventually moved on, the vision remained strong: to revolutionize mobility through sustainability.
                        </p>
                        <p>
                            We shifted from B2C to a B2B model, partnering with Mahindra Logistics to deploy EV fleets for large enterprises. Soon after, we began serving industry leaders like TCS, Capgemini, Cognizant, KPMG, and Indigo — expanding our fleet and proving that sustainable transport can meet the toughest corporate demands.
                        </p>
                        <p>
                            Recognizing that fleet growth is incomplete without infrastructure, we took the bold step of becoming Kolkata's first fleet owner to build a private EV charging hub in New Town, right at the heart of the city's IT corridor. This hub, set to be completed by August 2025, not only powers our fleet but also supports smaller operators, ensuring accessibility and affordability for all.
                        </p>
                        <p>
                            Today, our services span electric vehicle leasing, fleet management, smart charging infrastructure, and employee transportation solutions. From humble beginnings to city-wide impact, our story is proof that a vision backed by persistence can shape the future of mobility. As we move forward, our commitment remains the same: to empower businesses and communities to progress without compromising our planet. This is our story — and we're just getting started.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 4: LEADERSHIP TEAM */}
            <section className="py-32 px-6 bg-background">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-heading font-bold text-textPrimary mb-4">Leadership <span className="text-accent">Team</span></h2>
                        <p className="text-textPrimary/50 text-xl font-sans max-w-2xl mx-auto">
                            The minds behind our mission to transform transportation through clean energy and community-driven innovation.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Subhash Kumar",
                                role: "Founder & CEO",
                                bio: "B.Tech in Computer Science. Former employee at Vodafone. Currently leading Trio as Founder & CEO, driving innovation and sustainable solutions.",
                                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                            },
                            {
                                name: "Somnath Das",
                                role: "Founder & COO",
                                bio: "M.A. graduate. Former employee at Uber. Now serving as Founder & COO of Trio, ensuring smooth operations and impactful strategies.",
                                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                            }
                        ].map((leader, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-secondary/20 border border-white/5 rounded-[2.5rem] p-10 text-center hover:border-accent/40 transition-all duration-500 group"
                            >
                                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-8 border-4 border-accent/20 group-hover:border-accent/50 transition-all">
                                    <img src={leader.img} alt={leader.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl font-heading font-bold text-textPrimary mb-2">{leader.name}</h3>
                                <p className="text-accent font-heading font-bold text-sm uppercase tracking-widest mb-6">{leader.role}</p>
                                <p className="text-textPrimary/50 font-sans leading-relaxed">{leader.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: OUR IMPACT */}
            <section className="py-32 px-6 bg-secondary/5">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-heading font-bold text-textPrimary mb-4">Our <span className="text-accent">Impact</span></h2>
                        <p className="text-textPrimary/50 text-xl font-sans max-w-2xl mx-auto">
                            We are dedicated to accelerating a clean, equitable future by integrating technology and sustainability in every journey.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            {
                                icon: TrendingUp,
                                title: "EV-First Fleet",
                                desc: "Deploying electric vehicles and hybrid transport solutions across all regions by 2026."
                            },
                            {
                                icon: TreePine,
                                title: "Commitment to Nature",
                                desc: "Investing in reforestation and renewable projects to exceed net-zero impact by 2030."
                            },
                            {
                                icon: Zap,
                                title: "Sustainable Smart Roads",
                                desc: "Implementing road-based energy harvesting to power streetlights and EV charging stations."
                            },
                            {
                                icon: Users,
                                title: "Innovation & Inclusion",
                                desc: "Fostering R&D and skill-building programs to empower rural communities in clean tech adoption."
                            }
                        ].map((impact, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-background border-t-4 border-accent p-8 rounded-2xl shadow-xl hover:translate-y-[-8px] transition-transform duration-300"
                            >
                                <div className="text-accent mb-6">
                                    <impact.icon size={40} />
                                </div>
                                <h4 className="text-xl font-heading font-bold text-textPrimary mb-4">{impact.title}</h4>
                                <p className="text-textPrimary/50 text-sm font-sans leading-relaxed">{impact.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 6: CONTACT / CTA */}
            <section className="py-32 px-6 bg-background relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-heading font-bold text-textPrimary mb-4 tracking-tight">Get in <span className="text-accent">Touch</span> with Us</h2>
                        <p className="text-textPrimary/60 text-xl font-sans mb-8">
                            Have questions, suggestions, or collaboration ideas? Reach out and our team will get back to you promptly.
                        </p>
                        <h3 className="text-3xl font-heading font-bold text-accent mb-4 tracking-tight">Partner With Us for a Greener Future</h3>
                        <p className="text-textPrimary/40 text-lg font-sans">
                            Join hands with TRIO EV and be part of the green mobility revolution.
                        </p>
                    </div>

                    <form className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2 text-center md:text-left">
                            <label className="text-sm font-sans font-bold text-textPrimary/80 uppercase tracking-widest block text-center">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full bg-secondary/30 border border-white/10 rounded-2xl px-6 py-4 text-textPrimary focus:border-accent outline-none transition-colors text-center"
                            />
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <label className="text-sm font-sans font-bold text-textPrimary/80 uppercase tracking-widest block text-center">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-secondary/30 border border-white/10 rounded-2xl px-6 py-4 text-textPrimary focus:border-accent outline-none transition-colors text-center"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-center mt-8">
                            <button className="px-12 py-5 bg-accent text-background font-sans font-bold text-lg rounded-2xl hover:bg-accent/90 hover:scale-[1.02] transition-all duration-300 shadow-[0_10px_30px_rgba(92,240,158,0.2)]">
                                Book Now
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </motion.div>
    );
}
