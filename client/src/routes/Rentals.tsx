import { motion } from 'framer-motion';
import { RentalsHeroBanner } from '../components/rentals/RentalsHeroBanner';
import { DestinationGrid } from '../components/rentals/travel-mode/DestinationGrid';
import { RentalPlans } from '../components/rentals/RentalPlans';
import { RentalAudience } from '../components/rentals/RentalAudience';
import { RentalHowItWorks } from '../components/rentals/RentalHowItWorks';
import { RentalWhyHourly } from '../components/rentals/RentalWhyHourly';
import { RentalCTA } from '../components/rentals/RentalCTA';

export function Rentals() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full min-h-screen bg-background"
        >
            {/* Hero banner: "Rent EVs by the hour" + poster stats + triplet */}
            <RentalsHeroBanner />

            {/* KEEP: "Choose Your Destination" section (from picture) */}
            <DestinationGrid />

            {/* Plans: Pick a plan that fits your day */}
            <RentalPlans />

            {/* Who it's for */}
            <RentalAudience />

            {/* How it works — 5 steps */}
            <RentalHowItWorks />

            {/* Why hourly rentals work — bento grid */}
            <RentalWhyHourly />

            {/* CTA */}
            <RentalCTA />
        </motion.div>
    );
}
