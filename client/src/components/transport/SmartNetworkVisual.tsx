import { motion } from 'framer-motion';

const W = 900;
const H = 380;
const CENTER = { x: 450, y: 190 };

const HOUSES = [
    { id: 1, x: 110, y: 60,  label: 'Residence 1' },
    { id: 2, x: 790, y: 65,  label: 'Residence 2' },
    { id: 3, x: 90,  y: 310, label: 'Residence 3' },
    { id: 4, x: 800, y: 315, label: 'Residence 4' },
];

// Slight curve control point for each route
function ctrl(hx: number, hy: number) {
    const mx = (hx + CENTER.x) / 2;
    const my = (hy + CENTER.y) / 2;
    // offset perpendicular slightly
    const dx = CENTER.x - hx;
    const dy = CENTER.y - hy;
    const len = Math.sqrt(dx * dx + dy * dy);
    return { x: mx + (dy / len) * 20, y: my - (dx / len) * 20 };
}

function pathD(hx: number, hy: number) {
    const c = ctrl(hx, hy);
    return `M ${hx} ${hy} Q ${c.x} ${c.y} ${CENTER.x} ${CENTER.y}`;
}

function Car({ pathId, duration, delay, reverse }: {
    pathId: string; duration: number; delay: number; reverse: boolean;
}) {
    return (
        <g>
            {/* Recognizable Top-down EV Silhouette */}
            {/* Body */}
            <rect x="-10" y="-6" width="20" height="12" rx="3" fill="#5cf09e" />
            
            {/* Glass Canopy (Top) */}
            <rect x="-4" y="-4.5" width="10" height="9" rx="1.5" fill="#06120a" opacity="0.8" />
            
            {/* Hood and Trunk lines */}
            <line x1="6" y1="-6" x2="6" y2="6" stroke="#06120a" strokeWidth="0.5" opacity="0.2" />
            <line x1="-5" y1="-6" x2="-5" y2="6" stroke="#06120a" strokeWidth="0.5" opacity="0.2" />

            {/* Headlights (Front) */}
            <path d="M 9 -4 Q 10 -4 10 -2 L 10 2 Q 10 4 9 4" fill="white" opacity="0.6" />
            
            {/* Taillights (Rear) */}
            <rect x="-10" y="-4" width="1.5" height="2" rx="0.5" fill="#ef4444" opacity="0.6" />
            <rect x="-10" y="2"  width="1.5" height="2" rx="0.5" fill="#ef4444" opacity="0.6" />

            {/* Wheels - Side-mounted but top-down */}
            <rect x="-7" y="-7" width="4" height="2" rx="0.5" fill="#0a130a" />
            <rect x="4"  y="-7" width="4" height="2" rx="0.5" fill="#0a130a" />
            <rect x="-7" y="5"  width="4" height="2" rx="0.5" fill="#0a130a" />
            <rect x="4"  y="5"  width="4" height="2" rx="0.5" fill="#0a130a" />

            <animateMotion
                dur={`${duration}s`}
                repeatCount="indefinite"
                begin={`${delay}s`}
                keyPoints={reverse ? '1;0' : '0;1'}
                keyTimes="0;1"
                calcMode="linear"
                rotate="auto"
            >
                <mpath href={`#${pathId}`} />
            </animateMotion>
        </g>
    );
}

export function SmartNetworkVisual() {
    return (
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="flex flex-col items-center text-center mb-14 gap-4">
                <h2 className="text-3xl md:text-4xl font-bold uppercase">
                    Corporate <span className="text-accent">Mobility Network</span>
                </h2>
                <p className="text-textPrimary/55 max-w-lg text-sm leading-relaxed">
                    EVs shuttle employees between residences and the main office — continuously, on fixed schedules.
                </p>
            </div>

            <div className="relative w-full bg-secondary/10 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                {/* Dot-grid background */}
                <div
                    className="absolute inset-0 opacity-[0.1] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '36px 36px' }}
                />

                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="w-full"
                    style={{ minHeight: '220px' }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <radialGradient id="officeGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%"   stopColor="#5cf09e" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#5cf09e" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* ── ROUTE PATHS (named IDs so cars can reference them) ── */}
                    {HOUSES.map((h) => (
                        <path
                            key={`path-${h.id}`}
                            id={`route-${h.id}`}
                            d={pathD(h.x, h.y)}
                            stroke="#5cf09e"
                            strokeWidth="1.5"
                            fill="none"
                            strokeDasharray="6 5"
                            opacity={0.3}
                        />
                    ))}

                    {/* ── CARS ON PATHS — forward (house → office) ── */}
                    {HOUSES.map((h, i) => (
                        <Car
                            key={`to-${h.id}`}
                            pathId={`route-${h.id}`}
                            duration={5 + i * 0.5}
                            delay={i * 1.2}
                            reverse={false}
                        />
                    ))}

                    {/* ── CARS ON PATHS — reverse (office → house) ── */}
                    {HOUSES.map((h, i) => (
                        <Car
                            key={`from-${h.id}`}
                            pathId={`route-${h.id}`}
                            duration={5.5 + i * 0.5}
                            delay={i * 1.2 + 2.5}
                            reverse={true}
                        />
                    ))}

                    {/* ── RESIDENCE NODES ── */}
                    {HOUSES.map((h) => (
                        <g key={`node-${h.id}`}>
                            <circle cx={h.x} cy={h.y} r={22} fill="#5cf09e" opacity="0.07" />
                            <circle cx={h.x} cy={h.y} r={10} fill="none" stroke="#5cf09e" strokeWidth="1" opacity={0.3} />
                            <circle cx={h.x} cy={h.y} r={5}  fill="#5cf09e" filter="url(#glow)" />
                            <text
                                x={h.x} y={h.y + 22}
                                textAnchor="middle" fontSize="9" fill="rgba(244,245,246,0.4)"
                                fontFamily="monospace"
                                style={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}
                            >
                                {h.label}
                            </text>
                        </g>
                    ))}

                    {/* ── MAIN OFFICE (center) ── */}
                    <g>
                        <circle cx={CENTER.x} cy={CENTER.y} r={40} fill="url(#officeGlow)" />
                        <circle cx={CENTER.x} cy={CENTER.y} r={18} fill="none" stroke="#5cf09e" strokeWidth="1.2" opacity={0.2} />
                        <circle cx={CENTER.x} cy={CENTER.y} r={11} fill="none" stroke="#5cf09e" strokeWidth="1.2" opacity={0.4} />
                        <circle cx={CENTER.x} cy={CENTER.y} r={6}  fill="#5cf09e" filter="url(#glow)" />
                        <text
                            x={CENTER.x} y={CENTER.y + 28}
                            textAnchor="middle" fontSize="10" fill="#5cf09e" fontWeight="bold"
                            fontFamily="monospace"
                            style={{ textTransform: 'uppercase', letterSpacing: '0.18em' }}
                        >
                            Main Office
                        </text>
                    </g>
                </svg>

                {/* ── Status overlay ── */}
                <div className="absolute top-3 left-3 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-xl border border-white/8 z-40">
                    <div className="flex items-center gap-1.5 mb-2">
                        <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                            className="w-1 h-1 rounded-full bg-accent"
                        />
                        <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-accent/70">Live</span>
                    </div>
                    <div className="space-y-1">
                        {[
                            { label: 'Active', value: '124' },
                            { label: 'Residences', value: '4' },
                            { label: 'Trips', value: '318' },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center justify-between gap-5">
                                <span className="text-[9px] text-textPrimary/40">{s.label}</span>
                                <span className="text-[9px] font-bold text-accent">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
