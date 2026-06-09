import React, { useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import Calculator from './components/Calculator';
import Location from './components/Location';
import Admin from './components/Admin';
import Navbar from './components/Navbar';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <Hero onStartBooking={() => setActiveTab('calculator')} />; // calculator'a doğrudan randevu al butonu ile gitmesi düzeltildi
      case 'services':
        return <Services />;
      case 'calculator':
        return <Calculator />;
      case 'location':
        return <Location />;
      case 'admin':
        return <Admin />;
      default:
        return <Hero onStartBooking={() => setActiveTab('calculator')} />;
    }
  };

  return (
    <>
      <div className="mobile-wrapper">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      {/* Top Brand Logo Bar */}
      <div 
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(8, 10, 15, 0.6)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Glowing mini logo */}
          <div 
            className="animate-pulse-glow"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              boxShadow: '0 0 10px var(--primary)'
            }}
          />
          <span 
            style={{ 
              fontWeight: 900, 
              fontSize: '15px', 
              letterSpacing: '0.8px',
              background: 'linear-gradient(90deg, #fff 10%, var(--primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            BORA AUTO DETAILING
          </span>
        </div>
        
        {/* Contact Badge */}
        <a 
          href="tel:+905432727527"
          className="scale-active"
          style={{
            fontSize: '10.5px',
            fontWeight: '700',
            color: 'var(--secondary)',
            border: '1px solid rgba(57, 255, 20, 0.25)',
            background: 'rgba(57, 255, 20, 0.08)',
            padding: '4px 10px',
            borderRadius: '12px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'var(--transition-smooth)'
          }}
        >
          📞 Arayın
        </a>
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderTabContent()}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
    </>
  );
}
