import React, { useState } from 'react';
import { SERVICES_DATA } from './Services';
import { ShoppingBag, Clock, Calendar, MessageCircle, Check, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, Download } from 'lucide-react';
import { supabase } from '../supabaseClient';

const TIME_SLOTS = [
  { time: '12:00', status: 'available' },
  { time: '13:00', status: 'available' },
  { time: '14:00', status: 'available' },
  { time: '15:00', status: 'available' },
  { time: '16:00', status: 'available' },
  { time: '17:00', status: 'available' },
  { time: '18:00', status: 'available' },
  { time: '19:00', status: 'available' },
  { time: '20:00', status: 'available' },
  { time: '21:00', status: 'available' },
  { time: '22:00', status: 'available' },
  { time: '23:00', status: 'available' },
  { time: '00:00', status: 'available' }
];

export default function Calculator() {
  // Wizard Steps: 1 = Services, 2 = Plate & Info, 3 = Date & Time, 4 = Summary Card
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState(['wash_sedan']); // default binek yıkama
  const [polishVehicleType, setPolishVehicleType] = useState('sedan'); // sedan, suv, minibus

  // Step 2: Customer & Vehicle Info
  const [plate, setPlate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Step 3: Date & Time Selection
  const [selectedDate, setSelectedDate] = useState(0); // Index
  const [selectedTime, setSelectedTime] = useState(null);

  // Randevu Kodu State'i (8 haneli, içinde 2 harf barındıran benzersiz kod)
  const [appointmentCode, setAppointmentCode] = useState('');

  // Card Flip State
  const [isFlipped, setIsFlipped] = useState(false);

  // 8 haneli ve tam olarak 2 harf, 6 rakamdan oluşan rastgele kod üreteci
  const generateAppointmentCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    let codeArr = [];
    
    for (let i = 0; i < 2; i++) {
      codeArr.push(letters.charAt(Math.floor(Math.random() * letters.length)));
    }
    for (let i = 0; i < 6; i++) {
      codeArr.push(digits.charAt(Math.floor(Math.random() * digits.length)));
    }
    
    for (let i = codeArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [codeArr[i], codeArr[j]] = [codeArr[j], codeArr[i]];
    }
    
    return codeArr.join('');
  };

  // Generate next 8 dates (Today + next 7 days)
  const getDates = () => {
    const dates = [];
    const locale = 'tr-TR';
    for (let i = 0; i < 8; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      let dayName = d.toLocaleDateString(locale, { weekday: 'long' });
      let dayNum = d.getDate();
      let monthName = d.toLocaleDateString(locale, { month: 'short' });
      
      if (i === 0) dayName = 'Bugün';
      if (i === 1) dayName = 'Yarın';

      dates.push({
        dayName,
        dateString: `${dayNum} ${monthName}`,
        fullString: `${dayNum} ${d.toLocaleDateString(locale, { month: 'long' })} ${dayName}`
      });
    }
    return dates;
  };

  const dates = getDates();

  const toggleService = (id) => {
    let updated = [...selectedServices];

    if (updated.includes(id)) {
      if (updated.length > 1) {
        updated = updated.filter(s => s !== id);
      }
    } else {
      if (id === 'wash_sedan') {
        if (updated.includes('wash_suv')) {
          updated = updated.filter(s => s !== 'wash_suv');
        }
      } else if (id === 'wash_suv') {
        if (updated.includes('wash_sedan')) {
          updated = updated.filter(s => s !== 'wash_sedan');
        }
      }
      updated.push(id);
    }
    
    setSelectedServices(updated);
  };

  const getPolishPrice = () => {
    if (polishVehicleType === 'sedan') return 5000;
    if (polishVehicleType === 'suv') return 10000;
    if (polishVehicleType === 'minibus') return 15000;
    return 5000;
  };

  const calculatePolishDuration = () => {
    if (polishVehicleType === 'sedan') return '6 saat';
    if (polishVehicleType === 'suv') return '9 saat';
    if (polishVehicleType === 'minibus') return '12 saat';
    return '6 saat';
  };

  const calculateTotal = () => {
    return selectedServices.reduce((sum, serviceId) => {
      if (serviceId === 'polish') {
        return sum + getPolishPrice();
      }
      const service = SERVICES_DATA.find(s => s.id === serviceId);
      return sum + (service ? service.basePrice : 0);
    }, 0);
  };

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    selectedServices.forEach(serviceId => {
      if (serviceId === 'polish') {
        if (polishVehicleType === 'sedan') totalMinutes += 6 * 60;
        else if (polishVehicleType === 'suv') totalMinutes += 9 * 60;
        else if (polishVehicleType === 'minibus') totalMinutes += 12 * 60;
      } else {
        const service = SERVICES_DATA.find(s => s.id === serviceId);
        if (service) {
          const dur = service.duration;
          if (dur.includes('dk')) {
            totalMinutes += parseInt(dur);
          } else if (dur.includes('saat')) {
            const cleanDur = dur.split('-')[0].replace('saat', '').trim();
            totalMinutes += parseFloat(cleanDur) * 60;
          }
        }
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours} saat ${mins > 0 ? mins + ' dk' : ''}`;
    }
    return `${mins} dk`;
  };

  // Plaka formatlama fonksiyonu
  const handlePlateChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formatted = value;
    if (value.length > 2) {
      const city = value.substring(0, 2);
      let rest = value.substring(2);
      
      const letterMatch = rest.match(/^([A-Z]{1,3})/);
      if (letterMatch) {
        const letters = letterMatch[1];
        const numbers = rest.substring(letters.length);
        formatted = `${city} ${letters}` + (numbers ? ` ${numbers}` : '');
      } else {
        formatted = `${city} ${rest}`;
      }
    }
    
    setPlate(formatted.substring(0, 11));
  };

  // Bir sonraki adıma geçerken kontroller
  const nextStep = () => {
    if (step === 1) {
      if (selectedServices.length === 0) return;
      setStep(2);
    } else if (step === 2) {
      const cleanPlate = plate.replace(/\s+/g, '');
      if (cleanPlate.length < 5) return;
      if (!customerName.trim()) return;
      if (customerPhone.replace(/\D/g, '').length < 10) return;
      setStep(3);
    } else if (step === 3) {
      if (!selectedTime) return;
      setAppointmentCode(generateAppointmentCode());
      setStep(4);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // HTML5 Canvas Kullanarak Randevu Kartını PNG Olarak İndirme (Manuel İstek İçin)
  const downloadCardAsImage = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 800, 450);
      grad.addColorStop(0, '#111827');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#030712');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 450);

      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, 794, 444);

      const chipGrad = ctx.createLinearGradient(60, 60, 140, 120);
      chipGrad.addColorStop(0, '#00e5ff');
      chipGrad.addColorStop(1, '#0084ff');
      ctx.fillStyle = chipGrad;
      
      ctx.beginPath();
      ctx.arc(60 + 8, 60 + 8, 8, Math.PI, Math.PI * 1.5);
      ctx.lineTo(140 - 8, 60);
      ctx.arc(140 - 8, 60 + 8, 8, Math.PI * 1.5, Math.PI * 2);
      ctx.lineTo(140, 116 - 8);
      ctx.arc(140 - 8, 116 - 8, 8, 0, Math.PI * 0.5);
      ctx.lineTo(60 + 8, 116);
      ctx.arc(60 + 8, 116 - 8, 8, Math.PI * 0.5, Math.PI);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(75, 70, 50, 36);

      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('BORA AUTO MEMBER', 740, 95);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(plate ? plate : '34 BORA 527', 400, 240);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#8e9aa8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('MÜŞTERİ', 60, 350);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(customerName ? customerName : 'AD SOYAD', 60, 385);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#8e9aa8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('RANDEVU NO', 400, 350);
      ctx.fillStyle = '#39ff14';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(appointmentCode, 400, 385);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#8e9aa8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('RANDEVU ZAMANI', 740, 350);
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`${selectedTime} | ${dates[selectedDate].dateString}`, 740, 385);

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `BoraAuto_${plate.replace(/\s+/g, '_')}_${appointmentCode}.png`;
      link.href = url;
      link.click();
    } catch (err) {
      console.error('Kart resmi oluşturulurken hata:', err);
    }
  };

  // WhatsApp Mesajı Gönderme (Randevuyu Supabase'e kaydeder ve WhatsApp'a yönlendirir)
  const handleFinalBooking = async () => {
    const total = calculateTotal();
    const duration = calculateTotalDuration();
    
    const servicesText = selectedServices
      .map(id => {
        const service = SERVICES_DATA.find(s => s.id === id);
        if (id === 'polish') {
          let typeName = 'Normal Araç (Sedan)';
          if (polishVehicleType === 'suv') typeName = 'SUV Araç';
          if (polishVehicleType === 'minibus') typeName = 'Minibüs';
          return `${service?.title} (Araç: ${typeName} - ${getPolishPrice()} TL)`;
        }
        return `${service?.title} (${service?.basePrice} TL)`;
      })
      .filter(Boolean)
      .join('\n- ');

    const dateText = dates[selectedDate].fullString;
    const timeText = selectedTime;

    // Randevuyu Supabase veritabanına kaydet
    if (supabase) {
      const servicesList = selectedServices
        .map(id => {
          const service = SERVICES_DATA.find(s => s.id === id);
          if (id === 'polish') {
            let typeName = 'Binek (Sedan)';
            if (polishVehicleType === 'suv') typeName = 'SUV Araç';
            if (polishVehicleType === 'minibus') typeName = 'Minibüs';
            return `${service?.title} (${typeName})`;
          }
          return service?.title;
        })
        .filter(Boolean);

      try {
        await supabase
          .from('appointments')
          .insert([
            {
              customer_name: customerName,
              customer_phone: customerPhone,
              plate: plate,
              appointment_code: appointmentCode,
              services: servicesList,
              appointment_date: dates[selectedDate].fullString,
              appointment_time: selectedTime,
              total_price: total,
              status: 'Bekliyor'
            }
          ]);
      } catch (err) {
        console.error('Supabase kaydı başarısız oldu:', err);
      }
    }

    const message = `Merhaba Bora Auto Detailing!\nAracım için randevu oluşturmak istiyorum:\n\n*Müşteri Bilgileri:*\n👤 İsim: ${customerName}\n📞 Telefon: ${customerPhone}\n🚗 Araç Plakası: ${plate}\n\n*Randevu Numarası:*\n🔑 No: ${appointmentCode}\n\n*Seçilen İşlemler:*\n- ${servicesText}\n\n*Randevu Zamanı:*\n📅 Tarih: ${dateText}\n🕒 Saat: ${timeText}\n\n*Özet Detaylar:*\n⏱️ Tahmini İşlem Süresi: ~${duration}\n💳 Ödeme Yöntemi: Kapıda / Dükkanda Ödeme\n💰 Toplam Tutar: ${total} TL\n\nRandevumu onaylayabilir misiniz?`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/905432727527?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="tab-content" style={{ padding: '20px', position: 'relative', zIndex: 10 }}>
      
      {/* Header & Steps Indicator */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Randevu Al</h2>
        
        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
          {[
            { stepNum: 1, label: 'Hizmetler' },
            { stepNum: 2, label: 'Araç / Plaka' },
            { stepNum: 3, label: 'Tarih / Saat' },
            { stepNum: 4, label: 'Özet ve Onay' }
          ].map((item) => (
            <div 
              key={item.stepNum}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step >= item.stepNum ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                  color: step >= item.stepNum ? '#000' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: step >= item.stepNum ? '0 0 10px var(--primary-glow)' : 'none',
                  transition: 'var(--transition-smooth)'
                }}
              >
                {step > item.stepNum ? '✓' : item.stepNum}
              </div>
              <span style={{ fontSize: '9px', color: step === item.stepNum ? 'var(--primary)' : 'var(--text-muted)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------- STEP 1: SERVICES SELECTION -------------------- */}
      {step === 1 && (
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', marginBottom: '12px' }}>
            Hizmet Seçimi
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SERVICES_DATA.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              const price = service.id === 'polish' ? getPolishPrice() : service.basePrice;
              
              return (
                <div key={service.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    onClick={() => toggleService(service.id)}
                    className="scale-active"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                      background: isSelected ? 'rgba(0, 229, 255, 0.05)' : 'rgba(0,0,0,0.18)',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div 
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: isSelected ? 'none' : '1.5px solid var(--text-muted)',
                          background: isSelected ? 'var(--primary)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: '700', color: isSelected ? '#fff' : 'var(--text-main)' }}>
                          {service.title}
                        </div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          Süre: {service.id === 'polish' ? calculatePolishDuration() : service.duration}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {price} TL
                    </div>
                  </div>

                  {/* Pasta Cila Seçildiyse Araç Tipi Seçimi Ekstra Çıkar */}
                  {service.id === 'polish' && isSelected && (
                    <div 
                      style={{ 
                        padding: '12px', 
                        borderRadius: '8px', 
                        background: 'rgba(0, 229, 255, 0.03)', 
                        border: '1px solid rgba(0, 229, 255, 0.1)',
                        marginTop: '-4px',
                        animation: 'fadeInUp 0.3s ease-out'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
                        Pasta Cila için araç tipinizi belirtiniz:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {[
                          { id: 'sedan', label: 'Binek (Sedan)', price: '5.000 TL' },
                          { id: 'suv', label: 'SUV Araç', price: '10.000 TL' },
                          { id: 'minibus', label: 'Minibüs', price: '15.000 TL' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPolishVehicleType(opt.id)}
                            style={{
                              padding: '8px 4px',
                              borderRadius: '6px',
                              border: polishVehicleType === opt.id ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                              background: polishVehicleType === opt.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(0,0,0,0.2)',
                              color: polishVehicleType === opt.id ? '#fff' : 'var(--text-muted)',
                              cursor: 'pointer',
                              textAlign: 'center',
                              fontSize: '10px'
                            }}
                          >
                            <span style={{ display: 'block', fontWeight: 'bold' }}>{opt.label}</span>
                            <span style={{ display: 'block', fontSize: '9px', color: 'var(--primary)', marginTop: '2px' }}>{opt.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------- STEP 2: PLATE & CUSTOMER INFO -------------------- */}
      {step === 2 && (
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', marginBottom: '14px' }}>
            Araç Plakası ve İletişim Bilgileri
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* ŞIK DİNAMİK TÜRK PLAKASI ÖNİZLEMESİ */}
            <div style={{
              background: '#fff',
              border: '2.5px solid #111',
              borderRadius: '6px',
              height: '52px',
              width: '100%',
              maxWidth: '280px',
              margin: '0 auto 8px auto',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              boxShadow: '0 8px 25px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.8)',
              overflow: 'hidden',
              fontFamily: '"Outfit", sans-serif',
              animation: 'fadeInUp 0.4s ease-out'
            }}>
              {/* Mavi TR Bandı */}
              <div style={{
                background: '#003399',
                width: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 0',
                color: '#fff',
                fontSize: '8px',
                fontWeight: 'bold'
              }}>
                <span style={{ fontSize: '10px', lineHeight: 1 }}>🇪🇺</span>
                <span>TR</span>
              </div>
              {/* Plaka Numarası */}
              <div style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '24px',
                color: '#111',
                letterSpacing: '2.5px',
                fontWeight: '800',
                textTransform: 'uppercase'
              }}>
                {plate ? plate : '34 BORA 527'}
              </div>
            </div>

            {/* Araç Plakası Input */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Araç Plakası
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  placeholder="34 ABC 123"
                  value={plate}
                  onChange={handlePlateChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    background: 'rgba(0,0,0,0.35)',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    outline: 'none',
                    transition: 'var(--transition-smooth)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                {plate.replace(/\s+/g, '').length >= 5 && (
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }}>
                    <CheckCircle2 size={18} />
                  </span>
                )}
              </div>
            </div>

            {/* İsim Soyisim */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Adınız ve Soyadınız
              </label>
              <input 
                type="text"
                placeholder="Örn: Bora Kaya"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.35)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Telefon Numarası */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                Cep Telefonu Numaranız
              </label>
              <input 
                type="tel"
                placeholder="Örn: 0543 272 7527"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.35)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
            
          </div>
        </div>
      )}

      {/* -------------------- STEP 3: DATE & TIME SCHEDULER -------------------- */}
      {step === 3 && (
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', marginBottom: '14px' }}>
            Randevu Günü ve Saati Seçimi
          </h3>
          
          {/* Takvim Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
            {dates.map((date, idx) => {
              const isSelected = selectedDate === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDate(idx)}
                  className="scale-active"
                  style={{
                    cursor: 'pointer',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.06)',
                    background: isSelected ? 'rgba(0, 229, 255, 0.08)' : 'rgba(0,0,0,0.25)',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  <span style={{ fontWeight: '500', opacity: 0.8, fontSize: '9px' }}>{date.dayName}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)' }}>{date.dateString}</span>
                </button>
              );
            })}
          </div>

          {/* Saat Seçenekleri */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {TIME_SLOTS.map((slot, idx) => {
              const isSelected = selectedTime === slot.time;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedTime(slot.time)}
                  className={`time-slot-btn scale-active ${isSelected ? 'selected' : 'available'}`}
                  style={{
                    padding: '10px 0',
                    borderRadius: '6px',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.06)',
                    background: isSelected ? 'var(--primary)' : 'rgba(0,0,0,0.25)',
                    color: isSelected ? '#040609' : 'var(--text-main)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------- STEP 4: CUSTOMER CARD SUMMARY -------------------- */}
      {step === 4 && (
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', marginBottom: '14px' }}>
            Bora Auto Detailing Randevu Kartı
          </h3>

          {/* 3D FLIPPING MEMBER CARD (Tüm VIP kelimeleri kaldırıldı) */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`flip-card ${isFlipped ? 'flipped' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            <div className="flip-card-inner">
              {/* Kart Ön Yüzü (Bora Auto Müşteri Kartı) */}
              <div 
                className="flip-card-front"
                style={{
                  background: 'linear-gradient(135deg, #111827 0%, #1e1b4b 50%, #030712 100%)',
                  border: '1.5px solid rgba(0, 229, 255, 0.35)',
                  boxShadow: '0 0 25px rgba(0, 229, 255, 0.15)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="card-chip" style={{ background: 'linear-gradient(135deg, #00e5ff 0%, #0084ff 100%)' }}></div>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1px' }}>BORA AUTO MEMBER</span>
                </div>
                
                <div style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '1px', color: '#fff', textAlign: 'center', textShadow: '0 0 10px rgba(0,229,255,0.4)', margin: '10px 0' }}>
                  {plate ? plate : 'PLAKA BİLİNMEDİ'}
                </div>

                <div className="card-info-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: '4px' }}>
                  <div>
                    <div className="card-label">MÜŞTERİ</div>
                    <div className="card-val" style={{ color: '#fff', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customerName ? customerName : 'AD SOYAD'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div className="card-label">RANDEVU NO</div>
                    <div className="card-val" style={{ color: 'var(--secondary)', fontSize: '10px', fontWeight: 'bold' }}>{appointmentCode}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="card-label">RANDEVU ZAMANI</div>
                    <div className="card-val" style={{ color: 'var(--primary)', fontSize: '10px' }}>{selectedTime} | {dates[selectedDate].dateString}</div>
                  </div>
                </div>
              </div>

              {/* Kart Arka Yüzü */}
              <div 
                className="flip-card-back"
                style={{
                  background: 'linear-gradient(135deg, #030712 0%, #111827 100%)',
                  border: '1.5px solid rgba(57, 255, 20, 0.25)'
                }}
              >
                <div className="card-black-line" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
                <div style={{ marginTop: '14px' }}>
                  <div className="card-label" style={{ color: 'var(--secondary)' }}>BORA AUTO DETAILING</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.4', marginTop: '4px' }}>
                    📍 Yeditepe Mah. 85254. Sk No: 13 Şahinbey/Gaziantep
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    📞 0543 272 7527
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Kartı çevirmek için dokunun</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--secondary)' }}>KAPIDA ÖDEME</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dinamik Kart İndirme Butonu (Manuel ve İsteğe Bağlı) */}
          <button
            type="button"
            onClick={downloadCardAsImage}
            className="btn-secondary scale-active"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              fontSize: '12px',
              borderRadius: '8px',
              marginTop: '-8px',
              marginBottom: '15px'
            }}
          >
            <Download size={14} /> Randevu Kartını Resim Olarak İndir (İsteğe Bağlı)
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <ShieldAlert size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Randevu numaranız ve tüm bilgileriniz aşağıdaki buton ile doğrudan dükkan WhatsApp hattına gönderilecektir. İsteğe bağlı olarak kart resmini de yukarıdaki butondan kaydedip iletebilirsiniz.
            </div>
          </div>

        </div>
      )}

      {/* -------------------- WIZARD SUMMARY CARD & BUTTONS -------------------- */}
      <div 
        className="glass-panel glow-primary" 
        style={{ 
          padding: '16px', 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(22, 28, 41, 0.9) 0%, rgba(13, 15, 20, 0.98) 100%)',
          border: '1px solid rgba(0, 229, 255, 0.25)',
          marginTop: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--primary)' }}>
          <ShoppingBag size={16} />
          <h3 style={{ fontSize: '13px', fontWeight: '700' }}>Randevu Özeti</h3>
        </div>

        {/* Sepet Detayı */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Araç Plakası:</span>
            <span style={{ fontWeight: '700', color: plate ? '#fff' : 'var(--text-muted)' }}>
              {plate ? plate : 'Girilmedi'}
            </span>
          </div>

          {appointmentCode && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Randevu No:</span>
              <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>
                {appointmentCode}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tarih / Saat:</span>
            <span style={{ fontWeight: '700', color: selectedTime ? 'var(--primary)' : 'var(--text-muted)' }}>
              {dates[selectedDate].dateString} | {selectedTime ? selectedTime : 'Seçilmedi'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tahmini Süre:</span>
            <span style={{ fontWeight: '700' }}>{calculateTotalDuration()}</span>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />

          {/* Tutar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Toplam Tutar:</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--secondary)' }}>
              {calculateTotal()} TL
            </span>
          </div>
        </div>

        {/* Buton Kontrolleri */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="btn-secondary scale-active"
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '8px'
              }}
            >
              <ArrowLeft size={16} /> Geri
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary shimmer-btn scale-active"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary) 0%, #0084ff 100%)',
                boxShadow: '0 4px 15px rgba(0, 229, 255, 0.3)'
              }}
            >
              İleri <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleFinalBooking}
              className="btn-primary shimmer-btn scale-active"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                fontSize: '15px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.35)',
                border: 'none',
                color: '#fff',
                borderRadius: '8px'
              }}
            >
              <MessageCircle size={20} fill="#fff" />
              Randevuyu WhatsApp'a Gönder
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
export { TIME_SLOTS };
