import React from 'react';
import { Home, Sparkles, Calculator, MapPin } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'services', label: 'Hizmetler', icon: Sparkles },
    { id: 'calculator', label: 'Randevu Al', icon: Calculator },
    { id: 'location', label: 'Konum', icon: MapPin },
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        padding: '12px 16px 24px 16px', // safe area for mobile bottom notch
        background: 'rgba(8, 10, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
        boxShadow: '0 -8px 32px 0 rgba(0, 0, 0, 0.5)'
      }}
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="scale-active"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              background: 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              position: 'relative',
              padding: '6px 12px',
              borderRadius: '16px',
            }}
          >
            {/* Active Highlight Glow in background */}
            {isActive && (
              <div 
                style={{
                  position: 'absolute',
                  top: '-4px',
                  width: '32px',
                  height: '4.5px',
                  borderRadius: '2.5px',
                  background: 'var(--primary)',
                  boxShadow: '0 0 10px var(--primary)'
                }}
              />
            )}
            
            <IconComponent 
              size={19} 
              style={{
                transform: isActive ? 'scale(1.12)' : 'scale(1)',
                transition: 'var(--transition-smooth)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)'
              }} 
            />
            
            <span 
              style={{ 
                fontSize: '10.5px', 
                fontWeight: isActive ? '700' : '500',
                transition: 'var(--transition-smooth)',
                letterSpacing: '-0.25px'
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
