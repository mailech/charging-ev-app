import React from 'react';
import { motion } from 'framer-motion';
import mapImage from '../assets/world-map.png';

export const NetworkMap: React.FC = () => {
  return (
    <section className="network-section">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px' }}>GLOBAL NETWORK</h2>
        <p style={{ color: 'var(--accent-color)', letterSpacing: '2px', fontSize: '1rem', fontWeight: 700, marginBottom: '60px' }}>EXPLORE WORLDWIDE</p>
        
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <motion.img 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            src={mapImage} 
            alt="World Map" 
            style={{ width: '100%', maxWidth: '1000px', height: 'auto', filter: 'drop-shadow(0 0 30px rgba(124, 255, 0, 0.1))' }}
          />

          {/* Floating Location Markers */}
          {[
            { top: '30%', left: '20%', label: 'North America' },
            { top: '40%', left: '48%', label: 'Europe' },
            { top: '65%', left: '75%', label: 'Australia' },
            { top: '45%', left: '70%', label: 'Asia' },
          ].map((marker, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2 }}
              style={{
                position: 'absolute',
                top: marker.top,
                left: marker.left,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: 'var(--accent-color)', 
                borderRadius: '50%',
                boxShadow: '0 0 15px var(--accent-glow)'
              }} />
              <div className="glass marker-tooltip" style={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                padding: '5px 12px',
                whiteSpace: 'nowrap',
                fontSize: '0.7rem',
                fontWeight: 700,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none'
              }}>
                {marker.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style>{`
        .network-section div:hover > .marker-tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
};
