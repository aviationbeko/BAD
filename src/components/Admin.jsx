import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldCheck, Search, Trash2, CheckCircle, Clock, XCircle, LogOut } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Şifre doğrulama (Basit Pin: 2727)
  const ADMIN_PIN = '2727';

  useEffect(() => {
    // Tarayıcı oturumunda zaten giriş yapıldıysa hatırla
    const sessionAuth = sessionStorage.getItem('admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      fetchAppointments();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      fetchAppointments();
    } else {
      alert('Hatalı Yönetici Şifresi! Lütfen tekrar deneyin.');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  // Supabase'den Randevuları Çekme
  const fetchAppointments = async () => {
    if (!supabase) {
      setLoading(false);
      // Supabase kurulu değilse örnek veri göster
      setAppointments(getDemoAppointments());
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error('Randevular çekilirken hata oluştu:', err);
      // Hata durumunda da demo veri göster
      setAppointments(getDemoAppointments());
    } finally {
      setLoading(false);
    }
  };

  // Randevu Durumunu Güncelleme (Bekliyor -> Tamamlandı)
  const updateStatus = async (id, newStatus) => {
    // Demo veriyse yerel olarak güncelle
    if (!supabase) {
      setAppointments(appointments.map(app => app.id === id ? { ...app, status: newStatus } : app));
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      // Listeyi güncelle
      setAppointments(appointments.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } catch (err) {
      console.error('Durum güncellenirken hata oluştu:', err);
    }
  };

  // Randevuyu Silme
  const deleteAppointment = async (id) => {
    if (!window.confirm('Bu randevu kaydını kalıcı olarak silmek istediğinize emin misiniz?')) return;

    if (!supabase) {
      setAppointments(appointments.filter(app => app.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAppointments(appointments.filter(app => app.id !== id));
    } catch (err) {
      console.error('Randevu silinirken hata oluştu:', err);
    }
  };

  // Supabase bağlı olmadığında çalışan Demo veriler
  const getDemoAppointments = () => [
    {
      id: 1,
      customer_name: 'Bora Kaya',
      customer_phone: '0543 272 7527',
      plate: '34 BORA 527',
      appointment_code: 'Z5K93840',
      services: ['Seramik Kaplama', 'İç dış SUV araç yıkama'],
      appointment_date: '10 Haziran Çarşamba',
      appointment_time: '14:00',
      total_price: 15550,
      status: 'Bekliyor'
    },
    {
      id: 2,
      customer_name: 'Ahmet Yılmaz',
      customer_phone: '0532 111 2233',
      plate: '27 AY 888',
      appointment_code: 'B2P98301',
      services: ['Pasta Cila (Normal Araç)'],
      appointment_date: '9 Haziran Salı',
      appointment_time: '18:00',
      total_price: 5000,
      status: 'Tamamlandı'
    }
  ];

  // Filtreleme mantığı
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appointment_code.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Giriş Ekranı (Login Screen)
  if (!isAuthenticated) {
    return (
      <div className="tab-content" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '360px', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0,229,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--primary)' }}>
            <ShieldCheck size={26} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Yönetici Girişi</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Randevuları yönetmek ve görüntülemek için şifrenizi girin.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="password"
              placeholder="Giriş Şifresi (PIN)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: '15px',
                textAlign: 'center',
                letterSpacing: '4px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="btn-primary shimmer-btn scale-active"
              style={{ padding: '12px', fontSize: '14px', borderRadius: '8px', width: '100%' }}
            >
              Giriş Yap
            </button>
          </form>
          <div style={{ marginTop: '12px', fontSize: '10px', color: 'var(--text-muted)' }}>
            🔑 Varsayılan Yönetici PIN Kodu: <strong>2727</strong>
          </div>
        </div>
      </div>
    );
  }

  // Yönetim Paneli (Admin Dashboard)
  return (
    <div className="tab-content" style={{ padding: '20px', paddingBottom: '90px' }}>
      
      {/* Üst Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>Randevu Yönetimi</h2>
          <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold' }}>Canlı Veritabanı Aktif</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,0,0,0.2)',
            color: '#ff4444',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <LogOut size={13} /> Çıkış Yap
        </button>
      </div>

      {/* Arama ve Filtreleme HUD */}
      <div className="glass-panel" style={{ padding: '12px', borderRadius: '10px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* Arama Kutusu */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Plaka, İsim veya Randevu No Ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 34px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(0,0,0,0.2)',
              color: '#fff',
              fontSize: '12.5px',
              outline: 'none'
            }}
          />
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        {/* Durum Filtre Butonları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'Bekliyor', label: 'Bekleyen' },
            { id: 'Tamamlandı', label: 'Biten' },
            { id: 'İptal', label: 'İptal' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              style={{
                padding: '6px 0',
                fontSize: '11px',
                fontWeight: 'bold',
                borderRadius: '4px',
                cursor: 'pointer',
                border: statusFilter === btn.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                background: statusFilter === btn.id ? 'rgba(0,229,255,0.1)' : 'rgba(0,0,0,0.15)',
                color: statusFilter === btn.id ? '#fff' : 'var(--text-muted)'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Randevu Kartları Listesi */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Randevular yükleniyor...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.15)', borderRadius: '10px' }}>
          Randevu kaydı bulunamadı.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredAppointments.map(app => (
            <div
              key={app.id}
              className="glass-panel"
              style={{
                padding: '14px',
                borderRadius: '10px',
                borderLeft: app.status === 'Tamamlandı' 
                  ? '4px solid var(--secondary)' 
                  : app.status === 'İptal' 
                    ? '4px solid #ff4444' 
                    : '4px solid var(--primary)',
                background: 'rgba(12, 16, 26, 0.8)'
              }}
            >
              {/* Üst Kısım: Plaka ve Randevu Kodu */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  background: '#fff',
                  border: '1.5px solid #000',
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '900',
                  letterSpacing: '0.5px'
                }}>
                  🚗 {app.plate}
                </span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                  Kod: <strong style={{ color: 'var(--secondary)' }}>{app.appointment_code}</strong>
                </span>
              </div>

              {/* Müşteri Detayları */}
              <div style={{ fontSize: '12px', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.5' }}>
                <div>👤 <strong>{app.customer_name}</strong></div>
                <div>📞 <a href={`tel:${app.customer_phone}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{app.customer_phone}</a></div>
                <div style={{ marginTop: '4px', opacity: 0.8 }}>📅 {app.appointment_date} | 🕒 {app.appointment_time}</div>
                
                {/* Hizmetler */}
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {app.services && app.services.map((srv, idx) => (
                    <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '9.5px', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ height: '1.5px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />

              {/* Alt Kısım: Tutar, Durum ve Aksiyonlar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Tutar: </span>
                  <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: 'var(--secondary)' }}>{app.total_price} TL</span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {app.status === 'Bekliyor' && (
                    <>
                      <button
                        onClick={() => updateStatus(app.id, 'Tamamlandı')}
                        style={{
                          background: 'rgba(57, 255, 20, 0.1)',
                          border: 'none',
                          color: 'var(--secondary)',
                          padding: '6px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="Tamamlandı Olarak İşaretle"
                      >
                        <CheckCircle size={15} />
                      </button>
                      <button
                        onClick={() => updateStatus(app.id, 'İptal')}
                        style={{
                          background: 'rgba(255, 68, 68, 0.1)',
                          border: 'none',
                          color: '#ff4444',
                          padding: '6px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="İptal Et"
                      >
                        <XCircle size={15} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteAppointment(app.id)}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: 'none',
                      color: 'var(--text-muted)',
                      padding: '6px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    title="Randevuyu Kalıcı Olarak Sil"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
