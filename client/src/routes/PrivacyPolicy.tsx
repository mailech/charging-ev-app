import { motion } from 'framer-motion';

export function PrivacyPolicy() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen bg-background pt-32 pb-24 px-6"
        >
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-2 bg-accent w-full" />

                    <div className="p-8 md:p-16">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-4">
                                Privacy Policy
                            </h1>
                            <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">
                                {/* Effective Date: October 2023 */}
                            </p>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 leading-relaxed mb-12 italic border-l-4 border-accent/20 pl-6 py-2 bg-slate-50/50 rounded-r-lg">
                                At Trio, your privacy is important to us. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.
                            </p>

                            <div className="space-y-12">
                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                        Information We Collect
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        We may collect personal identification information such as name, email address, phone number, etc., when users visit our site, register, or interact with our services.
                                    </p>
                                </section>

                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                        How We Use Your Information
                                    </h2>
                                    <div className="pl-11">
                                        <p className="text-slate-600 leading-relaxed mb-4">
                                            We use the information we collect in various ways, including to:
                                        </p>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {[
                                                'Improve our website and services',
                                                'Send periodic emails and updates',
                                                'Respond to customer service requests',
                                                'Personalize user experience'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>

                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                        Data Protection
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information.
                                    </p>
                                </section>

                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                        Sharing Your Information
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information.
                                    </p>
                                </section>

                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                        Your Consent
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        By using our site, you hereby consent to our Privacy Policy and agree to its terms.
                                    </p>
                                </section>
                            </div>
                        </div>

                        <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            <span>Trio</span>
                            <span>Official Documentation</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
