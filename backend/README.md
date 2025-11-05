# SIDAS Backend - FastAPI + Gemini RAG

SIDAS backend uygulaması, FastAPI framework'ü üzerine kurulu, Gemini 2.0 Flash modeli ve FAISS vektör veritabanı kullanarak güçlü bir RAG (Retrieval-Augmented Generation) sistemi sunar.

## İçindekiler
- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Kurulum](#kurulum)
- [Yapılandırma](#yapılandırma)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [RAG Sistemi](#rag-sistemi)
- [Konum Servisleri](#konum-servisleri)
- [Geliştirme](#geliştirme)

## Özellikler

### Yapay Zeka ve RAG
- **Gemini 2.0 Flash**: Google'ın en güncel AI modeli ile doğal dil işleme
- **FAISS Vektör DB**: Hızlı ve verimli benzerlik araması
- **HuggingFace Embeddings**: `intfloat/multilingual-e5-base` modeli ile çok dilli destek
- **Akıllı Bellek Sistemi**: Konuşma geçmişini hatırlayan ve bağlam zenginleştirme yapan sistem
- **Acil Durum Tespiti**: Kritik anahtar kelimeleri tespit ederek otomatik yönlendirme

### Konum Tabanlı Hizmetler
- **Google Maps Places API**: Mekan arama
- **Geocoding API**: Adres koordinat dönüşümü
- **Nearby Search**: Yakındaki yerleri bulma
- **Şehir ve Yer Tespiti**: Akıllı NLP ile şehir ve yer türü tespiti

### Diğer Özellikler
- **CORS Desteği**: Güvenli cross-origin istekler
- **Özel Cevap Sistemi**: Sık sorulan sorular için hazır cevaplar
- **Konu Dışı Filtresi**: İlgisiz soruları tespit etme
- **Konuşma Kaydı**: JSON formatında konuşma logları

## Teknoloji Yığını

### Core Framework
- **FastAPI**: Modern, hızlı (yüksek performanslı) web framework
- **Pydantic**: Veri doğrulama ve ayarlar yönetimi
- **Uvicorn**: ASGI server

### AI ve ML
- **Google Gemini 2.0 Flash**: LLM modeli
- **LangChain Community**: Vektör store ve embeddings
- **FAISS**: Facebook AI Similarity Search
- **HuggingFace Transformers**: Embedding modelleri

### Diğer
- **python-dotenv**: Ortam değişkenleri yönetimi
- **requests**: HTTP istekleri
- **unicodedata**: Türkçe karakter normalizasyonu

## Kurulum

### Gereksinimler
- Python 3.8 veya üzeri
- pip (Python paket yöneticisi)
- Google Gemini API anahtarı
- Google Maps API anahtarı

### Adım 1: Sanal Ortam Oluşturma (Önerilen)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Adım 2: Bağımlılıkları Yükleme

```bash
pip install fastapi uvicorn
pip install pydantic python-dotenv requests
pip install google-generativeai
pip install langchain-community
pip install faiss-cpu  # CPU için, GPU için: faiss-gpu
pip install sentence-transformers
```

**veya requirements.txt ile:**

```bash
pip install -r requirements.txt
```

### Adım 3: Ortam Değişkenlerini Ayarlama

`.env` dosyasını proje ana dizininde oluşturun:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Adım 4: FAISS Vektör Veritabanını Oluşturma

İlk çalıştırmadan önce FAISS indeksini oluşturmalısınız:

```bash
python scr/index_faiss.py
```

Bu komut `knowledgw_base/` klasöründeki tüm `.txt` dosyalarını okuyarak FAISS vektör veritabanını `faiss_db/` klasörüne oluşturur.

### Adım 5: Sunucuyu Başlatma

```bash
# Geliştirme modu (otomatik reload)
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# veya direkt Python ile
python app.py
```

API şu adreste çalışacaktır: `http://localhost:8000`

## Yapılandırma

### Ortam Değişkenleri

| Değişken | Açıklama | Gerekli |
|----------|----------|---------|
| `GOOGLE_API_KEY` | Google Gemini API anahtarı | Evet |
| `GOOGLE_MAPS_API_KEY` | Google Maps API anahtarı | Evet |

### FAISS Yapılandırması

`scr/gemini_rag.py` dosyasında:

```python
FAISS_DB_PATH = "./faiss_db"  # FAISS veritabanı yolu
EMBEDDING_MODEL = "intfloat/multilingual-e5-base"  # Embedding modeli
```

### RAG Parametreleri

```python
# Retriever yapılandırması
search_type="similarity"  # Arama tipi
search_kwargs={"k": 4}    # Geri döndürülecek doküman sayısı

# Gemini yapılandırması
temperature=0.7    # Rastgelelik (0-1)
top_p=0.95        # Nucleus sampling
top_k=40          # Top-k sampling
max_output_tokens=512  # Maksimum çıktı uzunluğu
```

## API Dokümantasyonu

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Sağlık Kontrolü
```http
GET /
```

**Response:**
```json
{
  "message": "SIDAS API çalışıyor",
  "status": "ok"
}
```

#### 2. Sohbet
```http
POST /chat
```

**Request Body:**
```json
{
  "question": "Şiddet gördüğümde ne yapmalıyım?",
  "location": {
    "latitude": 39.9334,
    "longitude": 32.8597
  }
}
```

**Parameters:**
- `question` (string, required): Kullanıcı sorusu
- `location` (object, optional): Kullanıcı konumu
  - `latitude` (float): Enlem
  - `longitude` (float): Boylam

**Response (RAG Cevabı):**
```json
{
  "answer": "Şiddet gördüğünüzde öncelikle güvenliğinizi sağlayın...",
  "sources": "6284 Sayili Kanun, Destek Mekanizmalari"
}
```

**Response (Konum Bazlı - Tek Sonuç):**
```json
{
  "answer": "📍 Ankara ŞÖNIM\nAdres: Mithatpaşa Cad. No:3 Sıhhiye/Ankara\nTelefon: 0312 310 6666",
  "sources": "Google Maps",
  "place": {
    "name": "Ankara ŞÖNIM",
    "address": "Mithatpaşa Cad. No:3 Sıhhiye, Ankara",
    "maps_link": "https://www.google.com/maps/search/?api=1&query=39.9334,32.8597",
    "lat": 39.9334,
    "lng": 32.8597,
    "place_id": "ChIJ...",
    "phone": "0312 310 6666"
  }
}
```

**Response (Konum Bazlı - Çoklu Sonuç):**
```json
{
  "answer": "1. 📍 Ankara ŞÖNIM\n   Adres: ...\n   Telefon: ...\n\n2. 📍 ...",
  "sources": "Google Maps",
  "places": [
    {
      "name": "Ankara ŞÖNIM",
      "address": "Mithatpaşa Cad. No:3 Sıhhiye, Ankara",
      "maps_link": "https://www.google.com/maps/search/?api=1&query=39.9334,32.8597",
      "lat": 39.9334,
      "lng": 32.8597,
      "place_id": "ChIJ...",
      "phone": "0312 310 6666"
    }
  ]
}
```

### Swagger UI
FastAPI otomatik olarak interaktif API dokümantasyonu sağlar:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## RAG Sistemi

### Nasıl Çalışır?

1. **Soru Girişi**: Kullanıcı bir soru sorar
2. **Ön İşleme**:
   - Özel cevap kontrolü (merhaba, teşekkürler vb.)
   - Acil durum tespiti
   - Konu dışı filtresi
   - Anlamlılık kontrolü
3. **Bellek Zenginleştirme**: Önceki konuşmalardan bağlam ekleme
4. **Vektör Arama**: FAISS ile ilgili dokümanları bulma
5. **LLM Generation**: Gemini ile cevap üretme
6. **Bellek Kayıt**: Konuşmayı belleğe ekleme

### Akıllı Bellek Sistemi

```python
class EnhancedMemory:
    def __init__(self, k=8):
        self.k = k  # Son 8 mesajı tut
        self.memory = deque(maxlen=k)

    def add(self, soru, cevap):
        # Soru-cevap çiftini belleğe ekle

    def get_context(self, son_n=5):
        # Son N mesajı bağlam olarak getir

    def is_followup(self, soru):
        # Takip sorusu mu kontrol et

    def enrich(self, soru):
        # Soruyu önceki bağlamla zenginleştir
```

### Acil Durum Sistemi

Üç seviye acil durum tespiti:

1. **Kritik**: şiddet gördüm, dövdü, bıçak, silah, öldür...
2. **Yüksek**: tehdit ediyor, taciz, tecavüz, cinsel şiddet...
3. **Orta**: acil yardım, polis çağır, ambulans çağır...

Acil durum tespit edildiğinde:
```json
{
  "answer": "ACİL DURUM TESPİT EDİLDİ\n\n112 Acil Çağrı Merkezi\n155 Polis İmdat\n183 ALO Sosyal Destek Hattı",
  "sources": "Acil Protokol"
}
```

### Bilgi Tabanı Güncelleme

Yeni bilgi eklemek için:

1. `.txt` dosyasını `knowledgw_base/` klasörüne ekleyin
2. FAISS indeksini yeniden oluşturun:
```bash
python scr/index_faiss.py
```

## Konum Servisleri

### Google Maps API Özellikleri

#### 1. Yer Arama (Text Search)
```python
find_place(query_text, user_loc=None, city=None, max_results=3)
```

#### 2. Şehir Tespiti
Kullanıcının mesajından otomatik şehir tespiti:
```python
detect_city("ankara şönim nerede")  # -> "ankara"
```

#### 3. Yer Türü Tespiti
```python
extract_place_type("karakol nerede")  # -> "polis merkezi"
```

Desteklenen yer türleri:
- ŞÖNIM/SÖNIM merkezi
- Polis karakolu
- Hastane
- Sağlık merkezi
- Kadın konukevi
- Kadın sığınma evi
- Baro merkezi
- Adliye

#### 4. Geocoding
```python
geocode_address("Mithatpaşa Cad. Sıhhiye Ankara")
# -> {"lat": 39.9334, "lng": 32.8597, "maps_link": "..."}
```

### Konum Önceliklendirmesi

1. **"Yakınımda" + Konum Var** → Kullanıcı konumu kullan
2. **Şehir Adı Var** → Şehir bazlı ara (mesajda veya bellek)
3. **Sadece Konum Var** → Konum bazlı ara
4. **Hiçbiri Yok** → Hata mesajı döndür

## Geliştirme

### Proje Yapısı

```
backend/
├── app.py                  # Ana FastAPI uygulaması
├── scr/
│   ├── gemini_rag.py      # RAG sistemi, Gemini entegrasyonu
│   ├── find_place.py      # Google Maps servisleri
│   └── index_faiss.py     # FAISS indeksleme
├── faiss_db/              # FAISS vektör veritabanı
│   ├── index.faiss
│   └── index.pkl
├── knowledgw_base/        # Bilgi tabanı dokümanları (.txt)
├── konusmalar/            # Konuşma kayıtları (JSON)
└── README.md
```

### Kod Stili

- **Türkçe değişken isimleri**: `soru`, `cevap`, `bellek`
- **Type hints**: `def rag(soru: str, verbose: bool = False) -> dict:`
- **Docstrings**: Tüm fonksiyonlar dokümante edilmiş

### Loglama

Backend konsol çıktıları:
```
[Soru alındı]: ankara şönim nerede
[Şehir tespit edildi]: ankara
[📍 Yer türü]: şönim merkezi
[Arama sorgusu]: ankara şönim merkezi
[✓ Harita Yanıtı]: {...}
```

### Testing

API test etmek için:

```bash
# curl ile
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"question": "ŞÖNIM nedir?"}'

# Python ile
import requests
response = requests.post(
    "http://localhost:8000/chat",
    json={"question": "Ankara ŞÖNIM nerede?"}
)
print(response.json())
```

### Performans Optimizasyonu

- **Cache**: Bellek bağlamı cache'lenir
- **Token Limiti**: Maksimum 512 token (hız için)
- **Doküman Limiti**: En fazla 4 doküman retrieve edilir
- **Timeout**: API istekleri 10 saniye timeout

## Sorun Giderme

### FAISS yüklenemiyor
```bash
# CPU için
pip install faiss-cpu

# GPU için (CUDA gerekli)
pip install faiss-gpu
```

### HuggingFace model indirilemiyor
```bash
# Model önbelleğini temizle
rm -rf ~/.cache/huggingface
```

### API anahtarı hatası
```
HATA: GOOGLE_API_KEY bulunamadı!
```
Çözüm: `.env` dosyasının proje kök dizininde olduğundan emin olun.

### CORS hatası
CORS ayarları `app.py` dosyasında yapılandırılmıştır. Üretim ortamında `allow_origins=["*"]` yerine spesifik domain belirtin.

## Üretim Ortamı

### Güvenlik
- `.env` dosyasını GitHub'a yüklemeyin
- API anahtarlarını güvenli bir şekilde saklayın
- CORS ayarlarını kısıtlayın
- Rate limiting ekleyin

### Deployment

```bash
# Gunicorn ile (production)
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Docker ile
docker build -t sidas-backend .
docker run -p 8000:8000 --env-file .env sidas-backend
```

## Katkıda Bulunma

Backend geliştirmesine katkıda bulunmak için:

1. Kod kalitesini koruyun
2. Type hints kullanın
3. Docstring ekleyin
4. Test yazın
5. Loglama ekleyin

## Lisans

Bu proje sosyal fayda amacıyla geliştirilmiştir.

---

**Ana README**: [Proje Ana Sayfası](../README.md)
