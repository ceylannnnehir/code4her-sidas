from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from scr.gemini_rag import rag, memory
from scr.find_place import find_place, geocode_address  
import re


app = FastAPI(title="SIDAS Chatbot API")

# CORS Ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# CORS ayarları şu an geliştirme amaçlı olarak tüm origin'lere izin veriyor.
# Prod ortamında `allow_origins` daha kısıtlı tutulmalıdır 
class Location(BaseModel):
    latitude: float
    longitude: float

class ChatRequest(BaseModel):
    question: str
    location: Location | None = None


# question Kullanıcının sorduğu metin.
# location (opsiyonel) latitude/longitude bilgisini içeren nesne.

# Test endpoint
@app.get("/")
def root():
    return {"message": "SIDAS API çalışıyor ", "status": "ok"}

# Chat endpoint
@app.post("/chat")
def chat(req: ChatRequest):
    try:
        print(f"[Soru alındı]: {req.question}")
        q = req.question.lower()

        # --- Yer ve konum kelimeleri kontrolü ---
        place_types = [
            "karakol", "polis", "şönim", "sönim", "sonim", "hastane",
            "sığınma", "siginma", "konukevi", "shelter", "sağlık", "saglik",
            "violence", "center", "acil", "yardım", "yardim"
        ]
        location_keywords = ["adres", "nerede", "yakın", "yakin", "yakınımda", "yakinimda", "konum", "nereye", "harita", "göster", "goster"]
        nearby_keywords = ["yakınımda", "yakinimda", "yakın", "yakin", "civarda"]  # Kesinlikle konum kullanılması gereken kelimeler
        info_question_keywords = ["nedir", "ne demek", "nedemek", "nasıl", "nasil", "kimler", "kimdir", "hangi", "hangisi"]  # Tanım/bilgi soruları

        # Şehir listesi tanımı (hem Türkçe karakterli hem de karaktersiz)
        city_list = [
                "adana","adiyaman","afyon","ağrı","agri","amasya","ankara","antalya","artvin","aydın","aydin",
                "balıkesir","balikesir","bilecik","bingöl","bingol","bitlis","bolu","burdur","bursa",
                "çanakkale","canakkale","çankırı","cankiri","çorum","corum","denizli","diyarbakır","diyarbakir",
                "edirne","elazığ","elazig","erzincan","erzurum","eskişehir","eskisehir","gaziantep",
                "giresun","gümüşhane","gumushane","hakkari","hatay","ısparta","isparta",
                "mersin","istanbul","İstanbul","izmir","İzmir","kars","kastamonu","kayseri","kırklareli","kirklareli",
                "kırşehir","kirsehir","kocaeli","konya","kütahya","kutahya","malatya","manisa","kahramanmaraş","kahramanmaras",
                "mardin","muğla","mugla","muş","mus","nevşehir","nevsehir","niğde","nigde","ordu","rize","sakarya","samsun",
                "siirt","sinop","sivas","tekirdağ","tekirdag","tokat","trabzon","tunceli","şanlıurfa","sanliurfa",
                "uşak","usak","van","yozgat","zonguldak","aksaray","bayburt","karaman","kırıkkale","kirikkale",
                "batman","şırnak","sirnak","bartın","bartin","ardahan","ığdır","igdir","yalova","karabük","karabuk",
                "kilis","osmaniye","düzce","duzce"
            ]

        # - Eğer sorguda hem bir yer türü (ör. 'karakol') hem de konum/adres ilgisi varsa, uygulama harita araması yapar.
        # - Harita araması için önce 'yakınımda' gibi kesin konum isteyen kelimeler kontroledilir; sonra city (şehir) tespiti, en son istemciden gelen konum kullanılır.
        is_info_question = any(iq in q for iq in info_question_keywords)

        # Yer türü + (şehir VEYA konum kelimesi) varsa ara
        has_place_type = any(pt in q for pt in place_types)
        has_location_keyword = any(lk in q for lk in location_keywords)
        wants_nearby = any(nk in q for nk in nearby_keywords)  # "yakınımda" gibi kelimeler

       #Şehir tespiti
        city_match = None
        for city in city_list:
            if city in q or f"{city}de" in q or f"{city}da" in q or f"{city}deyim" in q or f"{city}dayim" in q:
                city_match = city
                break
        has_city = city_match is not None

        # Memory'den şehir bilgisi çek 
        if not city_match and memory.memory:
            for past_msg in reversed(list(memory.memory)):
                past_question = past_msg.get('soru', '').lower()
                for city in city_list:
                   
                    if city in past_question or f"{city}de" in past_question or f"{city}da" in past_question:
                        city_match = city
                        has_city = True
                        print(f"[ Memory'den şehir bulundu]: {city_match} ('{past_question}' içinde)")
                        break
                if city_match:
                    break

     
        # Bilgi sorusu DEĞİLSE ve (yer türü + şehir/konum kelimesi varsa)
        if not is_info_question and has_place_type and (has_city or has_location_keyword):

            # ÖNCELİK: yakınımda dedi VE konum varsa Konum kullan
            if wants_nearby and req.location:
                user_loc = (req.location.latitude, req.location.longitude)
                print(f"[📍 'Yakınımda' dedi - Kullanıcı konumu kullanılıyor]: {user_loc}")
                place_result = find_place(req.question, user_loc=user_loc)

            # Şehir adı varsa (sorguda veya memory'de) Şehir kullan
            elif city_match:
                print(f"[Şehir kullanılıyor]: {city_match}")
                place_result = find_place(req.question, city=city_match)

            # Sadece nerede dedi, konum varsa kullan
            elif req.location:
                user_loc = (req.location.latitude, req.location.longitude)
                print(f"[Fallback - Konum kullanılıyor]: {user_loc}")
                place_result = find_place(req.question, user_loc=user_loc)

            # Hiçbiri yoksa hata
            else:
                place_result = "Lütfen bir şehir adı belirtin veya konum izni verin."

            print(f"[ Harita Yanıtı]: {place_result}")

        
            # kullanıcıyla devam eden sohbette önceki yer sorguları referans alınabilsin.
            try:
                if isinstance(place_result, dict):
                    summary = f"{place_result.get('name', '')} - {place_result.get('address', '')}"
                else:
                    summary = str(place_result)
                # Kısa tutarak bellek yapısına ekle
                memory.add(req.question, summary)
            except Exception as e:
                print(f"[Memory ekleme hatası]: {e}")

            # Frontend'in metin kutusunda gösterilecek okunabilir metin oluştur
            #  Harita linkleri artık metin içine gömülmüyor, `place` veya `places` objesi
            # içinde `maps_link` alanı ile birlikte döndürülür. Böylece istemci buton veya link yapısıyla haritayı açabilir; plain text içinde URL çıkmasını
            try:
               
                if isinstance(place_result, dict):
                    parts = []
                    if place_result.get('name'):
                        # Başlık olarak nokta/isim göster
                        parts.append(f"📍 {place_result.get('name')}")
                    if place_result.get('address'):
                        parts.append(f"Adres: {place_result.get('address')}")
                    if place_result.get('phone'):
                        parts.append(f"Telefon: {place_result.get('phone')}")
                    # Link artık text'te değil, sadece place objesiyle gönderilecek

                    response_text = "\n".join(parts) if parts else str(place_result)
                    return {"answer": response_text, "sources": "Google Maps", "place": place_result}

                # If a list of places, format each with numbering
                if isinstance(place_result, list):
                    blocks = []
                    for i, p in enumerate(place_result, start=1):
                        sub = []
                        name = p.get('name') or ''
                        addr = p.get('address') or ''
                        phone = p.get('phone') or ''

                        if name:
                            sub.append(f"{i}. 📍 {name}")
                        if addr:
                            sub.append(f"   Adres: {addr}")
                        if phone:
                            sub.append(f"   Telefon: {phone}")
                        # Link artık text'te değil, her place objesiyle gönderilecek

                        blocks.append("\n".join(sub))

                    response_text = "\n\n".join(blocks) if blocks else str(place_result)
                    return {"answer": response_text, "sources": "Google Maps", "places": place_result}

                # Fallback
                return {"answer": str(place_result), "sources": "Google Maps"}
            except Exception as e:
                print(f"[Place response format hatası]: {e}")
                return {"answer": str(place_result), "sources": "Google Maps"}

        # --- RAG cevabı ---
        # Eğer sorgu harita/yer modu dışında kaldıysa, RAG pipeline çalıştırılır.
        answer = rag(req.question, verbose=False)
        if not answer or "cevap" not in answer:
            raise ValueError("Modelden geçerli yanıt alınamadı.")

        cevap_text = answer.get("cevap", "Cevap üretilemedi.")

        # RAG cevabından adres benzeri bir ifade tespit edilmeye çalışılırsa geocode_address çağrılarak harita bağlantısı ve koordinatlar eklenir.
        try:
            address_candidate = None
            m = re.search(r'Adres[:\s]*([^\n]+)', cevap_text, flags=re.IGNORECASE)
            if m:
                address_candidate = m.group(1).strip()
            else:
                city_list = [
                    "adana","adiyaman","afyon","ağrı","amasya","ankara","antalya","artvin","aydın",
                    "balıkesir","bilecik","bingöl","bitlis","bolu","burdur","bursa","çanakkale",
                    "çankırı","çorum","denizli","diyarbakır","edirne","elazığ","erzincan","erzurum",
                    "eskişehir","gaziantep","giresun","gümüşhane","hakkari","hatay","ısparta",
                    "mersin","istanbul","izmir","kars","kastamonu","kayseri","kırklareli",
                    "kırşehir","kocaeli","konya","kütahya","malatya","manisa","kahramanmaraş",
                    "mardin","muğla","muş","nevşehir","niğde","ordu","rize","sakarya","samsun",
                    "siirt","sinop","sivas","tekirdağ","tokat","trabzon","tunceli","şanlıurfa",
                    "uşak","van","yozgat","zonguldak"
                ]
                low = cevap_text.lower()
                if any(c in low for c in city_list):
                    address_candidate = cevap_text

            if address_candidate:
                geo = geocode_address(address_candidate)
                if geo:
                    if geo.get('maps_link') and geo.get('maps_link') not in cevap_text:
                        cevap_text = cevap_text + "\n\nHarita: " + geo.get('maps_link')

                    if geo.get('formatted_address') and geo.get('formatted_address') not in cevap_text:
                        cevap_text = cevap_text + "\nAdres (geocode): " + geo.get('formatted_address')

                    # `extra` alanı içinde harita linki ve koordinatlar döndürülür. İstemci bu alanı kullanarak haritayı açabilir veya işleyebilir.
                    extra = {"maps_link": geo.get('maps_link'), "lat": geo.get('lat'), "lng": geo.get('lng')}
                else:
                    extra = None
            else:
                extra = None
        except Exception as e:
            print(f"[Geocode ekleme hatası]: {e}")
            extra = None

        print(f"[ RAG Yanıtı]: {cevap_text}")
        resp = {"answer": cevap_text, "sources": answer.get("kaynak", "SIDAS RAG")}
        if extra:
            resp.update(extra)
        return resp

    except Exception as e:
        print(f"[ Hata]: {e}")
        raise HTTPException(status_code=500, detail=f"Hata: {str(e)}")
