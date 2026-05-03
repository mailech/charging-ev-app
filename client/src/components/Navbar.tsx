import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    label: string;
    href: string;
    type: 'link' | 'anchor';
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Rentals', href: '/rentals', type: 'link' },
    { label: 'Lease', href: '/leasing', type: 'link' },
    { label: 'Transportation', href: '/transport', type: 'link' },
    { label: 'Blog', href: '/blog', type: 'link' },
    { label: 'About us', href: '/about', type: 'link' },
];

export function Navbar() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 backdrop-blur-md bg-background/50 border-b border-secondary/50"
            >
                <Link to="/" className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="Trio Logo"
                        className="h-10 md:h-12 w-auto object-contain scale-[2] md:scale-[2.5] origin-left"
                    />
                </Link>

                <nav className="hidden md:flex gap-8 text-sm font-medium text-textPrimary/80">
                    {NAV_ITEMS.map((item) =>
                        item.type === 'link' ? (
                            <Link
                                key={item.href}
                                to={item.href}
                                className="hover:text-accent transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <a
                                key={item.href}
                                href={item.href}
                                className="hover:text-accent transition-colors"
                            >
                                {item.label}
                            </a>
                        ),
                    )}
                </nav>

                <Link
                    to="/contact"
                    className="hidden md:inline-flex items-center gap-2 px-5 py-2 bg-accent text-background font-semibold rounded-full hover:bg-accent/90 transition-colors"
                >
                    Contact Sales
                </Link>

                <button
                    type="button"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-secondary/60 text-textPrimary backdrop-blur-md transition hover:border-accent/40 hover:text-accent"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {open ? (
                            <motion.span
                                key="x"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                            >
                                <X className="h-5 w-5" />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="m"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                            >
                                <Menu className="h-5 w-5" />
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </motion.header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="mobile-nav"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 md:hidden"
                    >
                        <div
                            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                            onClick={() => setOpen(false)}
                        />

                        <motion.nav
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="relative z-10 mx-4 mt-24 overflow-hidden rounded-2xl border border-white/10 bg-secondary/70 backdrop-blur-xl shadow-2xl"
                        >
                            <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
                            <ul className="relative divide-y divide-white/5">
                                {NAV_ITEMS.map((item, idx) => {
                                    const Inner = (
                                        <span className="flex items-center justify-between px-5 py-4 text-base font-medium text-textPrimary transition-colors hover:bg-white/5 hover:text-accent">
                                            <span>{item.label}</span>
                                            <ArrowRight className="h-4 w-4 text-textPrimary/40 transition group-hover:translate-x-0.5 group-hover:text-accent" />
                                        </span>
                                    );
                                    return (
                                        <motion.li
                                            key={item.href}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.05 + idx * 0.04, duration: 0.2 }}
                                            className="group"
                                        >
                                            {item.type === 'link' ? (
                                                <Link to={item.href} className="block">
                                                    {Inner}
                                                </Link>
                                            ) : (
                                                <a href={item.href} className="block">
                                                    {Inner}
                                                </a>
                                            )}
                                        </motion.li>
                                    );
                                })}
                            </ul>

                            <motion.div
                                initial={{ y: 16, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.05 + NAV_ITEMS.length * 0.04, duration: 0.2 }}
                                className="relative border-t border-white/10 p-4"
                            >
                                <Link
                                    to="/contact"
                                    className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent/90"
                                >
                                    Contact Sales
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
