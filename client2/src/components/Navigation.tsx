import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Menu, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        zIndex: 1000, 
        padding: '20px 0',
        background: 'rgba(10, 13, 12, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: 'var(--accent-color)', 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px var(--accent-glow)'
          }}>
            <Zap size={24} color="#000" fill="#000" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-1px' }}>EV<span className="neon-text">CHARGE</span></span>
        </div>

        <nav style={{ display: 'flex', gap: '40px' }}>
          {['Home', 'About Us', 'Find Station', 'Articles & Blogs', 'Contact Us'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              style={{ 
                color: item === 'Home' ? 'var(--accent-color)' : 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'color 0.3s ease'
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" 
              alt="User" 
              style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid var(--accent-color)' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>David Johnson</span>
          </div>
          <Menu size={24} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </motion.header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer style={{ padding: '80px 0 40px', borderTop: '1px solid var(--glass-border)', background: '#050706' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '80px', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Zap size={24} className="neon-text" />
              <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>EVCHARGE</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              We are committed to building the world's most accessible and efficient electric vehicle charging network. Join the green revolution.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Social placeholders */}
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }} />
              ))}
            </div>
          </div>

          {[
            { title: 'Quick Links', items: ['Home', 'About Us', 'Find Station', 'Contact'] },
            { title: 'Resources', items: ['Blog', 'Charging Tips', 'Safety', 'FAQ'] },
            { title: 'Legal', items: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: 'var(--accent-color)' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.items.map(item => (
                  <li key={item}><a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.3s' }}>{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', borderTop: '1px solid var(--glass-border)', paddingTop: '30px' }}>
          © 2024 EVCHARGE. All rights reserved. Designed for the future of transportation.
        </div>
      </div>
    </footer>
  );
};
