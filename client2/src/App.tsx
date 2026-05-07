import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/logo.png'
import charger3d from './assets/charger-3d.png'
import hub3d from './assets/Screenshot_2026-05-05_004406-removebg-preview.png'
import serviceImg from './assets/Screenshot_2026-05-06_131630-removebg-preview-Picsart-AiImageEnhancer.png'
import professorImg from './assets/Screenshot_2026-05-08_003804-removebg-preview.png'

const ACCENT = '#00FF88'           // vibrant electric lime (from offline)
const ACCENT_SOFT = '#00CC77'      // secondary energy green
const BG = '#0B0F0D'               // dark graphite primary
const SURFACE = '#111715'          // secondary surface
const CARD = '#151B18'             // card surface
const BORDER = 'rgba(0,255,136,0.08)'
const BORDER_STRONG = 'rgba(0,255,136,0.18)'
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

const WHY_SLIDES = [
  {
    title: 'CRUCIAL FOR ELECTRIC VEHICLE ADOPTION',
    text: "Experts widely agree that a robust, reliable, and accessible network of charging stations is the absolute foundation for the widespread adoption of electric vehicles (EVs) globally. The availability of charging infrastructure is a primary factor influencing consumers' willingness to switch from internal combustion engine vehicles, directly addressing 'range anxiety' and ensuring that long-distance travel becomes as seamless as traditional refueling."
  },
  {
    title: 'REDUCING ENVIRONMENTAL IMPACT',
    text: "Experts recognize that EV charging stations are instrumental in drastically reducing the environmental impact of modern transportation systems. Unlike fossil-fuel-powered cars, EVs produce zero tailpipe emissions. When these vehicles are charged using renewable energy sources—such as solar, wind, or hydroelectric power—their total carbon footprint is significantly lower, contributing to cleaner air and a more sustainable future."
  },
  {
    title: 'DRIVING THE FUTURE OF MOBILITY',
    text: "By integrating smart grid technology and distributed renewable energy, EV charging infrastructure becomes more than just a power source—it's the backbone of a sustainable, connected ecosystem. This synergy allows for 'Vehicle-to-Grid' (V2G) capabilities, where EVs can actually return power to the grid during peak demand, creating a balanced and resilient energy network that powers the smart cities of tomorrow."
  }
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
  const [page, setPage] = useState<'home' | 'find-stations' | 'privacy-policy' | 'terms-conditions' | 'refund-policy' | 'about-us' | 'blog'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [connFilter, setConnFilter] = useState('Any');
  const [minPower, setMinPower] = useState(0);
  const [selectedStationId, setSelectedStationId] = useState('WB-410');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [activeService, setActiveService] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [whySlide, setWhySlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWhySlide(prev => (prev + 1) % WHY_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filteredStations = STATIONS.filter(s => {
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConn = connFilter === 'Any' || s.conn === connFilter;
    const matchesPower = s.kw >= minPower;
    return matchesQuery && matchesConn && matchesPower;
  });

  const selectedStation = STATIONS.find(s => s.id === selectedStationId) || STATIONS[0];

  const clusteredStations = useMemo(() => {
    const groups: Record<string, typeof filteredStations> = {};
    filteredStations.forEach(s => {
      if (!groups[s.state]) groups[s.state] = [];
      groups[s.state].push(s);
    });
    return Object.entries(groups).map(([state, stations]) => ({
      state,
      stations,
      count: stations.length,
      lon: stations[0].lon,
      lat: stations[0].lat,
      id: `cluster-${state}`,
      totalKw: stations.reduce((acc, curr) => acc + curr.kw, 0)
    }));
  }, [filteredStations]);

  const focusedState = indiaGeo?.states.find(s =>
    searchQuery.length > 2 && s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )?.name || null;

  const selectedCluster = clusteredStations.find(c => c.id === selectedClusterId);

  // PREMIUM CLUSTER POPUP
  const ClusterPopup = ({ cluster, onClose, onPick }: { cluster: any, onClose: () => void, onPick: (s: any) => void }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 380, background: '#0B0F0D', border: `1px solid ${ACCENT}`, borderRadius: 12,
        padding: 32, zIndex: 100, pointerEvents: 'auto', boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 24px ${ACCENT}20`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ color: ACCENT, fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>{cluster.state} · CLUSTER</div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: -0.5 }}>{cluster.count} stations in this area</h3>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </div>

      <div style={{ display: 'flex', gap: 32, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: ACCENT }}>{cluster.totalKw}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW total</span></div>
        </div>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{Math.round(cluster.totalKw / cluster.count)}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW avg</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 240, overflowY: 'auto' }} className="custom-scrollbar">
        {cluster.stations.map((s: any) => (
          <div key={s.id} onClick={() => onPick(s)} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
            padding: '12px 16px', borderRadius: 8, transition: 'all 0.2s'
          }} onMouseEnter={(e: any) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={(e: any) => e.currentTarget.style.background = 'transparent'}>
            <div>
              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{s.name}</div>
              <div style={{ color: TEXT_DIM, fontSize: '0.7rem' }}>{s.id}</div>
            </div>
            <div style={{ color: ACCENT, fontWeight: 700, fontSize: '0.9rem' }}>{s.kw} kW</div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Map Component for reuse
  const IndiaMap = ({ highlighted, onHover }: { highlighted?: string | null, onHover?: (name: string | null) => void }) => {
    if (!indiaGeo) return <div style={{ color: TEXT_DIM, fontSize: '0.8rem' }}>Initializing GeoData...</div>;
    return (
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <path d={indiaGeo.countryPath} fill="rgba(0,255,136,0.02)" stroke={ACCENT} strokeWidth="0.4" fillRule="evenodd" style={{ opacity: 0.3 }} />
        {indiaGeo.states.map((s: any, i: number) => (
          <motion.path
            key={i}
            d={s.path}
            fill={highlighted === s.name ? `${ACCENT}15` : 'transparent'}
            stroke={highlighted === s.name ? ACCENT : ACCENT}
            strokeWidth={highlighted === s.name ? 0.6 : 0.2}
            strokeOpacity={highlighted === s.name ? 0.8 : 0.15}
            whileHover={{ fill: `${ACCENT}22`, strokeOpacity: 0.6 }}
            transition={{ duration: 0.2 }}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover && onHover(s.name)}
            onMouseLeave={() => onHover && onHover(null)}
            onClick={() => setSearchQuery(s.name)}
          />
        ))}

        {clusteredStations.map((c, i) => {
          if (!indiaGeo || !indiaGeo.project) return null;
          const [x, y] = indiaGeo.project(c.lon, c.lat);
          if (isNaN(x) || isNaN(y)) return null;

          const isClusterSelected = c.id === selectedClusterId;
          const isSingle = c.count === 1;

          return (
            <motion.g
              key={c.id}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              onClick={(e) => { e.stopPropagation(); isSingle ? setSelectedStationId(c.stations[0].id) : setSelectedClusterId(c.id); }}
              style={{ cursor: 'pointer' }}
            >
              {/* CLUSTER MARKER */}
              {!isSingle ? (
                <>
                  <circle cx={x} cy={y} r={6} fill="#0B0F0D" stroke={ACCENT} strokeWidth="1" />
                  <circle cx={x} cy={y} r={8} stroke={ACCENT} strokeWidth="0.5" fill="none" opacity="0.3">
                    <animate attributeName="r" from="6" to="12" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x={x} y={y} dy="2.2" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="700">{c.count}</text>
                </>
              ) : (
                <>
                  <circle cx={x} cy={y} r={4} fill="#0B0F0D" stroke={ACCENT} strokeWidth="0.8" />
                  <path d={`M ${x} ${y - 2.5} L ${x - 1.5} ${y + 0.5} L ${x} ${y + 0.5} L ${x} ${y + 2.5} L ${x + 1.5} ${y - 0.5} L ${x} ${y - 0.5} Z`} fill={ACCENT} />
                </>
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
    } else if (target === 'privacy-policy') {
      setPage('privacy-policy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'terms-conditions') {
      setPage('terms-conditions');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'refund-policy') {
      setPage('refund-policy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'about-us') {
      setPage('about-us');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'blog') {
      setPage('blog');
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
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, h4 { font-family: 'Inter', sans-serif; font-weight: 600; letter-spacing: -0.022em; color: ${TEXT}; }
        h1 { letter-spacing: -0.035em; }
        h2 { letter-spacing: -0.028em; }
        p { color: ${TEXT_DIM}; }

        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: 'ss01' on; }
        .circle { border-radius: 9999px; }
        .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${ACCENT_SOFT}; font-weight: 500; }

        .btn-accent { background: ${ACCENT}; color: #0B0F0D; border: none; padding: 14px 26px; font-weight: 600; font-size: 0.88rem; letter-spacing: 0; cursor: pointer; transition: 220ms cubic-bezier(0.22, 1, 0.36, 1); border-radius: 999px; display: inline-flex; align-items: center; gap: 10px; font-family: 'Inter', sans-serif; }
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
        .finder-stage { width: 100%; height: 100%; position: relative; display: grid; place-items: center; background: radial-gradient(circle at 50% 50%, ${ACCENT}08, transparent 70%); }
        .loader-grid { position: absolute; inset: 0; background-image: linear-gradient(${ACCENT}08 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}08 1px, transparent 1px); background-size: 32px 32px; pointer-events: none; mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 90%); -webkit-mask-image: radial-gradient(circle at 50% 50%, black 40%, transparent 90%); }
        .loader-stage svg, .finder-stage svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; z-index: 2; }

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
            { label: 'Find stations', target: 'find-stations' },
            { label: 'About us', target: 'about-us' },
            { label: 'Blog', target: 'blog' },
          ].map(l => (
            <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ color: TEXT_DIM, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'color 200ms', cursor: 'pointer' }} onMouseEnter={(e: any) => e.target.style.color = TEXT} onMouseLeave={(e: any) => e.target.style.color = TEXT_DIM}>{l.label}</a>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            className="btn-accent"
            onClick={() => setShowContactForm(true)}
            style={{ padding: '12px 28px', fontSize: '0.88rem', fontWeight: 700 }}
          >
            Contact Sales
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              background: 'rgba(5, 7, 6, 0.96)',
              backdropFilter: 'blur(32px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowContactForm(false)}
              style={{ position: 'absolute', top: 40, right: 40, background: 'none', border: 'none', color: TEXT_DIM, cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e: any) => e.target.style.color = TEXT}
              onMouseLeave={(e: any) => e.target.style.color = TEXT_DIM}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ width: '100%', maxWidth: 1000, display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 60 }}
            >
              {/* Left Column: Info */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 99, width: 'fit-content', marginBottom: 32 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Talk to us</span>
                </div>

                <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.04em' }}>
                  Let's electrify <br />
                  <span style={{ color: ACCENT }}>your fleet.</span>
                </h2>

                <p style={{ fontSize: '1rem', color: TEXT_DIM, lineHeight: 1.6, marginBottom: 40, maxWidth: 380 }}>
                  Whether you're scaling rentals, leasing for a growing business, or moving employees daily — share what you need and our team will plan the route forward.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {[
                    { icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6', label: 'EMAIL', value: 'hello@trio.ev' },
                    { icon: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z', label: 'WHATSAPP', value: '+91 98xxx xxxxx' },
                    { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', label: 'HQ', value: 'Bengaluru, India' }
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}></path></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.1em' }}>{item.label}</div>
                        <div style={{ fontSize: '1rem', color: TEXT, fontWeight: 500 }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Form */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 32, position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.05em' }}>NAME</label>
                    <input placeholder="Your full name" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', color: TEXT, outline: 'none', fontSize: '0.9rem' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.05em' }}>EMAIL</label>
                    <input placeholder="you@company.com" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', color: TEXT, outline: 'none', fontSize: '0.9rem' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.05em' }}>PHONE <span style={{ opacity: 0.5, fontWeight: 400 }}>optional</span></label>
                  <input placeholder="+91 98xxx xxxxx" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', color: TEXT, outline: 'none', fontSize: '0.9rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.05em' }}>INQUIRY TYPE</label>
                  <select style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', color: TEXT, outline: 'none', fontSize: '0.9rem', cursor: 'pointer', appearance: 'none' }}>
                    <option style={{ background: CARD, color: TEXT }}>Select type</option>
                    <option style={{ background: CARD, color: TEXT }}>Fleet Charging Partnership</option>
                    <option style={{ background: CARD, color: TEXT }}>Station Installation</option>
                    <option style={{ background: CARD, color: TEXT }}>Individual Charging Plan</option>
                    <option style={{ background: CARD, color: TEXT }}>Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: TEXT_DIM, letterSpacing: '0.05em' }}>MESSAGE</label>
                  <textarea placeholder="A few details about your needs..." style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 18px', color: TEXT, outline: 'none', fontSize: '0.9rem', minHeight: 120, resize: 'none' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: TEXT_DIM }}>We respond within one business day. No spam, ever.</div>
                  <button className="btn-accent" style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    Send inquiry
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {page === 'home' && (
        <>
          {/* HERO — refined, premium */}
          <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 72, background: BG }}>
            {/* Subtle ambient gradient */}
            <div style={{ position: 'absolute', right: '-10%', top: '15%', width: 760, height: 760, background: `radial-gradient(circle, ${ACCENT_SOFT}22, transparent 60%)`, pointerEvents: 'none', borderRadius: '50%' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 80, padding: '24px 88px 0', alignItems: 'center', minHeight: 'calc(100vh - 120px)', position: 'relative', zIndex: 5, maxWidth: 1440, margin: '0 auto' }}>

              {/* LEFT COLUMN */}
              <div>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  {/* Eyebrow */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 32, padding: '6px 12px', border: `1px solid ${BORDER}`, borderRadius: 999, background: SURFACE }}>
                    <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                    <span className="eyebrow" style={{ color: ACCENT_SOFT, fontSize: '0.68rem' }}>Live network · {clock || '--:--:--'}</span>
                  </div>

                  {/* TITLE */}
                  <h1 style={{ fontSize: 'clamp(2.4rem, 4.8vw, 4.8rem)', lineHeight: 1.02, marginBottom: 28, fontWeight: 600 }}>
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
          <section id="services" style={{ padding: '40px 88px 60px', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
            <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative', zIndex: 5 }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 40 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center', marginTop: 20 }}>
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
          {/* INDIA COVERAGE OPERATIONAL DASHBOARD (Integrated High-Fidelity Prototype) */}
          <section id="network" className="loader-section" style={{ padding: '60px 0 80px', background: '#000', overflow: 'hidden' }}>
            <div style={{ maxWidth: 1250, margin: '0 auto', padding: '0 40px' }}>
              <div style={{ marginBottom: 40, textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 16px', background: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 99, marginBottom: 16 }}>
                  <div style={{ width: 6, height: 6, background: '#00FF88', borderRadius: '50%', boxShadow: '0 0 10px #00FF88' }}></div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#00FF88', letterSpacing: '0.12em', textTransform: 'uppercase' }}>System Status: Operational</span>
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 600, marginBottom: 12, letterSpacing: '-0.03em', color: '#fff' }}>
                  ENERGY <span style={{ color: '#00FF88' }}>SYNAPSE</span>
                </h2>
                <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: 540, margin: '0 auto' }}>
                  India Coverage Operational Dashboard — Real-time infrastructure telemetry and network deployment metrics.
                </p>
              </div>

              <div style={{
                width: '100%',
                height: '560px',
                background: '#0B0F0D',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
                position: 'relative'
              }}>
                <iframe
                  src="/dashboard.html"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: '#0B0F0D'
                  }}
                  title="Energy Synapse Dashboard"
                  scrolling="no"
                />
              </div>
            </div>
          </section>

          {/* WHY EV CHARGING SECTION */}
          <section id="why-ev" style={{ padding: '70px 88px 100px', background: '#000', position: 'relative', overflow: 'hidden' }}>
            {/* Background Glow */}
            <div style={{ position: 'absolute', left: '-10%', top: '40%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

            <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative', zIndex: 5 }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 50 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', color: '#e0e0e0', marginBottom: 16, textTransform: 'uppercase' }}
                >
                  EV CHARGING IS THE BEST FOR ELECTRICAL VEHICLES
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  style={{
                    fontSize: 'clamp(3rem, 6vw, 6.5rem)',
                    fontWeight: 800,
                    letterSpacing: -0.01,
                    marginBottom: 32,
                    textTransform: 'uppercase',
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 45%, #606060 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))'
                  }}
                >
                  WHY EV CHARGING?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', fontWeight: 400, maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}
                >
                  Electric vehicle (EV) charging is at the forefront of a transportation revolution that is reshaping the way we move and the world we live in.
                </motion.p>
              </div>

              {/* Content Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 100, alignItems: 'center' }}>
                {/* Left side: Text Carousel */}
                <div style={{ position: 'relative' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={whySlide}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5 }}
                      style={{ minHeight: '320px' }}
                    >
                      <h3 style={{
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        marginBottom: 32,
                        letterSpacing: '0.02em',
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #A0A0A0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        {WHY_SLIDES[whySlide].title}
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.7 }}>
                          {WHY_SLIDES[whySlide].text}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Carousel Controls */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 48 }}
                  >
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => setWhySlide(prev => (prev - 1 + WHY_SLIDES.length) % WHY_SLIDES.length)}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          border: '1px solid rgba(132, 204, 22, 0.4)',
                          background: 'rgba(132, 204, 22, 0.05)',
                          color: '#84cc16',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e: any) => { e.currentTarget.style.background = 'rgba(132, 204, 22, 0.15)'; e.currentTarget.style.borderColor = '#84cc16'; }}
                        onMouseLeave={(e: any) => { e.currentTarget.style.background = 'rgba(132, 204, 22, 0.05)'; e.currentTarget.style.borderColor = 'rgba(132, 204, 22, 0.4)'; }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      </button>

                      <button
                        onClick={() => setWhySlide(prev => (prev + 1) % WHY_SLIDES.length)}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          border: '1px solid rgba(132, 204, 22, 0.4)',
                          background: 'rgba(132, 204, 22, 0.05)',
                          color: '#84cc16',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e: any) => { e.currentTarget.style.background = 'rgba(132, 204, 22, 0.15)'; e.currentTarget.style.borderColor = '#84cc16'; }}
                        onMouseLeave={(e: any) => { e.currentTarget.style.background = 'rgba(132, 204, 22, 0.05)'; e.currentTarget.style.borderColor = 'rgba(132, 204, 22, 0.4)'; }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      {WHY_SLIDES.map((_, i) => (
                        <div
                          key={i}
                          onClick={() => setWhySlide(i)}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: whySlide === i ? '#84cc16' : 'rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right side: Professor Profile */}
                <div style={{ textAlign: 'right' }}>
                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'relative', display: 'inline-block' }}
                  >
                    {/* Image Container with Gradient Background */}
                    <div style={{
                      width: '420px',
                      height: '520px',
                      background: 'radial-gradient(circle at center, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                      <img
                        src={professorImg}
                        alt="David M. Johnson"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          objectPosition: 'bottom center',
                          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
                        }}
                      />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      style={{ marginTop: 32 }}
                    >
                      <h4 style={{
                        fontSize: '3.2rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        marginBottom: 4,
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 45%, #606060 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        DAVID M. JOHNSON
                      </h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        ENVIRONMENT PROFESSOR AT HARVARD
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>


        </>
      )}

      {page === 'find-stations' && (
        <section style={{ background: BG, paddingTop: '72px', overflow: 'hidden' }}>
          <iframe
            src="/find-stations.html"
            style={{ width: '100%', height: '1100px', border: 'none' }}
            title="Find Charging Stations"
            scrolling="no"
          />
        </section>
      )}
      {page === 'home' && (
        <>
          {/* CTA SECTION */}
          <section style={{ padding: '100px 48px 0', background: `linear-gradient(to bottom, #0a0e0c, ${SURFACE})`, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
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
                fontFamily: '"Orbitron", sans-serif',
                fontSize: 'clamp(2rem, 4.2vw, 3.8rem)',
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#fff',
                textDecoration: 'none',
                textShadow: '0 4px 24px rgba(0,0,0,0.5)',
                marginBottom: 48,
                lineHeight: 1.2
              }}>
                <span style={{ color: '#FFFFFF', fontWeight: 900 }}>ENGINEERING THE FUTURE OF</span><br />
                <span style={{
                  background: `linear-gradient(90deg, ${ACCENT} 0%, #00FF88 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 900
                }}>EMISSION-FREE MOBILITY.</span>
              </h2>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 80 }}>
                <button className="btn-accent" onClick={() => navigate('find-stations')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', fontSize: '0.95rem', fontWeight: 700 }}>
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

            {/* 3D Illustration — Aggressive attachment */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative', zIndex: 5, marginTop: '-20px', marginBottom: 0, lineHeight: 0 }}>
              <img src={hub3d} alt="EV Station 3D" style={{ maxWidth: '100%', width: 1100, objectFit: 'contain', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 -20px 40px rgba(0,0,0,0.6))', marginBottom: '-12px', verticalAlign: 'bottom' }} />
              {/* Subtle glow behind the station */}
              <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translate(-50%, 0)', width: '60%', height: '40%', background: `${ACCENT}20`, filter: 'blur(100px)', zIndex: -1, borderRadius: '50%' }} />
            </div>
          </section>
        </>
      )}

      {/* FOOTER — EXACT REPLICA OF REFERENCE IMAGE */}
      {page === 'privacy-policy' && (
        <section style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 40, color: '#fff' }}>Privacy Policy</h1>
            <div style={{ color: TEXT_DIM, lineHeight: 1.8, fontSize: '1.05rem' }}>
              <p style={{ marginBottom: 32, fontStyle: 'italic', borderLeft: `4px solid ${ACCENT}`, paddingLeft: 24 }}>At Trio, your privacy is important to us. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.</p>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>1. Information We Collect</h2>
              <p style={{ marginBottom: 24 }}>We may collect personal identification information such as name, email address, phone number, etc., when users visit our site, register, or interact with our services.</p>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>2. How We Use Your Information</h2>
              <p style={{ marginBottom: 24 }}>We use the information we collect in various ways, including to:</p>
              <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
                {['Improve our website and services', 'Send periodic emails and updates', 'Respond to customer service requests', 'Personalize user experience'].map(item => <li key={item} style={{ marginBottom: 10 }}>{item}</li>)}
              </ul>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>3. Data Protection</h2>
              <p style={{ marginBottom: 24 }}>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information.</p>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>4. Sharing Your Information</h2>
              <p style={{ marginBottom: 24 }}>We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information.</p>
            </div>
          </div>
        </section>
      )}

      {page === 'terms-conditions' && (
        <section style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 40, color: '#fff' }}>Terms & Conditions</h1>
            <div style={{ color: TEXT_DIM, lineHeight: 1.8, fontSize: '1.05rem' }}>
              <p style={{ marginBottom: 32, fontStyle: 'italic', borderLeft: `4px solid ${ACCENT}`, paddingLeft: 24 }}>Welcome to Trio. These terms and conditions outline the rules and regulations for the use of our website and services.</p>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>1. Acceptance of Terms</h2>
              <p style={{ marginBottom: 24 }}>By accessing this website we assume you accept these terms and conditions. Do not continue to use Trio if you do not agree to all the terms stated on this page.</p>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>2. Intellectual Property Rights</h2>
              <p style={{ marginBottom: 24 }}>Other than the content you own, under these Terms, Trio and/or its licensors own all the intellectual property rights and materials contained in this website.</p>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>3. Restrictions</h2>
              <p style={{ marginBottom: 24 }}>You are specifically restricted from all of the following:</p>
              <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
                {['Publishing any website material in any other media', 'Selling, sublicensing and/or commercializing any website material', 'Publicly performing and/or showing any website material', 'Using this website in any way that is or may be damaging to this website'].map(item => <li key={item} style={{ marginBottom: 10 }}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>
      )}

      {page === 'refund-policy' && (
        <section style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 40, color: '#fff' }}>Refund Policy</h1>
            <div style={{ color: TEXT_DIM, lineHeight: 1.8, fontSize: '1.05rem' }}>
              <p style={{ marginBottom: 32, fontStyle: 'italic', borderLeft: `4px solid ${ACCENT}`, paddingLeft: 24 }}>At Trio, we strive to ensure satisfaction with our services. If you're not entirely satisfied, we're here to help with a fair refund policy.</p>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>1. Eligibility for Refunds</h2>
              <p style={{ marginBottom: 24 }}>To be eligible for a refund, your request must be made within 7 days of service purchase and should include a valid reason for the request.</p>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>2. Non-refundable Cases</h2>
              <p style={{ marginBottom: 24 }}>The following cases are generally ineligible for a refund:</p>
              <ul style={{ marginBottom: 24, paddingLeft: 20 }}>
                {['Service already delivered and accepted by user', 'Customized or personalized fleet solutions', 'Issues arising from misuse or third-party integrations'].map(item => <li key={item} style={{ marginBottom: 10 }}>{item}</li>)}
              </ul>
              <h2 style={{ color: '#fff', fontSize: '1.5rem', marginTop: 48, marginBottom: 20 }}>3. Refund Process</h2>
              <p style={{ marginBottom: 24 }}>Once your request is approved, refunds will be processed to the original method of payment within 5–7 business days.</p>
            </div>
          </div>
        </section>
      )}

      {page === 'about-us' && (
        <section style={{ background: BG, color: TEXT, paddingTop: '100px', paddingBottom: '120px' }}>
          {/* 1. HERO */}
          <div style={{ textAlign: 'center', marginBottom: 120, padding: '0 24px' }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(3rem, 7vw, 4.5rem)', fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              Our Commitment to <br />
              <span style={{ color: ACCENT, fontSize: '0.8em' }}>Communities</span>
            </h1>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', color: TEXT_DIM, maxWidth: 600, margin: '0 auto', lineHeight: 1.6, fontWeight: 400 }}>
              Empowering local communities through clean technology and <br /> sustainable practices.
            </p>
          </div>

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
            {/* 2. VISION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 60, alignItems: 'center', marginBottom: 120 }}>
              <div style={{ background: SURFACE, borderRadius: 32, overflow: 'hidden', border: `1px solid ${BORDER}`, height: 420 }}>
                <img src="/sustainability.png" alt="Sustainability" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 2, background: ACCENT, borderRadius: 1 }} />
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Our Vision</h2>
                </div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', color: TEXT_DIM, lineHeight: 1.8, fontWeight: 400 }}>
                  Trio envisions a world where every ride and every delivery contributes to a healthier planet. Our vision is to eliminate pollution and carbon emissions by creating a fully electric ecosystem for both personal mobility and logistics. We aspire to lead the transformation of the automotive and logistics industries, making sustainable, smart, and connected transportation accessible to all. By combining innovation, responsibility, and care for nature, we aim to build a future where progress and the environment move together in harmony.
                </p>
              </div>
            </div>

            {/* 3. MISSION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 60, alignItems: 'center', marginBottom: 120 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 2, background: ACCENT, borderRadius: 1 }} />
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Our Mission</h2>
                </div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', color: TEXT_DIM, lineHeight: 1.7, marginBottom: 20 }}>
                  At Trio, our mission is to redefine the way people move and businesses operate. We are committed to:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    "Developing electric cars that are eco-friendly, stylish, reliable, and affordable for everyday use.",
                    "Revolutionizing logistics with 100% electric fleets that reduce congestion, minimize noise, and lower emissions.",
                    "Supporting sustainability by adopting green practices in design, manufacturing, and operations for healthier cities.",
                    "Driving innovation through smart technology, renewable energy integration, and continuous performance improvements.",
                    "Empowering communities by raising awareness about eco-friendly mobility and promoting nature-first choices.",
                    "Building a connected future where technology, people, and the environment coexist seamlessly."
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1px solid ${ACCENT}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.4 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'Outfit', sans-serif", marginTop: 24, paddingLeft: 20, borderLeft: `2px solid ${ACCENT}33`, fontStyle: 'italic', color: TEXT_DIM, fontSize: '0.9rem' }}>
                  Our purpose is clear: to protect nature, reduce pollution, and create a sustainable legacy where clean mobility becomes the heartbeat of modern living.
                </p>
              </div>
              <div style={{ background: SURFACE, borderRadius: 32, overflow: 'hidden', border: `1px solid ${BORDER}`, height: 500 }}>
                <img src="/energy.png" alt="Energy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* 4. STORY */}
            <div style={{ maxWidth: 800, margin: '0 auto 160px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: 12 }}>Our <span style={{ color: ACCENT }}>Story</span></h2>
              <div style={{ width: 60, height: 2, background: ACCENT, margin: '0 auto 60px' }} />
              <div style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 32 }}>
                <p>Our journey began in the world of IT and telecom, where one of our founders worked on designing revenue models for Vodafone across Greece, Albania, and the UK. While building systems that directly impacted millions of customers, a realization struck — technology was advancing, but the hidden cost was environmental damage caused by emissions, vibrations, and unsustainable operations.</p>
                <p>With a background in Computer Science and years of experience in telecom, the seed of an idea was planted: how can technology and business models be re-imagined to serve both people and the planet? This vision led to an entrepreneurial journey beginning in 2018, exploring eco-friendly solutions and sustainability-driven startups.</p>
                <p>In 2022, the concept of clean transportation took shape. Starting small in Pune with just two leased vehicles, we tested the market, even driving the cars ourselves to understand a driver's real challenges. Those early months gave us invaluable insights into operations, payment irregularities, and the struggles drivers face daily. From there, we expanded to Kolkata, scaling our fleet and building strong foundations.</p>

                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 500, color: ACCENT, fontStyle: 'italic', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
                    "We're not just offering transport — we're driving a transition to greener, smarter mobility for all."
                  </h3>
                </div>

                <p>In July 2024, after two years of groundwork, we officially registered Trio Evolution India Pvt. Ltd. — named to represent the three founders who came together from IT, transportation, and mechanical engineering backgrounds. Though one co-founder eventually moved on, the vision remained strong: to revolutionize mobility through sustainability.</p>
                <p>We shifted from B2C to a B2B model, partnering with Mahindra Logistics to deploy EV fleets for large enterprises. Soon after, we began serving industry leaders like TCS, Capgemini, Cognizant, KPMG, and Indigo — expanding our fleet and proving that sustainable transport can meet the toughest corporate demands.</p>
                <p>Recognizing that fleet growth is incomplete without infrastructure, we took the bold step of becoming Kolkata's first fleet owner to build a private EV charging hub in New Town, right at the heart of the city's IT corridor. This hub, set to be completed by August 2025, not only powers our fleet but also supports smaller operators, ensuring accessibility and affordability for all.</p>
                <p>Today, our services span electric vehicle leasing, fleet management, smart charging infrastructure, and employee transportation solutions. From humble beginnings to city-wide impact, our story is proof that a vision backed by persistence can shape the future of mobility. As we move forward, our commitment remains the same: to empower businesses and communities to progress without compromising our planet. This is our story — and we're just getting started.</p>
              </div>
            </div>

            {/* 5. LEADERSHIP */}
            <div style={{ marginBottom: 160 }}>
              <div style={{ textAlign: 'center', marginBottom: 80 }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: 20 }}>Leadership <span style={{ color: ACCENT }}>Team</span></h2>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', color: TEXT_DIM, maxWidth: 640, margin: '0 auto' }}>
                  The minds behind our mission to transform transportation through clean energy and community-driven innovation.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
                {[
                  {
                    name: "Subhash Kumar",
                    role: "Founder & CEO",
                    bio: "B.Tech in Computer Science. Former employee at Vodafone. Currently leading Trio as Founder & CEO, driving innovation and sustainable solutions.",
                    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                  },
                  {
                    name: "Somnath Das",
                    role: "Founder & COO",
                    bio: "M.A. graduate. Former employee at Uber. Now serving as Founder & COO of Trio, ensuring smooth operations and impactful strategies.",
                    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                  }
                ].map(leader => (
                  <div key={leader.name} style={{ background: '#121915', border: `1px solid ${BORDER}`, borderRadius: 40, padding: 60, textAlign: 'center', transition: 'all 0.3s' }}>
                    <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 32px', border: `4px solid ${ACCENT}22` }}>
                      <img src={leader.img} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>{leader.name}</h3>
                    <div style={{ fontFamily: "'Outfit', sans-serif", color: ACCENT, fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 24 }}>{leader.role}</div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: '0.95rem', lineHeight: 1.6 }}>{leader.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. IMPACT */}
            <div>
              <div style={{ textAlign: 'center', marginBottom: 80 }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: 20 }}>Our <span style={{ color: ACCENT }}>Impact</span></h2>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', color: TEXT_DIM, maxWidth: 640, margin: '0 auto' }}>
                  We are dedicated to accelerating a clean, equitable future by integrating technology and sustainability in every journey.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                {[
                  { icon: 'M23 6l-9.5 9.5-5-5L1 18', title: "EV-First Fleet", desc: "Deploying electric vehicles and hybrid transport solutions across all regions by 2026." },
                  { icon: 'M12 2L5 9h4v12h6V9h4L12 2z', title: "Commitment to Nature", desc: "Investing in reforestation and renewable projects to exceed net-zero impact by 2030." },
                  { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', title: "Sustainable Smart Roads", desc: "Implementing road-based energy harvesting to power streetlights and EV charging stations." },
                  { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', title: "Innovation & Inclusion", desc: "Fostering R&D and skill-building programs to empower rural communities in clean tech adoption." }
                ].map((item, i) => (
                  <div key={i} style={{ background: BG, border: `1px solid ${BORDER}`, borderTop: `4px solid ${ACCENT}`, borderRadius: 16, padding: 32, transition: 'transform 0.3s' }}>
                    <div style={{ color: ACCENT, marginBottom: 20 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}></path></svg>
                    </div>
                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: 16 }}>{item.title}</h4>
                    <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: '0.88rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {page === 'blog' && (
        <section style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: 24, color: '#fff' }}>Blog</h1>
            <p style={{ fontSize: '1.25rem', color: TEXT_DIM }}>Coming soon. We are preparing insights into the future of electric mobility.</p>
          </div>
        </section>
      )}

      <footer style={{ padding: '80px 88px 40px', background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr 1.2fr', gap: 48, marginBottom: 60 }}>
            {/* Column 1: Brand */}
            <div>
              <img src={logo} alt="TRIO" style={{ height: '82px', marginBottom: 20 }} />
              <div style={{ color: ACCENT, fontSize: '1.1rem', fontWeight: 700, marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>Drive Smart. Go Green.</div>
              <p style={{ color: TEXT_DIM, fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 20, maxWidth: 240 }}>
                TRIO EV is Kolkata's premier electric mobility company, delivering clean, green, and smart transportation solutions for businesses and individuals.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
                ].map((path, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={TEXT_DIM}><path d={path}></path></svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Categories */}
            <div>
              <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>CATEGORIES</div>
              {[
                { label: 'Find stations', target: 'find-stations' },
                { label: 'About us', target: 'about-us' },
                { label: 'Blog', target: 'blog' }
              ].map(l => (
                <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 16, fontSize: '0.9rem', fontWeight: 500, transition: 'color 200ms' }} onMouseEnter={(e: any) => e.target.style.color = ACCENT} onMouseLeave={(e: any) => e.target.style.color = TEXT}>{l.label}</a>
              ))}
            </div>

            {/* Column 3: Policies */}
            <div>
              <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>POLICIES</div>
              {[
                { label: 'Privacy Policy', target: 'privacy-policy' },
                { label: 'Terms & Conditions', target: 'terms-conditions' },
                { label: 'Refund Policy', target: 'refund-policy' }
              ].map(l => (
                <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 16, fontSize: '0.9rem', fontWeight: 500, transition: 'color 200ms' }} onMouseEnter={(e: any) => e.target.style.color = ACCENT} onMouseLeave={(e: any) => e.target.style.color = TEXT}>{l.label}</a>
              ))}
            </div>

            {/* Column 4: Registered Address */}
            <div>
              <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>REGISTERED ADDRESS</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ color: ACCENT, marginTop: 2 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                <div style={{ color: TEXT_DIM, fontSize: '0.85rem', lineHeight: 1.5 }}>
                  29E, Raipur Mondal Para Road, P.S. Netaji Nagar, Naktala, Kolkata - 700047, West Bengal, India
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ color: ACCENT }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                <div style={{ color: TEXT_DIM, fontSize: '0.85rem' }}>+91 62918 42000</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ color: ACCENT }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                <div style={{ color: TEXT_DIM, fontSize: '0.85rem' }}>info@trioev.com</div>
              </div>
            </div>

            {/* Column 5: Office Address + Button */}
            <div>
              <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>OFFICE ADDRESS</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <div style={{ color: ACCENT, marginTop: 2 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                <div style={{ color: TEXT_DIM, fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Shilpata More, Mahammadpur Road (Opposite Curiosity), New Town, Kolkata - 700135, West Bengal, India
                </div>
              </div>
              <button
                className="btn-accent"
                style={{ width: '100%', padding: '16px 24px', fontSize: '0.85rem', fontWeight: 800, borderRadius: 8, background: '#5AF59F', color: '#000', boxShadow: '0 4px 14px rgba(90, 245, 159, 0.3)' }}
                onClick={() => setShowContactForm(true)}
              >
                CONTACT US
              </button>
            </div>
          </div>
          <div style={{ color: TEXT_DIM, fontSize: '0.75rem', borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2026 Trio Inc. All rights reserved.</span>
            <span style={{ fontStyle: 'italic' }}>Clean. Green. Smart.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
