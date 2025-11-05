import os
import requests
from dotenv import load_dotenv

# --- .env dosyasını yükle ---
load_dotenv()
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

if not GOOGLE_MAPS_API_KEY:
    print(" GOOGLE_MAPS_API_KEY bulunamadı!")
    exit()

# Test için örnek sorgu: Ankara ŞÖNİM merkezi
query = "Ankara şönim merkezi"
url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
params = {
    "query": query,
    "key": GOOGLE_MAPS_API_KEY
}

response = requests.get(url, params=params)
data = response.json()

if response.status_code != 200:
    print(f" HTTP Hatası: {response.status_code}")
elif "error_message" in data:
    print(f" API Hatası: {data['error_message']}")
elif "results" in data and data["results"]:
    first = data["results"][0]
    name = first.get("name", "Bilinmeyen")
    address = first.get("formatted_address", "Adres yok")
    loc = first.get("geometry", {}).get("location", {})
    print(" API başarılı!")
    print(f"Yer adı: {name}")
    print(f"Adres: {address}")
    print(f"Koordinatlar: {loc.get('lat')}, {loc.get('lng')}")
else:
    print(" Sonuç bulunamadı.")
