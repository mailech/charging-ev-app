import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Settings, Headphones } from 'lucide-react';
import ecoCar from '../assets/eco-car.png';

const services = [
  {
    id: 'charging',
    title: 'Charging Solutions',
    description: 'We offer Level 2 charging, which provides a moderate charging speed at 240V, ideal for daily use and longer stops.',
    icon: <Zap size={24} />
  },
  {
    id: 'convenience',
    title: 'User Convenience',
    description: 'Our app allows you to find, reserve, and pay for charging stations with a single tap. Real-time availability updates.',
    icon: <Shield size={24} />
  },
  {
    id: 'energy',
    title: 'Energy Management',
    description: 'Smart grid integration ensures that your vehicle is charged efficiently while minimizing the load on the power system.',
    icon: <Settings size={24} />
  },
  {
    id: 'support',
    title: 'Maintenance & Support',
    description: '24/7 technical support and regular preventive maintenance ensure that our stations are always ready for you.',
    icon: <Headphones size={24} />
  }
];

export const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState(services[0].id);

  const activeService = services.find(s => s.id === activeTab);

  return (
    <section className="services-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <p style={{ color: 'var(--accent-color)', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>EXPLORE OUR SERVICES</p>
          <h2 style={{ fontSize: '4rem', fontWeight: 900 }}>OUR SERVICES</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>We provide the best services for your electric vehicles, Fast, Convenient and Eco-friendly.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ position: 'relative' }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
              zIndex: -1
            }} />
            <img src={ecoCar} alt="Eco Car" style={{ width: '100%', height: 'auto' }} />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {services.map((service) => (
              <div 
                key={service.id}
                onClick={() => setActiveTab(service.id)}
                style={{ 
                  padding: '25px', 
                  cursor: 'pointer',
                  position: 'relative',
                  borderBottom: '1px solid var(--glass-border)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ 
                    color: activeTab === service.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                    transition: 'color 0.3s ease'
                  }}>
                    {service.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: activeTab === service.id ? 'var(--accent-color)' : 'var(--text-primary)'
                  }}>
                    {service.title}
                  </h3>
                </div>

                {activeTab === service.id && (
                  <motion.div 
                    layoutId="activeTab"
                    style={{ 
                      position: 'absolute', 
                      bottom: '-1px', 
                      left: 0, 
                      width: '100%', 
                      height: '2px', 
                      backgroundColor: 'var(--accent-color)',
                      boxShadow: '0 0 10px var(--accent-glow)'
                    }} 
                  />
                )}
              </div>
            ))}

            <div style={{ marginTop: '30px', minHeight: '100px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 style={{ color: 'var(--accent-color)', marginBottom: '10px', fontSize: '1.5rem', fontWeight: 900 }}>
                    {activeService?.title}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {activeService?.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
