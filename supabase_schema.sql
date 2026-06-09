-- Bora Auto Detailing Randevu Tablosu Şeması
-- Bu kodları Supabase panelinizdeki "SQL Editor" kısmına yapıştırıp "Run" butonuna basarak çalıştırın.

-- 1. Randevular Tablosunu Oluşturun
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    plate TEXT NOT NULL,
    appointment_code TEXT NOT NULL UNIQUE,
    services TEXT[] NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Bekliyor' -- Bekliyor, Tamamlandı, İptal
);

-- 2. Güvenlik Politikalarını (RLS) Etkinleştirin
-- Dışarıdan veri eklenebilmesi ve admin şifresiyle okunabilmesi için izinler veriyoruz.
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 2.a. Herkesin Randevu Ekleyebilmesi İçin Politika (Insert Allowed for Anyone)
CREATE POLICY "Randevu eklemeye izin ver" 
ON appointments 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 2.b. Randevuları Okuma İzni (Select Allowed for Admin/Anyone in client)
-- Admin paneli üzerinden okuma yapabilmek için okuma yetkisini açıyoruz.
CREATE POLICY "Randevuları okumaya izin ver" 
ON appointments 
FOR SELECT 
TO public 
USING (true);

-- 2.c. Randevuları Güncelleme/Silme İzni (Update/Delete Allowed for anyone in client)
CREATE POLICY "Randevuları güncelleyebilmeye izin ver" 
ON appointments 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Randevuları silebilmeye izin ver" 
ON appointments 
FOR DELETE 
TO public 
USING (true);
