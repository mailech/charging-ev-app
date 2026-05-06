import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion';
import logo from './assets/logo.png'
import charger3d from './assets/charger-3d.png'
import hub3d from './assets/Screenshot_2026-05-05_004406-removebg-preview.png'
import serviceImg from './assets/Screenshot_2026-05-06_131630-removebg-preview-Picsart-AiImageEnhancer.png'

const ACCENT = '#9FE870'           // muted electric lime
const ACCENT_SOFT = '#6BAA75'      // secondary energy green
const BG = '#0B0F0D'               // dark graphite primary
const SURFACE = '#111715'          // secondary surface
const CARD = '#151B18'             // card surface
const BORDER = 'rgba(120,255,120,0.08)'
const BORDER_STRONG = 'rgba(159,232,112,0.18)'
const TEXT = '#F5F7F6'
const TEXT_DIM = '#8C948F'

// --- HUD CARD ---
const HUDCard = ({ title, value, unit }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
    style={{ background: CARD, border: `1px solid ${BORDER}`, padding: '16px 22px', minWidth: '170px', borderRadius: 12 }}
  >
    <div style={{ fontSize: '0.66rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 6, letterSpacing: 0.02 }}>{title}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ fontSize: '1.6rem', fontWeight: 600, color: TEXT, letterSpacing: -0.02, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontSize: '0.78rem', color: ACCENT_SOFT, fontWeight: 500 }}>{unit}</span>
    </div>
  </motion.div>
);

// --- LIVE STAT (hero strip) ---
const FlipStat = ({ label, value, trend }: any) => (
  <div style={{ padding: '4px 0', paddingRight: 24 }}>
    <div style={{ fontSize: '0.74rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: '1.6rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.02, color: TEXT }}>{value}</div>
    <div style={{ fontSize: '0.7rem', color: ACCENT_SOFT, marginTop: 4, fontWeight: 500 }}>↗ {trend}</div>
  </div>
);

// --- SPARKLINE (synapse cards) ---
const Sparkline = ({ color = ACCENT, points }: { color?: string, points: number[] }) => {
  const w = 220, h = 44;
  const step = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - (p / 100) * h}`).join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const gid = `g-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '44px', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle r="2" cx={(points.length - 1) * step} cy={h - (points[points.length - 1] / 100) * h} fill={color} />
    </svg>
  );
};

// --- MODULE CARD (synapse) ---
const ModuleCard = ({ idx, title, desc, status, statusColor = ACCENT, metrics, points, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className="module-card"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 500, color: TEXT_DIM }}>0{idx} · Module</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.7rem', fontWeight: 500, color: statusColor }}>
        <span className="circle" style={{ width: 6, height: 6, background: statusColor }} />
        {status.toLowerCase()}
      </span>
    </div>

    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8, letterSpacing: -0.02, color: TEXT }}>{title}</h3>
    <p style={{ color: TEXT_DIM, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 22, fontWeight: 400 }}>{desc}</p>

    <Sparkline color={statusColor} points={points} />

    <div style={{ display: 'flex', gap: 24, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
      {metrics.map((m: any) => (
        <div key={m.label} style={{ flex: 1 }}>
          <div style={{ fontSize: '0.7rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 4 }}>{m.label}</div>
          <div style={{ fontSize: '1rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: TEXT, letterSpacing: -0.01 }}>{m.val}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

// --- STATIONS DATA ---
const STATIONS = [
  { id: 'BR-B21', name: 'Patna', state: 'Bihar', lon: 85.14, lat: 25.59, kw: 50, conn: 'CCS' },
  { id: 'BR-B22', name: 'Gaya', state: 'Bihar', lon: 84.99, lat: 24.79, kw: 60, conn: 'CCS' },
  { id: 'BR-B23', name: 'Muzaffarpur', state: 'Bihar', lon: 85.39, lat: 26.12, kw: 25, conn: 'Type 2' },
  { id: 'JH-J31', name: 'Ranchi', state: 'Jharkhand', lon: 85.32, lat: 23.34, kw: 60, conn: 'CCS' },
  { id: 'JH-J32', name: 'Jamshedpur', state: 'JH', lon: 86.18, lat: 22.80, kw: 120, conn: 'CCS' },
  { id: 'JH-J33', name: 'Dhanbad', state: 'Jharkhand', lon: 86.43, lat: 23.79, kw: 50, conn: 'CHAdeMO' },
  { id: 'WB-410', name: 'Kolkata', state: 'West Bengal', lon: 88.36, lat: 22.57, kw: 50, conn: 'CCS' },
  { id: 'WB-411', name: 'Salt Lake', state: 'West Bengal', lon: 88.42, lat: 22.58, kw: 120, conn: 'CCS' },
  { id: 'WB-412', name: 'Howrah', state: 'West Bengal', lon: 88.31, lat: 22.59, kw: 60, conn: 'Type 2' },
  { id: 'WB-413', name: 'New Town', state: 'West Bengal', lon: 88.46, lat: 22.62, kw: 150, conn: 'CCS' },
  { id: 'WB-414', name: 'Durgapur', state: 'West Bengal', lon: 87.31, lat: 23.55, kw: 60, conn: 'CCS' },
  { id: 'MH-M50', name: 'Mumbai South', state: 'Maharashtra', lon: 72.83, lat: 18.93, kw: 150, conn: 'CCS' },
  { id: 'MH-M51', name: 'Navi Mumbai', state: 'Maharashtra', lon: 73.01, lat: 19.03, kw: 60, conn: 'CCS' },
  { id: 'MH-P52', name: 'Pune City', state: 'Maharashtra', lon: 73.85, lat: 18.52, kw: 50, conn: 'Type 2' },
  { id: 'DL-D60', name: 'Connaught Pl', state: 'Delhi', lon: 77.21, lat: 28.63, kw: 120, conn: 'CCS' },
  { id: 'DL-D61', name: 'Noida Sec 62', state: 'Uttar Pradesh', lon: 77.36, lat: 28.61, kw: 60, conn: 'CHAdeMO' },
  { id: 'DL-D62', name: 'Gurgaon PH3', state: 'Haryana', lon: 77.08, lat: 28.48, kw: 150, conn: 'CCS' },
  { id: 'KA-K70', name: 'Indiranagar', state: 'Karnataka', lon: 77.64, lat: 12.97, kw: 50, conn: 'Type 2' },
  { id: 'KA-K71', name: 'Whitefield', state: 'Karnataka', lon: 77.75, lat: 12.96, kw: 120, conn: 'CCS' },
  { id: 'TN-T80', name: 'Chennai Central', state: 'Tamil Nadu', lon: 80.27, lat: 13.08, kw: 60, conn: 'CCS' },
  { id: 'TN-T81', name: 'OMR Gateway', state: 'Tamil Nadu', lon: 80.23, lat: 12.89, kw: 150, conn: 'CCS' },
];

export default function App() {
  const [sessions] = useState([
    { id: 'TR-01', status: 'CHARGING', power: '150kW' },
    { id: 'TR-04', status: 'READY', power: '0kW' },
    { id: 'TR-09', status: 'CHARGING', power: '350kW' },
  ]);

  const [clock, setClock] = useState('');
  const [stationsOnline, setStationsOnline] = useState(2847);
  const [kwhToday, setKwhToday] = useState(184206);
  const [indiaGeo, setIndiaGeo] = useState<{ countryPath: string; states: { name: string; path: string }[]; project: (lon: number, lat: number) => [number, number] } | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<'home'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [connFilter, setConnFilter] = useState('Any');
  const [minPower, setMinPower] = useState(0);
  const [selectedStationId, setSelectedStationId] = useState('WB-410');
  const [activeService, setActiveService] = useState(0);

  const filteredStations = STATIONS.filter(s => {
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConn = connFilter === 'Any' || s.conn === connFilter;
    const matchesPower = s.kw >= minPower;
    return matchesQuery && matchesConn && matchesPower;
  });

  const selectedStation = STATIONS.find(s => s.id === selectedStationId) || STATIONS[0];

  const focusedState = indiaGeo?.states.find(s =>
    searchQuery.length > 2 && s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )?.name || null;

  // Map Component for reuse
  const IndiaMap = ({ highlighted, onHover }: { highlighted?: string | null, onHover?: (name: string | null) => void }) => {
    if (!indiaGeo) return <div style={{ color: TEXT_DIM, fontSize: '0.8rem' }}>Initializing GeoData...</div>;
    return (
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <path d={indiaGeo.countryPath} fill="rgba(159,232,112,0.03)" stroke={BORDER} strokeWidth="0.5" fillRule="evenodd" />
        {indiaGeo.states.map((s: any, i: number) => (
          <motion.path
            key={i}
            d={s.path}
            fill={highlighted === s.name ? `${ACCENT}15` : 'transparent'}
            stroke={highlighted === s.name ? ACCENT : BORDER}
            strokeWidth={highlighted === s.name ? 0.8 : 0.3}
            whileHover={{ fill: `${ACCENT}22`, stroke: ACCENT }}
            transition={{ duration: 0.2 }}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover && onHover(s.name)}
            onMouseLeave={() => onHover && onHover(null)}
            onClick={() => setSearchQuery(s.name)}
          />
        ))}
        {filteredStations.map((s, i) => {
          const [x, y] = indiaGeo.project(s.lon, s.lat);
          const isSelected = s.id === selectedStationId;
          return (
            <motion.g
              key={s.id}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={(e) => { e.stopPropagation(); setSelectedStationId(s.id); }}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={x} cy={y} r={isSelected ? 3 : 1.5} fill={isSelected ? ACCENT : '#fff'} opacity={isSelected ? 1 : 0.6} />
              {isSelected && (
                <circle cx={x} cy={y} r={6} stroke={ACCENT} strokeWidth="0.5" fill="none">
                  <animate attributeName="r" from="3" to="8" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
            </motion.g>
          );
        })}
      </svg>
    );
  };

  const navigate = (target: string) => {
    if (target === 'find-stations') {
      setPage('find-stations');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === '#top' || target === 'home') {
      setPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setPage('home');
      setTimeout(() => {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

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

  // Fetch real India GeoJSON and build projected SVG path
  useEffect(() => {
    let cancelled = false;
    const SOURCES = [
      'https://cdn.jsdelivr.net/gh/adarshbiradar/maps-geojson@master/india.json',
      'https://cdn.jsdelivr.net/gh/Subhash9325/GeoJson-Data-of-Indian-States@master/Indian_States',
    ];
    (async () => {
      let geo: any = null;
      for (const url of SOURCES) {
        try {
          const r = await fetch(url, { mode: 'cors' });
          if (!r.ok) continue;
          geo = await r.json();
          if (geo) break;
        } catch (e) { /* try next */ }
      }
      if (cancelled || !geo?.features) return;

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const eachRing = (coords: any, fn: (p: number[]) => void) => { for (const ring of coords) for (const p of ring) fn(p); };
      const eachGeom = (g: any, fn: (p: number[]) => void) => {
        if (!g) return;
        if (g.type === 'Polygon') eachRing(g.coordinates, fn);
        else if (g.type === 'MultiPolygon') for (const p of g.coordinates) eachRing(p, fn);
      };
      for (const f of geo.features) {
        eachGeom(f.geometry, (pt: number[]) => {
          const x = pt[0], y = -pt[1];
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        });
      }

      // Project into viewBox 0 0 200 200 (matches Loader.html exactly)
      const PAD = 22, W = 200, H = 200;
      const dataW = maxX - minX, dataH = maxY - minY;
      const scale = Math.min((W - PAD * 2) / dataW, (H - PAD * 2) / dataH);
      const offX = (W - dataW * scale) / 2 - minX * scale;
      const offY = (H - dataH * scale) / 2 - minY * scale;
      const project = (lon: number, lat: number): [number, number] => [lon * scale + offX, (-lat) * scale + offY];

      const ringToPath = (ring: number[][]) => {
        let d = '';
        for (let i = 0; i < ring.length; i++) {
          const [x, y] = project(ring[i][0], ring[i][1]);
          d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
        }
        return d + 'Z';
      };
      const geomToPath = (g: any): string => {
        if (!g) return '';
        if (g.type === 'Polygon') return g.coordinates.map(ringToPath).join(' ');
        if (g.type === 'MultiPolygon') return g.coordinates.map((p: any) => p.map(ringToPath).join(' ')).join(' ');
        return '';
      };

      const states: { name: string; path: string }[] = [];
      let combinedD = '';
      for (const f of geo.features) {
        const d = geomToPath(f.geometry);
        if (!d) continue;
        const name = (f.properties && (f.properties.st_nm || f.properties.NAME_1 || f.properties.ST_NM)) || 'State';
        states.push({ name, path: d });
        combinedD += ' ' + d;
      }
      setIndiaGeo({ countryPath: combinedD.trim(), states, project });
    })();
    return () => { cancelled = true; };
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
      title: 'Load balancing', desc: 'Grid-aware orchestration redistributing kilowatts across stations in real time.',
      status: 'Active', statusColor: ACCENT,
      metrics: [{ label: 'Nodes', val: '2,847' }, { label: 'Balance', val: '99.4%' }],
      points: [40, 55, 35, 70, 50, 80, 45, 75, 60, 88, 55, 72, 65, 90],
    },
    {
      title: 'Smart billing', desc: 'Per-electron settlement engine reconciling fleet ledgers across currencies.',
      status: 'Syncing', statusColor: ACCENT_SOFT,
      metrics: [{ label: 'Tx / sec', val: '1.2K' }, { label: 'Accuracy', val: '100%' }],
      points: [60, 65, 70, 68, 72, 78, 75, 82, 80, 85, 88, 84, 90, 92],
    },
    {
      title: 'Diagnostics', desc: 'Edge telemetry predicting hardware failure 72 hours before incidence.',
      status: 'Scanning', statusColor: ACCENT_SOFT,
      metrics: [{ label: 'Scans / hr', val: '4.8M' }, { label: 'Integrity', val: '99.9%' }],
      points: [70, 50, 80, 45, 75, 55, 85, 60, 78, 65, 82, 70, 88, 76],
    },
    {
      title: 'API integration', desc: 'Universal data bridge connecting fleets, logistics and grid operators in 4 ms.',
      status: 'Linked', statusColor: ACCENT,
      metrics: [{ label: 'Partners', val: '184' }, { label: 'Latency', val: '4ms' }],
      points: [55, 62, 58, 65, 60, 70, 68, 75, 72, 80, 76, 82, 78, 86],
    },
  ];

  return (
    <div style={{ background: BG, color: TEXT, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4 { font-family: 'Inter', sans-serif; font-weight: 600; letter-spacing: -0.022em; color: ${TEXT}; }
        h1 { letter-spacing: -0.035em; }
        h2 { letter-spacing: -0.028em; }
        p { color: ${TEXT_DIM}; }

        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: 'ss01' on; }
        .circle { border-radius: 9999px; }
        .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${ACCENT_SOFT}; font-weight: 500; }

        .btn-accent { background: ${ACCENT}; color: #0B0F0D; border: none; padding: 14px 26px; font-weight: 600; font-size: 0.88rem; letter-spacing: 0; cursor: pointer; transition: 220ms cubic-bezier(0.22, 1, 0.36, 1); border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; font-family: 'Inter', sans-serif; }
        .btn-accent:hover { background: #B5F08A; transform: translateY(-1px); }
        .btn-ghost { background: transparent; color: ${TEXT}; border: 1px solid rgba(245,247,246,0.12); padding: 14px 26px; font-weight: 500; font-size: 0.88rem; cursor: pointer; transition: 220ms cubic-bezier(0.22, 1, 0.36, 1); border-radius: 8px; font-family: 'Inter', sans-serif; }
        .btn-ghost:hover { background: rgba(245,247,246,0.04); border-color: rgba(245,247,246,0.22); }

        .glass-card { background: ${CARD}; border: 1px solid ${BORDER}; transition: 220ms cubic-bezier(0.22, 1, 0.36, 1); border-radius: 14px; }
        .glass-card:hover { border-color: ${BORDER_STRONG}; transform: translateY(-2px); }
        .grid-bg { background-image: radial-gradient(rgba(245,247,246,0.025) 1px, transparent 1px); background-size: 56px 56px; }

        /* Bracket corner ornaments — tiny + subtle */
        .bracket { position: absolute; width: 8px; height: 8px; border: 1px solid ${ACCENT_SOFT}; opacity: 0.35; pointer-events: none; }
        .bracket-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
        .bracket-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
        .bracket-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; }
        .bracket-br { bottom: 10px; right: 10px; border-left: none; border-top: none; }

        /* Pulse dot ring — subtle */
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.55; } 100% { transform: scale(2.2); opacity: 0; } }
        .pulse-dot { position: relative; }
        .pulse-dot::after { content: ''; position: absolute; inset: -3px; border-radius: 9999px; border: 1px solid currentColor; animation: pulse-ring 2.4s ease-out infinite; }

        /* Marquee ticker */
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker { width: 100%; overflow: hidden; border-top: 1px solid ${BORDER}; border-bottom: 1px solid ${BORDER}; background: ${SURFACE}; padding: 14px 0; }
        .ticker-track { display: flex; gap: 56px; white-space: nowrap; animation: marquee 90s linear infinite; will-change: transform; }
        .ticker-item { font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; letter-spacing: 0.04em; color: ${TEXT_DIM}; font-weight: 500; }
        .ticker-item .acc { color: ${ACCENT_SOFT}; }
        .ticker-item .sep { color: rgba(245,247,246,0.12); margin: 0 10px; }

        /* MODULE CARD — refined */
        .module-card { background: ${CARD}; border: 1px solid ${BORDER}; padding: 28px; position: relative; transition: 220ms cubic-bezier(0.22, 1, 0.36, 1); border-radius: 14px; }
        .module-card:hover { border-color: ${BORDER_STRONG}; transform: translateY(-2px); background: #181F1B; }

        /* SYNAPSE GRID */
        .synapse-grid { display: grid; grid-template-columns: minmax(280px, 360px) 1fr minmax(280px, 360px); grid-template-rows: auto auto; gap: 56px 96px; position: relative; max-width: 1440px; margin: 0 auto; }
        .core-col { grid-column: 2; grid-row: 1 / span 2; display: flex; align-items: center; justify-content: center; position: relative; min-height: 460px; }
        .module-nw { grid-column: 1; grid-row: 1; }
        .module-ne { grid-column: 3; grid-row: 1; }
        .module-sw { grid-column: 1; grid-row: 2; }
        .module-se { grid-column: 3; grid-row: 2; }
        .synapse-connectors { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }

        /* Event feed */
        @keyframes feed-scroll { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .event-feed-container { max-width: 1440px; margin: 96px auto 0; border: 1px solid ${BORDER}; padding: 18px 22px; background: ${SURFACE}; display: grid; grid-template-columns: 200px 1fr 80px; gap: 28px; align-items: center; border-radius: 12px; }
        .feed-window { height: 22px; overflow: hidden; position: relative; font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; letter-spacing: 0.02em; }
        .feed-track { animation: feed-scroll 36s linear infinite; }
        .feed-line { height: 22px; line-height: 22px; color: ${TEXT_DIM}; font-weight: 500; }
        .feed-line .tag { color: ${ACCENT_SOFT}; margin-right: 10px; }

        /* ======================================================
           NETWORK MAP — refined, premium dashboard aesthetic
           ====================================================== */
        .loader-section { background: ${BG}; color: ${TEXT}; }
        .loader-stage { width: 460px; height: 460px; position: relative; display: grid; place-items: center; }
        .loader-stage svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }

        .loader-hud-overlay { position: absolute; inset: -36px; pointer-events: none; z-index: 10; font-family: 'JetBrains Mono', monospace; }
        .loader-hud-corner { position: absolute; width: 18px; height: 18px; border: 1px solid ${ACCENT_SOFT}; opacity: 0.45; }
        .loader-corner-tl { top: 0; left: 0; border-right: 0; border-bottom: 0; }
        .loader-corner-tr { top: 0; right: 0; border-left: 0; border-bottom: 0; }
        .loader-corner-bl { bottom: 0; left: 0; border-right: 0; border-top: 0; }
        .loader-corner-br { bottom: 0; right: 0; border-left: 0; border-top: 0; }

        .loader-hud-labels { position: absolute; inset: 18px; color: ${ACCENT_SOFT}; font-size: 10px; letter-spacing: 0.12em; }
        .loader-hud-top-left { position: absolute; top: 0; left: 0; line-height: 1.7; text-transform: uppercase; }
        .loader-hud-bottom-right { position: absolute; bottom: 0; right: 0; text-align: right; line-height: 1.7; text-transform: uppercase; }
        .loader-accent-white { color: ${TEXT}; }
        .loader-hud-brand-text { display: none; }

        .loader-hud-scanline { display: none; }

        .loader-ring-wrap { z-index: 1; pointer-events: none; }
        .loader-ring-track { fill: none; stroke: rgba(245,247,246,0.06); stroke-width: 1; }
        .loader-ring-fill { fill: none; stroke: ${ACCENT_SOFT}; stroke-opacity: 0.35; stroke-width: 1; stroke-linecap: round; stroke-dasharray: 3 6; }
        .loader-ring-ticks line { stroke: rgba(159,232,112,0.18); stroke-width: 0.6; }

        .loader-car-body { fill: ${ACCENT}; }
        .loader-car-glass { fill: rgba(11,15,13,0.85); }
        .loader-car-wheel { fill: #0B0F0D; }
        .loader-car-light { fill: ${TEXT}; }

        .loader-map { z-index: 2; }
        .loader-country { fill: rgba(159,232,112,0.025); stroke: ${ACCENT_SOFT}; stroke-width: 0.6; stroke-opacity: 0.55; stroke-linejoin: round; stroke-linecap: round; pointer-events: none; }
        .loader-state { fill: transparent; stroke: ${ACCENT_SOFT}; stroke-width: 0.25; stroke-opacity: 0.22; stroke-linejoin: round; stroke-linecap: round; cursor: pointer; transition: all 220ms cubic-bezier(0.22, 1, 0.36, 1); }
        .loader-state:hover { fill: rgba(159,232,112,0.08); stroke-opacity: 0.6; }
        .loader-station-label { fill: ${TEXT}; font-size: 5.5px; font-weight: 600; letter-spacing: 0.04em; pointer-events: none; font-family: 'Inter', sans-serif; }
        .loader-station-count { fill: ${TEXT_DIM}; font-size: 4.8px; opacity: 0.85; font-weight: 500; }

        .loader-tooltip { position: absolute; pointer-events: none; background: ${CARD}; color: ${TEXT}; font-size: 11px; letter-spacing: 0.02em; padding: 6px 10px; border: 1px solid ${BORDER_STRONG}; border-radius: 6px; white-space: nowrap; transform: translate(-50%, -130%); opacity: 0; transition: opacity 180ms ease; z-index: 10; font-family: 'Inter', sans-serif; font-weight: 500; }
        .loader-tooltip::after { content: ""; position: absolute; left: 50%; bottom: -4px; transform: translateX(-50%) rotate(45deg); width: 8px; height: 8px; background: ${CARD}; border-right: 1px solid ${BORDER_STRONG}; border-bottom: 1px solid ${BORDER_STRONG}; }
        .loader-tooltip.show { opacity: 1; }
        .loader-tooltip .accent { color: ${ACCENT}; }

        .loader-stations { z-index: 3; pointer-events: none; }
        .loader-station-core { fill: ${ACCENT}; animation: loader-blink 3s ease-in-out infinite; animation-delay: var(--delay, 0s); }
        .loader-station-pulse { fill: none; stroke: ${ACCENT_SOFT}; stroke-width: 0.7; transform-origin: var(--cx) var(--cy); animation: loader-pulse 3s ease-out infinite; animation-delay: var(--delay, 0s); }
        .loader-station-halo { fill: rgba(11,15,13,0.5); }
        @keyframes loader-pulse { 0% { transform: scale(0.5); opacity: 0.55; } 80% { transform: scale(2.2); opacity: 0; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes loader-blink { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }

        .loader-bolt { display: none; }

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
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: '72px', display: 'flex', alignItems: 'center', padding: '0 88px', background: 'rgba(11,15,13,0.78)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('#top')}>
          <img src={logo} alt="TRIO" style={{ height: '96px', width: 'auto', position: 'absolute', left: 0, objectFit: 'contain' }} />
        </div>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 32 }}>
          {[
            { label: 'Why TRIO', target: '#platform' },
            { label: 'Network', target: '#network' },
            { label: 'Find stations', target: 'find-stations' },
            { label: 'Plans', target: '#plans' },
          ].map(l => (
            <a key={l.label} href={l.target.startsWith('#') ? l.target : '#'} onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ color: TEXT_DIM, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'color 200ms', cursor: 'pointer' }} onMouseEnter={(e: any) => e.target.style.color = TEXT} onMouseLeave={(e: any) => e.target.style.color = TEXT_DIM}>{l.label}</a>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="#" style={{ color: TEXT_DIM, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500 }}>Sign in</a>
          <button className="btn-accent" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>Get started</button>
        </div>
      </nav>

      {page === 'home' && (
        <>
          {/* HERO — refined, premium */}
          <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 80, background: BG }}>
            {/* Subtle ambient gradient */}
            <div style={{ position: 'absolute', right: '-10%', top: '15%', width: 760, height: 760, background: `radial-gradient(circle, ${ACCENT_SOFT}22, transparent 60%)`, pointerEvents: 'none', borderRadius: '50%' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 80, padding: '80px 88px 0', alignItems: 'center', minHeight: 'calc(100vh - 200px)', position: 'relative', zIndex: 5, maxWidth: 1440, margin: '0 auto' }}>

              {/* LEFT COLUMN */}
              <div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  {/* Eyebrow */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 32, padding: '6px 12px', border: `1px solid ${BORDER}`, borderRadius: 999, background: SURFACE }}>
                    <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                    <span className="eyebrow" style={{ color: ACCENT_SOFT, fontSize: '0.68rem' }}>Live network · {clock || '--:--:--'}</span>
                  </div>

                  {/* TITLE */}
                  <h1 style={{ fontSize: 'clamp(2.8rem, 5.6vw, 5.6rem)', lineHeight: 1.02, marginBottom: 28, fontWeight: 600 }}>
                    <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'block' }}>
                      EV power,
                    </motion.span>
                    <motion.span initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'block', color: ACCENT }}>
                      redefined.
                    </motion.span>
                  </h1>

                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    style={{ color: TEXT_DIM, fontSize: '1.1rem', lineHeight: 1.65, marginBottom: 40, maxWidth: '520px', fontWeight: 400 }}
                  >
                    The intelligence layer for industrial-scale charging infrastructure — orchestrating every electron from grid to vehicle, in real time.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                    style={{ display: 'flex', gap: 12, marginBottom: 64 }}
                  >
                    <button className="btn-accent">Find a station <span style={{ fontSize: '1rem' }}>→</span></button>
                    <button className="btn-ghost">Platform overview</button>
                  </motion.div>

                  {/* STAT STRIP */}
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 640, gap: 0 }}
                  >
                    <FlipStat label="Stations live" value={stationsOnline.toLocaleString()} trend="+12 / 24h" />
                    <FlipStat label="kWh delivered today" value={kwhToday.toLocaleString()} trend="Live" />
                    <FlipStat label="Avg session" value="22:14" trend="-1.4%" />
                  </motion.div>
                </motion.div>
              </div>

              {/* RIGHT COLUMN — charger */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px' }}>
                {/* Soft floor gradient */}
                <div style={{ position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)', width: '90%', height: '40%', background: `radial-gradient(ellipse at center, ${ACCENT_SOFT}1f, transparent 65%)`, pointerEvents: 'none' }} />

                {/* charger image */}
                <motion.img
                  src={charger3d}
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: '100%', maxWidth: '680px', position: 'relative', zIndex: 5 }}
                />

                {/* HUD cards */}
                <div style={{ position: 'absolute', top: '12%', right: '0%', zIndex: 20 }}>
                  <HUDCard title="Max output" value="350" unit="kW" />
                </div>
                <div style={{ position: 'absolute', bottom: '22%', left: '-2%', zIndex: 20 }}>
                  <HUDCard title="System uptime" value="99.9" unit="%" />
                </div>
              </div>
            </div>

            {/* Bottom ticker — calm */}
            <div className="ticker" style={{ position: 'relative', marginTop: 64 }}>
              <div className="ticker-track">
                {[...tickerItems, ...tickerItems].map((it, i) => {
                  const parts = it.split(' / ');
                  const isCharging = parts[2] === 'CHARGING';
                  return (
                    <span key={i} className="ticker-item">
                      <span style={{ color: isCharging ? ACCENT_SOFT : TEXT_DIM }}>●</span>{' '}
                      <span style={{ color: TEXT, fontWeight: 600 }}>{parts[0]}</span>
                      <span className="sep">·</span>{parts[1]}
                      <span className="sep">·</span><span style={{ color: isCharging ? ACCENT_SOFT : TEXT_DIM }}>{parts[2].toLowerCase()}</span>
                      <span className="sep">·</span>{parts[3]}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>

          {/* OUR SERVICES */}
          <section id="services" style={{ padding: '140px 88px 120px', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
            <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative', zIndex: 5 }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 80 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', color: '#e0e0e0', marginBottom: 16, textTransform: 'uppercase' }}>
                  EXPLORE OUR SERVICES
                </div>
                <h2 style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)', fontWeight: 800, letterSpacing: -0.01, marginBottom: 20, textTransform: 'uppercase', background: 'linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 45%, #606060 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))' }}>
                  OUR SERVICES
                </h2>
                <p style={{ color: TEXT_DIM, fontSize: '1.05rem', fontWeight: 400, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
                  We provide the best services for your electric vehicles, Fast,<br />Convenient and Eco-friendly.
                </p>
              </div>

              {/* Main Content Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center', marginTop: 40 }}>
                {/* Left: Image & Description */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: 40 }}>
                    <img src={serviceImg} alt="Eco Charging" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center' }} />
                  </div>

                  {/* Active Service Description */}
                  {(() => {
                    const SERVICES = [
                      { title: 'CHARGING SOLUTIONS', desc: 'We offer Level 2 charging, which provides a moderate charging speed at 240V, ideal for daily use and longer stops.' },
                      { title: 'USER CONVENIENCE', desc: 'Locate stations, start charging, and pay seamlessly using our mobile app. Enjoy real-time availability and smart routing.' },
                      { title: 'ENERGY MANAGEMENT', desc: 'Our hubs are powered by 100% renewable energy with BESS stabilization for grid resilience and zero carbon footprint.' },
                      { title: 'MAINTENANCE AND SUPPORT', desc: '24/7 dedicated support team with real-time telemetry and predictive maintenance to ensure 99.99% uptime.' }
                    ];
                    return (
                      <div style={{ paddingLeft: 12 }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: 14, letterSpacing: -0.01 }}>
                          {SERVICES[activeService].title}
                        </h3>
                        <p style={{ color: TEXT_DIM, fontSize: '1rem', lineHeight: 1.6, maxWidth: '90%' }}>
                          {SERVICES[activeService].desc}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Right: List of Services */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { title: 'CHARGING SOLUTIONS' },
                    { title: 'USER CONVENIENCE' },
                    { title: 'ENERGY MANAGEMENT' },
                    { title: 'MAINTENANCE AND SUPPORT' }
                  ].map((srv, idx) => {
                    const isActive = activeService === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveService(idx)}
                        style={{
                          padding: '36px 32px',
                          cursor: 'pointer',
                          position: 'relative',
                          borderBottom: idx === 3 ? 'none' : `1px solid rgba(255,255,255,0.06)`,
                          background: isActive ? 'linear-gradient(90deg, rgba(132, 204, 22, 0.08) 0%, transparent 100%)' : 'transparent',
                          transition: 'all 0.3s ease',
                          borderLeft: isActive ? `4px solid #84cc16` : '4px solid transparent'
                        }}
                      >
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: isActive ? '#84cc16' : '#ffffff', textTransform: 'uppercase', letterSpacing: -0.01, transition: 'color 0.3s ease' }}>
                          {srv.title}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* INDIA COVERAGE — operational dashboard */}
          <section id="network" className="loader-section" style={{ position: 'relative', padding: '140px 88px 140px', borderTop: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <div style={{ maxWidth: 1440, margin: '0 auto 56px' }}>
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'end' }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>India coverage · Real-time</div>
                  <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.4rem)', fontWeight: 600, marginBottom: 14, letterSpacing: -0.028 }}>
                    One network. <span style={{ color: TEXT_DIM, fontWeight: 400 }}>Every state.</span>
                  </h2>
                  <p style={{ color: TEXT_DIM, fontSize: '1.05rem', maxWidth: 540, lineHeight: 1.65, fontWeight: 400 }}>
                    National-scale charging intelligence — every metro online, every kilowatt accounted for.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1px solid ${BORDER}`, borderRadius: 12, background: CARD }}>
                  {[
                    { v: '1,847', l: 'Stations' },
                    { v: '142M', l: 'kWh / yr' },
                    { v: '28', l: 'States' },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '16px 18px', borderRight: i < 2 ? `1px solid ${BORDER}` : 'none' }}>
                      <div style={{ fontSize: '0.7rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 4 }}>{s.l}</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 600, color: TEXT, letterSpacing: -0.02, fontVariantNumeric: 'tabular-nums' }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* DASHBOARD GRID */}
            <div style={{ maxWidth: 1440, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 24 }}>

              {/* LEFT — Map panel */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 6 }}>Coverage map</div>
                    <div style={{ color: TEXT, fontWeight: 500, fontSize: '0.92rem' }}>9 metros · all online</div>
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', color: ACCENT_SOFT, fontWeight: 500 }}>
                    <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                    Sync OK
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                  <div className="loader-stage" ref={stageRef}>

                    {/* HUD overlay */}
                    <div className="loader-hud-overlay">
                      <div className="loader-hud-corner loader-corner-tl" />
                      <div className="loader-hud-corner loader-corner-tr" />
                      <div className="loader-hud-corner loader-corner-bl" />
                      <div className="loader-hud-corner loader-corner-br" />

                      <div className="loader-hud-labels">
                        <div className="loader-hud-top-left">
                          <div>{'// COVERAGE_MAP_v4.7 / IN'}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: '#fff', fontSize: 16, lineHeight: 0 }}>•</span>
                            9 METROS VISIBLE
                          </div>
                        </div>

                        <div className="loader-hud-bottom-right">
                          <div>GEO . BHARAT</div>
                          <div>SYNC . <span className="loader-accent-white">OK</span></div>
                        </div>

                        <div className="loader-hud-brand-text">
                          <div className="loader-hud-brand-title">INDIA_COVERAGE / REAL-TIME</div>
                          <div>ONE NETWORK.</div>
                          <div>EVERY STATE.</div>
                        </div>
                      </div>

                      <div className="loader-hud-scanline" />
                    </div>

                    {/* Bolt behind map */}
                    <svg viewBox="0 0 200 200" className="loader-bolt" aria-hidden="true">
                      <path d="M 108 70 L 86 104 L 100 104 L 92 132 L 116 96 L 102 96 Z" />
                    </svg>

                    {/* Charging progress ring + EV car */}
                    <svg viewBox="0 0 200 200" className="loader-ring-wrap" aria-hidden="true">
                      <circle className="loader-ring-track" cx="100" cy="100" r="92" />
                      <g className="loader-ring-ticks">
                        {Array.from({ length: 12 }).map((_, i) => {
                          const a = (i / 12) * Math.PI * 2;
                          const x1 = 100 + Math.cos(a) * 96;
                          const y1 = 100 + Math.sin(a) * 96;
                          const x2 = 100 + Math.cos(a) * 100;
                          const y2 = 100 + Math.sin(a) * 100;
                          return <line key={i} x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} />;
                        })}
                      </g>
                      <circle className="loader-ring-fill" cx="100" cy="100" r="92" />

                      <g>
                        <rect className="loader-car-body" x="-9" y="-2" width="18" height="4" rx="1.6" />
                        <path className="loader-car-body" d="M -5 -2 L -3 -4.8 L 4 -4.8 L 6 -2 Z" />
                        <path className="loader-car-glass" d="M -3.8 -2.2 L -2.2 -4 L 3.2 -4 L 4.8 -2.2 Z" />
                        <circle className="loader-car-wheel" cx="-5.5" cy="2.2" r="1.5" />
                        <circle className="loader-car-wheel" cx="5.5" cy="2.2" r="1.5" />
                        <rect className="loader-car-light" x="8.4" y="-1.2" width="1.2" height="1.6" rx="0.3" />
                        <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
                          <mpath href="#loaderCarPath" />
                        </animateMotion>
                      </g>

                      <path id="loaderCarPath" d="M 8 100 A 92 92 0 0 1 192 100 A 92 92 0 0 1 8 100" fill="none" stroke="none" />
                    </svg>

                    {/* Map: country fill + states with hover */}
                    <svg viewBox="0 0 200 200" className="loader-map">
                      {indiaGeo && (
                        <>
                          <path d={indiaGeo.countryPath} className="loader-country" fillRule="evenodd" />
                          {indiaGeo.states.map((s, i) => (
                            <path
                              key={i}
                              d={s.path}
                              className="loader-state"
                              onMouseEnter={() => setTooltip({ name: s.name, x: 0, y: 0 })}
                              onMouseMove={(e) => {
                                if (!stageRef.current) return;
                                const rect = stageRef.current.getBoundingClientRect();
                                setTooltip({ name: s.name, x: e.clientX - rect.left, y: e.clientY - rect.top });
                              }}
                              onMouseLeave={() => setTooltip(null)}
                            />
                          ))}
                        </>
                      )}
                    </svg>

                    {/* Stations */}
                    <svg viewBox="0 0 200 200" className="loader-stations" aria-hidden="true">
                      {indiaGeo && [
                        { name: 'Delhi', lon: 77.10, lat: 28.70 },
                        { name: 'Mumbai', lon: 72.87, lat: 19.07 },
                        { name: 'Bengaluru', lon: 77.59, lat: 12.97 },
                        { name: 'Chennai', lon: 80.27, lat: 13.08 },
                        { name: 'Kolkata', lon: 88.36, lat: 22.57 },
                        { name: 'Hyderabad', lon: 78.49, lat: 17.39 },
                        { name: 'Pune', lon: 73.85, lat: 18.52 },
                        { name: 'Ahmedabad', lon: 72.57, lat: 23.02 },
                        { name: 'Jaipur', lon: 75.79, lat: 26.92 },
                      ].map((c, i) => {
                        const [x, y] = indiaGeo.project(c.lon, c.lat);
                        const xs = x.toFixed(2);
                        const ys = y.toFixed(2);
                        const delay = `${((i % 7) * 0.32).toFixed(2)}s`;
                        return (
                          <g key={c.name}>
                            <circle cx={xs} cy={ys} r="3.5" className="loader-station-halo" />
                            <circle
                              cx={xs} cy={ys} r="2.5" className="loader-station-pulse"
                              style={{ ['--cx' as any]: `${xs}px`, ['--cy' as any]: `${ys}px`, ['--delay' as any]: delay }}
                            />
                            <circle
                              cx={xs} cy={ys} r="1.6" className="loader-station-core"
                              style={{ ['--delay' as any]: delay }}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Tooltip */}
                    {tooltip && (
                      <div className="loader-tooltip show" style={{ left: tooltip.x, top: tooltip.y }}>
                        <span className="accent">⚡</span> {tooltip.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT — State leaderboard */}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 6 }}>Top states</div>
                    <div style={{ color: TEXT, fontWeight: 500, fontSize: '0.92rem' }}>Stations · live ranking</div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: TEXT_DIM, padding: '4px 10px', border: `1px solid ${BORDER}`, borderRadius: 999 }}>Top 8</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                  {[
                    { name: 'Maharashtra', count: 287, pct: 100, code: 'MH' },
                    { name: 'Delhi NCR', count: 247, pct: 86, code: 'DL' },
                    { name: 'Karnataka', count: 224, pct: 78, code: 'KA' },
                    { name: 'Tamil Nadu', count: 198, pct: 69, code: 'TN' },
                    { name: 'Gujarat', count: 186, pct: 65, code: 'GJ' },
                    { name: 'Telangana', count: 142, pct: 49, code: 'TG' },
                    { name: 'Uttar Pradesh', count: 134, pct: 47, code: 'UP' },
                    { name: 'Rajasthan', count: 98, pct: 34, code: 'RJ' },
                  ].map((s, i) => (
                    <motion.div key={s.name}
                      initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                      style={{ display: 'grid', gridTemplateColumns: '32px 1fr 56px', gap: 14, alignItems: 'center' }}
                    >
                      <span style={{ fontSize: '0.7rem', color: TEXT_DIM, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace' }}>{s.code}</span>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                          <span style={{ fontSize: '0.86rem', color: TEXT, fontWeight: 500, letterSpacing: -0.01 }}>{s.name}</span>
                        </div>
                        <div style={{ height: 4, background: SURFACE, borderRadius: 4, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.1 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%', background: i < 3 ? ACCENT : ACCENT_SOFT, borderRadius: 4 }}
                          />
                        </div>
                      </div>
                      <span style={{ fontSize: '0.92rem', color: TEXT, fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums', letterSpacing: -0.01 }}>{s.count}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom — instantaneous metrics */}
                <div style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 4 }}>Active sessions</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 600, color: TEXT, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.02 }}>3,412</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 4 }}>Power flow</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 600, color: TEXT, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.02 }}>1.24</span>
                      <span style={{ fontSize: '0.72rem', color: ACCENT_SOFT, fontWeight: 500 }}>GW</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 4 }}>Avg session</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 600, color: TEXT, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.02 }}>22:14</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM — National pulse chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ maxWidth: 1440, margin: '24px auto 0', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 6 }}>National pulse</div>
                  <div style={{ color: TEXT, fontWeight: 500, fontSize: '0.92rem' }}>Power delivered · last 24 hours</div>
                </div>
                <div style={{ display: 'flex', gap: 28, fontSize: '0.78rem', color: TEXT_DIM }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="circle" style={{ display: 'inline-block', width: 8, height: 8, background: ACCENT }} />
                    <span>Now</span>
                    <strong style={{ color: TEXT, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>1.24 GW</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="circle" style={{ display: 'inline-block', width: 8, height: 8, background: ACCENT_SOFT, opacity: 0.5 }} />
                    <span>24 h avg</span>
                    <strong style={{ color: TEXT, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>0.82 GW</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: TEXT_DIM }}>Peak</span>
                    <strong style={{ color: TEXT, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>1.42 GW · 19:00</strong>
                  </div>
                </div>
              </div>

              {(() => {
                const pulse = [38, 35, 32, 30, 28, 28, 32, 42, 58, 72, 82, 86, 88, 82, 78, 80, 88, 95, 99, 96, 88, 75, 60, 48];
                const w = 1200, h = 160;
                const stepX = w / (pulse.length - 1);
                const linePath = pulse.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * stepX).toFixed(2)} ${(h - (p / 100) * h).toFixed(2)}`).join(' ');
                const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
                const nowIdx = 18;
                const nowX = nowIdx * stepX;
                const nowY = h - (pulse[nowIdx] / 100) * h;
                return (
                  <>
                    <svg viewBox={`0 0 ${w} ${h + 24}`} preserveAspectRatio="none" style={{ width: '100%', height: 200, display: 'block' }}>
                      <defs>
                        <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.18" />
                          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Horizontal grid lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                        <line key={i} x1="0" y1={h * p} x2={w} y2={h * p} stroke={BORDER} strokeWidth="1" />
                      ))}
                      <path d={areaPath} fill="url(#pulseFill)" />
                      <path d={linePath} fill="none" stroke={ACCENT_SOFT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      {/* Now marker */}
                      <line x1={nowX} y1="0" x2={nowX} y2={h} stroke={ACCENT} strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
                      <circle cx={nowX} cy={nowY} r="5" fill={ACCENT} />
                      <circle cx={nowX} cy={nowY} r="9" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.4">
                        <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.7rem', color: TEXT_DIM, fontFamily: 'JetBrains Mono, monospace' }}>
                      {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map(t => <span key={t}>{t}</span>)}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </section>


          {/* NETWORK (Redesigned Featured Stations) */}
          <section id="network" style={{ padding: '140px 88px 120px', background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ maxWidth: 1440, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'end', marginBottom: 64 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 14 }}>Global Network</div>
                  <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.4rem)', fontWeight: 600, marginBottom: 14, letterSpacing: -0.028 }}>
                    Charging hubs <span style={{ color: TEXT_DIM, fontWeight: 400 }}>across India.</span>
                  </h2>
                  <p style={{ color: TEXT_DIM, fontSize: '1.05rem', lineHeight: 1.65, maxWidth: 540 }}>
                    From metro corridors to highway expressways — a curated selection of TRIO hubs ready for your next charge.
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button onClick={() => navigate('find-stations')} className="btn-ghost" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>Open Network Map →</button>
                </div>
              </div>

              {/* Minimal sleek list of stations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { name: 'TRIO Mumbai Central', loc: 'Bandra–Kurla Complex, Mumbai', kind: '350 kW DC + Type 2', status: 'Available', amenity: '24/7 · CCTV · Lounge', tint: ACCENT, statusKind: 'available' as const },
                  { name: 'TRIO Delhi Solar Hub', loc: 'Connaught Place, New Delhi', kind: 'Solar Level 2 + DC', status: 'Available', amenity: '100% renewable energy', tint: ACCENT_SOFT, statusKind: 'available' as const },
                  { name: 'TRIO Bengaluru Tech', loc: 'Whitefield Tech Park', kind: 'DC Fast 150 kW', status: 'Occupied', amenity: 'App + RFID access', tint: '#E5946B', statusKind: 'occupied' as const },
                  { name: 'TRIO Hyderabad HITEC', loc: 'HITEC City, Hyderabad', kind: 'Level 2 + DC Combo', status: 'Available', amenity: '24/7 · CCTV · Restrooms', tint: ACCENT, statusKind: 'available' as const },
                  { name: 'TRIO Chennai Marina', loc: 'OMR · Marina expressway', kind: 'Type 2 fast charge', status: 'Available', amenity: 'UPI · FASTag · App', tint: ACCENT_SOFT, statusKind: 'available' as const },
                  { name: 'TRIO Pune Hinjewadi', loc: 'Hinjewadi IT Park, Pune', kind: 'Solar Level 2', status: 'Coming soon', amenity: 'Q1 2027 · Eco hub', tint: TEXT_DIM, statusKind: 'soon' as const },
                ].map((s, i) => {
                  const statusColor = s.statusKind === 'available' ? ACCENT : (s.statusKind === 'occupied' ? '#E5946B' : TEXT_DIM);
                  return (
                    <motion.div key={s.name}
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: 'rgba(255,255,255,0.015)', border: `1px solid rgba(255,255,255,0.03)`, borderRadius: 12, padding: '20px 24px',
                        display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr auto', gap: 24, alignItems: 'center',
                        transition: 'all 220ms ease', cursor: 'pointer'
                      }}
                      onMouseEnter={(e: any) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                      onMouseLeave={(e: any) => { e.currentTarget.style.background = 'rgba(255,255,255,0.015)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'; }}
                    >
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: TEXT, margin: '0 0 4px 0' }}>{s.name}</h3>
                        <div style={{ fontSize: '0.8rem', color: TEXT_DIM }}>{s.loc}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: TEXT_DIM }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        {s.kind}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: TEXT_DIM }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {s.amenity}
                      </div>

                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: statusColor, fontWeight: 600 }}>
                          <span className="circle" style={{ width: 6, height: 6, background: statusColor, borderRadius: '50%' }} />
                          {s.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', color: TEXT_DIM, border: `1px solid rgba(255,255,255,0.05)`, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CORPORATE PLANS */}
          <section id="plans" style={{ padding: '140px 88px 140px', background: BG, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ maxWidth: 1440, margin: '0 auto 64px', textAlign: 'center' }}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Plans · Fleets</div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.4rem)', fontWeight: 600, marginBottom: 14, letterSpacing: -0.028 }}>
                One platform. <span style={{ color: TEXT_DIM, fontWeight: 400 }}>Every fleet size.</span>
              </h2>
              <p style={{ color: TEXT_DIM, fontSize: '1.05rem', maxWidth: 580, margin: '0 auto', lineHeight: 1.65 }}>
                Charging plans built for the way Indian fleets actually operate — from a handful of vehicles to nationwide rollouts.
              </p>
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }}>
              {[
                {
                  name: 'Starter',
                  tagline: 'For small teams',
                  size: 'Up to 10 EVs',
                  price: '₹2,499',
                  cadence: '/ month',
                  features: ['Standard AC charging access', 'Basic usage reports', 'UPI & FASTag payments', '24/7 station access', 'Email support'],
                  cta: 'Get started',
                  featured: false,
                },
                {
                  name: 'Growth',
                  tagline: 'For scaling fleets',
                  size: '10–50 EVs',
                  price: '₹9,999',
                  cadence: '/ month',
                  features: ['Everything in Starter', 'Fast + DC charging access', 'Smart usage analytics', 'Dedicated account manager', 'Priority 24/7 support', 'Multi-driver billing'],
                  cta: 'Start free trial',
                  featured: true,
                },
                {
                  name: 'Enterprise',
                  tagline: 'For large operations',
                  size: '50+ EVs',
                  price: 'Custom',
                  cadence: 'Contact sales',
                  features: ['Everything in Growth', 'Dedicated charging stations', 'Custom API & integrations', 'Real-time fleet telematics', 'White-label deployment', '99.99% SLA · regional CSM'],
                  cta: 'Contact sales',
                  featured: false,
                },
              ].map((p, i) => (
                <motion.div key={p.name}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: p.featured ? `linear-gradient(180deg, ${CARD}, ${SURFACE})` : CARD,
                    border: `1px solid ${p.featured ? BORDER_STRONG : BORDER}`,
                    borderRadius: 16, padding: 32, position: 'relative',
                    display: 'flex', flexDirection: 'column',
                    transform: p.featured ? 'translateY(-8px)' : 'none',
                  }}
                >
                  {p.featured && (
                    <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: ACCENT, color: '#0B0F0D', fontSize: '0.68rem', fontWeight: 600, padding: '5px 14px', borderRadius: 999, letterSpacing: 0.04 }}>Most popular</span>
                  )}

                  <div style={{ marginBottom: 22 }}>
                    <div className="eyebrow" style={{ marginBottom: 8, color: p.featured ? ACCENT : ACCENT_SOFT }}>{p.tagline}</div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: TEXT, letterSpacing: -0.025, marginBottom: 4 }}>{p.name}</h3>
                    <div style={{ fontSize: '0.86rem', color: TEXT_DIM, fontWeight: 400 }}>{p.size}</div>
                  </div>

                  <div style={{ marginBottom: 22, paddingBottom: 22, borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: '2.4rem', fontWeight: 600, color: TEXT, letterSpacing: -0.035, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{p.price}</span>
                      <span style={{ fontSize: '0.86rem', color: TEXT_DIM, fontWeight: 400 }}>{p.cadence}</span>
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1, marginBottom: 28 }}>
                    {p.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.86rem', color: TEXT, lineHeight: 1.5 }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                          <circle cx="8" cy="8" r="7" stroke={ACCENT_SOFT} strokeOpacity="0.4" strokeWidth="1" />
                          <path d="M 5 8 L 7 10 L 11 6" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ color: TEXT_DIM, fontWeight: 400 }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {p.featured ? (
                    <button className="btn-accent" style={{ justifyContent: 'center' }}>{p.cta} <span>→</span></button>
                  ) : (
                    <button className="btn-ghost" style={{ justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 10 }}>{p.cta}</button>
                  )}
                </motion.div>
              ))}
            </div>

            <div style={{ maxWidth: 1280, margin: '64px auto 0', padding: '24px 32px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: TEXT, letterSpacing: -0.015, marginBottom: 4 }}>Need something custom?</div>
                <div style={{ fontSize: '0.86rem', color: TEXT_DIM, fontWeight: 400 }}>Hardware-only, white-label, or partner integrations — we&apos;ll build the right fit.</div>
              </div>
              <button className="btn-ghost" style={{ padding: '11px 22px', fontSize: '0.85rem' }}>Talk to our team →</button>
            </div>
          </section>
        </>
      )}

      {page === 'find-stations' && (
        <section id="find-stations" style={{ padding: '120px 88px 140px', background: BG, minHeight: '100vh', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto 48px', textAlign: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Station Intelligence</div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.6vw, 3.4rem)', fontWeight: 600, letterSpacing: -0.028 }}>
              Locate any charger. <span style={{ color: TEXT_DIM, fontWeight: 400 }}>Real-time.</span>
            </h2>
          </div>

          {/* MODERN MINIMAL FINDER */}
          <div style={{ maxWidth: 1440, margin: '0 auto', height: 800, position: 'relative', borderRadius: 24, overflow: 'hidden', background: '#080C0A', border: `1px solid ${BORDER}` }}>

            {/* MAP LAYER (Full Size) */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `radial-gradient(${ACCENT}33 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <div style={{ width: '100%', height: '100%', maxWidth: 700, maxHeight: 700 }}>
                <IndiaMap highlighted={focusedState || selectedStation.state} onHover={() => { }} />
              </div>
            </div>

            {/* FLOATING TOP BAR: Search & Filters */}
            <div style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', width: 'auto', display: 'flex', gap: 12, zIndex: 20 }}>
              <div style={{ background: 'rgba(11, 15, 13, 0.8)', backdropFilter: 'blur(24px)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 999, padding: '10px 10px 10px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXT_DIM} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, state or ID..."
                  style={{ background: 'transparent', border: 'none', color: TEXT, fontSize: '0.9rem', outline: 'none', width: 220 }}
                />
                <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.04)`, borderRadius: 999, padding: 4 }}>
                  {['Any', 'CCS', 'Type 2'].map(c => (
                    <button
                      key={c}
                      onClick={() => setConnFilter(c)}
                      style={{ background: connFilter === c ? ACCENT : 'transparent', color: connFilter === c ? '#000' : TEXT_DIM, border: 'none', borderRadius: 999, padding: '8px 18px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 200ms', whiteSpace: 'nowrap' }}
                    >{c}</button>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(11, 15, 13, 0.8)', backdropFilter: 'blur(24px)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 999, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 24 }}>
                <span style={{ fontSize: '0.8rem', color: TEXT_DIM, fontWeight: 500, whiteSpace: 'nowrap' }}>Min Power</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.2rem', color: ACCENT, fontWeight: 700, minWidth: 50, textAlign: 'right' }}>{minPower}kW</span>
                  <input type="range" min="0" max="150" step="25" value={minPower} onChange={(e) => setMinPower(parseInt(e.target.value))} style={{ width: 90, accentColor: ACCENT, cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            {/* FLOATING LEFT: Station List (Minimal) */}
            <motion.div
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              style={{ position: 'absolute', top: 110, bottom: 32, left: 32, width: 280, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 10 }}
            >
              <div style={{ color: TEXT_DIM, fontSize: '0.7rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{filteredStations.length} Nearby Hubs</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1, paddingRight: 8 }} className="custom-scrollbar">
                {filteredStations.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStationId(s.id)}
                    style={{
                      background: selectedStationId === s.id ? `${ACCENT}15` : 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${selectedStationId === s.id ? ACCENT : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: 14, padding: '16px 20px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: TEXT }}>{s.name}</span>
                      <span style={{ fontSize: '0.8rem', color: ACCENT, fontWeight: 600 }}>{s.kw}kW</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: TEXT_DIM }}>{s.state} · {s.id}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FLOATING RIGHT: Station Details (Modern Minimal) */}
            <motion.div
              key={selectedStationId}
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              style={{ position: 'absolute', top: 110, bottom: 32, right: 32, width: 340, background: 'rgba(11, 15, 13, 0.4)', backdropFilter: 'blur(32px)', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', gap: 24, zIndex: 10 }}
            >
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: TEXT, marginBottom: 8, letterSpacing: -1 }}>{selectedStation.name}</h3>
                <p style={{ color: TEXT_DIM, fontSize: '0.9rem' }}>{selectedStation.state} · Corridor A1</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: '0.65rem', color: TEXT_DIM, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Peak Output</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: ACCENT }}>{selectedStation.kw}kW</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: '0.65rem', color: TEXT_DIM, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Stalls</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: TEXT }}>2 <span style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.5 }}>Live</span></div>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 2].map(i => (
                    <div key={i} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: TEXT }}>Stall #{i} · {selectedStation.conn}</div>
                        <div style={{ fontSize: '0.7rem', color: ACCENT }}>Ready for charge</div>
                      </div>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>⚡</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button style={{ width: '100%', padding: '16px', background: ACCENT, color: '#000', border: 'none', borderRadius: 14, fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e: any) => e.target.style.transform = 'scale(1.02)'} onMouseLeave={(e: any) => e.target.style.transform = 'scale(1)'}>
                  Get Directions ↗
                </button>
                <div style={{ fontSize: '0.7rem', color: TEXT_DIM, textAlign: 'center' }}>Live telemetry synced via satellite</div>
              </div>
            </motion.div>

            {/* TELEMETRY OVERLAY */}
            <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 24, padding: '8px 24px', background: 'rgba(11,15,13,0.4)', backdropFilter: 'blur(12px)', border: `1px solid rgba(255,255,255,0.05)`, borderRadius: 999, zIndex: 10 }}>
              <div style={{ fontSize: '0.75rem', color: TEXT_DIM }}>Grid: <span style={{ color: ACCENT }}>Stable</span></div>
              <div style={{ fontSize: '0.75rem', color: TEXT_DIM }}>Uptime: <span style={{ color: TEXT }}>99.98%</span></div>
              <div style={{ fontSize: '0.75rem', color: TEXT_DIM }}>Sync: <span style={{ color: TEXT }}>{clock}</span></div>
            </div>
          </div>
        </section>
      )}
      {/* CTA SECTION */}
      <section style={{ padding: '100px 48px 0', background: `linear-gradient(to bottom, #0a0e0c, #050706)`, position: 'relative', overflow: 'hidden', textAlign: 'center', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{
            color: TEXT_DIM,
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 24
          }}>
            FIND STATION NEAR IN YOUR LOCATION
          </div>

          <h2 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(2.5rem, 4.5vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#fff',
            textDecoration: 'none',
            textShadow: '0 4px 24px rgba(0,0,0,0.5)',
            marginBottom: 48,
            lineHeight: 1.15
          }}>
            <span style={{ color: '#E2E8E5' }}>WE ARE AT THE FOREFRONT OF THE</span><br />
            <span style={{ color: '#8C948F' }}>ELECTRIC VEHICLE (EV) REVOLUTION.</span>
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 80 }}>
            <button className="btn-accent" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', fontSize: '0.95rem', fontWeight: 700 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              FIND STATION
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px',
              fontSize: '0.95rem', fontWeight: 700,
              background: 'transparent', color: ACCENT, border: `1px solid ${ACCENT}`, borderRadius: 999,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
              onMouseEnter={(e: any) => { e.target.style.background = `${ACCENT}15`; }}
              onMouseLeave={(e: any) => { e.target.style.background = 'transparent'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              LEARN MORE
            </button>
          </div>
        </div>

        {/* 3D Illustration */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 5, marginTop: '-20px' }}>
          <img src={hub3d} alt="EV Station 3D" style={{ maxWidth: '100%', width: 1100, objectFit: 'contain', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 -20px 40px rgba(0,0,0,0.6))' }} />
          {/* Subtle glow behind the station */}
          <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translate(-50%, 0)', width: '60%', height: '40%', background: `${ACCENT}20`, filter: 'blur(100px)', zIndex: -1, borderRadius: '50%' }} />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '100px 88px 50px', background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 64, marginBottom: 80 }}>
            <div>
              <img src={logo} alt="TRIO" style={{ height: '52px', marginBottom: 28 }} />
              <p style={{ color: TEXT_DIM, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '380px', fontWeight: 400 }}>The intelligence layer for industrial-scale electric vehicle infrastructure.</p>
            </div>
            <div>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: '0.78rem', marginBottom: 22 }}>Platform</div>
              {['Network', 'Security', 'Hardware'].map(l => <a key={l} href="#" style={{ display: 'block', color: TEXT_DIM, textDecoration: 'none', marginBottom: 12, fontSize: '0.88rem', transition: 'color 200ms' }} onMouseEnter={(e: any) => e.target.style.color = TEXT} onMouseLeave={(e: any) => e.target.style.color = TEXT_DIM}>{l}</a>)}
            </div>
            <div>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: '0.78rem', marginBottom: 22 }}>Resources</div>
              {['API Docs', 'Support'].map(l => <a key={l} href="#" style={{ display: 'block', color: TEXT_DIM, textDecoration: 'none', marginBottom: 12, fontSize: '0.88rem', transition: 'color 200ms' }} onMouseEnter={(e: any) => e.target.style.color = TEXT} onMouseLeave={(e: any) => e.target.style.color = TEXT_DIM}>{l}</a>)}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: '1.3rem', marginBottom: 16, letterSpacing: -0.02 }}>Ready to scale?</div>
              <button className="btn-accent">Contact sales</button>
            </div>
          </div>
          <div style={{ color: TEXT_DIM, fontSize: '0.78rem', borderTop: `1px solid ${BORDER}`, paddingTop: 28, display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2026 TRIO Platform</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
