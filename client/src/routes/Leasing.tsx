import { motion } from 'framer-motion';
import { LeasingHero } from '../components/leasing/LeasingHero';
import { ValuePropSection } from '../components/leasing/ValuePropSection';
import { RevenueEngine } from '../components/leasing/RevenueEngine';
import { InvestorBenefits } from '../components/leasing/InvestorBenefits';
import { EarningsSimulator } from '../components/leasing/EarningsSimulator';
import { FleetGrowthVisual } from '../components/leasing/FleetGrowthVisual';
import { FleetUseCases } from '../components/leasing/FleetUseCases';

export function Leasing() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full min-h-screen bg-background"
        >
            {/* Hero — Scale Your Fleet */}
            <LeasingHero />

            {/* Value Props + Efficiency Gap */}
            <ValuePropSection />


            {/* Revenue Engine — Capital→Fleet→Ops→Revenue→Returns */}
            <RevenueEngine />

            {/* Investor Benefits — 4 premium cards */}
            <InvestorBenefits />


            {/* Live Earnings Simulator */}
            <EarningsSimulator />

            {/* Fleet Growth Visual */}
            <FleetGrowthVisual />

            {/* How the Fleet is Used (Corporate, Commute, Mobility) */}
            <FleetUseCases />

            {/* Final CTA */}
            <div className="py-32 px-6 text-center border-t border-white/5 bg-secondary/5">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8 tracking-tight">
                    Ready to <span className="text-accent">scale?</span>
                </h2>
                <button className="px-12 py-5 bg-accent text-background font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(92,240,158,0.2)] text-xs">
                    Get a Custom Plan
                </button>
            </div>
        </motion.div>
    );
}
