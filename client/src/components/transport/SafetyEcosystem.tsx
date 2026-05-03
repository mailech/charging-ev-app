import { ShieldCheck, Eye, Zap, Bell, CheckCircle } from 'lucide-react';

export function SafetyEcosystem() {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Side: Visual "Command Center" */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-accent/5 blur-3xl rounded-[3rem] group-hover:bg-accent/10 transition-colors" />
                    <div className="relative bg-secondary/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <span className="text-xs font-heading font-bold tracking-widest text-accent uppercase">Active Safety Network</span>
                            </div>
                            <span className="text-[10px] text-textPrimary/40 uppercase font-bold tracking-wider font-sans">256 Nodes Monitored</span>
                        </div>

                        {/* Interactive-looking Safety Status */}
                        <div className="space-y-6">
                            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 flex items-center justify-between group/item">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-background transition-all">
                                        <Eye size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">Live GPS & In-Cab Feed</div>
                                        <p className="text-[10px] text-textPrimary/40">Real-time telematics stream</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-accent">STABLE</div>
                                    <div className="text-[10px] text-textPrimary/30">99.9% uptime</div>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 flex items-center justify-between group/item">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-background transition-all">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">Instant SOS Network</div>
                                        <p className="text-[10px] text-textPrimary/40">Direct link to response teams</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-accent">READY</div>
                                    <div className="text-[10px] text-textPrimary/30">{"< 5s Response"}</div>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 flex items-center justify-between group/item">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-background transition-all">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">Biometric Authentication</div>
                                        <p className="text-[10px] text-textPrimary/40">Verified driver start-up</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-accent">SECURE</div>
                                    <div className="text-[10px] text-textPrimary/30">100% Compliance</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 leading-[1.1] tracking-tight">
                        Built for <span className="text-accent">safety,</span><br />
                        designed for sanity.
                    </h2>
                    <p className="text-lg text-textPrimary/60 mb-10 leading-relaxed font-sans">
                        Transportation isn't just about the vehicle — it's about the security of every employee and the peace of mind of every administrator. We've built an ecosystem that prioritizes human safety above all.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-accent">
                                <Zap size={18} />
                                <span className="font-bold text-sm uppercase tracking-wider">Sanity Driven</span>
                            </div>
                            <p className="text-sm text-textPrimary/50 leading-relaxed font-sans">
                                Silent, smooth EV rides that turn stressful commutes into productive morning routines.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-accent">
                                <CheckCircle size={18} />
                                <span className="font-bold text-sm uppercase tracking-wider">Total Transparency</span>
                            </div>
                            <p className="text-sm text-textPrimary/50 leading-relaxed font-sans">
                                Admins see exactly where every employee is, with predictive alerts for any route deviations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
