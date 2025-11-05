import os
import re
import requests
from dotenv import load_dotenv
import unicodedata

# --- API key yükleme ---
load_dotenv()
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# Şehir tespiti fonksiyonu
def detect_city(text: str):
    # normalize to lowercase and fold Turkish characters to ASCII for more robust matching
    raw = text.lower()
    def _fold(s: str):
        replacements = {
            'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
            'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c'
        }
        for k, v in replacements.items():
            s = s.replace(k, v)
        s = unicodedata.normalize('NFKD', s)
        s = ''.join(c for c in s if not unicodedata.combining(c))
        return s

    text_folded = _fold(raw)
    cities = [
        "adana","adiyaman","afyon","ağrı","amasya","ankara","antalya","artvin","aydın",
        "balıkesir","bilecik","bingöl","bitlis","bolu","burdur","bursa","çanakkale",
        "çankırı","çorum","denizli","diyarbakır","edirne","elazığ","erzincan","erzurum",
        "eskişehir","gaziantep","giresun","gümüşhane","hakkari","hatay","ısparta",
        "mersin","istanbul","izmir","kars","kastamonu","kayseri","kırklareli",
        "kırşehir","kocaeli","konya","kütahya","malatya","manisa","kahramanmaraş",
        "mardin","muğla","muş","nevşehir","niğde","ordu","rize","sakarya","samsun",
        "siirt","sinop","sivas","tekirdağ","tokat","trabzon","tunceli","şanlıurfa",
        "uşak","van","yozgat","zonguldak","aksaray","bayburt","karaman","kırıkkale",
        "batman","şırnak","bartın","ardahan","ığdır","yalova","karabük","kilis",
        "osmaniye","düzce"
    ]
    for city in cities:

        if _fold(city) in text_folded:
            return city
    return None


# Yer türü tespiti fonksiyonu
def extract_place_type(text: str):
    text = text.lower()
    place_keywords = {
        "şönim": "şönim merkezi",
        "sönim": "şönim merkezi",
        "karakol": "polis merkezi",
        "polis": "polis merkezi",
        "hastane": "hastane",
        "sağlık": "sağlık merkezi",
        "konukevi": "kadın konukevi",
        "sığınma": "kadın sığınma evi",
        "baro": "baro merkezi",
        "adliye": "adliye",
        "shelter": "kadın sığınma evi",
        "center": "kadın destek merkezi",
    }
    for key, value in place_keywords.items():
        if key in text:
            return value
    return "kadın destek merkezi"


# Ana find_place fonksiyonu
def find_place(query_text, user_loc=None, city=None, max_results=3):
    """
    Kullanıcının mesajından şehir, yer türü ve konum bilgisine göre
    Google Maps üzerinden adres veya kurum araması yapar.
    """
    if not GOOGLE_MAPS_API_KEY:
        return "Google Maps API anahtarı eksik."

    #  Şehir tespiti gerekirse
    if city is None:
        city = detect_city(query_text)

    #  Yer türünü bul
    place_type = extract_place_type(query_text)

    print(f"[Şehir tespit edildi]: {city}")
    print(f"[📍 Yer türü]: {place_type}")

    #  Şehir veya konum yoksa kullanıcıya uyarı ver
    if not city and not user_loc:
        return "Şehir adı ya da konum bilgisi gerekli. Lütfen birini belirtin."

    #  Arama sorgusu oluştur
    search_query = f"{city} {place_type}" if city else place_type
    print(f"[Arama sorgusu]: {search_query}")

    #  Google Maps Places API isteği
    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": search_query,
        "key": GOOGLE_MAPS_API_KEY,
        "language": "tr",
    }

    #  Eğer kullanıcı konumu varsa, yakınlık öncelikli arama
    if user_loc:
        params["location"] = f"{user_loc[0]},{user_loc[1]}"
        params["radius"] = 5000  # 5 km yarıçap
        print(f"[📍 Konum temelli arama]: {params['location']} (5 km yarıçap)")

    try:
        res = requests.get(base_url, params=params, timeout=10)
        data = res.json()

        results = data.get("results", [])
        if (data.get("status") != "OK" or not results) and city:
            print(f"[ Google Maps TextSearch durum]: {data.get('status')} - fallback to nearby search")
            
            try:
                geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
                gres = requests.get(geocode_url, params={"address": city, "key": GOOGLE_MAPS_API_KEY, "language": "tr"}, timeout=10)
                gdata = gres.json()
                if gdata.get("status") == "OK" and gdata.get("results"):
                    city_loc = gdata["results"][0]["geometry"]["location"]
                   
                    nearby_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
                    nearby_params = {
                        "location": f"{city_loc.get('lat')},{city_loc.get('lng')}",
                        "radius": 20000,  # 20 km
                        "keyword": place_type,
                        "key": GOOGLE_MAPS_API_KEY,
                        "language": "tr"
                    }
                    nres = requests.get(nearby_url, params=nearby_params, timeout=10)
                    ndata = nres.json()
                    results = ndata.get("results", [])
                    print(f"[Nearby search results]: {len(results)}")
                else:
                    print(f"[Geocode durum]: {gdata.get('status')} - {gdata.get('error_message')}")
            except Exception as e:
                print(f"[Geocode/Nearby hata]: {e}")

        if not results:
            print(f"[ Google Maps Yanıtı]: {data.get('status')}")
            return f"{city or 'Konum'} yakınında {place_type} bulunamadı."

        out_list = []
        for place in results[:max_results]:
            name = place.get("name", "Bilinmeyen Yer")
            address = place.get("formatted_address", place.get('vicinity', 'Adres bilgisi yok'))
            loc = place.get("geometry", {}).get("location", {})
            maps_link = f"https://www.google.com/maps/search/?api=1&query={loc.get('lat')},{loc.get('lng')}"
            place_id = place.get("place_id")
            phone = None

    
            if place_id:
                try:
                    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
                    details_params = {
                        "place_id": place_id,
                        "key": GOOGLE_MAPS_API_KEY,
                        "language": "tr",
                        "fields": "formatted_phone_number,formatted_address,website,name,geometry"
                    }
                    dres = requests.get(details_url, params=details_params, timeout=10)
                    ddata = dres.json()
                    if ddata.get("status") == "OK":
                        result = ddata.get("result", {})
                        phone = result.get("formatted_phone_number")
                        address = result.get("formatted_address", address)
                        geom = result.get("geometry", {}).get("location")
                        if geom:
                            loc = geom
                            maps_link = f"https://www.google.com/maps/search/?api=1&query={loc.get('lat')},{loc.get('lng')}"
                    else:
                        print(f"[Place Details durum]: {ddata.get('status')} - {ddata.get('error_message')}")
                except Exception as e:
                    print(f"[Place Details hatası]: {e}")

            entry = {
                "name": name,
                "address": address,
                "maps_link": maps_link,
                "lat": loc.get('lat'),
                "lng": loc.get('lng'),
                "place_id": place_id
            }
            if phone:
                entry["phone"] = phone

    
            if (not entry.get('lat') or not entry.get('lng')) and place_id:
                try:
                    entry['maps_link'] = f"https://www.google.com/maps/place/?q=place_id:{place_id}"
                except Exception:
                    pass

            out_list.append(entry)
        return out_list[0] if max_results == 1 and len(out_list) == 1 else out_list
    except Exception as e:
        print(f"[find_place hata]: {e}")
        return f"Harita araması sırasında hata oluştu: {str(e)}"


def geocode_address(address: str):
    """Geocode an arbitrary address string and return lat/lng and a maps link or None."""
    if not address or not GOOGLE_MAPS_API_KEY:
        return None

    try:
        geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
        res = requests.get(geocode_url, params={"address": address, "key": GOOGLE_MAPS_API_KEY, "language": "tr"}, timeout=10)
        data = res.json()
        if data.get("status") == "OK" and data.get("results"):
            loc = data["results"][0]["geometry"]["location"]
            lat = loc.get("lat")
            lng = loc.get("lng")
            maps_link = f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"
            return {"lat": lat, "lng": lng, "maps_link": maps_link, "formatted_address": data["results"][0].get("formatted_address")}
        return None
    except Exception as e:
        print(f"[geocode_address hata]: {e}")
        return None
