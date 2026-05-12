import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import logo from './assets/logo.png'
import charger3d from './assets/charger-3d.png'
import hub3d from './assets/Screenshot_2026-05-05_004406-removebg-preview.png'
import serviceImg from './assets/Screenshot_2026-05-06_131630-removebg-preview-Picsart-AiImageEnhancer.png'
import { NoticeModal } from './components/NoticeModal';
import { HeroCarousel } from './components/HeroCarousel';
import { BlogPage } from './components/BlogPage';
import { ContactSalesForm } from './components/ContactSalesForm';
import { trackPageView } from './lib/track';
import { api } from './lib/axios';
import professorImg from './assets/Screenshot_2026-05-08_003804-removebg-preview.png'

type ApiStation = { id: string; name: string; state: string; lat: number; lon: number; kw: number; connector: string; stalls: number; tariff: number; enabled: boolean; order: number };
type LocalStation = { id: string; name: string; state: string; lon: number; lat: number; kw: number; conn: string; stalls: number; tariff: number };
async function fetchStations(): Promise<LocalStation[]> {
  const { data } = await api.get<ApiStation[]>('/api/stations');
  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    state: s.state,
    lon: s.lon,
    lat: s.lat,
    kw: s.kw,
    conn: s.connector,
    stalls: s.stalls,
    tariff: s.tariff,
  }));
}

type SocialLinkApi = { platform: string; url: string; enabled?: boolean; label?: string | null };
type SiteSettingsPublic = {
  registeredAddress: string;
  officeAddress: string;
  phone: string;
  email: string;
  contactCtaUrl: string;
  socials: SocialLinkApi[];
};
async function fetchSiteSettings(): Promise<SiteSettingsPublic | null> {
  try {
    const { data } = await api.get<SiteSettingsPublic>('/api/settings');
    return data;
  } catch {
    return null;
  }
}

const SOCIAL_ICONS: Record<string, string> = {
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  twitter: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
  youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  whatsapp: 'M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l.001.001-.999 3.648 3.477-.609zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z',
  tiktok: 'M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.831 4.831 0 01-1.003-.104z',
  pinterest: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z',
  website: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z',
  other: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71m-3.05 11.36l-1.72 1.72a5 5 0 01-7.07-7.07l3-3A5 5 0 0114 5',
};

const ACCENT = '#00FF88'           // vibrant electric lime (from offline)
const ACCENT_SOFT = '#00CC77'      // secondary energy green
const BG = '#0B0F0D'               // dark graphite primary
const SURFACE = '#111715'          // secondary surface
const CARD = '#151B18'             // card surface
const BORDER = 'rgba(0,255,136,0.08)'
const BORDER_STRONG = 'rgba(0,255,136,0.18)'
const TEXT = '#F5F7F6'
const TEXT_DIM = '#8C948F'

// --- HOOKS ---
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

// --- HUD CARD ---
const HUDCard = ({ icon, title, value, unit, delay = 0.5, lineCycle = 2.6 }: any) => (
  <motion.div
    className="hero-hud-card"
    initial={{ opacity: 0, y: 16 }}
    animate={{
      opacity: 1,
      y: 0,
      boxShadow: [
        '0 0 0px 0 rgba(0, 255, 136, 0)',
        '0 0 0px 0 rgba(0, 255, 136, 0)',
        '0 0 30px 4px rgba(0, 255, 136, 0.55)',
        '0 0 0px 0 rgba(0, 255, 136, 0)',
      ],
    }}
    transition={{
      default: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
      boxShadow: {
        duration: lineCycle,
        times: [0, 0.82, 0.95, 1],
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay + 0.7,
      },
    }}
    style={{
      background: 'rgba(10, 14, 12, 0.55)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(255,255,255,0.04)',
      padding: '10px 16px',
      minWidth: '150px',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}
  >
    {icon && (
      <div style={{
        color: ACCENT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
    )}
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: TEXT, letterSpacing: -0.01 }}>{value}</span>
        {unit && <span style={{ fontSize: '0.75rem', color: ACCENT, fontWeight: 600 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: '0.68rem', color: TEXT_DIM, fontWeight: 500, marginTop: 2 }}>{title}</div>
    </div>
  </motion.div>
);

// --- LIVE STAT (hero strip) ---
const FlipStat = ({ label, value, trend }: any) => (
  <div className="flip-stat" style={{ padding: '4px 0', paddingRight: 24 }}>
    <div className="stat-label" style={{ fontSize: '0.74rem', color: TEXT_DIM, fontWeight: 500, marginBottom: 6 }}>{label}</div>
    <div className="stat-val" style={{ fontSize: '1.6rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.02, color: TEXT }}>{value}</div>
    <div className="stat-trend" style={{ fontSize: '0.7rem', color: ACCENT_SOFT, marginTop: 4, fontWeight: 500 }}>↗ {trend}</div>
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

// --- STATIONS DATA (fallback shown briefly before /api/stations resolves) ---
const STATIONS_FALLBACK = [
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

type Page = 'home' | 'find-stations' | 'privacy-policy' | 'terms-conditions' | 'refund-policy' | 'about-us' | 'blog' | 'contact-us';
const PAGE_TO_PATH: Record<Page, string> = {
  'home': '/',
  'find-stations': '/find-stations',
  'about-us': '/about-us',
  'blog': '/blog',
  'privacy-policy': '/privacy-policy',
  'terms-conditions': '/terms-conditions',
  'refund-policy': '/refund-policy',
  'contact-us': '/contact-us',
};
function pathToPage(path: string): Page {
  const normalized = (path || '/').replace(/\/+$/, '') || '/';
  for (const [p, url] of Object.entries(PAGE_TO_PATH) as [Page, string][]) {
    if (url === normalized) return p;
  }
  return 'home';
}

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
  const [page, setPage] = useState<Page>(() =>
    typeof window !== 'undefined' ? pathToPage(window.location.pathname) : 'home',
  );
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile(1024);
  const [searchQuery, setSearchQuery] = useState('');
  const [connFilter, setConnFilter] = useState('Any');
  const [minPower, setMinPower] = useState(0);
  const [selectedStationId, setSelectedStationId] = useState('WB-410');
  const [stationSheetOpen, setStationSheetOpen] = useState(false);
  const [stationListExpanded, setStationListExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [whySlide, setWhySlide] = useState(0);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWhySlide(prev => (prev + 1) % WHY_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate Services showcase every 4s; timer resets on manual change (mobile + desktop)
  useEffect(() => {
    const t = setTimeout(() => {
      setActiveService(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearTimeout(t);
  }, [activeService, isMobile]);

  const stationsQuery = useQuery({ queryKey: ['stations'], queryFn: fetchStations, staleTime: 60_000 });
  const STATIONS: LocalStation[] = useMemo(
    () => stationsQuery.data ?? STATIONS_FALLBACK.map((s) => ({ ...s, stalls: 2, tariff: 20 })),
    [stationsQuery.data],
  );

  const settingsQuery = useQuery({ queryKey: ['site-settings'], queryFn: fetchSiteSettings, staleTime: 60_000 });
  const siteSettings = useMemo(() => {
    const s = settingsQuery.data;
    return {
      registeredAddress: s?.registeredAddress?.trim() || '29E, Raipur Mondal Para Road, P.S. Netaji Nagar, Naktala, Kolkata - 700047, West Bengal, India',
      officeAddress: s?.officeAddress?.trim() || 'Shilpata More, Mahammadpur Road (Opposite Curiosity), New Town, Kolkata - 700135, West Bengal, India',
      phone: s?.phone?.trim() || '+91 62918 42000',
      email: s?.email?.trim() || 'info@trioev.com',
      socials: (s?.socials ?? []).filter((x) => x.enabled !== false && x.url?.trim()),
    };
  }, [settingsQuery.data]);

  const filteredStations = useMemo(() => STATIONS.filter(s => {
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConn = connFilter === 'Any' || s.conn === connFilter;
    const matchesPower = s.kw >= minPower;
    return matchesQuery && matchesConn && matchesPower;
  }), [STATIONS, searchQuery, connFilter, minPower]);

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
  }, [filteredStations, isMobile]);

  const focusedState = indiaGeo?.states.find(s =>
    searchQuery.length > 2 && s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )?.name || null;

  const selectedCluster = useMemo(
    () => clusteredStations.find(c => c.id === selectedClusterId),
    [clusteredStations, selectedClusterId]
  );

  // PREMIUM CLUSTER POPUP
  const ClusterPopup = ({ cluster, onClose, onPick }: { cluster: any, onClose: () => void, onPick: (s: any) => void }) => (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: isMobile ? 'fixed' : 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? 'calc(100vw - 32px)' : 380,
        maxWidth: 380,
        zIndex: 4000,
        pointerEvents: 'auto',
      }}
    >
    <motion.div
      key="cluster-popup-inner"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: '100%',
        background: '#0B0F0D', border: `1px solid ${ACCENT}`, borderRadius: 14,
        padding: isMobile ? 16 : 32,
        boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 24px ${ACCENT}33`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? 16 : 24, gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: ACCENT, fontSize: isMobile ? '0.58rem' : '0.65rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: isMobile ? 6 : 8 }}>{cluster.state} · {cluster.count === 1 ? 'STATION' : 'CLUSTER'}</div>
          <h3 style={{ fontSize: isMobile ? '1.05rem' : '1.6rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: -0.5, lineHeight: 1.2 }}>{cluster.count === 1 ? cluster.stations[0].name : `${cluster.count} stations in this area`}</h3>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>×</button>
      </div>

      <div style={{ display: 'flex', gap: isMobile ? 16 : 32, marginBottom: isMobile ? 14 : 24, paddingBottom: isMobile ? 14 : 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div style={{ fontSize: isMobile ? '1rem' : '1.4rem', fontWeight: 700, color: ACCENT }}>{cluster.totalKw}<span style={{ fontSize: isMobile ? '0.62rem' : '0.75rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW total</span></div>
        </div>
        <div>
          <div style={{ fontSize: isMobile ? '1rem' : '1.4rem', fontWeight: 700, color: '#fff' }}>{Math.round(cluster.totalKw / cluster.count)}<span style={{ fontSize: isMobile ? '0.62rem' : '0.75rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW avg</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: isMobile ? 180 : 240, overflowY: 'auto' }} className="custom-scrollbar">
        {cluster.stations.map((s: any) => (
          <div key={s.id} onClick={() => onPick(s)} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
            padding: isMobile ? '8px 10px' : '12px 16px', borderRadius: 8, transition: 'all 0.2s'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: isMobile ? '0.82rem' : '0.9rem', fontWeight: 600 }}>{s.name}</div>
              <div style={{ color: TEXT_DIM, fontSize: isMobile ? '0.62rem' : '0.7rem' }}>{s.id}</div>
            </div>
            <div style={{ color: ACCENT, fontWeight: 700, fontSize: isMobile ? '0.82rem' : '0.9rem' }}>{s.kw} kW</div>
          </div>
        ))}
      </div>
    </motion.div>
    </div>
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
            style={{ cursor: 'default' }}
            onMouseEnter={() => onHover && onHover(s.name)}
            onMouseLeave={() => onHover && onHover(null)}
          />
        ))}

        {clusteredStations.map((c, i) => {
          if (!indiaGeo || !indiaGeo.project) return null;
          const [x, y] = indiaGeo.project(c.lon, c.lat);
          if (isNaN(x) || isNaN(y)) return null;

          return (
            <g
              key={c.id}
              onClick={(e) => { e.stopPropagation(); setSelectedClusterId(c.id); }}
              style={{ cursor: 'pointer' }}
            >
              {/* MARKER — cyan glow with bolt + cluster count (matches desktop spots) */}
              <circle cx={x} cy={y} r={9.5} fill="#5EC8FF" opacity={0.08} />
              <circle cx={x} cy={y} r={7} fill="none" stroke="#5EC8FF" strokeWidth="0.35" opacity={0.4} />
              <circle cx={x} cy={y} r={5.5} fill="#0B1620" stroke="#5EC8FF" strokeWidth={0.8} style={{ filter: `drop-shadow(0 0 2.5px #5EC8FF)` }} />
              <path d={`M ${x - 1.6} ${y - 2.2} L ${x - 2.8} ${y + 0.2} L ${x - 1.9} ${y + 0.2} L ${x - 2.3} ${y + 2.2} L ${x - 0.8} ${y - 0.3} L ${x - 1.7} ${y - 0.3} L ${x - 1.2} ${y - 2.2} Z`} fill="#5EC8FF" />
              <text x={x + 1.2} y={y + 1.3} fontSize="3.4" fontWeight="700" fill="#fff" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" style={{ pointerEvents: 'none' }}>{c.count}</text>
            </g>
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
    } else if (target === 'contact-us') {
      setPage('contact-us');
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
      const time = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
      });
      setClock(`${time} IST`);
    };
    tick();
    const id = setInterval(tick, 1000);
    const id2 = setInterval(() => setStationsOnline(n => n + (Math.random() > 0.45 ? 1 : -1)), 2400);
    const id3 = setInterval(() => setKwhToday(n => n + Math.floor(Math.random() * 18 + 4)), 1200);
    return () => { clearInterval(id); clearInterval(id2); clearInterval(id3); };
  }, []);

  useEffect(() => {
    trackPageView('/' + (page === 'home' ? '' : page));
  }, [page]);

  // Keep /contact-us and the Contact Sales form modal in sync (works in both directions)
  useEffect(() => {
    if (page === 'contact-us' && !showContactForm) setShowContactForm(true);
  }, [page, showContactForm]);
  useEffect(() => {
    if (showContactForm && page !== 'contact-us') setPage('contact-us');
  }, [showContactForm, page]);

  useEffect(() => {
    const target = PAGE_TO_PATH[page];
    if (window.location.pathname !== target) {
      window.history.pushState({}, '', target);
    }
  }, [page]);

  useEffect(() => {
    const handler = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
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

        :root {
          --side-padding: 88px;
        }

        @media (max-width: 1024px) {
          :root {
            --side-padding: 24px;
          }
        }

        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11,15,13,0.98);
          backdrop-filter: blur(20px);
          z-index: 2000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          padding: 40px;
        }

        .mobile-menu-link {
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: ${TEXT};
          text-decoration: none;
          letter-spacing: -0.01em;
          padding: 6px 16px;
        }
        .mobile-menu-link:active { color: ${ACCENT}; }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: ${TEXT};
          cursor: pointer;
          padding: 8px;
          z-index: 2100;
        }

        @media (max-width: 1024px) {
          .menu-toggle { display: flex !important; align-items: center; justify-content: center; }
          .desktop-nav { display: none !important; }
        }

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
          .synapse-grid { grid-template-columns: 1fr; gap: 32px; }
          .core-col { grid-column: 1; grid-row: 5; min-height: 320px; }
          .module-nw { grid-row: 1; }
          .module-ne { grid-row: 2; }
          .module-sw { grid-row: 3; }
          .module-se { grid-row: 4; }
          
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; padding-top: 40px !important; }
          .hero-left { display: flex; flex-direction: column; align-items: center; }
          .hero-btns { justify-content: center !important; }
          .hero-right { order: -1; }

          .why-grid { grid-template-columns: 1fr !important; gap: 64px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }

        /* ==================== MOBILE OVERRIDES ==================== */
        @media (max-width: 1024px) {
          /* HEADER / FOOTER LOGO */
          .header-logo { height: 76px !important; }
          .footer-logo { height: 60px !important; }
          .menu-toggle { min-width: 44px; min-height: 44px; }

          /* HERO — charger first (visual), then text + stats */
          .hero-grid { padding-top: 24px !important; gap: 24px !important; }
          .hero-right { order: -1 !important; }
          .hero-right-charger { min-height: 220px !important; }
          .hero-right-charger img { max-width: 260px !important; }
          .hero-hud-left, .hero-hud-right { display: none !important; }
          .hero-charging-lines { display: none !important; }
          .hero-stat-strip { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; max-width: 100% !important; margin-top: 8px; }
          .hero-stat-strip .flip-stat { padding-right: 6px !important; padding-left: 6px !important; }
          .hero-stat-strip .flip-stat .stat-val { font-size: 1rem !important; }
          .hero-stat-strip .flip-stat .stat-label { font-size: 0.62rem !important; }
          .hero-stat-strip .flip-stat .stat-trend { font-size: 0.58rem !important; }

          /* SERVICES SECTION */
          .services-main-grid { grid-template-columns: 1fr !important; gap: 24px !important; margin-top: 8px !important; }
          .services-img-container { height: 200px !important; margin-bottom: 18px !important; }
          .services-img-container img { object-position: center center !important; }
          .services-desc { padding-left: 0 !important; text-align: center; }
          .services-desc p { max-width: 100% !important; }
          .service-item { padding: 18px 16px !important; }
          .service-item h4 { font-size: 1rem !important; }
          .services-eyebrow { font-size: 0.65rem !important; }
          .services-h2 { font-size: 2.4rem !important; }
          .services-tag { font-size: 0.95rem !important; }

          /* HERO TICKER hidden on mobile (overflow) */
          .ticker { display: none !important; }

          /* INDIA COVERAGE */
          .network-inner { padding: 0 16px !important; }
          .network-iframe-wrap { height: 380px !important; border-radius: 14px !important; }

          /* WHY-EV */
          .why-grid { gap: 40px !important; }
          .why-slide-title { font-size: 1.25rem !important; margin-bottom: 20px !important; }
          .why-slide-content { min-height: auto !important; }
          .why-right-col { text-align: center !important; }
          .prof-img-container { width: 100% !important; max-width: 320px !important; height: 360px !important; margin: 0 auto !important; }
          .prof-name { font-size: 1.9rem !important; }
          .prof-role { font-size: 0.7rem !important; }

          /* CTA */
          .cta-section { padding: 60px 20px 0 !important; }
          .cta-section .cta-btn-row { gap: 12px !important; margin-bottom: 40px !important; }

          /* POLICY PAGES */
          .policy-section { padding-top: 96px !important; padding-bottom: 64px !important; }
          .policy-inner { padding: 0 16px !important; }
          .policy-title { font-size: 2rem !important; margin-bottom: 28px !important; }
          .policy-inner h2 { font-size: 1.2rem !important; margin-top: 32px !important; }
          .policy-inner p, .policy-inner ul { font-size: 0.95rem !important; }

          /* ABOUT US */
          .about-hero { margin-bottom: 64px !important; padding: 0 16px !important; }
          .about-inner { padding: 0 16px !important; }
          .vision-grid, .mission-grid { grid-template-columns: 1fr !important; gap: 28px !important; margin-bottom: 64px !important; }
          .vision-img, .mission-img { height: 240px !important; border-radius: 20px !important; }
          .about-section-title { font-size: 1.7rem !important; }
          .story-block { margin-bottom: 80px !important; }
          .story-quote { font-size: 1.35rem !important; padding: 32px 0 !important; }
          .story-block h2 { font-size: 2rem !important; }
          .leadership-block { margin-bottom: 80px !important; }
          .leadership-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .leadership-card { padding: 36px 24px !important; border-radius: 24px !important; }
          .leadership-card .leader-avatar { width: 96px !important; height: 96px !important; margin-bottom: 20px !important; }
          .leadership-card h3 { font-size: 1.35rem !important; }
          .impact-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
          .impact-card { padding: 20px !important; }
          .impact-card h4 { font-size: 1rem !important; margin-bottom: 10px !important; }
          .impact-card p { font-size: 0.82rem !important; }

          /* FIND-STATIONS IFRAME */
          .find-stations-iframe { height: 760px !important; }

          /* FOOTER */
          footer { padding-top: 56px !important; padding-bottom: 32px !important; }
          .footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
        }

        @media (max-width: 600px) {
          .impact-grid { grid-template-columns: 1fr !important; }
          .network-iframe-wrap { height: 320px !important; }
          .find-stations-iframe { height: 660px !important; }
          .hero-stat-strip { grid-template-columns: 1fr !important; gap: 14px !important; }
          .hero-stat-strip .flip-stat { padding-right: 0 !important; border-bottom: 1px solid ${BORDER}; padding-bottom: 14px !important; }
          .hero-stat-strip .flip-stat:last-child { border-bottom: none; padding-bottom: 0 !important; }
          .hero-stat-strip .flip-stat .stat-val { font-size: 1.3rem !important; }
        }
      `}</style>

      {/* HEADER */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, height: '72px', display: 'flex', alignItems: 'center', padding: '0 var(--side-padding)', background: 'rgba(11,15,13,0.78)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('home')}>
          <img className="header-logo" src={logo} alt="TRIO" style={{ height: '96px', width: 'auto', position: 'relative', objectFit: 'contain' }} />
        </div>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 32 }}>
          {[
            { label: 'Find stations', target: 'find-stations' },
            { label: 'About us', target: 'about-us' },
            { label: 'Blog', target: 'blog' },
          ].map(l => (
            <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target as any); }} style={{ color: TEXT_DIM, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'color 200ms', cursor: 'pointer' }} onMouseEnter={(e: any) => e.target.style.color = TEXT} onMouseLeave={(e: any) => e.target.style.color = TEXT_DIM}>{l.label}</a>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          {!isMobile && (
            <button
              className="btn-accent"
              onClick={() => setShowContactForm(true)}
              style={{ padding: '12px 28px', fontSize: '0.88rem', fontWeight: 700 }}
            >
              Contact Us
            </button>
          )}

          <button className="menu-toggle" onClick={() => setShowMobileMenu(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <button
              style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: TEXT, cursor: 'pointer' }}
              onClick={() => setShowMobileMenu(false)}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {[
              { label: 'Find stations', target: 'find-stations' },
              { label: 'About us', target: 'about-us' },
              { label: 'Blog', target: 'blog' },
            ].map(l => (
              <a
                key={l.label}
                href="#"
                className="mobile-menu-link"
                onClick={(e) => { e.preventDefault(); navigate(l.target as any); setShowMobileMenu(false); }}
              >
                {l.label}
              </a>
            ))}

            <button
              className="btn-accent"
              onClick={() => { setShowContactForm(true); setShowMobileMenu(false); }}
              style={{ marginTop: 20, padding: '16px 40px', fontSize: '1.1rem' }}
            >
              Contact Us
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <NoticeModal />
      <ContactSalesForm
        open={showContactForm}
        onClose={() => {
          setShowContactForm(false);
          if (page === 'contact-us') setPage('home');
        }}
      />

      {/* STATION DETAIL — bottom sheet (global; opens from Find-stations list and from ENERGY SYNAPSE mobile map) */}
      <AnimatePresence>
        {stationSheetOpen && selectedStation && (
          <>
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setStationSheetOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 1500 }}
            />
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 500) setStationSheetOpen(false); }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(180deg, ${SURFACE}, ${BG})`,
                borderTop: `1px solid ${BORDER_STRONG}`,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                zIndex: 1600,
                padding: '10px 20px 28px',
                maxHeight: '88vh',
                overflowY: 'auto',
                boxShadow: `0 -16px 40px rgba(0,0,0,0.5), 0 0 60px ${ACCENT}14`,
              }}
            >
              {/* Drag handle */}
              <div style={{ width: 44, height: 4, background: 'rgba(255,255,255,0.22)', borderRadius: 999, margin: '0 auto 18px' }} />

              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {selectedStation.id} · Charging Station
                  </div>
                  <h2 style={{ fontSize: '1.7rem', fontWeight: 700, color: TEXT, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 2 }}>{selectedStation.name}</h2>
                  <div style={{ color: TEXT_DIM, fontSize: '0.78rem' }}>{selectedStation.state}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStationSheetOpen(false)}
                  aria-label="Close"
                  style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.06)', color: TEXT, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {/* Specs table */}
              <div style={{ marginBottom: 18 }}>
                {[
                  { label: 'POWER', value: <><span style={{ color: ACCENT }}>{selectedStation.kw}</span> <span style={{ color: TEXT }}>kW</span></> },
                  { label: 'CONNECTOR', value: <span style={{ color: ACCENT }}>{selectedStation.conn}</span> },
                  { label: 'COORDS', value: <span style={{ color: TEXT }}>{selectedStation.lat.toFixed(2)}° N, {selectedStation.lon.toFixed(2)}° E</span> },
                  { label: 'STALLS', value: <><span style={{ color: ACCENT }}>{selectedStation.stalls}</span> <span style={{ color: TEXT }}>available</span></> },
                  { label: 'TARIFF', value: <span style={{ color: ACCENT }}>₹ {selectedStation.tariff}/ kWh</span> },
                ].map((row, i, arr) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 0',
                      borderBottom: i < arr.length - 1 ? `1px dashed ${BORDER_STRONG}` : 'none',
                    }}
                  >
                    <span className="mono" style={{ color: TEXT_DIM, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.16em' }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Online status footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
                <span className="circle pulse-dot" style={{ width: 7, height: 7, background: ACCENT, color: ACCENT }} />
                <span className="mono" style={{ color: ACCENT, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em' }}>
                  ONLINE · ACCEPTING SESSIONS
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn-accent"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedStation.lat},${selectedStation.lon}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }}
                  style={{ flex: 1, padding: '15px 20px', fontSize: '0.9rem', fontWeight: 700, justifyContent: 'center' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                  Get directions
                </button>
                <button
                  type="button"
                  onClick={() => { setStationSheetOpen(false); setShowContactForm(true); }}
                  aria-label="Reserve / contact"
                  style={{ width: 52, height: 52, borderRadius: 999, border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {page === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* HERO — refined, premium */}
            <HeroCarousel fallback={
              isMobile ? (
                <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 92, paddingBottom: 40, background: BG, minHeight: 'calc(100vh - 72px)' }}>
                  {/* Ambient gradients */}
                  <div style={{ position: 'absolute', top: '12%', right: '-35%', width: 480, height: 480, background: `radial-gradient(circle, ${ACCENT_SOFT}28, transparent 65%)`, pointerEvents: 'none', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', bottom: '-15%', left: '-35%', width: 420, height: 420, background: `radial-gradient(circle, ${ACCENT_SOFT}1c, transparent 70%)`, pointerEvents: 'none', borderRadius: '50%' }} />

                  <div style={{ position: 'relative', zIndex: 5, padding: '0 20px' }}>
                    {/* Live status pill */}
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 14px', border: `1px solid ${BORDER_STRONG}`, borderRadius: 999, background: 'rgba(11,15,13,0.6)', backdropFilter: 'blur(10px)', marginBottom: 22 }}
                    >
                      <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                      <span className="mono" style={{ color: ACCENT, fontSize: '0.62rem', letterSpacing: '0.14em', fontWeight: 600 }}>LIVE · {clock || '--:--:--'}</span>
                    </motion.div>

                    {/* Title */}
                    <h1 style={{ fontSize: '2.6rem', lineHeight: 1.0, marginBottom: 14, fontWeight: 700, letterSpacing: '-0.035em' }}>
                      <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ display: 'block' }}>
                        EV power,
                      </motion.span>
                      <motion.span initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ display: 'block', color: ACCENT }}>
                        redefined.
                      </motion.span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      style={{ color: TEXT_DIM, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24, maxWidth: 340 }}
                    >
                      The intelligence layer for industrial-scale charging — from grid to vehicle, in real time.
                    </motion.p>

                    {/* Charger showcase */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ position: 'relative', height: 300, marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {/* Floor glow */}
                      <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '85%', height: '32%', background: `radial-gradient(ellipse at center, ${ACCENT}38, transparent 65%)`, pointerEvents: 'none', filter: 'blur(10px)', zIndex: 0 }} />

                      {/* Soft radial spotlight backdrop */}
                      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${ACCENT_SOFT}10, transparent 65%)`, pointerEvents: 'none', zIndex: 0 }} />

                      {/* Connecting lines — charger ↔ badges. Lines start just outside the charger silhouette and terminate inside each badge's bounding box (badges have higher z-index so they cleanly cap the line). */}
                      <svg
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
                        viewBox="0 0 100 60"
                        preserveAspectRatio="none"
                      >
                        {/* Top-right line: exits charger right side → bends up → enters CHARGING badge from below */}
                        <motion.path
                          d="M 58 32 L 88 32 L 88 10"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="1.4"
                          strokeDasharray="3 3"
                          strokeLinecap="round"
                          opacity={0.7}
                          vectorEffect="non-scaling-stroke"
                          animate={{ strokeDashoffset: [0, -12] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.path
                          d="M 58 32 L 88 32 L 88 10"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="2.2"
                          strokeDasharray="10 200"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          style={{ filter: `drop-shadow(0 0 4px ${ACCENT})` }}
                          animate={{ strokeDashoffset: [200, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Bottom-left line: exits charger left side → bends down → enters CONNECTOR badge from above */}
                        <motion.path
                          d="M 42 32 L 12 32 L 12 50"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="1.4"
                          strokeDasharray="3 3"
                          strokeLinecap="round"
                          opacity={0.7}
                          vectorEffect="non-scaling-stroke"
                          animate={{ strokeDashoffset: [0, -12] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.path
                          d="M 42 32 L 12 32 L 12 50"
                          fill="none"
                          stroke={ACCENT}
                          strokeWidth="2.2"
                          strokeDasharray="10 200"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          style={{ filter: `drop-shadow(0 0 4px ${ACCENT})` }}
                          animate={{ strokeDashoffset: [200, 0] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                        />
                      </svg>

                      {/* Charger image with float — wrapper handles centering via flexbox so framer-motion's y doesn't break it */}
                      <motion.img
                        src={charger3d}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          width: '72%',
                          maxWidth: 240,
                          height: 'auto',
                          filter: 'drop-shadow(0 18px 28px rgba(0,0,0,0.55))',
                          position: 'relative',
                          zIndex: 2,
                        }}
                      />

                      {/* Charging status badge — top right */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, x: 12 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: 0,
                          boxShadow: [
                            `0 8px 24px rgba(0,0,0,0.4), 0 0 0 0 rgba(0,255,136,0)`,
                            `0 8px 24px rgba(0,0,0,0.4), 0 0 0 0 rgba(0,255,136,0)`,
                            `0 8px 24px rgba(0,0,0,0.4), 0 0 22px 3px rgba(0,255,136,0.55)`,
                            `0 8px 24px rgba(0,0,0,0.4), 0 0 0 0 rgba(0,255,136,0)`,
                          ],
                        }}
                        transition={{
                          default: { delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                          boxShadow: { duration: 2.4, times: [0, 0.82, 0.95, 1], repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
                        }}
                        style={{
                          position: 'absolute',
                          top: 18,
                          right: 12,
                          background: 'rgba(11,15,13,0.85)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          border: `1px solid ${ACCENT}55`,
                          borderRadius: 12,
                          padding: '9px 13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          zIndex: 3,
                        }}
                      >
                        <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, color: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                        <div>
                          <div style={{ fontSize: '0.56rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Charging</div>
                          <div style={{ fontSize: '0.88rem', color: TEXT, fontWeight: 700, lineHeight: 1.1, marginTop: 2 }}>150 <span style={{ color: ACCENT, fontSize: '0.7rem' }}>kW</span></div>
                        </div>
                      </motion.div>

                      {/* Connector badge — bottom left */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85, x: -12 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: 0,
                          boxShadow: [
                            '0 0 0 0 rgba(0,255,136,0)',
                            '0 0 0 0 rgba(0,255,136,0)',
                            '0 0 22px 3px rgba(0,255,136,0.55)',
                            '0 0 0 0 rgba(0,255,136,0)',
                          ],
                        }}
                        transition={{
                          default: { delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                          boxShadow: { duration: 2.4, times: [0, 0.82, 0.95, 1], repeat: Infinity, ease: 'easeInOut', delay: 1.7 },
                        }}
                        style={{
                          position: 'absolute',
                          bottom: 18,
                          left: 12,
                          background: 'rgba(11,15,13,0.85)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          border: `1px solid ${BORDER_STRONG}`,
                          borderRadius: 12,
                          padding: '9px 13px',
                          zIndex: 3,
                        }}
                      >
                        <div style={{ fontSize: '0.56rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Connector</div>
                        <div style={{ fontSize: '0.88rem', color: TEXT, fontWeight: 700, lineHeight: 1.1, marginTop: 2 }}>CCS2 <span style={{ color: TEXT_DIM, fontSize: '0.62rem', fontWeight: 500 }}>· DC Fast</span></div>
                      </motion.div>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65, duration: 0.5 }}
                      style={{ display: 'flex', gap: 10, marginBottom: 28 }}
                    >
                      <button
                        className="btn-accent"
                        onClick={() => setPage('find-stations')}
                        style={{ flex: 1, padding: '15px 20px', fontSize: '0.92rem', fontWeight: 700, justifyContent: 'center' }}
                      >
                        Find a station <span style={{ fontSize: '1.05rem' }}>→</span>
                      </button>
                      <button
                        onClick={() => { const el = document.querySelector('#network'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                        aria-label="View network"
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 999,
                          border: `1px solid ${BORDER_STRONG}`,
                          background: SURFACE,
                          color: ACCENT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                      </button>
                    </motion.div>

                    {/* Live stat cards */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.85, duration: 0.5 }}
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}
                    >
                      {[
                        { label: 'Stations', val: stationsOnline.toLocaleString(), accent: true },
                        { label: 'kWh today', val: (kwhToday / 1000).toFixed(1) + 'K' },
                        { label: 'Avg session', val: '22:14' },
                      ].map((s, i) => (
                        <div
                          key={i}
                          style={{
                            background: s.accent ? `${ACCENT}10` : SURFACE,
                            border: `1px solid ${s.accent ? BORDER_STRONG : BORDER}`,
                            borderRadius: 12,
                            padding: '12px 10px',
                          }}
                        >
                          <div style={{ fontSize: '1rem', color: s.accent ? ACCENT : TEXT, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{s.val}</div>
                          <div style={{ fontSize: '0.62rem', color: TEXT_DIM, fontWeight: 500, marginTop: 5, letterSpacing: '0.03em' }}>{s.label}</div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </section>
              ) : (
              <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 72, background: BG }}>
                {/* Subtle ambient gradient */}
                <div style={{ position: 'absolute', right: '-10%', top: '15%', width: 760, height: 760, background: `radial-gradient(circle, ${ACCENT_SOFT}22, transparent 60%)`, pointerEvents: 'none', borderRadius: '50%' }} />

                <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 80, padding: '24px var(--side-padding) 0', alignItems: 'center', minHeight: 'calc(100vh - 120px)', position: 'relative', zIndex: 5, maxWidth: 1440, margin: '0 auto' }}>

                  {/* LEFT COLUMN */}
                  <div className="hero-left">
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
                        className="hero-btns"
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                        style={{ display: 'flex', gap: 12, marginBottom: 64 }}
                      >
                        <button
                          className="btn-accent"
                          onClick={() => setPage('find-stations')}
                        >
                          Find a station <span style={{ fontSize: '1rem' }}>→</span>
                        </button>
                      </motion.div>

                      {/* STAT STRIP */}
                      <motion.div
                        className="hero-stat-strip"
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
                  <div className="hero-right hero-right-charger" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px' }}>
                    {/* Soft floor gradient */}
                    <div style={{ position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)', width: '90%', height: '40%', background: `radial-gradient(ellipse at center, ${ACCENT_SOFT}1f, transparent 65%)`, pointerEvents: 'none' }} />

                    {/* charger image — entrance then continuous float (matches mobile hero) */}
                    <motion.img
                      src={charger3d}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                      transition={{
                        opacity: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
                        scale: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
                        y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
                      }}
                      style={{ width: '100%', maxWidth: '680px', position: 'relative', zIndex: 5 }}
                    />

                    {/* HUD cards & Charging Lines */}
                    <div className="hero-hud-left" style={{ position: 'absolute', top: '22%', left: '-15%', zIndex: 20 }}>
                      <HUDCard
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                        title="Total Customers"
                        value="56,894"
                        delay={0.8}
                        lineCycle={2.6}
                      />
                    </div>
                    <div className="hero-hud-right" style={{ position: 'absolute', bottom: '28%', right: '-15%', zIndex: 20 }}>
                      <HUDCard
                        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                        title="Total Bookings"
                        value="38,465"
                        delay={1.0}
                        lineCycle={2.2}
                      />
                    </div>

                    {/* CHARGING LINES — Static green dashed connectors. preserveAspectRatio=none so SVG units map 1:1 to container percentages; overflow:visible lets lines extend outside viewBox to reach cards (which sit at left/right:-15%) */}
                    <svg
                      className="hero-charging-lines"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}
                      viewBox="0 0 1000 600"
                      preserveAspectRatio="none"
                    >
                      {/* Left Connection (Total Customers): flowing dashes toward card. Path is card→charger so positive offset moves dashes toward card */}
                      <motion.path
                        d="M -25 180 L -25 380 L 360 380"
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                        opacity={0.75}
                        vectorEffect="non-scaling-stroke"
                        animate={{ strokeDashoffset: [0, 24] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                      />
                      {/* Bright pulse traveling from charger → card (left) */}
                      <motion.path
                        d="M -25 180 L -25 380 L 360 380"
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth="2.2"
                        strokeDasharray="50 600"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        style={{ filter: `drop-shadow(0 0 6px ${ACCENT})` }}
                        animate={{ strokeDashoffset: [-650, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
                      />

                      {/* Right Connection (Total Bookings): flowing dashes toward card. Path is charger→card so negative offset moves dashes toward card */}
                      <motion.path
                        d="M 760 320 L 1025 320 L 1025 380"
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                        opacity={0.75}
                        vectorEffect="non-scaling-stroke"
                        animate={{ strokeDashoffset: [0, -24] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                      />
                      {/* Bright pulse traveling from charger → card (right) */}
                      <motion.path
                        d="M 760 320 L 1025 320 L 1025 380"
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth="2.2"
                        strokeDasharray="40 360"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        style={{ filter: `drop-shadow(0 0 6px ${ACCENT})` }}
                        animate={{ strokeDashoffset: [400, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                      />
                    </svg>
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
              )
            } />

            {/* OUR SERVICES */}
            <section id="services" style={{ padding: isMobile ? '48px 20px 56px' : '40px var(--side-padding) 60px', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
              {isMobile ? (() => {
                const MOBILE_SERVICES = [
                  {
                    short: 'Charging',
                    title: 'Charging Solutions',
                    desc: 'Level 2 charging at 240V — moderate speed, ideal for daily use and longer stops.',
                    features: ['Universal CCS · CHAdeMO · Type 2', '240V smart output', '4–8 hour full charge'],
                    tag: 'Daily use',
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
                  },
                  {
                    short: 'Convenience',
                    title: 'User Convenience',
                    desc: 'Locate stations, start sessions, and pay seamlessly through the Trio app. Real-time availability with smart routing built in.',
                    features: ['Live station availability', 'In-app payments', 'Smart route planning'],
                    tag: 'One-tap',
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2.5" ry="2.5" /><line x1="12" y1="18" x2="12" y2="18" /></svg>,
                  },
                  {
                    short: 'Energy',
                    title: 'Energy Management',
                    desc: 'Hubs powered by 100% renewable energy with BESS stabilization for grid resilience and zero net emissions.',
                    features: ['100% renewable input', 'BESS grid stabilization', 'Zero carbon footprint'],
                    tag: 'Renewable',
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-7-5-7-12a7 7 0 0 1 14 0c0 7-7 12-7 12z" /><path d="M9 9c1 2 3 3 6 3" /></svg>,
                  },
                  {
                    short: 'Support',
                    title: 'Maintenance & Support',
                    desc: '24/7 dedicated support with real-time telemetry and predictive maintenance, ensuring 99.99% uptime across the network.',
                    features: ['24/7 expert response', 'Predictive maintenance', '99.99% uptime SLA'],
                    tag: '24 / 7',
                    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3z" /><path d="M3 19a2 2 0 0 0 2 2h1v-6H3z" /></svg>,
                  },
                ];
                const current = MOBILE_SERVICES[activeService];
                return (
                  <div style={{ position: 'relative', zIndex: 5 }}>
                    {/* Ambient backdrop */}
                    <div style={{ position: 'absolute', top: '15%', right: '-30%', width: 360, height: 360, background: `radial-gradient(circle, ${ACCENT_SOFT}18, transparent 65%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                    {/* Eyebrow + title */}
                    <motion.div initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ position: 'relative' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0,255,136,0.08)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99, marginBottom: 14 }}>
                        <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                        <span className="mono" style={{ fontSize: '0.6rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.18em' }}>WHAT WE OFFER</span>
                      </div>
                      <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: TEXT, lineHeight: 1.05, marginBottom: 8, letterSpacing: '-0.03em' }}>
                        Powering your fleet,<br /><span style={{ color: ACCENT }}>end to end.</span>
                      </h2>
                      <p style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.55, marginBottom: 22 }}>
                        Four integrated services that take your EV operation from grid to gateway.
                      </p>
                    </motion.div>

                    {/* Hero showcase card — swipeable, slides up from below with subtle 3D tilt */}
                    <div style={{ position: 'relative', perspective: 1200, minHeight: 360, marginTop: 24 }}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={activeService}
                          initial={{ opacity: 0, x: 80 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -80 }}
                          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.18}
                          dragMomentum={false}
                          onDragEnd={(_, info) => {
                            if (info.offset.x < -50 && activeService < MOBILE_SERVICES.length - 1) {
                              setActiveService(activeService + 1);
                            } else if (info.offset.x > 50 && activeService > 0) {
                              setActiveService(activeService - 1);
                            }
                          }}
                          style={{
                            background: `linear-gradient(150deg, ${SURFACE} 0%, ${BG} 100%)`,
                            border: `1px solid ${BORDER_STRONG}`,
                            borderRadius: 22,
                            padding: '24px 22px',
                            position: 'relative',
                            overflow: 'hidden',
                            transformStyle: 'preserve-3d',
                            cursor: 'grab',
                            touchAction: 'pan-y',
                          }}
                        >
                        {/* Glow blob */}
                        <div style={{ position: 'absolute', top: -70, right: -70, width: 240, height: 240, background: `radial-gradient(circle, ${ACCENT}26, transparent 70%)`, pointerEvents: 'none' }} />
                        {/* Dotted grid */}
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${ACCENT}12 1px, transparent 1px)`, backgroundSize: '16px 16px', opacity: 0.4, pointerEvents: 'none', maskImage: 'radial-gradient(circle at 100% 0%, black 0%, transparent 60%)', WebkitMaskImage: 'radial-gradient(circle at 100% 0%, black 0%, transparent 60%)' }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                          {/* Top row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                            <div className="mono" style={{ color: ACCENT, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', marginTop: 14 }}>
                              0{activeService + 1} <span style={{ color: TEXT_DIM, fontWeight: 500 }}>/ 0{MOBILE_SERVICES.length}</span>
                            </div>
                            <div style={{ width: 52, height: 52, borderRadius: 16, background: `${ACCENT}1a`, border: `1px solid ${ACCENT}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT, boxShadow: `0 0 24px ${ACCENT}22 inset, 0 0 16px ${ACCENT}22` }}>
                              {current.icon}
                            </div>
                          </div>

                          {/* Tag pill */}
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', background: 'rgba(11,15,13,0.55)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 999, marginBottom: 12 }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT }} />
                            <span style={{ fontSize: '0.6rem', color: ACCENT, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{current.tag}</span>
                          </div>

                          {/* Title */}
                          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: TEXT, marginBottom: 12, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
                            {current.title}
                          </h3>

                          {/* Description */}
                          <p style={{ color: TEXT_DIM, fontSize: '0.88rem', lineHeight: 1.65, marginBottom: 22 }}>
                            {current.desc}
                          </p>

                          {/* Feature list */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                            {current.features.map((f, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 11 }}
                              >
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${ACCENT}1c`, border: `1px solid ${ACCENT}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <span style={{ color: TEXT, fontSize: '0.84rem', lineHeight: 1.4 }}>{f}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    </div>

                    {/* Carousel controls — pagination dots + arrows (matches why-ev section) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {MOBILE_SERVICES.map((_, i) => (
                          <div
                            key={i}
                            onClick={() => setActiveService(i)}
                            style={{
                              width: activeService === i ? 24 : 6,
                              height: 6,
                              borderRadius: 999,
                              background: activeService === i ? ACCENT : 'rgba(255,255,255,0.22)',
                              transition: 'all 0.3s',
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setActiveService((activeService - 1 + MOBILE_SERVICES.length) % MOBILE_SERVICES.length)}
                          aria-label="Previous service"
                          style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <button
                          onClick={() => setActiveService((activeService + 1) % MOBILE_SERVICES.length)}
                          aria-label="Next service"
                          style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })() : (
              <div style={{ maxWidth: 1440, margin: '0 auto', position: 'relative', zIndex: 5 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <div className="services-eyebrow" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', color: '#e0e0e0', marginBottom: 16, textTransform: 'uppercase' }}>
                    EXPLORE OUR SERVICES
                  </div>
                  <h2 className="services-h2" style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)', fontWeight: 800, letterSpacing: -0.01, marginBottom: 20, textTransform: 'uppercase', background: 'linear-gradient(180deg, #FFFFFF 0%, #B0B0B0 45%, #606060 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))' }}>
                    OUR SERVICES
                  </h2>
                  <p className="services-tag" style={{ color: TEXT_DIM, fontSize: '1.05rem', fontWeight: 400, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
                    We provide the best services for your electric vehicles, Fast,<br />Convenient and Eco-friendly.
                  </p>
                </div>

                {/* Main Content Grid — left: live EV-Eco animation iframe + active description, right: services list */}
                <div className="services-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'stretch', marginTop: 20 }}>
                  {/* Left: live animated hero + active service description */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                      className="services-iframe-wrap"
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '460px',
                        marginBottom: 36,
                        borderRadius: 24,
                        overflow: 'hidden',
                        border: `1px solid ${BORDER_STRONG}`,
                        background: '#0a2620',
                        boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 60px ${ACCENT}14`,
                      }}
                    >
                      <iframe
                        src="/ev-eco-car.html"
                        title="TRIO EV — Eco Charging"
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          display: 'block',
                          background: '#0a2620',
                        }}
                      />
                      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: `inset 0 0 80px rgba(0,0,0,0.45)` }} />
                      <div style={{ position: 'absolute', top: 14, left: 14, width: 22, height: 22, borderTop: `1.5px solid ${ACCENT}`, borderLeft: `1.5px solid ${ACCENT}`, opacity: 0.65, pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderTop: `1.5px solid ${ACCENT}`, borderRight: `1.5px solid ${ACCENT}`, opacity: 0.65, pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', bottom: 14, left: 14, width: 22, height: 22, borderBottom: `1.5px solid ${ACCENT}`, borderLeft: `1.5px solid ${ACCENT}`, opacity: 0.65, pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', bottom: 14, right: 14, width: 22, height: 22, borderBottom: `1.5px solid ${ACCENT}`, borderRight: `1.5px solid ${ACCENT}`, opacity: 0.65, pointerEvents: 'none' }} />
                    </div>

                    {(() => {
                      const SERVICES = [
                        { title: 'CHARGING SOLUTIONS', desc: 'We offer Level 2 charging, which provides a moderate charging speed at 240V, ideal for daily use and longer stops.' },
                        { title: 'USER CONVENIENCE', desc: 'Locate stations, start charging, and pay seamlessly using our mobile app. Enjoy real-time availability and smart routing.' },
                        { title: 'ENERGY MANAGEMENT', desc: 'Our hubs are powered by 100% renewable energy with BESS stabilization for grid resilience and zero carbon footprint.' },
                        { title: 'MAINTENANCE AND SUPPORT', desc: '24/7 dedicated support team with real-time telemetry and predictive maintenance to ensure 99.99% uptime.' }
                      ];
                      return (
                        <div className="services-desc" style={{ paddingLeft: 12 }}>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeService}
                              initial={{ opacity: 0, x: 24 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -16 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: 14, letterSpacing: -0.01 }}>
                                {SERVICES[activeService].title}
                              </h3>
                              <p style={{ color: TEXT_DIM, fontSize: '1rem', lineHeight: 1.6, maxWidth: '90%' }}>
                                {SERVICES[activeService].desc}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right: compact clickable services list, evenly distributed within iframe height */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 460 }}>
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
                          className="service-item"
                          onClick={() => setActiveService(idx)}
                          style={{
                            padding: '20px 28px',
                            cursor: 'pointer',
                            position: 'relative',
                            borderBottom: idx === 3 ? 'none' : `1px solid rgba(255,255,255,0.06)`,
                            background: isActive ? `linear-gradient(90deg, ${ACCENT}14 0%, transparent 100%)` : 'transparent',
                            transition: 'all 0.3s ease',
                            borderLeft: isActive ? `4px solid ${ACCENT}` : '4px solid transparent',
                          }}
                        >
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 600, color: isActive ? ACCENT : '#ffffff', textTransform: 'uppercase', letterSpacing: -0.01, transition: 'color 0.3s ease' }}>
                            {srv.title}
                          </h4>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              )}
            </section>

            {/* INDIA COVERAGE — operational dashboard */}
            {/* INDIA COVERAGE OPERATIONAL DASHBOARD (Integrated High-Fidelity Prototype) */}
            <section id="network" className="loader-section" style={{ padding: '60px 0 80px', background: '#000', overflow: 'hidden' }}>
              <div className="network-inner" style={{ maxWidth: 1250, margin: '0 auto', padding: '0 40px' }}>
                <div style={{ marginBottom: 40, textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 16px', background: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 99, marginBottom: 16 }}>
                    <div style={{ width: 6, height: 6, background: '#00FF88', borderRadius: '50%', boxShadow: '0 0 10px #00FF88' }}></div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#00FF88', letterSpacing: '0.12em', textTransform: 'uppercase' }}>System Status: Operational</span>
                  </div>
                  <h2 style={{ fontSize: isMobile ? '1.9rem' : 'clamp(2rem, 3vw, 3rem)', fontWeight: 600, marginBottom: 10, letterSpacing: '-0.03em', color: '#fff' }}>
                    ENERGY <span style={{ color: '#00FF88' }}>SYNAPSE</span>
                  </h2>
                  <p style={{ fontSize: isMobile ? '0.88rem' : '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: 540, margin: '0 auto', lineHeight: 1.5 }}>
                    India Coverage Operational Dashboard — Real-time infrastructure telemetry and network deployment metrics.
                  </p>
                </div>

                {isMobile ? (() => {
                  const totalKw = STATIONS.reduce((a, s) => a + s.kw, 0);
                  const stateCount = new Set(STATIONS.map(s => s.state)).size;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      style={{
                        background: '#0B0F0D',
                        border: `1px solid ${BORDER_STRONG}`,
                        borderRadius: 20,
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
                        marginTop: 72,
                      }}
                    >
                      {/* HUD top bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, background: 'rgba(0,255,136,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="circle pulse-dot" style={{ width: 5, height: 5, background: ACCENT, color: ACCENT }} />
                          <span className="mono" style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em', color: ACCENT }}>SCANNING</span>
                        </div>
                        <span className="mono" style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.16em', color: TEXT_DIM }}>NETWORK · IND</span>
                        <span className="mono" style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.12em', color: TEXT_DIM }}>{clock || '--:--:--'}</span>
                      </div>

                      {/* Map area */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1 / 1',
                        padding: '8px',
                        background: `radial-gradient(circle at 50% 50%, ${ACCENT}08, transparent 70%)`,
                      }}>
                        {/* HUD corner brackets */}
                        <div style={{ position: 'absolute', top: 12, left: 12, width: 18, height: 18, borderTop: `1.5px solid ${ACCENT_SOFT}`, borderLeft: `1.5px solid ${ACCENT_SOFT}`, opacity: 0.55 }} />
                        <div style={{ position: 'absolute', top: 12, right: 12, width: 18, height: 18, borderTop: `1.5px solid ${ACCENT_SOFT}`, borderRight: `1.5px solid ${ACCENT_SOFT}`, opacity: 0.55 }} />
                        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 18, height: 18, borderBottom: `1.5px solid ${ACCENT_SOFT}`, borderLeft: `1.5px solid ${ACCENT_SOFT}`, opacity: 0.55 }} />
                        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 18, height: 18, borderBottom: `1.5px solid ${ACCENT_SOFT}`, borderRight: `1.5px solid ${ACCENT_SOFT}`, opacity: 0.55 }} />

                        {/* Subtle grid backdrop */}
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${ACCENT}08 1px, transparent 1px), linear-gradient(90deg, ${ACCENT}08 1px, transparent 1px)`, backgroundSize: '24px 24px', maskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 85%)', WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 85%)', pointerEvents: 'none' }} />

                        {/* The map itself */}
                        <div style={{ position: 'absolute', inset: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IndiaMap />
                        </div>

                        {/* Floating live counter bottom-center */}
                        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(11,15,13,0.85)', border: `1px solid ${ACCENT}44`, borderRadius: 999, backdropFilter: 'blur(8px)', zIndex: 5 }}>
                          <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                          <span className="mono" style={{ fontSize: '0.62rem', fontWeight: 700, color: TEXT, letterSpacing: '0.06em' }}>{stationsOnline.toLocaleString()}</span>
                          <span style={{ fontSize: '0.58rem', color: TEXT_DIM, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>live</span>
                        </div>

                        {/* Cluster detail popup — appears when user taps a cluster, dismissed by tapping outside or close button */}
                        <AnimatePresence>
                          {selectedCluster && (
                            <>
                              <motion.div
                                key="cluster-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                onClick={() => setSelectedClusterId(null)}
                                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 3900 }}
                              />
                              <div
                                key="cluster-popup-outer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  position: 'fixed',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: 'calc(100vw - 32px)',
                                  maxWidth: 380,
                                  zIndex: 4000,
                                  pointerEvents: 'auto',
                                }}
                              >
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                  style={{
                                    width: '100%',
                                    background: '#0B0F0D',
                                    border: `1px solid ${ACCENT}`,
                                    borderRadius: 14,
                                    padding: 18,
                                    boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 24px ${ACCENT}33`,
                                  }}
                                >
                                  {(() => {
                                    const c = selectedCluster;
                                    const isOne = c.count === 1;
                                    const first = c.stations[0];
                                    const isFast = first && first.kw >= 100;
                                    return (
                                      <>
                                        {/* Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 8 }}>
                                          <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ color: ACCENT, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 5 }}>{c.state} · {isOne ? 'STATION' : 'CLUSTER'}</div>
                                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                                              {isOne ? first.name : `${c.count} stations in this area`}
                                            </h3>
                                          </div>
                                          <button onClick={() => setSelectedClusterId(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', cursor: 'pointer', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>×</button>
                                        </div>

                                        {/* Single-station stats: power, connector, status */}
                                        {isOne ? (
                                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div style={{ background: 'rgba(0,255,136,0.06)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                                              <div style={{ fontSize: '0.5rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Output</div>
                                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{first.kw}<span style={{ fontSize: '0.6rem', marginLeft: 2 }}>kW</span></div>
                                            </div>
                                            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                                              <div style={{ fontSize: '0.5rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Connector</div>
                                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: TEXT, lineHeight: 1 }}>{first.conn}</div>
                                            </div>
                                            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                                              <div style={{ fontSize: '0.5rem', color: TEXT_DIM, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Type</div>
                                              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isFast ? ACCENT : TEXT, lineHeight: 1 }}>{isFast ? 'DC Fast' : 'Standard'}</div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div style={{ display: 'flex', gap: 16, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div>
                                              <div style={{ fontSize: '1rem', fontWeight: 700, color: ACCENT }}>{c.totalKw}<span style={{ fontSize: '0.62rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW total</span></div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{Math.round(c.totalKw / c.count)}<span style={{ fontSize: '0.62rem', fontWeight: 500, color: TEXT_DIM, marginLeft: 4 }}>kW avg</span></div>
                                            </div>
                                          </div>
                                        )}

                                        {/* Station list (always shows; for single it's just one row) */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 180, overflowY: 'auto' }}>
                                          {c.stations.map((s: any) => (
                                            <div
                                              key={s.id}
                                              onClick={() => { setSelectedStationId(s.id); setSelectedClusterId(null); setStationSheetOpen(true); }}
                                              style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                padding: '8px 10px',
                                                borderRadius: 8,
                                              }}
                                            >
                                              <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{s.name}</div>
                                                <div style={{ color: TEXT_DIM, fontSize: '0.62rem' }}>{s.id}{isOne ? ` · ${s.state}` : ''}</div>
                                              </div>
                                              <div style={{ color: ACCENT, fontWeight: 700, fontSize: '0.82rem' }}>{s.kw} kW</div>
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    );
                                  })()}
                                </motion.div>
                              </div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Bottom stats strip */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `1px solid ${BORDER}`, background: 'rgba(0,255,136,0.02)' }}>
                        {[
                          { val: STATIONS.length.toString(), label: 'Stations' },
                          { val: stateCount.toString(), label: 'States' },
                          { val: (totalKw / 1000).toFixed(1) + ' MW', label: 'Capacity' },
                        ].map((s, i) => (
                          <div key={i} style={{ padding: '12px 8px', textAlign: 'center', borderRight: i < 2 ? `1px solid ${BORDER}` : 'none' }}>
                            <div style={{ color: i === 0 ? ACCENT : TEXT, fontSize: '0.95rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{s.val}</div>
                            <div style={{ color: TEXT_DIM, fontSize: '0.55rem', marginTop: 4, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })() : (
                  <div className="network-iframe-wrap" style={{
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
                    />
                  </div>
                )}
              </div>
            </section>

            {/* WHY EV CHARGING SECTION */}
            <section id="why-ev" style={{ padding: isMobile ? '56px 20px 72px' : '70px var(--side-padding) 100px', background: '#000', position: 'relative', overflow: 'hidden' }}>
              {/* Background Glow */}
              <div style={{ position: 'absolute', left: '-10%', top: '40%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

              {isMobile ? (
                <div style={{ position: 'relative', zIndex: 5 }}>
                  {/* Pill eyebrow */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0,255,136,0.08)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99, marginBottom: 18 }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.14em', textTransform: 'uppercase' }}>The case for EVs</span>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    style={{ fontSize: '2.2rem', fontWeight: 800, color: TEXT, lineHeight: 1.08, marginBottom: 14, letterSpacing: '-0.03em' }}
                  >
                    Why EV <span style={{ color: ACCENT }}>charging</span> matters.
                  </motion.h2>

                  {/* Intro */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    style={{ color: TEXT_DIM, fontSize: '0.94rem', lineHeight: 1.65, marginBottom: 28 }}
                  >
                    EV charging is at the forefront of a transportation revolution reshaping the way we move and the world we live in.
                  </motion.p>

                  {/* Combined Expert + Insight card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ background: `linear-gradient(180deg, ${CARD}, ${SURFACE})`, border: `1px solid ${BORDER_STRONG}`, borderRadius: 20, padding: '20px 18px 22px', marginBottom: 18, position: 'relative', overflow: 'hidden' }}
                  >
                    <div style={{ position: 'absolute', top: -80, right: -80, width: 240, height: 240, background: `radial-gradient(circle, ${ACCENT}18, transparent 70%)`, pointerEvents: 'none' }} />

                    {/* Expert header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 18, borderBottom: `1px solid ${BORDER_STRONG}`, marginBottom: 18, position: 'relative', zIndex: 1 }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${ACCENT}66`, flexShrink: 0, boxShadow: `0 0 18px ${ACCENT}33`, background: SURFACE }}>
                        <img
                          src={professorImg}
                          alt="David M. Johnson"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: ACCENT, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 5 }}>Expert insight</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: TEXT, marginBottom: 2, letterSpacing: '-0.01em' }}>David M. Johnson</div>
                        <div style={{ color: TEXT_DIM, fontSize: '0.68rem', letterSpacing: '0.04em' }}>Environment Professor · Harvard</div>
                      </div>
                    </div>

                    {/* Slide content */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <span className="mono" style={{ color: ACCENT, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em' }}>
                          0{whySlide + 1} / 0{WHY_SLIDES.length}
                        </span>
                        <svg width="18" height="14" viewBox="0 0 32 24" fill={ACCENT} style={{ opacity: 0.35 }}>
                          <path d="M0 14 C 0 6, 4 0, 12 0 L 12 4 C 8 4, 6 6, 6 12 L 12 12 L 12 24 L 0 24 Z M 20 14 C 20 6, 24 0, 32 0 L 32 4 C 28 4, 26 6, 26 12 L 32 12 L 32 24 L 20 24 Z" />
                        </svg>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={whySlide}
                          initial={{ opacity: 0, x: 60 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -60 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: TEXT, marginBottom: 12, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                            {WHY_SLIDES[whySlide].title}
                          </h3>
                          <p style={{ color: TEXT_DIM, fontSize: '0.86rem', lineHeight: 1.65, margin: 0 }}>
                            {WHY_SLIDES[whySlide].text}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Carousel controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {WHY_SLIDES.map((_, i) => (
                        <div
                          key={i}
                          onClick={() => setWhySlide(i)}
                          style={{
                            width: whySlide === i ? 24 : 6,
                            height: 6,
                            borderRadius: 999,
                            background: whySlide === i ? ACCENT : 'rgba(255,255,255,0.22)',
                            transition: 'all 0.3s',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setWhySlide(prev => (prev - 1 + WHY_SLIDES.length) % WHY_SLIDES.length)}
                        style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      </button>
                      <button
                        onClick={() => setWhySlide(prev => (prev + 1) % WHY_SLIDES.length)}
                        style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${BORDER_STRONG}`, background: SURFACE, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
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
                <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 100, alignItems: 'center' }}>
                  {/* Left side: Text Carousel */}
                  <div style={{ position: 'relative' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={whySlide}
                        className="why-slide-content"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        style={{ minHeight: '320px' }}
                      >
                        <h3 className="why-slide-title" style={{
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
                  <div className="why-right-col" style={{ textAlign: 'right' }}>
                    <motion.div
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{ position: 'relative', display: 'inline-block' }}
                    >
                      {/* Image Container with Gradient Background */}
                      <div className="prof-img-container" style={{
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
                        <h4 className="prof-name" style={{
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
                        <p className="prof-role" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                          ENVIRONMENT PROFESSOR AT HARVARD
                        </p>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
              )}
            </section>

            {/* CTA SECTION */}
            <section className="cta-section" style={{ padding: '100px 48px 0', background: `linear-gradient(to bottom, #0a0e0c, ${SURFACE})`, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
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

                <div className="cta-btn-row" style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 80 }}>
                  <button className="btn-accent" onClick={() => navigate('find-stations')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', fontSize: '0.95rem', fontWeight: 700 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    FIND STATION
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
          </motion.div>
        )}

        {page === 'find-stations' && (
          <motion.section
            key="find-stations"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: BG, paddingTop: '72px', overflow: 'hidden' }}
          >
            {isMobile ? (
              <div style={{ padding: '24px 0 80px', minHeight: 'calc(100vh - 72px)', background: BG, position: 'relative', overflow: 'hidden' }}>
                {/* Ambient backdrop glow */}
                <div style={{ position: 'absolute', top: '-5%', right: '-30%', width: 420, height: 420, background: `radial-gradient(circle, ${ACCENT_SOFT}1f, transparent 65%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '40%', left: '-30%', width: 360, height: 360, background: `radial-gradient(circle, ${ACCENT_SOFT}15, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

                <div style={{ position: 'relative', zIndex: 1, padding: '0 16px' }}>
                  {/* HERO CARD — pill + title + icon-led stats unified */}
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      background: `linear-gradient(150deg, ${SURFACE} 0%, ${BG} 100%)`,
                      border: `1px solid ${BORDER_STRONG}`,
                      borderRadius: 22,
                      padding: '20px 18px',
                      marginBottom: 14,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Decorative glow */}
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: `radial-gradient(circle, ${ACCENT}1c, transparent 70%)`, pointerEvents: 'none' }} />
                    {/* Decorative dotted grid */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${ACCENT}10 1px, transparent 1px)`, backgroundSize: '18px 18px', opacity: 0.5, pointerEvents: 'none', maskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Top row — pill + icon actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0,255,136,0.1)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99 }}>
                          <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                          <span className="mono" style={{ fontSize: '0.6rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.18em' }}>{filteredStations.length} LIVE</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            aria-label={searchOpen ? 'Close search' : 'Open search'}
                            onClick={() => setSearchOpen(o => !o)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              border: `1px solid ${searchOpen ? ACCENT : BORDER_STRONG}`,
                              background: searchOpen ? `${ACCENT}1c` : 'rgba(11,15,13,0.5)',
                              color: searchOpen ? ACCENT : TEXT,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 200ms',
                              backdropFilter: 'blur(6px)',
                            }}
                          >
                            {searchOpen ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label={filtersOpen ? 'Close filters' : 'Open filters'}
                            onClick={() => setFiltersOpen(o => !o)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              border: `1px solid ${filtersOpen ? ACCENT : BORDER_STRONG}`,
                              background: filtersOpen ? `${ACCENT}1c` : 'rgba(11,15,13,0.5)',
                              color: filtersOpen ? ACCENT : TEXT,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 200ms',
                              backdropFilter: 'blur(6px)',
                              position: 'relative',
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                            {(connFilter !== 'Any' || minPower > 0) && (
                              <span style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: ACCENT, border: `2px solid ${SURFACE}`, boxShadow: `0 0 6px ${ACCENT}` }} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h1 style={{ fontSize: '1.95rem', fontWeight: 700, color: TEXT, lineHeight: 1.1, marginBottom: 6, letterSpacing: '-0.03em' }}>
                        Find your <span style={{ color: ACCENT, whiteSpace: 'nowrap' }}>charging spot.</span>
                      </h1>

                      {/* Subtitle */}
                      <p style={{ color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.45, marginBottom: 18 }}>
                        Real-time charging network across India.
                      </p>

                      {/* Divider */}
                      <div style={{ height: 1, background: `linear-gradient(to right, transparent 0%, ${BORDER_STRONG} 30%, ${BORDER_STRONG} 70%, transparent 100%)`, marginBottom: 16 }} />

                      {/* Icon-led stats */}
                      {(() => {
                        const totalKw = STATIONS.reduce((a, s) => a + s.kw, 0);
                        const items = [
                          {
                            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
                            val: STATIONS.length,
                            label: 'Stations',
                          },
                          {
                            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
                            val: new Set(STATIONS.map(s => s.state)).size,
                            label: 'States',
                          },
                          {
                            icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="10" rx="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line><line x1="6" y1="11" x2="6" y2="13"></line><line x1="10" y1="11" x2="10" y2="13"></line></svg>,
                            val: (totalKw / 1000).toFixed(1),
                            unit: 'MW',
                            label: 'Capacity',
                          },
                        ];
                        return (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                            {items.map((stat, i) => (
                              <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: i === 0 ? 0 : 12 }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: ACCENT, marginBottom: 6 }}>
                                  {stat.icon}
                                  <span style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{stat.label}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                                  <span style={{ fontSize: '1.35rem', fontWeight: 700, color: TEXT, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1 }}>{stat.val}</span>
                                  {stat.unit && <span style={{ fontSize: '0.65rem', color: ACCENT, fontWeight: 600 }}>{stat.unit}</span>}
                                </div>
                                {i < 2 && <div style={{ position: 'absolute', right: 0, top: 4, bottom: 4, width: 1, background: BORDER }} />}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>

                  {/* Collapsible search bar — only visible when icon tapped */}
                  <AnimatePresence initial={false}>
                    {searchOpen && (
                      <motion.div
                        key="search-collapsible"
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ position: 'relative' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXT_DIM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                          <input
                            type="search"
                            autoFocus
                            placeholder="City, state, or station ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '14px 44px 14px 42px',
                              background: SURFACE,
                              border: `1px solid ${ACCENT}55`,
                              borderRadius: 14,
                              color: TEXT,
                              fontSize: '0.95rem',
                              outline: 'none',
                              fontFamily: 'inherit',
                              boxShadow: `0 0 0 3px ${ACCENT}11`,
                            }}
                          />
                          {searchQuery && (
                            <button
                              type="button"
                              onClick={() => setSearchQuery('')}
                              aria-label="Clear search"
                              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.08)', color: TEXT_DIM, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Combined Filters — collapsible */}
                  <AnimatePresence initial={false}>
                    {filtersOpen && (
                      <motion.div
                        key="filters-panel"
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ background: SURFACE, border: `1px solid ${BORDER_STRONG}`, borderRadius: 16, padding: '16px 14px' }}>
                          {/* Header row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: ACCENT }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                              <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Filters</span>
                            </div>
                            {(connFilter !== 'Any' || minPower > 0) && (
                              <button
                                type="button"
                                onClick={() => { setConnFilter('Any'); setMinPower(0); }}
                                style={{ background: 'none', border: 'none', color: TEXT_DIM, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0, letterSpacing: '0.04em' }}
                              >
                                Clear all
                              </button>
                            )}
                          </div>

                          {/* Connector */}
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ color: TEXT_DIM, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Connector</div>
                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
                              {['Any', 'CCS', 'CHAdeMO', 'Type 2'].map((c) => {
                                const count = c === 'Any' ? STATIONS.length : STATIONS.filter(s => s.conn === c).length;
                                const active = connFilter === c;
                                return (
                                  <button
                                    key={c}
                                    onClick={() => setConnFilter(c)}
                                    style={{
                                      padding: '7px 13px',
                                      background: active ? `${ACCENT}22` : 'transparent',
                                      border: `1px solid ${active ? ACCENT : BORDER_STRONG}`,
                                      color: active ? ACCENT : TEXT,
                                      borderRadius: 999,
                                      fontSize: '0.76rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      flexShrink: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 6,
                                      fontFamily: 'inherit',
                                    }}
                                  >
                                    {c}
                                    <span style={{ fontSize: '0.62rem', opacity: 0.7, fontWeight: 500 }}>{count}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Hairline divider */}
                          <div style={{ height: 1, background: BORDER, marginBottom: 14 }} />

                          {/* Min power */}
                          <div>
                            <div style={{ color: TEXT_DIM, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Min power</div>
                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
                              {[0, 50, 100, 150].map(p => {
                                const active = minPower === p;
                                return (
                                  <button
                                    key={p}
                                    onClick={() => setMinPower(p)}
                                    style={{
                                      padding: '7px 13px',
                                      background: active ? `${ACCENT}22` : 'transparent',
                                      border: `1px solid ${active ? ACCENT : BORDER_STRONG}`,
                                      color: active ? ACCENT : TEXT,
                                      borderRadius: 999,
                                      fontSize: '0.76rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      flexShrink: 0,
                                      fontFamily: 'inherit',
                                    }}
                                  >
                                    {p === 0 ? 'Any' : `${p}+ kW`}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Results header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ color: TEXT_DIM, fontSize: '0.78rem', fontWeight: 500 }}>
                      <span style={{ color: TEXT, fontWeight: 700 }}>{filteredStations.length}</span> result{filteredStations.length !== 1 ? 's' : ''}
                    </div>
                    <div style={{ color: ACCENT_SOFT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                      By power
                    </div>
                  </div>

                  {/* Tap hint */}
                  <div style={{ fontSize: '0.65rem', color: TEXT_DIM, marginBottom: 8, fontStyle: 'italic' }}>Tap a station for details & directions</div>

                  {/* Station cards */}
                  {filteredStations.length === 0 ? (
                    <div style={{ padding: '48px 24px', textAlign: 'center', border: `1px dashed ${BORDER_STRONG}`, borderRadius: 16, background: SURFACE, marginTop: 8 }}>
                      <div style={{ fontSize: '2.4rem', marginBottom: 8 }}>⚡</div>
                      <div style={{ color: TEXT, fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>No stations match</div>
                      <div style={{ color: TEXT_DIM, fontSize: '0.85rem', marginBottom: 18, lineHeight: 1.5 }}>Try clearing filters or expanding your search.</div>
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(''); setConnFilter('Any'); setMinPower(0); }}
                        style={{ background: 'transparent', border: `1px solid ${ACCENT}`, color: ACCENT, padding: '9px 18px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(() => {
                        const sorted = [...filteredStations].sort((a, b) => b.kw - a.kw);
                        const visible = stationListExpanded ? sorted : sorted.slice(0, 5);
                        const hiddenCount = sorted.length - visible.length;
                        return (
                          <>
                            {visible.map((s, idx) => {
                              const isSelected = selectedStationId === s.id;
                              const isFast = s.kw >= 100;
                        const connColor = s.conn === 'CCS' ? ACCENT : s.conn === 'CHAdeMO' ? '#FFB020' : '#5EC8FF';
                        return (
                          <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.4) }}
                            whileTap={{ scale: 0.985 }}
                            onClick={() => { setSelectedStationId(s.id); setStationSheetOpen(true); }}
                            style={{
                              background: isSelected ? `${ACCENT}10` : CARD,
                              border: `1px solid ${isSelected ? ACCENT : BORDER}`,
                              borderRadius: 16,
                              padding: '14px 16px 14px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 14,
                              cursor: 'pointer',
                              transition: 'background 200ms, border-color 200ms',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.25 }}
                                style={{ position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, background: ACCENT, borderRadius: 999, transformOrigin: 'center' }}
                              />
                            )}

                            {/* Connector icon */}
                            <div style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              background: `${connColor}18`,
                              border: `1px solid ${connColor}33`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              color: connColor,
                            }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                <div style={{ color: TEXT, fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{s.name}</div>
                                {isFast && (
                                  <span style={{ fontSize: '0.55rem', fontWeight: 700, color: ACCENT, background: `${ACCENT}1c`, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.12em', flexShrink: 0 }}>FAST</span>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: TEXT_DIM, marginBottom: 6 }}>
                                <span>{s.id}</span>
                                <span style={{ opacity: 0.5 }}>·</span>
                                <span>{s.state}</span>
                              </div>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 7px', background: `${connColor}10`, border: `1px solid ${connColor}25`, borderRadius: 6 }}>
                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: connColor }} />
                                <span style={{ color: connColor, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.04em' }}>{s.conn}</span>
                              </div>
                            </div>

                            {/* Power */}
                            <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div>
                                <div style={{ color: isSelected ? ACCENT : TEXT, fontWeight: 700, fontSize: '1.3rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{s.kw}</div>
                                <div style={{ color: TEXT_DIM, fontSize: '0.58rem', marginTop: 4, letterSpacing: '0.18em', fontWeight: 600 }}>KW</div>
                              </div>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isSelected ? ACCENT : TEXT_DIM} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                          </motion.div>
                        );
                            })}
                            {hiddenCount > 0 && (
                              <motion.button
                                key="show-more"
                                type="button"
                                onClick={() => setStationListExpanded(true)}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  marginTop: 6,
                                  padding: '14px 20px',
                                  background: 'transparent',
                                  border: `1px dashed ${ACCENT}66`,
                                  color: ACCENT,
                                  borderRadius: 14,
                                  fontSize: '0.88rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 8,
                                  fontFamily: 'inherit',
                                  letterSpacing: '0.01em',
                                }}
                              >
                                Show {hiddenCount} more {hiddenCount === 1 ? 'station' : 'stations'}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                              </motion.button>
                            )}
                            {stationListExpanded && sorted.length > 5 && (
                              <motion.button
                                key="show-less"
                                type="button"
                                onClick={() => { setStationListExpanded(false); window.scrollTo({ top: 200, behavior: 'smooth' }); }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  marginTop: 6,
                                  padding: '12px 20px',
                                  background: 'transparent',
                                  border: `1px solid ${BORDER_STRONG}`,
                                  color: TEXT_DIM,
                                  borderRadius: 14,
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 6,
                                  fontFamily: 'inherit',
                                }}
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                Show less
                              </motion.button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <iframe
                className="find-stations-iframe"
                src="/find-stations.html"
                style={{ width: '100%', height: '1100px', border: 'none' }}
                title="Find Charging Stations"
              />
            )}
          </motion.section>
        )}

        {/* FOOTER — EXACT REPLICA OF REFERENCE IMAGE */}

        {page === 'privacy-policy' && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="policy-section" style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
              <div className="policy-inner" style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
                <h1 className="policy-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 40, color: '#fff' }}>Privacy Policy</h1>
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
          </motion.div>
        )}

        {page === 'terms-conditions' && (
          <motion.div
            key="terms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="policy-section" style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
              <div className="policy-inner" style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
                <h1 className="policy-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 40, color: '#fff' }}>Terms & Conditions</h1>
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
          </motion.div>
        )}

        {page === 'refund-policy' && (
          <motion.div
            key="refund"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section className="policy-section" style={{ background: BG, paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh' }}>
              <div className="policy-inner" style={{ maxWidth: 800, margin: '0 auto', padding: '0 40px' }}>
                <h1 className="policy-title" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 40, color: '#fff' }}>Refund Policy</h1>
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
          </motion.div>
        )}

        {page === 'about-us' && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <section style={{ background: BG, color: TEXT, paddingTop: isMobile ? '92px' : '100px', paddingBottom: isMobile ? '64px' : '120px' }}>
            {isMobile ? (
              <div style={{ padding: '0 20px', position: 'relative', zIndex: 1 }}>
                {/* Ambient backdrop */}
                <div style={{ position: 'absolute', top: '5%', right: '-30%', width: 360, height: 360, background: `radial-gradient(circle, ${ACCENT_SOFT}20, transparent 65%)`, borderRadius: '50%', pointerEvents: 'none', zIndex: -1 }} />

                {/* HERO */}
                <motion.div initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ marginBottom: 40 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(0,255,136,0.08)', border: `1px solid ${BORDER_STRONG}`, borderRadius: 99, marginBottom: 16 }}>
                    <span className="circle pulse-dot" style={{ width: 6, height: 6, background: ACCENT, color: ACCENT }} />
                    <span className="mono" style={{ fontSize: '0.6rem', fontWeight: 700, color: ACCENT, letterSpacing: '0.18em' }}>WHO WE ARE</span>
                  </div>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-0.035em', lineHeight: 1.05 }}>
                    Our story <br /><span style={{ color: ACCENT }}>starts here.</span>
                  </h1>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem', color: TEXT_DIM, lineHeight: 1.6 }}>
                    Empowering communities through clean technology and sustainable mobility — built in India, designed for the world.
                  </p>
                </motion.div>

                {/* VISION */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 32, background: `linear-gradient(180deg, ${SURFACE}, ${BG})`, border: `1px solid ${BORDER_STRONG}`, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ height: 180, background: SURFACE, position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${BORDER}` }}>
                    <img src="/sustainability.png" alt="Sustainability" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${BG} 100%)` }} />
                  </div>
                  <div style={{ padding: '18px 18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 28, height: 2, background: ACCENT }} />
                      <span style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Our Vision</span>
                    </div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      A planet where progress moves with nature.
                    </h2>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', color: TEXT_DIM, lineHeight: 1.65 }}>
                      Trio envisions a world where every ride and every delivery contributes to a healthier planet. We aim to eliminate pollution and create a fully electric ecosystem for both personal mobility and logistics — making sustainable, smart, connected transport accessible to all.
                    </p>
                  </div>
                </motion.div>

                {/* MISSION */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 2, background: ACCENT }} />
                    <span style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Our Mission</span>
                  </div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: 18, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    Redefining how people move<br /><span style={{ color: ACCENT }}>and how business runs.</span>
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { tag: 'Electric Cars', text: 'Eco-friendly, stylish, reliable, and affordable for everyday use.' },
                      { tag: 'Smart Logistics', text: '100% electric fleets that reduce congestion, noise, and emissions.' },
                      { tag: 'Sustainability', text: 'Green practices across design, manufacturing, and daily operations.' },
                      { tag: 'Innovation', text: 'Smart tech + renewable energy + continuous performance.' },
                      { tag: 'Community', text: 'Raising awareness about eco-friendly mobility and nature-first choices.' },
                      { tag: 'Connected Future', text: 'Technology, people, and the environment coexisting seamlessly.' },
                    ].map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.06 * i }}
                        style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}
                      >
                        <span style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{m.tag}</span>
                        <span style={{ color: TEXT, fontSize: '0.86rem', lineHeight: 1.45, fontFamily: "'Outfit', sans-serif" }}>{m.text}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, padding: '12px 14px', borderLeft: `2px solid ${ACCENT}44`, fontStyle: 'italic', color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.5, fontFamily: "'Outfit', sans-serif" }}>
                    Our purpose is clear — protect nature, reduce pollution, and create a sustainable legacy.
                  </div>
                </motion.div>

                {/* STORY TIMELINE */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 2, background: ACCENT }} />
                    <span style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Our Story</span>
                  </div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: 22, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    From an idea<br /><span style={{ color: ACCENT }}>to a city-wide impact.</span>
                  </h2>

                  {/* Vertical timeline */}
                  <div style={{ position: 'relative', paddingLeft: 24, marginBottom: 24 }}>
                    <div style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 1, background: `linear-gradient(180deg, ${ACCENT}55, ${BORDER_STRONG} 50%, ${ACCENT}55)` }} />
                    {[
                      { year: '2018', title: 'The spark', text: 'Roots in telecom (Vodafone, multi-country). The realization: tech advances but environment pays the cost.' },
                      { year: '2022', title: 'Two cars in Pune', text: 'Tested the market by driving cars ourselves — learned operations, payments, and driver realities.' },
                      { year: '2024', title: 'Trio Evolution India', text: 'Officially registered. Pivoted to B2B with Mahindra Logistics, serving TCS, Capgemini, Cognizant, KPMG, Indigo.' },
                      { year: '2025', title: 'Kolkata charging hub', text: "Becoming Kolkata's first fleet owner to build a private EV charging hub in New Town's IT corridor." },
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        style={{ position: 'relative', marginBottom: i === 3 ? 0 : 22 }}
                      >
                        <div style={{ position: 'absolute', left: -24, top: 4, width: 14, height: 14, borderRadius: '50%', background: BG, border: `2px solid ${ACCENT}`, boxShadow: `0 0 8px ${ACCENT}55` }} />
                        <div className="mono" style={{ color: ACCENT, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', marginBottom: 4 }}>{step.year}</div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', fontWeight: 700, color: TEXT, marginBottom: 4 }}>{step.title}</div>
                        <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.55, margin: 0 }}>{step.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Featured founder quote card */}
                  <div style={{ background: `linear-gradient(140deg, ${ACCENT}12, ${SURFACE})`, border: `1px solid ${ACCENT}44`, borderRadius: 16, padding: '22px 18px', position: 'relative', overflow: 'hidden' }}>
                    <svg width="22" height="18" viewBox="0 0 32 24" fill={ACCENT} style={{ opacity: 0.45, marginBottom: 10 }}>
                      <path d="M0 14 C 0 6, 4 0, 12 0 L 12 4 C 8 4, 6 6, 6 12 L 12 12 L 12 24 L 0 24 Z M 20 14 C 20 6, 24 0, 32 0 L 32 4 C 28 4, 26 6, 26 12 L 32 12 L 32 24 L 20 24 Z" />
                    </svg>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontStyle: 'italic', color: TEXT, lineHeight: 1.5, margin: 0, letterSpacing: '-0.01em' }}>
                      We're not just offering transport — we're driving a transition to greener, smarter mobility for all.
                    </p>
                  </div>
                </motion.div>

                {/* LEADERSHIP */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 2, background: ACCENT }} />
                    <span style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Leadership</span>
                  </div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: 18, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    The minds behind <span style={{ color: ACCENT }}>the mission.</span>
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { name: 'Subhash Kumar', role: 'Founder & CEO', bio: 'B.Tech CS. Former Vodafone. Now leading Trio with focus on innovation and sustainability.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
                      { name: 'Somnath Das', role: 'Founder & COO', bio: 'M.A. graduate. Former Uber. Drives smooth operations and impactful strategy at Trio.', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
                    ].map(leader => (
                      <div key={leader.name} style={{ background: '#121915', border: `1px solid ${BORDER_STRONG}`, borderRadius: 18, padding: 18, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${ACCENT}33`, flexShrink: 0 }}>
                          <img src={leader.img} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: 3, letterSpacing: '-0.01em' }}>{leader.name}</h3>
                          <div style={{ fontFamily: "'Outfit', sans-serif", color: ACCENT, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{leader.role}</div>
                          <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: '0.78rem', lineHeight: 1.5, margin: 0 }}>{leader.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* IMPACT */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 2, background: ACCENT }} />
                    <span style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Impact</span>
                  </div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: 18, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    Accelerating a <span style={{ color: ACCENT }}>cleaner future.</span>
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { icon: 'M23 6l-9.5 9.5-5-5L1 18', title: 'EV-First Fleet', desc: 'All-electric fleet rollout across regions by 2026.' },
                      { icon: 'M12 2L5 9h4v12h6V9h4L12 2z', title: 'Nature First', desc: 'Reforestation + renewables, net-zero by 2030.' },
                      { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', title: 'Smart Roads', desc: 'Road-harvested energy for streetlights & EVs.' },
                      { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', title: 'Inclusion', desc: 'R&D + skills for rural clean-tech adoption.' },
                    ].map((item, i) => (
                      <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderTop: `3px solid ${ACCENT}`, borderRadius: 12, padding: 14 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ACCENT}15`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                        </div>
                        <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: 5, lineHeight: 1.2 }}>{item.title}</h4>
                        <p style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: '0.7rem', lineHeight: 1.45, margin: 0 }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              <>
              {/* 1. HERO */}
              <div className="about-hero" style={{ textAlign: 'center', marginBottom: 120, padding: '0 24px' }}>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(3rem, 7vw, 4.5rem)', fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                  Our Commitment to <br />
                  <span style={{ color: ACCENT, fontSize: '0.8em' }}>Communities</span>
                </h1>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', color: TEXT_DIM, maxWidth: 600, margin: '0 auto', lineHeight: 1.6, fontWeight: 400 }}>
                  Empowering local communities through clean technology and <br /> sustainable practices.
                </p>
              </div>

              <div className="about-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
                {/* 2. VISION */}
                <div className="vision-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 60, alignItems: 'center', marginBottom: 120 }}>
                  <div className="vision-img" style={{ background: SURFACE, borderRadius: 32, overflow: 'hidden', border: `1px solid ${BORDER}`, height: 420 }}>
                    <img src="/sustainability.png" alt="Sustainability" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                      <div style={{ width: 40, height: 2, background: ACCENT, borderRadius: 1 }} />
                      <h2 className="about-section-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Our Vision</h2>
                    </div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', color: TEXT_DIM, lineHeight: 1.8, fontWeight: 400 }}>
                      Trio envisions a world where every ride and every delivery contributes to a healthier planet. Our vision is to eliminate pollution and carbon emissions by creating a fully electric ecosystem for both personal mobility and logistics. We aspire to lead the transformation of the automotive and logistics industries, making sustainable, smart, and connected transportation accessible to all. By combining innovation, responsibility, and care for nature, we aim to build a future where progress and the environment move together in harmony.
                    </p>
                  </div>
                </div>

                {/* 3. MISSION */}
                <div className="mission-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 60, alignItems: 'center', marginBottom: 120 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                      <div style={{ width: 40, height: 2, background: ACCENT, borderRadius: 1 }} />
                      <h2 className="about-section-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Our Mission</h2>
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
                  <div className="mission-img" style={{ background: SURFACE, borderRadius: 32, overflow: 'hidden', border: `1px solid ${BORDER}`, height: 500 }}>
                    <img src="/energy.png" alt="Energy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>

                {/* 4. STORY */}
                <div className="story-block" style={{ maxWidth: 800, margin: '0 auto 160px', textAlign: 'center' }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: 12 }}>Our <span style={{ color: ACCENT }}>Story</span></h2>
                  <div style={{ width: 60, height: 2, background: ACCENT, margin: '0 auto 60px' }} />
                  <div style={{ fontFamily: "'Outfit', sans-serif", color: TEXT_DIM, fontSize: '1.15rem', lineHeight: 1.8, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 32 }}>
                    <p>Our journey began in the world of IT and telecom, where one of our founders worked on designing revenue models for Vodafone across Greece, Albania, and the UK. While building systems that directly impacted millions of customers, a realization struck — technology was advancing, but the hidden cost was environmental damage caused by emissions, vibrations, and unsustainable operations.</p>
                    <p>With a background in Computer Science and years of experience in telecom, the seed of an idea was planted: how can technology and business models be re-imagined to serve both people and the planet? This vision led to an entrepreneurial journey beginning in 2018, exploring eco-friendly solutions and sustainability-driven startups.</p>
                    <p>In 2022, the concept of clean transportation took shape. Starting small in Pune with just two leased vehicles, we tested the market, even driving the cars ourselves to understand a driver's real challenges. Those early months gave us invaluable insights into operations, payment irregularities, and the struggles drivers face daily. From there, we expanded to Kolkata, scaling our fleet and building strong foundations.</p>

                    <div style={{ padding: '60px 0', textAlign: 'center' }}>
                      <h3 className="story-quote" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 500, color: ACCENT, fontStyle: 'italic', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
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
                <div className="leadership-block" style={{ marginBottom: 160 }}>
                  <div style={{ textAlign: 'center', marginBottom: 80 }}>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: 20 }}>Leadership <span style={{ color: ACCENT }}>Team</span></h2>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', color: TEXT_DIM, maxWidth: 640, margin: '0 auto' }}>
                      The minds behind our mission to transform transportation through clean energy and community-driven innovation.
                    </p>
                  </div>
                  <div className="leadership-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1000, margin: '0 auto' }}>
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
                      <div key={leader.name} className="leadership-card" style={{ background: '#121915', border: `1px solid ${BORDER}`, borderRadius: 40, padding: 60, textAlign: 'center', transition: 'all 0.3s' }}>
                        <div className="leader-avatar" style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 32px', border: `4px solid ${ACCENT}22` }}>
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
                  <div className="impact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
                    {[
                      { icon: 'M23 6l-9.5 9.5-5-5L1 18', title: "EV-First Fleet", desc: "Deploying electric vehicles and hybrid transport solutions across all regions by 2026." },
                      { icon: 'M12 2L5 9h4v12h6V9h4L12 2z', title: "Commitment to Nature", desc: "Investing in reforestation and renewable projects to exceed net-zero impact by 2030." },
                      { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', title: "Sustainable Smart Roads", desc: "Implementing road-based energy harvesting to power streetlights and EV charging stations." },
                      { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', title: "Innovation & Inclusion", desc: "Fostering R&D and skill-building programs to empower rural communities in clean tech adoption." }
                    ].map((item, i) => (
                      <div key={i} className="impact-card" style={{ background: BG, border: `1px solid ${BORDER}`, borderTop: `4px solid ${ACCENT}`, borderRadius: 16, padding: 32, transition: 'transform 0.3s' }}>
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
              </>
            )}
            </section>
          </motion.div>
        )}

        {page === 'blog' && (
          <motion.div
            key="blog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BlogPage />
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{ padding: '56px var(--side-padding) 28px', background: SURFACE, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1440, margin: '0 auto' }}>
          {isMobile ? (
            <div>
              {/* Brand */}
              <div style={{ marginBottom: 28 }}>
                <img src={logo} alt="TRIO" style={{ height: 64, marginBottom: 14, display: 'block' }} />
                <div style={{ color: ACCENT, fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>Drive Smart. Go Green.</div>
                <p style={{ color: TEXT_DIM, fontSize: '0.86rem', lineHeight: 1.6, marginBottom: 18 }}>
                  TRIO EV is Kolkata's premier electric mobility company, delivering clean, green, and smart transportation solutions for businesses and individuals.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {siteSettings.socials.map((s, i) => (
                    <a
                      key={`${s.platform}-${i}`}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label ?? s.platform}
                      style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER_STRONG}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', textDecoration: 'none' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={ACCENT}><path d={SOCIAL_ICONS[s.platform] ?? SOCIAL_ICONS.other}></path></svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact CTA */}
              <button
                className="btn-accent"
                style={{ width: '100%', padding: '15px 24px', fontSize: '0.85rem', fontWeight: 800, borderRadius: 12, background: '#5AF59F', color: '#000', boxShadow: '0 4px 14px rgba(90, 245, 159, 0.3)', letterSpacing: '0.05em', marginBottom: 32, justifyContent: 'center' }}
                onClick={() => setShowContactForm(true)}
              >
                CONTACT US →
              </button>

              {/* Links — two columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32, paddingTop: 28, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                <div>
                  <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.62rem', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.18em' }}>EXPLORE</div>
                  {[
                    { label: 'Find stations', target: 'find-stations' },
                    { label: 'About us', target: 'about-us' },
                    { label: 'Blog', target: 'blog' }
                  ].map(l => (
                    <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 12, fontSize: '0.92rem', fontWeight: 500 }}>{l.label}</a>
                  ))}
                </div>
                <div>
                  <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.62rem', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.18em' }}>LEGAL</div>
                  {[
                    { label: 'Privacy Policy', target: 'privacy-policy' },
                    { label: 'Terms & Conditions', target: 'terms-conditions' },
                    { label: 'Refund Policy', target: 'refund-policy' }
                  ].map(l => (
                    <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 12, fontSize: '0.92rem', fontWeight: 500 }}>{l.label}</a>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div style={{ paddingTop: 28, borderTop: `1px solid rgba(255,255,255,0.05)`, marginBottom: 32 }}>
                <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.62rem', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.18em' }}>GET IN TOUCH</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8, background: `${ACCENT}10`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: TEXT, fontSize: '0.78rem', fontWeight: 600, marginBottom: 3 }}>Office</div>
                      <div style={{ color: TEXT_DIM, fontSize: '0.8rem', lineHeight: 1.5 }}>{siteSettings.officeAddress}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8, background: `${ACCENT}10`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M9 7v10M15 7v10M3 12h18"></path></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: TEXT, fontSize: '0.78rem', fontWeight: 600, marginBottom: 3 }}>Registered</div>
                      <div style={{ color: TEXT_DIM, fontSize: '0.8rem', lineHeight: 1.5 }}>{siteSettings.registeredAddress}</div>
                    </div>
                  </div>

                  <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none' }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8, background: `${ACCENT}10`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div style={{ color: TEXT, fontSize: '0.92rem', fontWeight: 500 }}>{siteSettings.phone}</div>
                  </a>

                  <a href={`mailto:${siteSettings.email}`} style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none' }}>
                    <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8, background: `${ACCENT}10`, color: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div style={{ color: TEXT, fontSize: '0.92rem', fontWeight: 500 }}>{siteSettings.email}</div>
                  </a>
                </div>
              </div>

              {/* Bottom — stacked, centered */}
              <div style={{ paddingTop: 24, borderTop: `1px solid rgba(255,255,255,0.05)`, textAlign: 'center', color: TEXT_DIM, fontSize: '0.72rem' }}>
                <div>© 2026 Trio Inc. All rights reserved.</div>
                <div style={{ fontStyle: 'italic', marginTop: 6, color: ACCENT_SOFT }}>Clean. Green. Smart.</div>
              </div>
            </div>
          ) : (
          <>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr 1.2fr', gap: 32, marginBottom: 32, alignItems: 'start' }}>
            {/* Column 1: Brand */}
            <div>
              <img className="footer-logo" src={logo} alt="TRIO" style={{ height: '60px', marginBottom: 14 }} />
              <div style={{ color: ACCENT, fontSize: '1rem', fontWeight: 700, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Drive Smart. Go Green.</div>
              <p style={{ color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.55, marginBottom: 14, maxWidth: 240 }}>
                TRIO EV is Kolkata's premier electric mobility company, delivering clean, green, and smart transportation solutions for businesses and individuals.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {siteSettings.socials.map((s, i) => (
                  <a
                    key={`${s.platform}-${i}`}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label ?? s.platform}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={TEXT_DIM}><path d={SOCIAL_ICONS[s.platform] ?? SOCIAL_ICONS.other}></path></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Categories */}
            <div>
              <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>CATEGORIES</div>
              {[
                { label: 'Find stations', target: 'find-stations' },
                { label: 'About us', target: 'about-us' },
                { label: 'Blog', target: 'blog' }
              ].map(l => (
                <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 10, fontSize: '0.9rem', fontWeight: 500, transition: 'color 200ms' }} onMouseEnter={(e: any) => e.target.style.color = ACCENT} onMouseLeave={(e: any) => e.target.style.color = TEXT}>{l.label}</a>
              ))}
            </div>

            {/* Column 3: Policies */}
            <div>
              <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>POLICIES</div>
              {[
                { label: 'Privacy Policy', target: 'privacy-policy' },
                { label: 'Terms & Conditions', target: 'terms-conditions' },
                { label: 'Refund Policy', target: 'refund-policy' }
              ].map(l => (
                <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); navigate(l.target); }} style={{ display: 'block', color: TEXT, textDecoration: 'none', marginBottom: 10, fontSize: '0.9rem', fontWeight: 500, transition: 'color 200ms' }} onMouseEnter={(e: any) => e.target.style.color = ACCENT} onMouseLeave={(e: any) => e.target.style.color = TEXT}>{l.label}</a>
              ))}
            </div>

            {/* Column 4: Registered Address */}
            <div>
              <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>REGISTERED ADDRESS</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ color: ACCENT, marginTop: 2 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                <div style={{ color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {siteSettings.registeredAddress}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div style={{ color: ACCENT }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                <a href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} style={{ color: TEXT_DIM, fontSize: '0.82rem', textDecoration: 'none' }}>{siteSettings.phone}</a>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ color: ACCENT }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                <a href={`mailto:${siteSettings.email}`} style={{ color: TEXT_DIM, fontSize: '0.82rem', textDecoration: 'none' }}>{siteSettings.email}</a>
              </div>
            </div>

            {/* Column 5: Office Address + Button */}
            <div>
              <div style={{ color: ACCENT, fontWeight: 800, fontSize: '0.7rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif" }}>OFFICE ADDRESS</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ color: ACCENT, marginTop: 2 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                <div style={{ color: TEXT_DIM, fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {siteSettings.officeAddress}
                </div>
              </div>
              <button
                className="btn-accent"
                style={{ width: '100%', padding: '12px 20px', fontSize: '0.8rem', fontWeight: 800, borderRadius: 8, background: '#5AF59F', color: '#000', boxShadow: '0 4px 14px rgba(90, 245, 159, 0.3)' }}
                onClick={() => setShowContactForm(true)}
              >
                CONTACT US
              </button>
            </div>
          </div>
          <div className="footer-bottom" style={{ color: TEXT_DIM, fontSize: '0.72rem', borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span>© 2026 Trio Inc. All rights reserved.</span>
            <span style={{ fontStyle: 'italic' }}>Clean. Green. Smart.</span>
          </div>
          </>
          )}
        </div>
      </footer>
    </div>
  );
}
