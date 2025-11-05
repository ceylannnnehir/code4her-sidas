# SIDAS - Kadına Yönelik Şiddet Destek Chatbot

SIDAS, kadına yönelik şiddet konusunda bilgilendirme, destek ve yönlendirme sağlayan akıllı bir chatbot uygulamasıdır. Yapay zeka destekli RAG (Retrieval-Augmented Generation) sistemi ile Türkiye'deki kadın hakları, yasal süreçler ve destek mekanizmaları hakkında güvenilir bilgiler sunar.

## Özellikler

### Ana Özellikler
- **Yapay Zeka Destekli Sohbet**: Gemini 2.0 Flash modeli ile doğal dil işleme
- **RAG Sistemi**: FAISS vektör veritabanı ile hızlı ve doğru bilgi erişimi
- **Konum Tabanlı Hizmetler**: Google Maps API entegrasyonu ile yakın destek merkezlerini bulma
- **Akıllı Bellek**: Konuşma geçmişini hatırlayan bağlam farkındalığı
- **Acil Durum Tespiti**: Kritik durumlarda otomatik yönlendirme
- **Çok Dilli Destek**: Türkçe odaklı optimize edilmiş sistem

### Güvenlik ve Gizlilik
- Hassas konularda empatik ve profesyonel yaklaşım
- Kullanıcı gizliliğine saygı
- Güvenli API iletişimi

## Teknoloji Yığını

### Backend
- **Framework**: FastAPI (Python)
- **AI Model**: Google Gemini 2.0 Flash
- **Vektör DB**: FAISS + HuggingFace Embeddings (multilingual-e5-base)
- **Konum Servisleri**: Google Maps API (Places, Geocoding, Nearby Search)
- **Diğer**: LangChain, python-dotenv

### Frontend
- **Framework**: React Native (Expo)
- **Navigasyon**: React Navigation v7
- **Harita**: React Native Maps
- **UI Kütüphanesi**: React Native Paper
- **Form Yönetimi**: React Hook Form + Zod
- **Depolama**: AsyncStorage
- **Kimlik Doğrulama**: Firebase

## Proje Yapısı

```
studio-mobile_yeni/
├── backend/                 # FastAPI Backend
│   ├── app.py              # Ana API dosyası
│   ├── scr/                # Kaynak kodlar
│   │   ├── gemini_rag.py   # RAG sistemi ve Gemini entegrasyonu
│   │   ├── find_place.py   # Google Maps entegrasyonu
│   │   └── index_faiss.py  # FAISS indeksleme
│   ├── faiss_db/           # FAISS vektör veritabanı
│   ├── knowledgw_base/     # Bilgi tabanı dokümanları
│   └── konusmalar/         # Sohbet kayıtları
│
├── frontend/               # React Native Frontend
│   ├── src/
│   │   ├── components/     # Yeniden kullanılabilir bileşenler
│   │   ├── screens/        # Uygulama ekranları
│   │   ├── navigation/     # Navigasyon yapılandırması
│   │   ├── services/       # API servisleri
│   │   ├── config/         # Yapılandırma dosyaları
│   │   └── utils/          # Yardımcı fonksiyonlar
│   └── package.json
│
├── .env                    # Ortam değişkenleri
├── .gitignore
└── README.md              # Bu dosya
```

## Hızlı Başlangıç

### Gereksinimler
- **Backend**: Python 3.8+
- **Frontend**: Node.js 16+, Expo CLI
- **API Anahtarları**:
  - Google Maps API Key
  - Google Gemini API Key
  - Firebase yapılandırması (opsiyonel)

### Kurulum

1. **Repoyu Klonlayın**
```bash
git clone <repository-url>
cd studio-mobile_yeni
```

2. **Ortam Değişkenlerini Ayarlayın**
```bash
cp .env.example .env
# .env dosyasını düzenleyerek API anahtarlarınızı ekleyin
```

3. **Backend Kurulumu**
```bash
cd backend
# Detaylı talimatlar için backend/README.md dosyasına bakın
```

4. **Frontend Kurulumu**
```bash
cd frontend
# Detaylı talimatlar için frontend/README.md dosyasına bakın
```

## Ortam Değişkenleri

`.env` dosyasında aşağıdaki değişkenleri tanımlayın:

```env
# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Google Gemini AI
GOOGLE_API_KEY=your_gemini_api_key

# Firebase (Opsiyonel)
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

## API Endpoint'leri

### Backend API
- **Base URL**: `http://localhost:8000` (geliştirme ortamı)
- **Sağlık Kontrolü**: `GET /`
- **Sohbet**: `POST /chat`

Detaylı API dokümantasyonu için `backend/README.md` dosyasına bakın.

## Kullanım

1. Backend sunucusunu başlatın:
```bash
cd backend
python app.py
```

2. Frontend uygulamasını başlatın:
```bash
cd frontend
npm start
```

3. Mobil cihazınızda Expo Go uygulamasını kullanarak QR kodu tarayın veya emülatör kullanın.

## Önemli Notlar

- **Gizlilik**: Kullanıcı verileri hassas olabilir. Üretim ortamında ek güvenlik önlemleri alınmalıdır.
- **API Limitleri**: Google Maps ve Gemini API'leri kullanım limitleri vardır.
- **Bilgi Kaynakları**: RAG sisteminin bilgi tabanı düzenli olarak güncellenmelidir.
- **Acil Durumlar**: Uygulama acil durumlarda 112, 155, 183 gibi acil hatlara yönlendirme yapar.

## Katkıda Bulunma

Bu proje sosyal sorumluluk amacıyla geliştirilmiştir. Katkılarınızı bekliyoruz:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Katkıda Bulunanlar

- Demet Aşgaroğlu
- Zeynep Kılınç
- Nehir Ceylan
- Beyza Bekdemir

## Lisans

Bu proje sosyal fayda amacıyla geliştirilmiştir.

## İletişim ve Destek

Acil durumlarda:
- **112**: Acil Çağrı Merkezi
- **155**: Polis İmdat
- **183**: ALO Sosyal Destek Hattı (7/24)
- **Kadın Danışma Hattı**: 0 312 656 92 95

## Teşekkürler

Bu proje, kadın haklarını desteklemek ve kadına yönelik şiddeti önlemek amacıyla geliştirilmiştir.

---

**Not**: Daha detaylı teknik bilgi için ilgili README dosyalarına bakın:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
