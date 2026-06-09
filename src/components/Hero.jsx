import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Flame, Star, Award } from 'lucide-react';

const SLIDES = [
  {
    image: '/detail_polish.png',
    title: 'Profesyonel Yüzey Yenileme',
    subtitle: 'Pasta cila ve hare giderme işlemleri ile kılcal çiziklere son veriyoruz.'
  },
  {
    image: '/detail_ceramic.png',
    title: '9H Nano Seramik Kaplama',
    subtitle: 'Aracınızın boyasını 3 yıl boyunca dış etkenlerden koruyan zırh.'
  },
  {
    image: '/detail_interior.png',
    title: 'Detaylı İç Sterilizasyon',
    subtitle: 'Koltuk, döşeme ve tüm iç aksamda antibakteriyel derinlemesine temizlik.'
  }
];

export default function Hero({ onStartBooking }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="tab-content" style={{ padding: '20px' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>
        <h1 
          className="text-glow-primary" 
          style={{ 
            fontSize: '30px', 
            fontWeight: 900, 
            background: 'linear-gradient(135deg, #fff 40%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.8px',
            marginBottom: '4px'
          }}
        >
          Bora Auto Detailing
        </h1>
        <p 
          style={{ 
            color: 'var(--text-main)', 
            fontSize: '14px', 
            fontWeight: '600',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            opacity: 0.9,
            marginBottom: '4px'
          }}
        >
          Aracınıza değer katar
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', color: '#ffb300' }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="#ffb300" stroke="none" />
          ))}
        </div>
      </div>

      {/* Image Carousel (Premium Presentation) */}
      <div 
        className="glass-panel" 
        style={{ 
          position: 'relative', 
          height: '240px', 
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}
      >
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: isActive ? 1 : 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.65,
                  transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  transition: 'transform 4.5s ease-out'
                }}
              />
              {/* Gradient shadow overlay */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(13, 15, 20, 0.95) 15%, rgba(13, 15, 20, 0.4) 60%, rgba(13, 15, 20, 0) 100%)',
                  zIndex: 2
                }}
              />
              
              {/* Text overlay */}
              <div 
                style={{ 
                  position: 'relative', 
                  zIndex: 3, 
                  padding: '20px',
                  transform: isActive ? 'translateY(0)' : 'translateY(15px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, opacity 0.8s ease 0.2s'
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                  {slide.title}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {slide.subtitle}
                </p>
              </div>
            </div>
          );
        })}

        {/* Carousel indicators */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            zIndex: 10,
            display: 'flex',
            gap: '6px'
          }}
        >
          {SLIDES.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: index === currentSlide ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: index === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Trust factors / VIP Experience */}
      <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.3px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        Hizmet Standartlarımız
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' }}>
        <div className="glass-panel" style={{ padding: '14px', borderRadius: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 229, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', color: 'var(--primary)' }}>
            <ShieldCheck size={18} />
          </div>
          <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>Garanti Kalkanı</h4>
          <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: '1.3' }}>Seramik kaplama ve cam filmi işlemlerinde 3 yıla varan resmi garanti belgesi.</p>
        </div>

        <div className="glass-panel" style={{ padding: '14px', borderRadius: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(57, 255, 20, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', color: 'var(--secondary)' }}>
            <Award size={18} />
          </div>
          <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>Uluslararası Ürünler</h4>
          <p style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: '1.3' }}>Uygulamalarda sadece lisanslı ve test edilmiş premium markalar tercih edilir.</p>
        </div>
      </div>

      {/* VIP CTA Card */}
      <div 
        className="glass-panel glow-primary" 
        style={{ 
          padding: '20px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.06) 0%, rgba(22, 28, 41, 0.7) 100%)',
          border: '1px solid rgba(0, 229, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="shimmer-sweep" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="badge badge-secondary" style={{ padding: '4px 12px' }}>BORA VIP</span>
          <span style={{ fontSize: '10.5px', color: 'var(--primary)', fontWeight: '700' }}>Özel İlgi & Kusursuz Teslimat</span>
        </div>
        <h4 style={{ fontSize: '17px', fontWeight: '800', lineHeight: '1.2' }}>Aracınız İçin En İyisini Seçin</h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
          Pasta ciladan seramik kaplamaya, cam filminden detaylı sterilizasyona kadar dilediğiniz tüm profesyonel işlemleri listeleyin ve randevunuzu hemen ayırtın.
        </p>
        <button 
          onClick={onStartBooking}
          className="btn-primary shimmer-btn" 
          style={{ 
            marginTop: '4px', 
            padding: '12px 20px', 
            fontSize: '14px', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          Hizmetleri ve Fiyatları Listele
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
