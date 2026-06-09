# Gerçek Online Kredi Kartı Ödeme Entegrasyonu Rehberi

Bora Auto Detailing web uygulamasında müşterilerden **gerçek kredi kartı ile ödeme almak** ve paranın doğrudan banka hesabınıza geçmesini sağlamak için izlemeniz gereken adımlar aşağıda detaylandırılmıştır.

---

## 1. Bir Ödeme Hizmeti Sağlayıcısı Seçin
Türkiye'de en çok tercih edilen ve kurulumu kolay olan iki seçenek şunlardır:
1.  **iyzico (Önerilen - Türkiye için doğrudan entegrasyon)**: Kolay vergi mükellefi kaydı, TL desteği, taksit seçenekleri.
2.  **Stripe**: Küresel ödemeler için en büyük sağlayıcı. Türkiye'deki banka hesaplarına doğrudan transfer için ek aracı hesaplar (Payoneer vb.) gerektirebilir veya Stripe Atlas üzerinden şirket kurulmalıdır.

---

## 2. API Anahtarlarınızı Alın
Ödeme aracı kurumunda (iyzico veya Stripe) satıcı hesabı oluşturduktan sonra yönetim panelinizden şu anahtarları alacaksınız:
*   **Sandbox (Test) Keys**: Geliştirme aşamasında gerçek para çekmeden test etmek için kullanılır.
*   **Production (Live) Keys**: Canlıya geçip gerçek para tahsilatı yapmak için kullanılır.
*   *Gereken Anahtarlar:* `API Key` (veya Stripe için `Publishable Key`) ve `Secret Key` (iyzico için `Security Key`).

---

## 3. Backend (Sunucu) Kurulumu
> [!WARNING]
> **Güvenlik Kuralı:** Kredi kartı bilgileri doğrudan frontend (istemci) kodunda işlenemez ve `Secret Key` asla tarayıcıda barındırılamaz. Aksi takdirde API anahtarlarınız çalınır ve adınıza sahte işlemler yapılır. Bu yüzden araya bir backend API (Node.js/Express vb.) koymamız zorunludur.

Aşağıdaki backend Node.js kodu, istemciden gelen kart bilgilerini alarak güvenli bir şekilde **iyzico API**'sine iletir ve tahsilat işlemini gerçekleştirir.

### Backend Kurulum Adımları:
1. Sunucunuzda boş bir klasör oluşturun ve `npm init -y` ile projeyi başlatın.
2. Gerekli kütüphaneleri yükleyin:
   ```bash
   npm install express cors dotenv iyzipay
   ```
3. Klasörde bir `.env` dosyası oluşturup API anahtarlarınızı yazın:
   ```env
   IYZICO_API_KEY=api_key_buraya_yazilacak
   IYZICO_SECRET_KEY=secret_key_buraya_yazilacak
   IYZICO_BASE_URL=https://sandbox-api.iyzipay.com  # Canlı için: https://api.iyzipay.com
   PORT=5000
   ```
4. `server.js` dosyasını oluşturun ve aşağıdaki kodları yazın:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const Iyzipay = require('iyzipay');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// iyzico İstemcisini Yapılandır
const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL
});

// Ödeme Tahsilat Endpoint'i
app.post('/api/payment', (req, res) => {
    const { cardNo, cardName, cardExpiry, cardCvc, amount, customer, plate } = req.body;
    
    const [expireMonth, expireYear] = cardExpiry.split('/');
    const formattedYear = '20' + expireYear; // örn: 26 -> 2026

    // iyzico API İstek Nesnesi
    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: 'BORA-' + Date.now(),
        price: amount.toString(),
        paidPrice: amount.toString(),
        currency: Iyzipay.CURRENCY.TRY,
        installments: '1',
        basketId: 'B' + Date.now(),
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardHolderName: cardName,
            cardNumber: cardNo.replace(/\s/g, ''),
            expireMonth: expireMonth,
            expireYear: formattedYear,
            cvc: cardCvc,
            registerCard: '0'
        },
        buyer: {
            id: 'BYR-' + Date.now(),
            name: customer.name.split(' ')[0] || 'Müşteri',
            surname: customer.name.split(' ')[1] || 'Soyadı',
            gsmNumber: '+90' + customer.phone.replace(/\D/g, ''),
            email: 'email@domain.com', // Opsiyonel
            identityNumber: '11111111111', // T.C. Kimlik No zorunludur
            lastLoginDate: '2026-06-09 20:00:00',
            registrationDate: '2026-06-09 20:00:00',
            registrationAddress: 'Yeditepe Mah. 85254. Sk No 13',
            ip: req.ip || '127.0.0.1',
            city: 'Gaziantep',
            country: 'Turkey',
            zipCode: '27000'
        },
        shippingAddress: {
            contactName: customer.name,
            city: 'Gaziantep',
            country: 'Turkey',
            address: 'Yeditepe Mah. 85254. Sk No 13 Şahinbey',
            zipCode: '27000'
        },
        billingAddress: {
            contactName: customer.name,
            city: 'Gaziantep',
            country: 'Turkey',
            address: 'Yeditepe Mah. 85254. Sk No 13 Şahinbey',
            zipCode: '27000'
        },
        basketItems: [
            {
                id: 'BI-' + Date.now(),
                name: 'Bora Auto Detailing Rezervasyonu - Plaka: ' + plate,
                category1: 'Oto Bakım',
                category2: 'Temizlik',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: amount.toString()
            }
        ]
    };

    // Ödemeyi Başlat
    iyzipay.payment.create(request, function (err, result) {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.toString() });
        }
        
        if (result.status === 'success') {
            res.json({
                status: 'success',
                transactionId: result.paymentId,
                message: 'Ödeme başarıyla tamamlandı.'
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: result.errorMessage || 'Ödeme başarısız oldu.'
            });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Ödeme backend sunucusu ${PORT} portunda çalışıyor.`));
```

---

## 4. Frontend (React) Güncellemesi
Gerçek entegrasyonda frontend uygulamasındaki `verifyOtpAndPay` veya `startPaymentProcess` fonksiyonları yukarıda kurduğunuz API'ye istek atmalıdır. 

`Calculator.jsx` bileşeninde `startPaymentProcess` fonksiyonunu gerçek API ile bağlamak için şu şekilde güncelleyebilirsiniz:

```javascript
const startPaymentProcess = async () => {
    // ... input kontrolleri yapıldıktan sonra ...

    setPaymentStatus('processing');
    
    try {
        const response = await fetch('http://localhost:5000/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cardNo: cardNo,
                cardName: cardName,
                cardExpiry: cardExpiry,
                cardCvc: cardCvc,
                amount: calculateTotal(),
                plate: plate,
                customer: {
                    name: customerName,
                    phone: customerPhone
                }
            })
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            setPaymentSuccessCode(data.transactionId);
            setPaymentStatus('success');
            showToast('Ödeme başarıyla tahsil edildi!', 'success');
        } else {
            setPaymentStatus('error');
            showToast(data.message || 'Ödeme reddedildi!', 'error');
        }
    } catch (error) {
        setPaymentStatus('error');
        showToast('Ödeme sunucusuyla bağlantı kurulamadı!', 'error');
    }
};
```

---

## 5. 3D Secure (Şifreli Onay) ile Güvenli Canlı Entegrasyon
Eğer ödemede **zorunlu 3D Secure SMS onayı** olmasını istiyorsanız (iyzico kurallarına göre Türkiye'de bu yasal zorunluluktur):
1.  Backend kodunda `iyzipay.payment.create` yerine `iyzipay.threedsInitialize.create` metodunu kullanmalısınız.
2.  Bu metod size bir `htmlContent` döner. Bu HTML içeriğini React uygulamanızda bir `iframe` içinde gösterdiğinizde, bankanın gerçek SMS onay ekranı açılır.
3.  Müşteri şifreyi girip onayladığında iyzico sizin backend callback URL'nize (örn: `/api/payment/callback`) bir POST isteği gönderir.
4.  Callback endpoint'inizde `iyzipay.threedsPayment.create` ile işlemi tamamlayıp React uygulamanıza "Ödeme Başarılı" bilgisini iletebilirsiniz.

*Bu sayede müşterinin cebinden gerçekten para çekilir, paranız iyzico panelinize düşer ve müşterinin plaka ve ödeme onay bilgileri doğrudan WhatsApp'ınıza randevu olarak gelir.*
