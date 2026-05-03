import { motion } from 'framer-motion';

export function RefundPolicy() {
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
                                Refund Policy
                            </h1>
                            <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">
                                {/* Policy Revision: 2.1 */}
                            </p>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 leading-relaxed mb-12 italic border-l-4 border-accent/20 pl-6 py-2 bg-slate-50/50 rounded-r-lg">
                                At Trio, we strive to ensure satisfaction with our services. If you're not entirely satisfied, we're here to help with a fair refund policy.
                            </p>

                            <div className="space-y-12">
                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">1</span>
                                        Eligibility for Refunds
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        To be eligible for a refund, your request must be made within 7 days of service purchase and should include a valid reason for the request.
                                    </p>
                                </section>

                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">2</span>
                                        Non-refundable Cases
                                    </h2>
                                    <div className="pl-11">
                                        <p className="text-slate-600 leading-relaxed mb-4">
                                            The following cases are generally ineligible for a refund:
                                        </p>
                                        <ul className="grid grid-cols-1 gap-3">
                                            {[
                                                'Service already delivered and accepted by user',
                                                'Customized or personalized fleet solutions',
                                                'Issues arising from misuse or third-party integrations'
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
                                        Refund Process
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        Once your request is approved, refunds will be processed to the original method of payment within 5–7 business days.
                                    </p>
                                </section>

                                <section className="relative">
                                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">4</span>
                                        Contact for Refunds
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed pl-11">
                                        If you have any questions or want to request a refund, please contact us at <span className="font-bold text-slate-900">support@triowebsite.com</span>.
                                    </p>
                                </section>
                            </div>
                        </div>

                        <div className="mt-20 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            <span>Trio</span>
                            <span>Billing & Refunds</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
