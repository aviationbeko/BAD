import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Eğer anahtarlar henüz girilmediyse konsola bilgi yaz, çökmesini önle
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase bağlantı anahtarları eksik! Lütfen projenin kök dizinindeki .env dosyasını oluşturup VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY değerlerini girin.'
  );
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
