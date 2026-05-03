import { motion } from 'framer-motion';

export function TermsConditions() {
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
                                Terms & Conditions
                            </h1>
                            <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">
                                {/* Last Updated: October 2023 */}
                            </p>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 leading-relaxed mb-12 italic border-l-4 border-accent/20 pl-6 py-2 bg-slate-50/50 rounded-r-lg">
                                Welcome to Trio. These terms and conditions outline the rules and regulations for the use of our website and services.
                            </p>

                            <div className="space-y-12">
                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                        Acceptance of Terms
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        By accessing this website we assume you accept these terms and conditions. Do not continue to use Trio if you do not agree to all the terms stated on this page.
                                    </p>
                                </section>

                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                        Intellectual Property Rights
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        Other than the content you own, under these Terms, Trio and/or its licensors own all the intellectual property rights and materials contained in this website.
                                    </p>
                                </section>

                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">3</span>
                                        Restrictions
                                    </h2>
                                    <div className="pl-11">
                                        <p className="text-slate-600 leading-relaxed mb-4">
                                            You are specifically restricted from all of the following:
                                        </p>
                                        <ul className="grid grid-cols-1 gap-3">
                                            {[
                                                'Publishing any website material in any other media',
                                                'Selling, sublicensing and/or commercializing any website material',
                                                'Publicly performing and/or showing any website material',
                                                'Using this website in any way that is or may be damaging to this website'
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
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                        Limitation of Liability
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        In no event shall Trio, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website.
                                    </p>
                                </section>

                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">5</span>
                                        Governing Law
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        This Agreement shall be governed by and construed in accordance with the laws of your location without regard to its conflict of law provisions.
                                    </p>
                                </section>
                            </div>
                        </div>

                        <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            <span>Trio</span>
                            <span>Service Agreement</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
