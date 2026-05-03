import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="bg-secondary/20 border-t border-secondary/50 pt-16 pb-8 px-6 md:px-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">

                {/* Column 1: Logo & Slogan */}
                <div className="lg:col-span-1">
                    <div className="mb-4">
                        <img src="/logo.png" alt="Trio Logo" className="h-10 w-auto object-contain scale-[2] origin-left" />
                    </div>
                    <p className="text-accent font-bold text-sm mb-4">Drive Smart. Go Green.</p>
                    <p className="text-textPrimary/50 text-xs leading-relaxed max-w-[220px]">
                        TRIO EV is Kolkata's premier electric mobility company, delivering clean, green, and smart transportation solutions for businesses and individuals.
                    </p>
                </div>

                {/* Column 2: Categories */}
                <div>
                    <h4 className="font-heading font-bold text-[10px] uppercase tracking-[0.2em] mb-6 text-textPrimary">Categories</h4>
                    <ul className="space-y-3 text-sm text-textPrimary/60 font-medium">
                        <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
                        <li><Link to="/leasing" className="hover:text-accent transition-colors">Lease</Link></li>
                        <li><Link to="/rentals" className="hover:text-accent transition-colors">Rent</Link></li>
                        <li><Link to="/transport" className="hover:text-accent transition-colors">Transportation</Link></li>
                        <li><Link to="/about" className="hover:text-accent transition-colors">About us</Link></li>
                    </ul>
                </div>

                {/* Column 3: Policies */}
                <div>
                    <h4 className="font-heading font-bold text-[10px] uppercase tracking-[0.2em] mb-6 text-textPrimary">Policies</h4>
                    <ul className="space-y-3 text-sm text-textPrimary/60 font-medium">
                        <li><Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms-conditions" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
                        <li><Link to="/refund-policy" className="hover:text-accent transition-colors">Refund Policy</Link></li>
                    </ul>
                </div>

                {/* Column 4: Registered Address */}
                <div>
                    <h4 className="font-heading font-bold text-[10px] uppercase tracking-[0.2em] mb-6 text-accent">Registered Address</h4>
                    <div className="space-y-4 text-[11px] text-textPrimary/60 leading-relaxed">
                        <div className="flex gap-3">
                            <MapPin size={13} className="text-accent shrink-0 mt-0.5" />
                            <p>26E, Raipur Mondal Para Road, P.S. Netaji Nagar, Naktala, Kolkata – 700047, West Bengal, India</p>
                        </div>
                        <div className="flex gap-3">
                            <Phone size={13} className="text-accent shrink-0 mt-0.5" />
                            <p>+91 62918 42407</p>
                        </div>
                        <div className="flex gap-3">
                            <Mail size={13} className="text-accent shrink-0 mt-0.5" />
                            <p>info@trio-ev.com</p>
                        </div>
                    </div>
                </div>

                {/* Column 5: Office Address */}
                <div>
                    <h4 className="font-heading font-bold text-[10px] uppercase tracking-[0.2em] mb-6 text-accent">Office Address</h4>
                    <div className="space-y-4 text-[11px] text-textPrimary/60 leading-relaxed">
                        <div className="flex gap-3">
                            <MapPin size={13} className="text-accent shrink-0 mt-0.5" />
                            <p>Shilpota More, Mahammadpur Road (Opposite Curiosity), New Town, Kolkata – 700135, West Bengal, India</p>
                        </div>
                        <button className="w-full py-3.5 bg-accent text-background font-bold rounded-lg hover:scale-[1.02] transition-all text-[10px] uppercase tracking-widest mt-2 shadow-[0_10px_20px_rgba(92,240,158,0.1)]">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto pt-8 border-t border-secondary/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-textPrimary/30">
                <p>&copy; {new Date().getFullYear()} Trio Inc. All rights reserved.</p>
                <div className="flex gap-6 italic opacity-50">
                    <span>Clean. Green. Smart.</span>
                </div>
            </div>
        </footer>
    );
}
