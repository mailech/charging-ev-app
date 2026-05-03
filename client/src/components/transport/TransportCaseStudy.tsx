export function TransportCaseStudy() {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="p-12 md:p-20 rounded-[4rem] bg-accent text-background flex flex-col lg:flex-row gap-16 items-center">
                <div className="flex-1 space-y-8 text-center lg:text-left">
                    <h2 className="text-4xl md:text-5xl font-heading leading-tight uppercase">The Impact of <br />EV Transition.</h2>
                    <p className="text-background/80 text-sm md:text-base max-w-md">How a global tech giant reduced its carbon footprint and commute costs by 40% in just 12 months.</p>
                </div>
                <div className="flex-1 w-full grid grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-background/5 border border-background/10">
                        <div className="text-xs uppercase font-bold tracking-widest opacity-60 mb-2 text-background">Before</div>
                        <div className="text-3xl font-bold">$1.2M</div>
                        <div className="text-[10px] font-medium opacity-60 uppercase text-background">Annual Cost</div>
                    </div>
                    <div className="p-8 rounded-3xl bg-background/20 border border-background/10">
                        <div className="text-xs uppercase font-bold tracking-widest opacity-60 mb-2 text-background">After</div>
                        <div className="text-3xl font-bold">$720K</div>
                        <div className="text-[10px] font-medium opacity-60 uppercase text-background">Annual Cost</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
