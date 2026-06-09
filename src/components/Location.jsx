import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Navigation, ExternalLink } from 'lucide-react';

export default function Location() {
  const address = "Yeditepe Mahallesi, 85254. Sokak, No:13, Şahinbey / Gaziantep";
  const phone = "0543 272 75 27";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Gaziantep Şahinbey Yeditepe Mahallesi 85254. Sokak No 13")}`;

  const handleCall = () => {
    window.open(`tel:${phone.replace(/\s+/g, '')}`);
  };

  const handleWhatsApp = () => {
    const message = "Merhaba, Bora Auto Detailing dükkanınızın konumu ve çalışma saatleri hakkında bilgi almak istiyorum.";
    window.open(`https://wa.me/905432727527?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="tab-content" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Konum & İletişim</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Dükkanımızın konumu, çalışma saatleri ve iletişim kanalları.
        </p>
      </div>

      {/* Map Glass Panel */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '12px', 
          borderRadius: '12px', 
          marginBottom: '20px',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{ 
            borderRadius: '10px', 
            overflow: 'hidden', 
            height: '220px',
            position: 'relative',
            background: 'var(--bg-color)'
          }}
        >
          {/* Custom Styled Google Maps Iframe fitted for Dark Mode */}
          <iframe 
            title="Bora Auto Detailing Google Maps Location"
            width="100%" 
            height="100%" 
            src="https://maps.google.com/maps?q=Gaziantep%20Yeditepe%20Mahallesi%2085254%20Sokak%20No%2013&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0" 
            style={{ 
              border: 0,
              filter: 'invert(90%) hue-rotate(180deg) grayscale(10%) contrast(110%)',
              opacity: 0.85
            }}
          />
        </div>
        
        {/* Quick Navigate overlay action */}
        <div style={{ padding: '12px 6px 4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--secondary)', 
                display: 'inline-block',
                boxShadow: '0 0 8px var(--secondary)'
              }} 
            />
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)' }}>Şuan Açığız</span>
          </div>
          
          <a 
            href={mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="scale-active"
            style={{ 
              fontSize: '12px', 
              color: 'var(--primary)', 
              textDecoration: 'none',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Haritada Aç <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Address Details Card */}
      <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '10px', 
              background: 'rgba(0, 229, 255, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--primary)',
              flexShrink: 0
            }}
          >
            <MapPin size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Açık Adres
            </h4>
            <p style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px', lineHeight: '1.4' }}>
              {address}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '10px', 
              background: 'rgba(57, 255, 20, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--secondary)',
              flexShrink: 0
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Çalışma Saatleri
            </h4>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', marginBottom: '2px' }}>
                <span>Hafta İçi:</span>
                <span>12:00 - 00:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px' }}>
                <span>Hafta Sonu:</span>
                <span>12:00 - 22:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Contact Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <a 
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary shimmer-btn scale-active"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            fontSize: '14px'
          }}
        >
          <Navigation size={18} fill="#05070a" />
          Yol Tarifi Al (Google Maps)
        </a>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleCall}
            className="btn-secondary scale-active"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px'
            }}
          >
            <Phone size={16} />
            Hemen Ara
          </button>
          
          <button 
            onClick={handleWhatsApp}
            className="btn-secondary scale-active"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              color: 'var(--secondary)',
              borderColor: 'var(--secondary)'
            }}
          >
            <MessageSquare size={16} />
            WhatsApp Destek
          </button>
        </div>
      </div>
    </div>
  );
}
