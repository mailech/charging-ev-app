import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Zap, Users, Calendar } from 'lucide-react';
import heroImage from '../assets/hero-charger.png';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }}>
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ color: 'var(--accent-color)', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px' }}
          >
            ELECTRICAL CHARGING POWER STATION
          </motion.p>
          
          <h1 style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 900, lineHeight: 0.9, marginBottom: '30px', color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.1)', position: 'relative' }}>
            EV <br />
            <span style={{ color: 'var(--text-primary)', WebkitTextStroke: '0' }}>CHARGING</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '40px', lineHeight: 1.6 }}>
            Welcome to our state-of-the-art electrical vehicle power station, where we're redefining the future of sustainable transportation.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
            <button className="btn-primary">
              <Search size={20} />
              Find Station
            </button>
            <button className="btn-secondary">
              <Zap size={20} />
              Learn More
            </button>
          </div>

          <div style={{ display: 'flex', gap: '40px' }}>
            <div className="glass" style={{ padding: '20px 30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: 'rgba(124, 255, 0, 0.1)', padding: '10px', borderRadius: '50%', color: 'var(--accent-color)' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>56,894</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Customers</p>
              </div>
            </div>

            <div className="glass" style={{ padding: '20px 30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: 'rgba(124, 255, 0, 0.1)', padding: '10px', borderRadius: '50%', color: 'var(--accent-color)' }}>
                <Calendar size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>38,465</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Bookings</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ position: 'relative' }}
        >
          {/* Background Glow */}
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            background: 'var(--accent-glow)',
            filter: 'blur(100px)',
            borderRadius: '50%',
            zIndex: -1
          }} />

          <motion.img 
            src={heroImage} 
            alt="EV Charger" 
            style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 50px rgba(124, 255, 0, 0.2))' }}
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>

      </div>
    </section>
  );
};
