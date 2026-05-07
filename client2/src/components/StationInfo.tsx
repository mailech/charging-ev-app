import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Search } from 'lucide-react';
import promotionImage from '../assets/promotion-hub.png';

export const Promotion: React.FC = () => {
  return (
    <section className="promotion-section" style={{ background: 'rgba(0,0,0,0.3)', padding: '150px 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img src={promotionImage} alt="Future Station" style={{ width: '100%', height: 'auto', borderRadius: '24px', filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.5))' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '30px' }}>
            WE ARE AT THE FOREFRONT OF THE <span className="neon-text">EV REVOLUTION</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.6 }}>
            Investing in the future of energy today. Our network is expanding rapidly to provide seamless charging infrastructure across the continent.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button className="btn-primary">
              <Search size={20} />
              Find Station
            </button>
            <button className="btn-secondary">
              <Zap size={20} />
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const FeatureStrip: React.FC = () => {
  return (
    <div style={{ 
      background: 'var(--accent-color)', 
      padding: '20px 0', 
      overflow: 'hidden', 
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      borderTop: '2px solid #000',
      borderBottom: '2px solid #000'
    }}>
      <div style={{ display: 'flex', gap: '50px', alignItems: 'center', animation: 'marquee 20s linear infinite' }}>
        {[...Array(20)].map((_, i) => (
          <React.Fragment key={i}>
            <span style={{ color: '#000', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>EV CHARGING</span>
            <span style={{ color: '#000', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>ELECTRICAL VEHICLES</span>
            <span style={{ color: '#000', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase' }}>SMART ENERGY</span>
          </React.Fragment>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export const StationFinder: React.FC = () => {
  return (
    <section className="finder-section" id="find-station">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '50px' }}>FIND A STATION NEAR YOU</h2>
        
        <div className="glass" style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '40px',
          display: 'flex',
          gap: '20px'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              placeholder="Enter your location (City, ZIP, or Address)" 
              style={{ 
                width: '100%', 
                padding: '18px 20px 18px 60px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)',
                borderRadius: '100px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
          </div>
          <button className="btn-primary" style={{ padding: '0 40px' }}>
            FIND STATION
          </button>
        </div>

        <div style={{ marginTop: '40px', opacity: 0.5, fontSize: '0.9rem' }}>
          Over 50,000+ stations connected worldwide.
        </div>
      </div>
    </section>
  );
};
