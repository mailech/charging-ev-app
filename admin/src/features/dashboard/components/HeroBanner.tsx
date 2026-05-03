import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
    return (
        <section className="relative mb-6 mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 px-6 py-10 shadow-sm md:px-10 md:py-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-200/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-emerald-300/30 blur-3xl" />

            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                    <h1 className="text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">
                        Powering EV adoption{' '}
                        <span className="text-emerald-600">across India.</span>
                    </h1>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                        Monitor incoming inquiries, triage customer requests, and keep your team
                        responsive — all from one console.
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                        <Link
                            to="/inquiries"
                            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
                        >
                            Open inquiries
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            to="/blog"
                            className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                            Manage blog →
                        </Link>
                    </div>
                </div>

                <div className="relative hidden h-64 w-[34rem] shrink-0 md:block lg:h-44 lg:w-[44rem]">
                    <img
                        src="/city-bg.png"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-y-0 right-56 h-full w-auto max-w-none origin-right scale-[1.5] object-right opacity-100"
                    />
                    <img
                        src="/banner-car1.png"
                        alt="Electric vehicle"
                        className="absolute inset-y-0 right-16 h-full w-auto max-w-none origin-right scale-[2.5] object-right drop-shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
}
