# Canlıya Alma ve Bulut Entegrasyonu Kılavuzu (GitHub, Supabase & Render)

Bora Auto Detailing uygulamasının randevuları kalıcı olarak veritabanına kaydetmesi ve dilediğiniz tüm cep telefonu, tablet ve bilgisayarda (diğer cihazlarda da) aynı anda gözükebilmesi için aşağıdaki adımları sırasıyla uygulamanız yeterlidir.

Bu kurulum sayesinde, müşterilerinizin aldığı randevular anında veritabanınıza işlenecek ve siz de kendi telefonunuzdan uygulamanın **Yönetim** sekmesine şifrenizle (`2727`) girerek tüm randevuları anlık olarak yönetebileceksiniz.

---

## ADIM 1: Supabase Bulut Veritabanı Kurulumu
Randevu bilgilerinin saklanacağı ücretsiz ve son derece hızlı bir bulut veritabanı oluşturalım.

1.  **[Supabase.com](https://supabase.com)** adresine gidin ve ücretsiz bir hesap oluşturun.
2.  **New Project** (Yeni Proje) butonuna tıklayın:
    *   **Project Name:** `Bora Auto Detailing`
    *   **Database Password:** Güvenli bir şifre belirleyin (unutmayın).
    *   **Region:** Size en yakın konumu seçin (örneğin *EU Central - Frankfurt*).
    *   **Plan:** *Free* (Ücretsiz) seçeneğini işaretleyin.
3.  Proje oluştuktan sonra sol menüdeki **SQL Editor** simgesine (üzerinde `SQL` yazan ikon) tıklayın.
4.  **New Query** butonuna basın ve proje kök dizinindeki [supabase_schema.sql](file:///c:/Users/user/Desktop/car/supabase_schema.sql) dosyasının içindeki tüm kodları kopyalayıp buraya yapıştırın.
5.  Sağ alttaki **Run** butonuna tıklayın. Ekranın altında `Success. No rows returned` yazısını gördüyseniz veritabanı tablonuz ve tüm güvenlik kuralları (RLS) başarıyla oluşturulmuştur.
6.  Sol menünün en altındaki **Project Settings** (Dişli çark) > **API** sekmesine gidin. Burada göreceğiniz:
    *   `Project URL`
    *   `Project API keys (anon public)`
    bilgilerini bir kenara not edin (Bir sonraki adımlarda kullanacağız).

---

## ADIM 2: Kodun GitHub'a Yüklenmesi
Uygulamayı canlı yayın sunucusuna bağlayabilmek için kodlarınızı GitHub'a yüklemelisiniz.

1.  Bilgisayarınızda bir **GitHub** hesabı açın.
2.  GitHub üzerinde **New Repository** butonuna basarak `bora-auto-detailing` adında boş bir depo oluşturun.
3.  Projenizin ana dizininde (`c:\Users\user\Desktop\car`) bir terminal/PowerShell penceresi açın ve sırasıyla şu komutları yazın:
    ```bash
    git init
    git add .
    git commit -m "ilk kurulum veritabani aktif"
    git branch -M main
    git remote add origin https://github.com/kullanici_adiniz/bora-auto-detailing.git
    git push -u origin main
    ```
    *(Not: `kullanici_adiniz` kısmını kendi GitHub kullanıcı adınızla değiştirmeyi unutmayın).*

---

## ADIM 3: Render ile Canlı Yayın (Deployment)
Şimdi GitHub'a yüklediğimiz projeyi internette yayınlayarak bir mobil uygulama linki elde edeceğiz.

1.  **[Render.com](https://render.com)** adresine gidin ve GitHub hesabınızla giriş yapın.
2.  Yönetim panelinde **New +** butonuna tıklayın ve listeden **Static Site** seçeneğini seçin.
3.  GitHub hesabınızı bağlayın ve az önce oluşturduğunuz `bora-auto-detailing` deposunu seçerek **Connect** butonuna tıklayın.
4.  Kurulum ayarlarını şu şekilde yapılandırın:
    *   **Name:** `bora-auto-detailing`
    *   **Build Command:** `npm run build`
    *   **Publish Directory:** `dist`
5.  Aynı sayfada biraz aşağıda bulunan **Advanced** (Gelişmiş) butonuna tıklayın ve **Add Environment Variable** diyerek Adım 1'de Supabase'den aldığınız API anahtarlarını ekleyin:
    *   **Key:** `VITE_SUPABASE_URL` | **Value:** *(Supabase Project URL'iniz)*
    *   **Key:** `VITE_SUPABASE_ANON_KEY` | **Value:** *(Supabase anon public key'iniz)*
6.  En alttaki **Create Static Site** butonuna tıklayın.
7.  Yaklaşık 1-2 dakika içinde siteniz derlenecek ve ekranın sol üstünde size özel bir canlı site linki verilecektir (Örn: `https://bora-auto-detailing.onrender.com`).

---

## ADIM 4: Test ve Canlı Randevu Takibi
Her şey hazır!
1.  Render'ın size verdiği canlı linki kendi telefonunuzdan veya başka bir cihazdan açın.
2.  **Randevu Al** kısmından bir plaka girerek randevu oluşturun ve WhatsApp onay butonuna basın.
3.  Daha sonra kendi telefonunuzdan veya bilgisayarınızdan uygulamanın **Yönetim** sekmesine geçin.
4.  Şifre alanına **`2727`** yazarak giriş yapın.
5.  Müşterinin diğer cihazdan girdiği randevuyu, plakayı, saati ve detayları anlık olarak kendi yönetim ekranınızda göreceksiniz. Buradan biten randevuları "Tamamlandı" olarak işaretleyebilir veya temizleyebilirsiniz.
