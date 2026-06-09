import React, { useState } from 'react';
import { Sparkles, Shield, Layers, Sun, CheckCircle, Clock } from 'lucide-react';

const SERVICES_DATA = [
  {
    id: 'wash_sedan',
    title: 'İç Dış Sedan Araç Yıkama',
    description: 'Sedan ve Hatchback araçlar için pH dengeli şampuanlarla fırçasız dış yıkama, detaylı jant temizliği ve iç süpürme/toz alma.',
    basePrice: 450,
    priceDisplay: '450 TL',
    duration: '45 dk',
    icon: CheckCircle,
    badge: 'Ekonomik',
    image: '/detail_interior.png',
    details: [
      'Nötr pH şampuanla çift kova yöntemiyle yıkama',
      'Jantlarda biriken balata tozlarının özel solüsyonla arındırılması',
      'Lastiklerin temizlenmesi ve özel jel ile parlatılması',
      'İç mekanın yüksek emişli süpürgelerle temizlenmesi',
      'Torpido ve plastik aksamların antistatik temizliği'
    ]
  },
  {
    id: 'wash_suv',
    title: 'İç Dış SUV Araç Yıkama',
    description: 'SUV, Crossover ve Pikap araçlar için genişletilmiş dış yıkama, çamurluk içi temizliği, jant bakımı ve iç vakumlama.',
    basePrice: 550,
    priceDisplay: '550 TL',
    duration: '60 dk',
    icon: CheckCircle,
    badge: 'Detaylı',
    image: '/detail_interior.png',
    details: [
      'Geniş yüzeyli araçlar için özel köpük banyosu',
      'Davlumbaz ve çamurluk içlerinin çamurdan arındırılması',
      'Jant ve lastiklerin derinlemesine temizlenip beslenmesi',
      'Detaylı iç vakumlama ve bagaj temizliği',
      'Camların iz bırakmayan özel solüsyonla silinmesi'
    ]
  },
  {
    id: 'polish',
    title: 'Pasta Cila (Yüzey Yenileme)',
    description: 'Normal araçlarda 5.000 TL, SUV araçlarda 10.000 TL, Minibüslerde 15.000 TL olarak uygulanan, kılcal çizik giderme ve boya parlatma işlemi.',
    basePrice: 5000,
    priceDisplay: '5.000 - 15.000 TL',
    duration: '6-12 saat',
    icon: Sparkles,
    badge: 'Premium',
    image: '/detail_polish.png',
    details: [
      'Normal Araç (Sedan/Hatchback): 5.000 TL',
      'SUV Araç (Crossover/Pikap): 10.000 TL',
      'Minibüs / Panelvan / Van: 15.000 TL',
      'Kil temizliği ile boya yüzeyindeki pürüzlerin arındırılması',
      'Çizik derinliğine göre ağır çizik giderici pasta ve hassas hare giderici cila uygulamaları'
    ]
  },
  {
    id: 'interior',
    title: 'Detay Temizlik (Sterilizasyon)',
    description: 'Koltuk, tavan, taban halısı, bagaj ve kapı döşemelerinin anti-bakteriyel solüsyonlar ve vakumlu makinelerle yıkanması.',
    basePrice: 5000,
    priceDisplay: '5.000 TL',
    duration: '8 saat',
    icon: Layers,
    badge: 'Hijyen',
    image: '/detail_interior.png',
    details: [
      'Koltuk kumaş veya derilerinin lekelerden arındırılıp yıkanması',
      'Taban halısının ve bagajın derinlemesine vakumlanması',
      'Tavan döşemesinin nemli yöntemle sarkma riski olmadan temizlenmesi',
      'Klima kanallarının ve havalandırma ızgaralarının temizliği',
      'Ozon cihazı ile araç içi kötü kokuların giderilmesi'
    ]
  },
  {
    id: 'window_film',
    title: 'Profesyonel Cam Filmi',
    description: 'Güneş ışınlarını (UV) engelleyen, araç içi sıcaklığı düşüren ve sürüş güvenliğini artıran garantili cam filmi uygulaması.',
    basePrice: 6000,
    priceDisplay: '6.000 TL',
    duration: '3 saat',
    icon: Sun,
    badge: 'UV Koruma',
    image: '/detail_polish.png',
    details: [
      '1. Sınıf çizilmez ve solmaz Amerikan cam filmi kullanımı',
      'UV ışınlarına karşı %99 koruma, ısı engelleme',
      'Hatasız, tozsuz ve kabarcıksız hassas montaj',
      'Farklı koyuluk tonu alternatifleri (açık, orta, koyu)',
      'Uygulama sonrası kalkma ve soyulmaya karşı garanti'
    ]
  },
  {
    id: 'ceramic',
    title: '9H Nano Seramik Kaplama',
    description: 'Boya yüzeyini dış etkenlerden, asit yağmurlarından ve UV ışınlarından koruyan, 3 yıl garantili seramik kalkan.',
    basePrice: 15000,
    priceDisplay: '15.000 TL',
    duration: '24-48 saat',
    icon: Shield,
    badge: 'Ultra Koruma',
    image: '/detail_ceramic.png',
    details: [
      'Çok aşamalı boya düzeltme (pasta cila) ön hazırlığı',
      'Boya gözeneklerinin alkolle tamamen temizlenmesi',
      'Çift katmanlı 9H sertlikte Nano Seramik uygulaması',
      'Camlara ve jantlara su itici (hydrophobic) koruma',
      '3 yıllık resmi garanti belgesi ve periyodik kontrol programı'
    ]
  }
];

export default function Services() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="tab-content" style={{ padding: '20px' }}>
      {/* Description */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '8px' }}>PROFESYONEL UYGULAMALAR</span>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.5px' }}>
          Hizmetlerimiz & Fiyatlar
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '320px', margin: '0 auto' }}>
          Bora Auto Detailing stüdyomuzda aracınıza uyguladığımız lisanslı ve garantili işlemler.
        </p>
      </div>

      {/* Services List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {SERVICES_DATA.map((service) => {
          const IconComponent = service.icon;
          const isExpanded = expandedId === service.id;

          return (
            <div 
              key={service.id}
              className="glass-panel scale-active"
              onClick={() => toggleExpand(service.id)}
              style={{ 
                padding: '0px', 
                overflow: 'hidden',
                cursor: 'pointer',
                border: isExpanded ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid var(--card-border)',
                background: isExpanded ? 'linear-gradient(180deg, rgba(22, 28, 41, 0.9) 0%, rgba(13, 15, 20, 0.98) 100%)' : 'var(--card-bg)'
              }}
            >
              {/* Image Header for expanded card */}
              {isExpanded && (
                <div style={{ height: '140px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transition: 'var(--transition-smooth)' }}
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      height: '60px', 
                      background: 'linear-gradient(to top, rgba(13, 15, 20, 1), rgba(13, 15, 20, 0))' 
                    }} 
                  />
                </div>
              )}

              {/* Main Content Area */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div 
                      style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '12px', 
                        background: isExpanded ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: isExpanded ? 'var(--primary)' : 'var(--text-muted)',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.2px' }}>{service.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span className="badge badge-primary" style={{ fontSize: '9px', padding: '2px 6px' }}>{service.badge}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} /> {service.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--secondary)' }}>
                      {service.priceDisplay}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '6px' }}>
                  {service.description}
                </p>

                {/* Accordion Details */}
                <div 
                  style={{ 
                    maxHeight: isExpanded ? '350px' : '0px', 
                    overflow: 'hidden', 
                    transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    marginTop: isExpanded ? '14px' : '0px',
                    paddingTop: isExpanded ? '14px' : '0px',
                    borderTop: isExpanded ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                  }}
                >
                  <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
                    İşlem Aşamaları ve Kapsamı:
                  </h4>
                  <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {service.details.map((detail, idx) => (
                      <li 
                        key={idx} 
                        style={{ 
                          fontSize: '11.5px', 
                          color: 'var(--text-main)', 
                          display: 'flex', 
                          alignItems: 'flex-start',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div 
                    style={{ 
                      marginTop: '15px', 
                      fontSize: '10px', 
                      color: 'var(--text-muted)', 
                      background: 'rgba(0,0,0,0.2)', 
                      padding: '8px 12px', 
                      borderRadius: '10px',
                      borderLeft: '2px solid var(--primary)'
                    }}
                  >
                    * İşlemlerimiz tamamen profesyonel ekipmanlarla ve lisanslı kimyasallarla yapılmaktadır. Fiyatlar resmi dükkan fiyatlarımızdır.
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export { SERVICES_DATA };
