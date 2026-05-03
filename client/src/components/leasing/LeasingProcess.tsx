const steps = [
    { title: "Consultation", desc: "Fleet audit and ROI analysis." },
    { title: "Selection", desc: "Custom configuration of EVs." },
    { title: "Deployment", desc: "Seamless onboarding and delivery." },
    { title: "Support", desc: "24/7 maintenance and tech support." }
];

export function LeasingProcess() {
    return (
        <section className="py-24 w-full border-t border-white/5">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
                <h2 className="text-3xl font-heading font-black uppercase mb-16 text-center">
                    Seamless <span className="text-accent">Onboarding</span>
                </h2>
                <div className="relative flex flex-col md:flex-row items-start gap-8 md:gap-0">
                    {/* Connecting line behind circles */}
                    <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px bg-white/10 z-0" />
                    {steps.map((step, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10 px-4">
                            <div className="w-10 h-10 rounded-full border border-accent flex items-center justify-center text-accent font-black text-xs mb-6 bg-background">
                                {i + 1}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                            <p className="text-xs text-textPrimary/40 leading-relaxed max-w-[160px]">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
