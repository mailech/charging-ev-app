import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion';
import logo from './assets/logo.png'
import charger3d from './assets/charger-3d.png'
import hub3d from './assets/Screenshot_2026-05-05_004406-removebg-preview.png'

const ACCENT = '#7CFF00'
const BG = '#0A0D0C'
const BORDER = 'rgba(255,255,255,0.06)'

// --- ALL COMPONENTS DEFINED AT TOP ---

const HUDCard = ({ title, value, unit, color = ACCENT }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
    style={{ background: 'rgba(10,13,12,0.95)', border: `1px solid ${color}33`, padding: '25px', borderRadius: '12px', backdropFilter: 'blur(20px)', minWidth: '200px' }}
  >
    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>{title}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: -1 }}>{value}</span>
        <span style={{ fontSize: '0.9rem', color, fontWeight: 800 }}>{unit}</span>
    </div>
  </motion.div>
);

const SynapseNode = ({ title, desc, status, index, isHovered, onHover, onLeave }: any) => {
    // Strategic S-Curve Placement
    const offsets = [
        { x: '15%', y: '65%', labelY: -80 },
        { x: '40%', y: '35%', labelY: 80 },
        { x: '65%', y: '65%', labelY: -80 },
        { x: '85%', y: '35%', labelY: 80 },
    ];
    const off = offsets[index];

    return (
        <motion.div 
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{ 
                position: 'absolute', 
                left: off.x,
                top: off.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 100,
                cursor: 'pointer'
            }}
        >
            {/* The Junction Core (Holographic Orb) */}
            <div style={{ position: 'relative', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div 
                    animate={{ scale: isHovered ? [1, 1.8, 1] : [1, 1.2, 1], opacity: isHovered ? [0.8, 0.2, 0.8] : 0.3 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', inset: -15, background: ACCENT, borderRadius: '50%', filter: 'blur(15px)' }}
                />
                <div style={{ width: 10, height: 10, background: '#fff', borderRadius: '50%', border: `2px solid ${ACCENT}`, zIndex: 10 }} />
            </div>

            {/* HUD Label (Floating) */}
            <motion.div 
                animate={{ y: isHovered ? off.labelY * 1.1 : off.labelY, opacity: isHovered ? 1 : 0.5 }}
                style={{ position: 'absolute', left: 0, transform: 'translateX(-50%)', width: '280px', textAlign: 'center' }}
            >
                {/* HUD Line */}
                <div style={{ position: 'absolute', left: '50%', top: off.labelY < 0 ? '100%' : 'auto', bottom: off.labelY > 0 ? '100%' : 'auto', width: '1px', height: '40px', background: isHovered ? ACCENT : BORDER, transform: 'translateX(-50%)' }} />
                
                <div style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 900, letterSpacing: 4, marginBottom: 5 }}>NODE_0{index + 1}__{status}</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{title}</h3>
                
                {isHovered && (
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: 10 }}
                    >
                        {desc}
                    </motion.p>
                )}
            </motion.div>
        </motion.div>
    );
}

export default function App() {
  const [sessions, setSessions] = useState([
    { id: 'TR-01', status: 'CHARGING', power: '150kW' },
    { id: 'TR-04', status: 'READY', power: '0kW' },
    { id: 'TR-09', status: 'CHARGING', power: '350kW' },
  ]);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const stages = [
    { title: "LOAD BALANCING", desc: "Adaptive energy orchestration across regional grids with real-time predictive distribution.", status: "ACTIVE" },
    { title: "SMART BILLING", desc: "Enterprise automated ledger sync for massive vehicle fleet transaction settlement.", status: "SYNCING" },
    { title: "DIAGNOSTICS", desc: "Proactive hardware maintenance and predictive integrity scanning via edge telemetry.", status: "SCANNING" },
    { title: "API INTEGRATION", desc: "Universal data bridge for seamless integration with global logistics orchestration.", status: "LINKED" },
  ];

  return (
    <div style={{ background: BG, color: '#fff', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; border-radius: 0 !important; }
        
        h1, h2, h3 { font-weight: 900; text-transform: uppercase; letter-spacing: -1px; }
        
        .btn-accent { background: ${ACCENT}; color: #000; border: none; padding: 22px 50px; font-weight: 900; font-size: 0.85rem; letter-spacing: 1px; cursor: pointer; transition: 0.4s; border-radius: 8px !important; text-transform: uppercase; }
        .btn-accent:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 15px 40px ${ACCENT}33; }

        .btn-ghost { background: transparent; color: #fff; border: 1px solid ${BORDER}; padding: 22px 50px; font-weight: 900; font-size: 0.85rem; letter-spacing: 1px; cursor: pointer; transition: 0.4s; border-radius: 8px !important; text-transform: uppercase; }
        .btn-ghost:hover { background: rgba(255,255,255,0.05); border-color: #fff; }

        .glass-card { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); transition: 0.4s; border-radius: 15px !important; }
        .grid-bg { background-image: radial-gradient(${BORDER} 1px, transparent 1px); background-size: 60px 60px; }
      `}</style>

      {/* HEADER */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: '80px', display: 'flex', alignItems: 'center', padding: '0 80px', background: 'rgba(10,13,12,0.9)', backdropFilter: 'blur(30px)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="TRIO" style={{ height: '110px', width: 'auto', position: 'absolute', left: 0, objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }} />
        </div>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 50 }}>
            {['NETWORK', 'INFRASTRUCTURE', 'SOLUTIONS'].map(l => (
                <a key={l} href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 1, opacity: 0.6, transition: '0.3s' }} onMouseEnter={(e:any)=>e.target.style.opacity=1} onMouseLeave={(e:any)=>e.target.style.opacity=0.6}>{l}</a>
            ))}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="grid-bg" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '80px 80px 0', position: 'relative' }}>
        <div style={{ width: '48%', zIndex: 10 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
                    <div style={{ width: 12, height: 12, background: ACCENT, borderRadius: '50%' }} />
                    <span style={{ color: ACCENT, fontWeight: 900, fontSize: '0.8rem', letterSpacing: 3 }}>LIVE NETWORK ACTIVE</span>
                </div>
                <h1 style={{ fontSize: '6.5rem', lineHeight: 0.9, marginBottom: 40 }}>
                    EV POWER<br />REDEFINED.
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', lineHeight: 1.7, marginBottom: 50, maxWidth: '520px' }}>
                    Industrial-grade charging infrastructure managed by a high-performance intelligence platform.
                </p>
                <div style={{ display: 'flex', gap: 20 }}>
                    <button className="btn-accent">FIND STATION</button>
                    <button className="btn-ghost">LEARN MORE</button>
                </div>
            </motion.div>
        </div>

        <div style={{ width: '52%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} style={{ position: 'relative' }}>
                <img src={charger3d} style={{ width: '100%', maxWidth: '750px', zIndex: 5, position: 'relative' }} />
                <div style={{ position: 'absolute', top: '10%', right: '-5%', zIndex: 20 }}><HUDCard title="MAX OUTPUT" value="350" unit="kW" /></div>
                <div style={{ position: 'absolute', bottom: '15%', left: '-10%', zIndex: 20 }}><HUDCard title="SYSTEM UPTIME" value="99.9" unit="%" /></div>
            </motion.div>
        </div>
      </section>

      {/* THE ENERGY SYNAPSE (CREATIVE INFRASTRUCTURE REDESIGN) */}
      <section style={{ height: '110vh', background: '#0A0D0C', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Background Data Matrix */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `radial-gradient(${ACCENT} 0.5px, transparent 0.5px)`, backgroundSize: '40px 40px' }} />

        <div style={{ textAlign: 'center', marginBottom: 120, position: 'relative', zIndex: 200 }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <div style={{ fontSize: '0.75rem', color: ACCENT, fontWeight: 900, letterSpacing: 8, marginBottom: 15 }}>INFRASTRUCTURE_ORCHESTRATION</div>
                <h2 style={{ fontSize: '4rem', fontWeight: 900, position: 'relative' }}>
                    ENERGY_SYNAPSE
                    <motion.div 
                        animate={{ left: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: `linear-gradient(90deg, transparent, ${ACCENT}22, transparent)`, skewX: '-20deg', zIndex: -1 }}
                    />
                </h2>
            </motion.div>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
            {/* THE ENERGY RIBBON (SVG) */}
            <svg viewBox="0 0 1400 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {/* Multi-layered Glowing Path */}
                <path 
                    d="M 0 350 Q 350 350 350 150 Q 350 -50 700 250 Q 1050 550 1050 350 Q 1050 150 1400 150"
                    fill="none" stroke={BORDER} strokeWidth="2" strokeLinecap="round"
                />
                <motion.path 
                    d="M 0 350 Q 350 350 350 150 Q 350 -50 700 250 Q 1050 550 1050 350 Q 1050 150 1400 150"
                    fill="none" stroke={ACCENT} strokeWidth="3"
                    strokeDasharray="10 50"
                    animate={{ strokeDashoffset: [200, 0] }}
                    transition={{ repeat: Infinity, duration: hoveredNode !== null ? 10 : 5, ease: "linear" }}
                    style={{ filter: `drop-shadow(0 0 15px ${ACCENT}66)` }}
                />
                
                {/* Data Particles */}
                {[...Array(5)].map((_, i) => (
                    <motion.circle key={i} r="2" fill={ACCENT}>
                        <animateMotion 
                            path="M 0 350 Q 350 350 350 150 Q 350 -50 700 250 Q 1050 550 1050 350 Q 1050 150 1400 150"
                            dur={hoveredNode !== null ? `${12 + i * 2}s` : `${6 + i}s`}
                            repeatCount="indefinite"
                            begin={`${i * 1.5}s`}
                        />
                    </motion.circle>
                ))}
            </svg>

            {/* SYNAPSE NODES */}
            {stages.map((s, i) => (
                <SynapseNode 
                    key={i} {...s} 
                    index={i}
                    isHovered={hoveredNode === i}
                    onHover={() => setHoveredNode(i)}
                    onLeave={() => setHoveredNode(null)}
                />
            ))}
        </div>

        {/* Global Landscape Metrics */}
        <div style={{ marginTop: 80, display: 'flex', gap: 60, position: 'relative', zIndex: 100 }}>
            {['STABILITY: 99.9%', 'THROUGHPUT: 1.2GW', 'LATENCY: 4ms'].map(m => (
                <div key={m} style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontWeight: 900, letterSpacing: 4 }}>{m}</div>
            ))}
        </div>
      </section>

      {/* HUB INSPECTION */}
      <section style={{ padding: '120px 80px', background: BG, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 60, alignItems: 'center' }}>
                <div className="glass-card" style={{ padding: '40px' }}>
                    <div style={{ color: ACCENT, fontWeight: 900, fontSize: '0.75rem', letterSpacing: 2, marginBottom: 30 }}>LIVE SESSIONS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {sessions.map(s => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${BORDER}`, paddingBottom: 15 }}>
                                <div><div style={{ fontWeight: 800, fontSize: '0.9rem' }}>HUB_{s.id}</div><div style={{ fontSize: '0.65rem', opacity: 0.4 }}>ACTIVE_SESSION_08</div></div>
                                <div style={{ textAlign: 'right' }}><div style={{ color: s.status === 'CHARGING' ? ACCENT : '#fff', fontWeight: 900, fontSize: '0.8rem' }}>{s.power}</div><div style={{ fontSize: '0.6rem', opacity: 0.4 }}>{s.status}</div></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}><motion.img whileHover={{ scale: 1.05 }} src={hub3d} style={{ width: '100%', maxWidth: '800px' }} /></div>
                <div className="glass-card" style={{ padding: '40px' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.75rem', letterSpacing: 2, marginBottom: 30 }}>HARDWARE SPECS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
                        <div><div style={{ fontSize: '0.65rem', opacity: 0.4, marginBottom: 5 }}>CONNECTOR TYPE</div><div style={{ fontWeight: 800 }}>CCS2 / CHAdeMO</div></div>
                        <div><div style={{ fontSize: '0.65rem', opacity: 0.4, marginBottom: 5 }}>COOLING SYSTEM</div><div style={{ fontWeight: 800 }}>LIQUID COOLED</div></div>
                        <div><div style={{ fontSize: '0.65rem', opacity: 0.4, marginBottom: 5 }}>MAX VOLTAGE</div><div style={{ fontWeight: 800 }}>1000V DC</div></div>
                    </div>
                </div>
            </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '120px 80px 60px', background: '#050706', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 80, marginBottom: 100 }}>
            <div>
                <img src={logo} alt="TRIO" style={{ height: '60px', marginBottom: 35 }} />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '400px' }}>The global standard for industrial-scale electric vehicle infrastructure orchestration.</p>
            </div>
            <div>
                <div style={{ fontWeight: 900, fontSize: '0.7rem', letterSpacing: 2, marginBottom: 35 }}>PLATFORM</div>
                {['Network', 'Security', 'Hardware'].map(l => <a key={l} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: 15, fontSize: '0.9rem' }}>{l}</a>)}
            </div>
            <div>
                <div style={{ fontWeight: 900, fontSize: '0.7rem', letterSpacing: 2, marginBottom: 35 }}>RESOURCES</div>
                {['API Docs', 'Support'].map(l => <a key={l} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: 15, fontSize: '0.9rem' }}>{l}</a>)}
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ color: ACCENT, fontWeight: 900, fontSize: '1.6rem', marginBottom: 20 }}>Ready to Scale?</div>
                <button className="btn-accent">CONTACT SALES</button>
            </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.1)', fontSize: '0.8rem', borderTop: `1px solid ${BORDER}`, paddingTop: 60, textAlign: 'center', letterSpacing: 4 }}>© 2026 TRIO PLATFORM. ALL RIGHTS RESERVED.</div>
      </footer>
    </div>
  );
}
