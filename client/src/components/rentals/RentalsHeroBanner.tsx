import { motion } from 'framer-motion';

export function RentalsHeroBanner() {
    return (
        <section className="relative w-full pt-28 pb-0 px-6 md:px-12 max-w-7xl mx-auto">

            {/* Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 mb-8 font-sans text-[10px] uppercase tracking-[0.18em] text-textPrimary/40"
            >
                <span className="hover:text-accent transition-colors cursor-pointer">Trio</span>
                <span className="opacity-40">/</span>
                <span className="text-textPrimary">Rentals</span>
            </motion.div>

            {/* Hero headline + meta */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="font-heading text-[clamp(48px,7vw,96px)] font-bold leading-none tracking-tight text-textPrimary"
                >
                    <span className="block">Rent EVs</span>
                    <span className="block text-accent">by the hour.</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="md:max-w-[300px]"
                >
                    <strong className="block text-base uppercase tracking-wide text-textPrimary mb-2 font-sans font-bold">
                        Simple. Flexible. Affordable.
                    </strong>
                    <p className="text-textPrimary/55 text-sm leading-relaxed font-sans">
                        Pay only for the hours you ride — no full-day charges, no ownership hassles.
                        Pick up an electric vehicle for as little as 2 hours.
                    </p>
                </motion.div>
            </div>

            {/* ─── POSTER BANNER ─── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="relative w-full rounded-3xl overflow-hidden border border-white/5"
                style={{ height: '420px', background: 'linear-gradient(160deg, #0d1410 0%, #080b09 100%)' }}
            >
                {/* Radial glow — left side only, like headlights from behind */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 60% 60% at 20% 60%, rgba(92,240,158,0.09), transparent)' }}
                />

                {/* Top labels row */}
                <div className="absolute top-5 left-6 flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.18em] text-accent z-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    Hourly fleet · across India
                </div>
                <div className="absolute top-5 right-6 font-sans text-[10px] uppercase tracking-[0.14em] text-accent/50 z-20">
                    Pay for the hours you ride.
                </div>

                {/* ── SVG SCENE ── */}
                {/*
                    ViewBox: 1200 × 320 (scene area, excludes the stats strip)
                    Road ground line: y = 280
                    Car: wheels radius 34px, wheel centre y = 246, bottom of wheel y = 280 ✓
                    Car body translate: x=360, y=136   →  body top=136, body bottom=246, wheels bottom=280
                */}
                <svg
                    viewBox="0 0 1200 300"
                    preserveAspectRatio="xMidYMax meet"
                    className="absolute inset-0 w-full"
                    style={{ top: 0, height: '300px' }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* ── ROAD SURFACE ── */}
                    {/* Solid road band */}
                    <rect x="0" y="275" width="1200" height="25" fill="#0f1612" />
                    {/* Road edge highlight */}
                    <line x1="0" y1="276" x2="1200" y2="276" stroke="#1e2d24" strokeWidth="1.5" />

                    {/* ── ANIMATED EV MINIBUS — matches reference image ── */}
                    <motion.g
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {/* Car group: wheel-bottom sits on y=280 */}
                        {/* Wheel r=36, centre-y = 280-36 = 244, body above */}
                        <g transform="translate(280, 120)">

                            {/* ── BODY — wide minibus silhouette ── */}
                            {/*
                              Profile (x goes 0→460, y goes 0→124):
                              Front (right): sloped windshield  Back (left): tall flat rear
                            */}
                            <path
                                d="
                                  M 0 124
                                  L 0 50
                                  Q 0 30 20 30
                                  L 80 30
                                  L 115 4
                                  L 300 0
                                  L 360 0
                                  L 420 30
                                  Q 460 30 460 55
                                  L 460 124
                                  Z
                                "
                                fill="#1a7a43"
                                opacity="0.97"
                            />
                            {/* Roof accent strip */}
                            <path
                                d="M 20 30 L 80 30 L 115 4 L 300 0 L 360 0 L 418 28"
                                fill="none" stroke="#5cf09e" strokeWidth="2" opacity="0.35"
                            />
                            {/* Lower body sill (darker) — clipped between wheels */}
                            {/* Rear wheel: cx=82 r=36 → right edge x=118 */}
                            {/* Front wheel: cx=378 r=36 → left edge x=342 */}
                            <rect x="118" y="108" width="224" height="12" rx="0" fill="#0f5c2e" />

                            {/* ── WINDOWS — kept in upper body, well above wheel zone (wheel top = y=88) ── */}
                            {/* Rear window: x=20–90, y=36–76 (bottom at y=76, clear of wheel top y=88) */}
                            <rect x="22" y="36" width="72" height="40" rx="5" fill="#060d08" opacity="0.85" />
                            {/* Main cabin window: y=8–72 (bottom at y=72, clear of wheel top y=88) */}
                            <rect x="118" y="8" width="228" height="64" rx="5" fill="#060d08" opacity="0.85" />
                            {/* Window reflections */}
                            <rect x="23" y="37" width="16" height="38" rx="3" fill="#5cf09e" opacity="0.05" />
                            <rect x="119" y="9" width="36" height="62" rx="3" fill="#5cf09e" opacity="0.05" />

                            {/* ── HEADLIGHT (front-right) ── */}
                            <rect x="444" y="68" width="18" height="10" rx="3" fill="#5cf09e" opacity="0.95" />
                            <rect x="444" y="68" width="18" height="10" rx="3" fill="#5cf09e" opacity="0.5"
                                style={{ filter: 'blur(5px)' }} />

                            {/* ── TAILLIGHT (rear-left) ── */}
                            <rect x="0" y="68" width="12" height="10" rx="3" fill="#5cf09e" opacity="0.5" />

                            {/* ── WHEEL 1 — front-right (cx=378, cy=124) ── */}
                            <circle cx="378" cy="124" r="36" fill="#060908" />
                            <circle cx="378" cy="124" r="28" fill="#0c1410" />
                            <circle cx="378" cy="124" r="14" fill="#5cf09e" opacity="0.8" />
                            <circle cx="378" cy="124" r="36" fill="none" stroke="#1c2e22" strokeWidth="2.5" />

                            {/* ── WHEEL 2 — rear-left (cx=82, cy=124) ── */}
                            <circle cx="82" cy="124" r="36" fill="#060908" />
                            <circle cx="82" cy="124" r="28" fill="#0c1410" />
                            <circle cx="82" cy="124" r="14" fill="#5cf09e" opacity="0.8" />
                            <circle cx="82" cy="124" r="36" fill="none" stroke="#1c2e22" strokeWidth="2.5" />

                        </g>{/* end car group */}
                    </motion.g>{/* end float */}

                    {/* Speed lines behind car — subtle */}
                    {[0, 1, 2, 3].map((i) => (
                        <motion.line
                            key={`speed-${i}`}
                            x1={340} y1={200 + i * 18}
                            x2={100} y2={200 + i * 18}
                            stroke="#5cf09e"
                            strokeWidth={i === 1 ? 1.5 : 1}
                            strokeLinecap="round"
                            opacity={0}
                            animate={{ x1: [340, 200, 340], opacity: [0, 0.18, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                        />
                    ))}
                </svg>

                {/* ── STATS STRIP ── clearly separated below the scene */}
                <div
                    className="absolute bottom-0 left-0 right-0 z-20"
                    style={{ background: 'linear-gradient(to top, rgba(8,11,9,0.96) 70%, transparent)' }}
                >
                    <div className="flex items-end gap-16 px-8 pb-7 pt-10">
                        {[
                            { label: 'Min rental', value: '2 hrs' },
                            { label: 'Max rental', value: '24 hrs' },
                            { label: 'Plans', value: '4' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col gap-1">
                                <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-accent/70">
                                    {stat.label}
                                </span>
                                <span className="font-heading text-4xl md:text-5xl leading-none text-white">
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </motion.div>
            {/* ─── END POSTER ─── */}

        </section>
    );
}
