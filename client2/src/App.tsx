import { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import logo from './assets/logo.png'
import charger3d from './assets/charger-3d.png'
import hub3d from './assets/Screenshot_2026-05-05_004406-removebg-preview.png'
import worldMap from './assets/world-map.png'

const ACCENT = '#7CFF00'
const BG = '#0A0D0C'
const BORDER = 'rgba(255,255,255,0.06)'

// --- HUD CARD ---
const HUDCard = ({ title, value, unit, color = ACCENT }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
    style={{ background: 'rgba(10,13,12,0.92)', border: `1px solid ${color}33`, padding: '20px 26px', backdropFilter: 'blur(20px)', minWidth: '180px', position: 'relative' }}
  >
    <span className="bracket bracket-tl" style={{ borderColor: color }} />
    <span className="bracket bracket-br" style={{ borderColor: color }} />
    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 8 }}>{title}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
      <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fff', letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontSize: '0.85rem', color, fontWeight: 800 }}>{unit}</span>
    </div>
  </motion.div>
);

// --- LIVE STAT (hero strip) ---
const FlipStat = ({ label, value, trend }: any) => (
  <div style={{ flex: 1, padding: '16px 22px', borderLeft: `1px solid ${BORDER}` }}>
    <div className="mono" style={{ fontSize: '0.58rem', letterSpacing: 2.5, color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>{label}</div>
    <div style={{ fontSize: '1.7rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums', marginTop: 4, letterSpacing: -0.5, color: '#fff' }}>{value}</div>
    <div className="mono" style={{ fontSize: '0.6rem', color: ACCENT, marginTop: 2, letterSpacing: 1.5, fontWeight: 800 }}>↗ {trend}</div>
  </div>
);

// --- SPARKLINE (synapse cards) ---
const Sparkline = ({ color = ACCENT, points }: { color?: string, points: number[] }) => {
  const w = 220, h = 50;
  const step = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - (p / 100) * h}`).join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const gid = `g-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '50px', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${color}aa)` }} />
      <circle r="2.5" cx={(points.length - 1) * step} cy={h - (points[points.length - 1] / 100) * h} fill={color}>
        <animate attributeName="r" values="2.5;5;2.5" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

// --- MODULE CARD (synapse) ---
const ModuleCard = ({ idx, title, desc, status, statusColor = ACCENT, metrics, points, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay }}
    className="module-card"
  >
    <span className="bracket bracket-tl" />
    <span className="bracket bracket-tr" />
    <span className="bracket bracket-bl" />
    <span className="bracket bracket-br" />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: 2.5 }}>// MODULE_0{idx}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.58rem', fontWeight: 900, letterSpacing: 2, color: statusColor }}>
        <span className="circle pulse-dot" style={{ width: 7, height: 7, background: statusColor, color: statusColor, boxShadow: `0 0 10px ${statusColor}` }} />
        {status}
      </span>
    </div>

    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 10, letterSpacing: -0.5, color: '#fff' }}>{title}</h3>
    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: 18 }}>{desc}</p>

    <Sparkline color={statusColor} points={points} />

    <div style={{ display: 'flex', gap: 14, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
      {metrics.map((m: any) => (
        <div key={m.label} style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: 2, fontWeight: 800, marginBottom: 4 }}>{m.label}</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: '#fff' }}>{m.val}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function App() {
  const [sessions] = useState([
    { id: 'TR-01', status: 'CHARGING', power: '150kW' },
    { id: 'TR-04', status: 'READY', power: '0kW' },
    { id: 'TR-09', status: 'CHARGING', power: '350kW' },
  ]);

  const [clock, setClock] = useState('');
  const [stationsOnline, setStationsOnline] = useState(2847);
  const [kwhToday, setKwhToday] = useState(184206);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, '0');
      const mm = String(d.getUTCMinutes()).padStart(2, '0');
      const ss = String(d.getUTCSeconds()).padStart(2, '0');
      setClock(`${hh}:${mm}:${ss} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    const id2 = setInterval(() => setStationsOnline(n => n + (Math.random() > 0.45 ? 1 : -1)), 2400);
    const id3 = setInterval(() => setKwhToday(n => n + Math.floor(Math.random() * 18 + 4)), 1200);
    return () => { clearInterval(id); clearInterval(id2); clearInterval(id3); };
  }, []);

  const tickerItems = [
    'TR-01 / NYC_DOWNTOWN / CHARGING / 150kW',
    'TR-04 / SF_BAY / READY / 0kW',
    'TR-09 / LDN_CITY / CHARGING / 350kW',
    'TR-12 / TYO_SHINJUKU / CHARGING / 320kW',
    'TR-22 / BER_MITTE / READY / 0kW',
    'TR-31 / SGP_MARINA / CHARGING / 280kW',
    'TR-44 / DXB_MARINA / CHARGING / 300kW',
    'TR-58 / SYD_HARBOUR / CHARGING / 220kW',
  ];

  const modules = [
    {
      title: 'LOAD BALANCING', desc: 'Adaptive grid-aware orchestration redistributing kilowatts across stations in real time.',
      status: 'ACTIVE', statusColor: ACCENT,
      metrics: [{ label: 'NODES', val: '2,847' }, { label: 'BALANCE', val: '99.4%' }],
      points: [40, 55, 35, 70, 50, 80, 45, 75, 60, 88, 55, 72, 65, 90],
    },
    {
      title: 'SMART BILLING', desc: 'Per-electron settlement engine reconciling fleet ledgers across sovereign currencies.',
      status: 'SYNCING', statusColor: '#5BD9FF',
      metrics: [{ label: 'TX/SEC', val: '1.2K' }, { label: 'ACCURACY', val: '100%' }],
      points: [60, 65, 70, 68, 72, 78, 75, 82, 80, 85, 88, 84, 90, 92],
    },
    {
      title: 'DIAGNOSTICS', desc: 'Edge-telemetry health scanner predicting hardware failure 72 hours before incidence.',
      status: 'SCANNING', statusColor: '#FFB85B',
      metrics: [{ label: 'SCANS/HR', val: '4.8M' }, { label: 'INTEGRITY', val: '99.9%' }],
      points: [70, 50, 80, 45, 75, 55, 85, 60, 78, 65, 82, 70, 88, 76],
    },
    {
      title: 'API INTEGRATION', desc: 'Universal data bridge connecting global logistics, fleets and grid operators in 4ms.',
      status: 'LINKED', statusColor: '#C77FFF',
      metrics: [{ label: 'PARTNERS', val: '184' }, { label: 'LATENCY', val: '4ms' }],
      points: [55, 62, 58, 65, 60, 70, 68, 75, 72, 80, 76, 82, 78, 86],
    },
  ];

  return (
    <div style={{ background: BG, color: '#fff', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; border-radius: 0 !important; }
        h1, h2, h3 { font-weight: 900; text-transform: uppercase; letter-spacing: -1px; }

        .mono { font-family: 'JetBrains Mono', monospace; }
        .circle { border-radius: 50% !important; }

        .btn-accent { background: ${ACCENT}; color: #000; border: none; padding: 22px 44px; font-weight: 900; font-size: 0.85rem; letter-spacing: 1px; cursor: pointer; transition: 0.4s; border-radius: 8px !important; text-transform: uppercase; display: inline-flex; align-items: center; gap: 14px; }
        .btn-accent:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 15px 40px ${ACCENT}33; }
        .btn-ghost { background: transparent; color: #fff; border: 1px solid ${BORDER}; padding: 22px 44px; font-weight: 900; font-size: 0.85rem; letter-spacing: 1px; cursor: pointer; transition: 0.4s; border-radius: 8px !important; text-transform: uppercase; }
        .btn-ghost:hover { background: rgba(255,255,255,0.05); border-color: #fff; }

        .glass-card { background: rgba(255,255,255,0.02); backdrop-filter: blur(20px); transition: 0.4s; border-radius: 15px !important; }
        .grid-bg { background-image: radial-gradient(${BORDER} 1px, transparent 1px); background-size: 60px 60px; }

        /* Bracket corner ornaments */
        .bracket { position: absolute; width: 12px; height: 12px; border: 1px solid ${ACCENT}; pointer-events: none; }
        .bracket-tl { top: 8px; left: 8px; border-right: none; border-bottom: none; }
        .bracket-tr { top: 8px; right: 8px; border-left: none; border-bottom: none; }
        .bracket-bl { bottom: 8px; left: 8px; border-right: none; border-top: none; }
        .bracket-br { bottom: 8px; right: 8px; border-left: none; border-top: none; }

        /* Pulse dot ring */
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.6); opacity: 0; } }
        .pulse-dot { position: relative; }
        .pulse-dot::after { content: ''; position: absolute; inset: -2px; border-radius: 50% !important; border: 1px solid currentColor; animation: pulse-ring 2s infinite; }

        /* Side rails */
        .rail { position: absolute; top: 100px; bottom: 110px; width: 80px; pointer-events: none; display: flex; flex-direction: column; justify-content: space-between; padding: 20px 0; opacity: 0.55; z-index: 4; }
        .rail-left { left: 0; padding-left: 22px; }
        .rail-right { right: 0; padding-right: 22px; align-items: flex-end; }
        .rail-tick { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; letter-spacing: 2px; color: rgba(255,255,255,0.35); font-weight: 700; display: inline-flex; align-items: center; gap: 8px; }
        .rail-tick .bar { display: inline-block; width: 14px; height: 1px; background: rgba(255,255,255,0.3); }
        .rail-tick.hot { color: ${ACCENT}; }
        .rail-tick.hot .bar { background: ${ACCENT}; box-shadow: 0 0 6px ${ACCENT}; }

        /* Kinetic title */
        .kinetic-line { display: block; overflow: hidden; line-height: 0.92; }
        .kinetic-inner { display: inline-block; }

        /* Voltage gauge */
        .v-gauge { position: absolute; right: -8px; top: 12%; bottom: 18%; width: 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 18; }
        .v-gauge-track { flex: 1; width: 4px; background: ${BORDER}; position: relative; overflow: hidden; }
        .v-gauge-fill { position: absolute; left: 0; right: 0; bottom: 0; background: linear-gradient(0deg, ${ACCENT}, ${ACCENT}66); box-shadow: 0 0 16px ${ACCENT}; }
        @keyframes vgauge { 0%, 100% { height: 70%; } 50% { height: 92%; } }
        .v-gauge-anim { animation: vgauge 3.5s ease-in-out infinite; }

        /* Marquee ticker */
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker { width: 100%; overflow: hidden; border-top: 1px solid ${BORDER}; border-bottom: 1px solid ${BORDER}; background: rgba(0,0,0,0.5); padding: 14px 0; }
        .ticker-track { display: flex; gap: 50px; white-space: nowrap; animation: marquee 70s linear infinite; will-change: transform; }
        .ticker-item { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; letter-spacing: 1.5px; color: rgba(255,255,255,0.55); font-weight: 700; }
        .ticker-item .acc { color: ${ACCENT}; }
        .ticker-item .sep { color: rgba(255,255,255,0.18); margin: 0 8px; }

        /* MODULE CARD */
        .module-card { background: linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)); border: 1px solid ${BORDER}; padding: 26px; backdrop-filter: blur(20px); position: relative; transition: 0.4s; border-radius: 14px !important; overflow: hidden; }
        .module-card:hover { border-color: ${ACCENT}66; transform: translateY(-4px); box-shadow: 0 20px 60px rgba(124,255,0,0.08); }
        .module-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, ${ACCENT}aa, transparent); transform: translateX(-100%); animation: card-scan 4.5s linear infinite; }
        @keyframes card-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

        /* SYNAPSE GRID */
        .synapse-grid { display: grid; grid-template-columns: minmax(280px, 360px) 1fr minmax(280px, 360px); grid-template-rows: auto auto; gap: 60px 100px; position: relative; max-width: 1500px; margin: 0 auto; }
        .core-col { grid-column: 2; grid-row: 1 / span 2; display: flex; align-items: center; justify-content: center; position: relative; min-height: 460px; }
        .module-nw { grid-column: 1; grid-row: 1; }
        .module-ne { grid-column: 3; grid-row: 1; }
        .module-sw { grid-column: 1; grid-row: 2; }
        .module-se { grid-column: 3; grid-row: 2; }
        .synapse-connectors { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

        /* Event feed */
        @keyframes feed-scroll { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .event-feed-container { max-width: 1500px; margin: 100px auto 0; border: 1px solid ${BORDER}; padding: 18px 24px; background: rgba(0,0,0,0.45); display: grid; grid-template-columns: 220px 1fr 100px; gap: 30px; align-items: center; backdrop-filter: blur(20px); }
        .feed-window { height: 24px; overflow: hidden; position: relative; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; letter-spacing: 1px; }
        .feed-track { animation: feed-scroll 32s linear infinite; }
        .feed-line { height: 24px; line-height: 24px; color: rgba(255,255,255,0.65); font-weight: 700; }
        .feed-line .tag { color: ${ACCENT}; margin-right: 12px; }

        @media (max-width: 1100px) {
          .synapse-grid { grid-template-columns: 1fr 1fr; }
          .core-col { grid-column: 1 / span 2; grid-row: 3; }
          .module-nw { grid-column: 1; grid-row: 1; }
          .module-ne { grid-column: 2; grid-row: 1; }
          .module-sw { grid-column: 1; grid-row: 2; }
          .module-se { grid-column: 2; grid-row: 2; }
        }
      `}</style>

      {/* HEADER */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: '80px', display: 'flex', alignItems: 'center', padding: '0 80px', background: 'rgba(10,13,12,0.9)', backdropFilter: 'blur(30px)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="TRIO" style={{ height: '110px', width: 'auto', position: 'absolute', left: 0, objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }} />
        </div>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 50 }}>
          {['NETWORK', 'INFRASTRUCTURE', 'SOLUTIONS'].map(l => (
            <a key={l} href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 1, opacity: 0.6, transition: '0.3s' }} onMouseEnter={(e: any) => e.target.style.opacity = 1} onMouseLeave={(e: any) => e.target.style.opacity = 0.6}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO SECTION (REDESIGNED) */}
      <section className="grid-bg" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>

        {/* Side instrumentation rails */}
        <div className="rail rail-left">
          {[
            { l: '350kW', hot: true }, { l: '300kW' }, { l: '250kW' }, { l: '200kW' },
            { l: '150kW', hot: true }, { l: '100kW' }, { l: '50kW' }, { l: '0kW' },
          ].map(t => (
            <span key={t.l} className={`rail-tick${t.hot ? ' hot' : ''}`}><span className="bar" />{t.l}</span>
          ))}
        </div>
        <div className="rail rail-right">
          {['T-00', 'T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06', 'T-07'].map((t, i) => (
            <span key={t} className={`rail-tick${i === 2 ? ' hot' : ''}`}>{t}<span className="bar" /></span>
          ))}
        </div>

        {/* Ambient glows */}
        <div className="circle" style={{ position: 'absolute', right: '8%', top: '25%', width: 760, height: 760, background: ACCENT, filter: 'blur(180px)', opacity: 0.10, pointerEvents: 'none' }} />
        <div className="circle" style={{ position: 'absolute', left: '14%', bottom: '15%', width: 500, height: 500, background: '#5BD9FF', filter: 'blur(180px)', opacity: 0.05, pointerEvents: 'none' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, padding: '60px 110px 0', alignItems: 'center', minHeight: 'calc(100vh - 200px)', position: 'relative', zIndex: 5 }}>

          {/* LEFT COLUMN */}
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              {/* Eyebrow with live clock + station counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 38, fontSize: '0.7rem', letterSpacing: 2.5, fontWeight: 800, flexWrap: 'wrap' }}>
                <span className="circle pulse-dot" style={{ width: 10, height: 10, background: ACCENT, color: ACCENT }} />
                <span style={{ color: ACCENT }}>LIVE NETWORK ACTIVE</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
                <span className="mono" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', letterSpacing: 1.5 }}>{clock || '--:--:-- UTC'}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
                <span className="mono" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: 1.5 }}>STATIONS {stationsOnline.toLocaleString()}</span>
              </div>

              {/* KINETIC TITLE */}
              <h1 style={{ fontSize: 'clamp(3.5rem, 6.8vw, 7rem)', lineHeight: 0.92, marginBottom: 32, position: 'relative' }}>
                <span style={{ position: 'absolute', left: -28, top: 8, bottom: 8, width: 3, background: `linear-gradient(180deg, ${ACCENT}, transparent)`, boxShadow: `0 0 12px ${ACCENT}88` }} />
                <span className="kinetic-line">
                  <motion.span className="kinetic-inner" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>EV POWER</motion.span>
                </span>
                <span className="kinetic-line">
                  <motion.span className="kinetic-inner" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
                    REDEFINED<span style={{ color: ACCENT }}>.</span>
                  </motion.span>
                </span>
                {/* shimmer sweep */}
                <motion.span
                  initial={{ x: '-30%' }} animate={{ x: '230%' }}
                  transition={{ duration: 2.4, delay: 1.3, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '30%', background: `linear-gradient(90deg, transparent, ${ACCENT}33, transparent)`, mixBlendMode: 'screen', pointerEvents: 'none', skew: '-12deg' as any }}
                />
              </h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.18rem', lineHeight: 1.7, marginBottom: 44, maxWidth: '540px' }}
              >
                Industrial-grade charging infrastructure managed by a high-performance intelligence platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                style={{ display: 'flex', gap: 16, marginBottom: 56 }}
              >
                <button className="btn-accent">FIND STATION <span style={{ fontSize: '1.1rem' }}>→</span></button>
                <button className="btn-ghost">LEARN MORE</button>
              </motion.div>

              {/* LIVE STAT STRIP */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}
                style={{ display: 'flex', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, maxWidth: 720, position: 'relative' }}
              >
                <FlipStat label="STATIONS LIVE" value={stationsOnline.toLocaleString()} trend="+12 / 24h" />
                <FlipStat label="kWh / TODAY" value={kwhToday.toLocaleString()} trend="LIVE" />
                <FlipStat label="AVG SESSION" value="22:14" trend="-1.4%" />
                {/* corner brackets */}
                <span className="bracket bracket-tl" />
                <span className="bracket bracket-tr" />
                <span className="bracket bracket-bl" />
                <span className="bracket bracket-br" />
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN — charger stage */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px' }}>

            {/* Concentric podium rings (perspective) */}
            <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 280, perspective: '1000px', pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', inset: 0, transform: 'rotateX(70deg)', transformStyle: 'preserve-3d' }}>
                {[1, 1.4, 1.8, 2.3].map((s, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [s, s * 1.04, s], opacity: [0.55 - i * 0.1, 0.2, 0.55 - i * 0.1] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                    className="circle"
                    style={{ position: 'absolute', inset: '40%', border: `1px solid ${ACCENT}${i === 0 ? 'aa' : '44'}`, boxShadow: i === 0 ? `0 0 30px ${ACCENT}66` : 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* charger image */}
            <motion.img
              src={charger3d}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: '100%', maxWidth: '720px', position: 'relative', zIndex: 5, filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.5)) drop-shadow(0 0 80px rgba(124,255,0,0.18))` }}
            />

            {/* HUD floating cards */}
            <div style={{ position: 'absolute', top: '8%', right: '-2%', zIndex: 20 }}>
              <HUDCard title="MAX OUTPUT" value="350" unit="kW" />
            </div>
            <div style={{ position: 'absolute', bottom: '20%', left: '-4%', zIndex: 20 }}>
              <HUDCard title="SYSTEM UPTIME" value="99.9" unit="%" />
            </div>

            {/* Rotating circular text badge */}
            <motion.div
              animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
              style={{ position: 'absolute', top: '52%', right: '4%', width: 110, height: 110, zIndex: 15, pointerEvents: 'none' }}
            >
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <defs>
                  <path id="ct-1" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="6.4" letterSpacing="2.5" fontWeight="800" fill="rgba(255,255,255,0.55)" fontFamily="'JetBrains Mono', monospace">
                  <textPath href="#ct-1">// LIVE • SESSION_ACTIVE • GRID_ONLINE • LIVE • SESSION_ACTIVE • GRID_ONLINE •</textPath>
                </text>
                <circle cx="50" cy="50" r="3" fill={ACCENT} />
              </svg>
            </motion.div>

            {/* ECG waveform */}
            <svg style={{ position: 'absolute', left: '-10%', top: '46%', width: '40%', height: 80, pointerEvents: 'none', zIndex: 12 }} viewBox="0 0 400 80" preserveAspectRatio="none">
              <motion.path
                d="M 0 40 L 60 40 L 70 18 L 80 62 L 90 28 L 100 40 L 180 40 L 195 22 L 205 58 L 215 40 L 300 40 L 310 12 L 320 68 L 330 40 L 400 40"
                fill="none" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 6"
                style={{ filter: `drop-shadow(0 0 6px ${ACCENT})` }}
                animate={{ strokeDashoffset: [0, -80] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              />
            </svg>

            {/* Voltage gauge */}
            <div className="v-gauge">
              <div className="mono" style={{ fontSize: '0.55rem', color: ACCENT, fontWeight: 800, letterSpacing: 1.5 }}>kW</div>
              <div className="v-gauge-track">
                <div className="v-gauge-fill v-gauge-anim" />
              </div>
              <div className="mono" style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: 1.5 }}>0</div>
            </div>
          </div>
        </div>

        {/* Bottom marquee ticker */}
        <div className="ticker" style={{ position: 'relative', marginTop: 40 }}>
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((it, i) => {
              const parts = it.split(' / ');
              const isCharging = parts[2] === 'CHARGING';
              return (
                <span key={i} className="ticker-item">
                  <span className="acc">●</span> <span style={{ color: '#fff', fontWeight: 800 }}>{parts[0]}</span>
                  <span className="sep">/</span>{parts[1]}
                  <span className="sep">/</span><span style={{ color: isCharging ? ACCENT : 'rgba(255,255,255,0.45)' }}>{parts[2]}</span>
                  <span className="sep">/</span>{parts[3]}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* THE ENERGY SYNAPSE (REDESIGNED — NEURAL CORE) */}
      <section style={{ padding: '160px 80px 140px', position: 'relative', overflow: 'hidden' }}>

        {/* Background dot matrix with radial mask */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: `radial-gradient(${ACCENT}11 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px', maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 110, position: 'relative', zIndex: 5 }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: '0.7rem', color: ACCENT, fontWeight: 900, letterSpacing: 6, marginBottom: 26 }}>
              <span style={{ width: 36, height: 1, background: ACCENT }} />
              INFRASTRUCTURE_ORCHESTRATION
              <span style={{ width: 36, height: 1, background: ACCENT }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)', fontWeight: 900, letterSpacing: -2, marginBottom: 22 }}>
              ENERGY<span style={{ color: ACCENT }}>_</span>SYNAPSE
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: 660, margin: '0 auto', lineHeight: 1.65 }}>
              Four autonomous modules coordinated by a single neural core. Every electron from grid to vehicle, orchestrated in under four milliseconds.
            </p>
          </motion.div>
        </div>

        {/* Grid: 2 cards left column / core / 2 cards right column */}
        <div className="synapse-grid">

          {/* SVG connectors that span the whole grid */}
          <svg className="synapse-connectors" viewBox="0 0 1500 700" preserveAspectRatio="none">
            {[
              { d: 'M 360 110 Q 600 220 750 350', dur: 4, color: ACCENT },
              { d: 'M 1140 110 Q 900 220 750 350', dur: 5, color: '#5BD9FF' },
              { d: 'M 360 590 Q 600 480 750 350', dur: 4.5, color: '#FFB85B' },
              { d: 'M 1140 590 Q 900 480 750 350', dur: 5.5, color: '#C77FFF' },
            ].map((p, i) => (
              <g key={i}>
                <path d={p.d} fill="none" stroke={BORDER} strokeWidth="1" />
                <motion.path
                  d={p.d} fill="none" stroke={p.color} strokeWidth="1.5" strokeDasharray="6 80" opacity="0.9"
                  style={{ filter: `drop-shadow(0 0 6px ${p.color})` }}
                  animate={{ strokeDashoffset: [0, -86] }}
                  transition={{ duration: p.dur, repeat: Infinity, ease: 'linear' }}
                />
                <circle r="3" fill={p.color} style={{ filter: `drop-shadow(0 0 4px ${p.color})` }}>
                  <animateMotion dur={`${p.dur}s`} repeatCount="indefinite" path={p.d} />
                </circle>
              </g>
            ))}
          </svg>

          {/* MODULE CARDS */}
          <div className="module-nw"><ModuleCard idx={1} {...modules[0]} delay={0} /></div>
          <div className="module-ne"><ModuleCard idx={2} {...modules[1]} delay={0.1} /></div>
          <div className="module-sw"><ModuleCard idx={3} {...modules[2]} delay={0.2} /></div>
          <div className="module-se"><ModuleCard idx={4} {...modules[3]} delay={0.3} /></div>

          {/* CENTRAL NEURAL CORE */}
          <div className="core-col">
            <div style={{ position: 'relative', width: 360, height: 360, zIndex: 3 }}>
              {/* Outer rotating dashed ring */}
              <motion.div
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                className="circle"
                style={{ position: 'absolute', inset: 0, border: `1px dashed ${ACCENT}55` }}
              />
              {/* Mid ring counter-rotate with satellite */}
              <motion.svg
                animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                viewBox="0 0 280 280" style={{ position: 'absolute', inset: 40 }}
              >
                <circle cx="140" cy="140" r="135" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="2 14" />
                <circle cx="140" cy="5" r="4" fill={ACCENT} style={{ filter: `drop-shadow(0 0 8px ${ACCENT})` }} />
                <circle cx="275" cy="140" r="2.5" fill="#fff" opacity="0.6" />
                <circle cx="140" cy="275" r="2.5" fill="#fff" opacity="0.4" />
                <circle cx="5" cy="140" r="2.5" fill="#fff" opacity="0.5" />
              </motion.svg>

              {/* Pulsing glow */}
              <motion.div
                animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.75, 0.4] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="circle"
                style={{ position: 'absolute', inset: 80, background: ACCENT, filter: 'blur(50px)' }}
              />

              {/* Core disc */}
              <div className="circle" style={{ position: 'absolute', inset: 95, background: 'radial-gradient(circle, rgba(124,255,0,0.18), rgba(10,13,12,0.95))', border: `1px solid ${ACCENT}66`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `inset 0 0 40px ${ACCENT}22, 0 0 60px rgba(124,255,0,0.18)` }}>
                <div className="mono" style={{ fontSize: '0.55rem', letterSpacing: 4, color: ACCENT, fontWeight: 900, marginBottom: 8 }}>// NEURAL CORE</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', letterSpacing: -2, fontVariantNumeric: 'tabular-nums' }}>1.2</span>
                  <span style={{ fontSize: '1rem', color: ACCENT, fontWeight: 900 }}>GW</span>
                </div>
                <div style={{ height: 1, width: 60, background: `${ACCENT}66`, margin: '8px 0' }} />
                <div className="mono" style={{ fontSize: '0.58rem', letterSpacing: 3, color: 'rgba(255,255,255,0.7)', fontWeight: 800 }}>UPTIME · 99.9%</div>
                <div className="mono" style={{ fontSize: '0.55rem', letterSpacing: 2, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 4 }}>LATENCY · 4ms</div>
              </div>

              {/* Compass plus marks (N/S/E/W) */}
              {[
                { top: -22, left: '50%', tx: '-50%', ty: 0 },
                { bottom: -22, left: '50%', tx: '-50%', ty: 0 },
                { left: -22, top: '50%', tx: 0, ty: '-50%' },
                { right: -22, top: '50%', tx: 0, ty: '-50%' },
              ].map((p, i) => (
                <div key={i} className="mono" style={{ position: 'absolute', ...p, transform: `translate(${p.tx}, ${p.ty})`, fontSize: '0.65rem', color: ACCENT, fontWeight: 800, letterSpacing: 2 } as any}>+</div>
              ))}
            </div>
          </div>
        </div>

        {/* Live event feed */}
        <div className="event-feed-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="circle pulse-dot" style={{ width: 8, height: 8, background: ACCENT, color: ACCENT }} />
            <span className="mono" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 3, color: ACCENT }}>SYSTEM_EVENTS</span>
          </div>
          <div className="feed-window">
            <div className="feed-track">
              {[
                ['12:04:33', 'NODE_2847 → power redistributed (+18kW)'],
                ['12:04:31', 'TR-09 / LDN_CITY → session started · 350kW'],
                ['12:04:28', 'API bridge synced with FleetOS · 1.2K tx/s'],
                ['12:04:22', 'Diagnostic scan complete · 0 anomalies'],
                ['12:04:18', 'TR-04 / SF_BAY → handshake / authenticated'],
                ['12:04:14', 'Load balance · NYC region · 99.4% optimal'],
                ['12:04:11', 'Settlement batch #88141 finalized'],
                ['12:04:08', 'Edge telemetry · 4.8M readings/hr'],
                ['12:04:33', 'NODE_2847 → power redistributed (+18kW)'],
                ['12:04:31', 'TR-09 / LDN_CITY → session started · 350kW'],
                ['12:04:28', 'API bridge synced with FleetOS · 1.2K tx/s'],
                ['12:04:22', 'Diagnostic scan complete · 0 anomalies'],
                ['12:04:18', 'TR-04 / SF_BAY → handshake / authenticated'],
                ['12:04:14', 'Load balance · NYC region · 99.4% optimal'],
                ['12:04:11', 'Settlement batch #88141 finalized'],
                ['12:04:08', 'Edge telemetry · 4.8M readings/hr'],
              ].map(([t, m], i) => (
                <div key={i} className="feed-line"><span className="tag">[{t}]</span>{m}</div>
              ))}
            </div>
          </div>
          <div className="mono" style={{ fontSize: '0.6rem', color: ACCENT, fontWeight: 800, textAlign: 'right', letterSpacing: 1.5 }}>● LIVE</div>
        </div>
      </section>

      {/* GLOBAL COVERAGE — map section */}
      <section style={{ position: 'relative', padding: '160px 80px 140px', background: '#080a09', borderTop: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: `radial-gradient(${BORDER} 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)' }} />

        <div style={{ maxWidth: 1500, margin: '0 auto', position: 'relative', zIndex: 5 }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'end', marginBottom: 70 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: '0.7rem', color: ACCENT, fontWeight: 900, letterSpacing: 5, marginBottom: 22 }}>
                <span style={{ width: 28, height: 1, background: ACCENT }} />
                GLOBAL_COVERAGE / REAL-TIME
              </div>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)', fontWeight: 900, letterSpacing: -2, lineHeight: 0.95 }}>
                ONE NETWORK.<br />EVERY <span style={{ color: ACCENT }}>CONTINENT</span>.
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: `1px solid ${BORDER}`, position: 'relative', background: 'rgba(0,0,0,0.4)' }}>
              <span className="bracket bracket-tl" /><span className="bracket bracket-tr" />
              <span className="bracket bracket-bl" /><span className="bracket bracket-br" />
              {[
                { v: '47', l: 'COUNTRIES', acc: false },
                { v: '2,847', l: 'STATIONS', acc: true },
                { v: '184M', l: 'kWh / YR', acc: false },
                { v: '5', l: 'CONTINENTS', acc: true },
              ].map((s, i) => (
                <div key={i} style={{ padding: '22px 12px', borderRight: i < 3 ? `1px solid ${BORDER}` : 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: s.acc ? ACCENT : '#fff', letterSpacing: -1 }}>{s.v}</div>
                  <div className="mono" style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)', letterSpacing: 2.5, fontWeight: 800, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* MAP CANVAS */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '2.2 / 1', background: 'rgba(0,0,0,0.55)', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <span className="bracket bracket-tl" /><span className="bracket bracket-tr" />
            <span className="bracket bracket-bl" /><span className="bracket bracket-br" />

            {/* World map base */}
            <img src={worldMap} alt="world" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, filter: 'grayscale(1) brightness(0.55) contrast(1.5) hue-rotate(60deg) saturate(2)', mixBlendMode: 'screen' }} />

            {/* Overlay grid lines */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`, backgroundSize: '60px 60px', opacity: 0.4 }} />

            {/* Vertical scanline */}
            <motion.div animate={{ left: ['-2%', '102%'] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, transparent, ${ACCENT}, transparent)`, boxShadow: `0 0 24px ${ACCENT}`, opacity: 0.7 }} />

            {/* Pulsing station nodes */}
            {[
              { city: 'NEW YORK', x: '24%', y: '40%', count: '247' },
              { city: 'LA', x: '15%', y: '46%', count: '198' },
              { city: 'SAO PAULO', x: '32%', y: '70%', count: '67' },
              { city: 'LONDON', x: '47%', y: '34%', count: '184' },
              { city: 'BERLIN', x: '51%', y: '36%', count: '128' },
              { city: 'DUBAI', x: '60%', y: '48%', count: '89' },
              { city: 'TOKYO', x: '83%', y: '42%', count: '312' },
              { city: 'SINGAPORE', x: '76%', y: '60%', count: '156' },
              { city: 'SYDNEY', x: '86%', y: '76%', count: '94' },
            ].map((c, i) => (
              <div key={i} style={{ position: 'absolute', left: c.x, top: c.y, transform: 'translate(-50%, -50%)', zIndex: 8 }}>
                <motion.div className="circle" animate={{ scale: [1, 3, 1], opacity: [0.7, 0, 0.7] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.25 }} style={{ position: 'absolute', inset: -3, border: `1px solid ${ACCENT}`, width: 14, height: 14 }} />
                <div className="circle" style={{ width: 8, height: 8, background: ACCENT, boxShadow: `0 0 14px ${ACCENT}` }} />
                <div className="mono" style={{ position: 'absolute', left: 16, top: -4, fontSize: '0.55rem', color: 'rgba(255,255,255,0.75)', letterSpacing: 1.5, fontWeight: 800, whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                  {c.city}<br /><span style={{ color: ACCENT }}>● {c.count}</span>
                </div>
              </div>
            ))}

            {/* Top-left readout */}
            <div className="mono" style={{ position: 'absolute', top: 24, left: 28, fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', fontWeight: 800, letterSpacing: 2, lineHeight: 1.6 }}>
              <div>// COVERAGE_MAP_v4.7</div>
              <div style={{ color: ACCENT }}>● 9 NODES VISIBLE</div>
            </div>
            {/* Bottom-right readout */}
            <div className="mono" style={{ position: 'absolute', bottom: 24, right: 28, fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', fontWeight: 800, letterSpacing: 2, textAlign: 'right', lineHeight: 1.6 }}>
              <div>LAT/LON · LIVE</div>
              <div style={{ color: ACCENT }}>SYNC · OK</div>
            </div>
            {/* Crosshair center */}
            <div className="mono" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)', letterSpacing: 2 }}>+</div>
          </div>

          {/* Region cards row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 30, border: `1px solid ${BORDER}`, position: 'relative', background: 'rgba(0,0,0,0.3)' }}>
            <span className="bracket bracket-tl" /><span className="bracket bracket-tr" />
            <span className="bracket bracket-bl" /><span className="bracket bracket-br" />
            {[
              { region: 'NORTH AMERICA', stations: '847', flag: 'NA', growth: '+18% Q4' },
              { region: 'EUROPE', stations: '1,124', flag: 'EU', growth: '+24% Q4' },
              { region: 'APAC', stations: '622', flag: 'AP', growth: '+41% Q4' },
              { region: 'MEA / SA', stations: '254', flag: 'MS', growth: '+62% Q4' },
            ].map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ padding: '28px 26px', borderRight: i < 3 ? `1px solid ${BORDER}` : 'none', position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span className="mono" style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', letterSpacing: 2.5, fontWeight: 800 }}>// REGION_0{i + 1}</span>
                  <span className="mono" style={{ fontSize: '0.55rem', color: ACCENT, letterSpacing: 1.5, fontWeight: 800 }}>{r.flag}</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, letterSpacing: -0.5, marginBottom: 14 }}>{r.region}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: '2.1rem', fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: ACCENT, letterSpacing: -1 }}>{r.stations}</span>
                  <span className="mono" style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, fontWeight: 800 }}>STATIONS</span>
                </div>
                <div className="mono" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, fontWeight: 700 }}>↗ {r.growth}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARGE PROTOCOL — 4-step flow */}
      <section style={{ padding: '160px 80px 140px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: `radial-gradient(${BORDER} 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at top, black 30%, transparent 80%)' }} />

        <div style={{ maxWidth: 1500, margin: '0 auto', position: 'relative', zIndex: 5 }}>
          {/* Header */}
          <div style={{ marginBottom: 100, textAlign: 'center' }}>
            <div className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: '0.7rem', color: ACCENT, fontWeight: 900, letterSpacing: 5, marginBottom: 24 }}>
              <span style={{ width: 28, height: 1, background: ACCENT }} />
              CHARGE_PROTOCOL / 04 SEQUENCE
              <span style={{ width: 28, height: 1, background: ACCENT }} />
            </div>
            <h2 style={{ fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)', fontWeight: 900, letterSpacing: -2, lineHeight: 0.95, marginBottom: 20 }}>
              ZERO TO FULL <span style={{ color: ACCENT }}>IN FOUR</span> STEPS
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.65 }}>
              From driver tap to ledger settlement, every charge follows a deterministic four-stage protocol — measured to the millisecond.
            </p>
          </div>

          {/* STEPS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
            {/* base track */}
            <div style={{ position: 'absolute', top: 40, left: '12.5%', right: '12.5%', height: 1, background: BORDER, zIndex: 0 }} />
            {/* traveling pulse */}
            <motion.div
              animate={{ left: ['8%', '92%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 38, width: 60, height: 5, background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`, boxShadow: `0 0 16px ${ACCENT}`, zIndex: 1, transform: 'translateX(-50%)' }}
            />

            {[
              { num: '01', tag: 'INITIATE', title: 'AUTHENTICATE', desc: 'RFID tap or app handshake. Identity verified, vehicle paired, session opened.', time: '< 200ms' },
              { num: '02', tag: 'NEGOTIATE', title: 'HANDSHAKE', desc: 'OCPP / ISO 15118 negotiation. Battery profile read, optimal curve calculated.', time: '< 400ms' },
              { num: '03', tag: 'DELIVER', title: 'CHARGE', desc: 'Adaptive power curve, real-time grid balancing, liquid-cooled at full output.', time: '15-30 min' },
              { num: '04', tag: 'CLOSE', title: 'SETTLE', desc: 'Auto-billing across currencies, fleet ledger sync, receipt to driver in 4ms.', time: '< 4ms' },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.12 }}
                style={{ padding: '0 14px', position: 'relative', zIndex: 2 }}
              >
                {/* Step number disc */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 30 }}>
                  <div className="circle" style={{ width: 80, height: 80, background: 'rgba(10,13,12,0.95)', border: `1px solid ${ACCENT}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: `0 0 30px rgba(124,255,0,0.18)` }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 12 + i * 2, ease: 'linear' }} className="circle" style={{ position: 'absolute', inset: -6, border: `1px dashed ${ACCENT}55` }} />
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: ACCENT, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>{s.num}</div>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))', border: `1px solid ${BORDER}`, padding: 26, position: 'relative', minHeight: 240, transition: '0.4s' }} className="protocol-card">
                  <span className="bracket bracket-tl" /><span className="bracket bracket-br" />
                  <div className="mono" style={{ fontSize: '0.55rem', color: ACCENT, letterSpacing: 2.5, fontWeight: 800, marginBottom: 12 }}>// {s.tag}</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: -0.5, marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 22 }}>{s.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
                    <span className="mono" style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5, fontWeight: 800 }}>EXEC TIME</span>
                    <span className="mono" style={{ fontSize: '0.9rem', color: ACCENT, fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{s.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* TOTAL IMPACT BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ marginTop: 80, border: `1px solid ${BORDER}`, padding: '32px 40px', background: 'rgba(0,0,0,0.45)', position: 'relative', display: 'grid', gridTemplateColumns: '1fr repeat(3, auto)', gap: 60, alignItems: 'center', backdropFilter: 'blur(20px)' }}
          >
            <span className="bracket bracket-tl" /><span className="bracket bracket-tr" />
            <span className="bracket bracket-bl" /><span className="bracket bracket-br" />
            <div>
              <div className="mono" style={{ fontSize: '0.6rem', color: ACCENT, letterSpacing: 3, fontWeight: 800, marginBottom: 8 }}>// TOTAL_IMPACT · Q4_2026</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: -0.5 }}>EVERY CHARGE COMPOUNDS.</div>
            </div>
            {[
              { v: '184M', l: 'kWh DELIVERED' },
              { v: '92K', l: 'TONS CO₂ OFFSET' },
              { v: '1.2B', l: 'MILES POWERED' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: `1px solid ${BORDER}`, paddingLeft: 32 }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: ACCENT, fontVariantNumeric: 'tabular-nums', letterSpacing: -1 }}>{m.v}</div>
                <div className="mono" style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', letterSpacing: 2.5, fontWeight: 800, marginTop: 4 }}>{m.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HUB INSPECTION (preserved) */}
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
