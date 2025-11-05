# SIDAS Frontend - React Native (Expo)

SIDAS mobil uygulaması, Expo framework'ü kullanılarak geliştirilmiş modern bir React Native uygulamasıdır. Kadına yönelik şiddet konusunda kullanıcı dostu bir arayüz ve güçlü özellikler sunar.

## İçindekiler
- [Özellikler](#özellikler)
- [Teknoloji Yığını](#teknoloji-yığını)
- [Kurulum](#kurulum)
- [Yapılandırma](#yapılandırma)
- [Proje Yapısı](#proje-yapısı)
- [Ekranlar](#ekranlar)
- [API Entegrasyonu](#api-entegrasyonu)
- [Geliştirme](#geliştirme)

## Özellikler

### 🚨 Acil Durum Yönetimi
- **Güvenlik Durumu Değerlendirmesi (Triage)**: Kullanıcıyı durumuna göre yönlendirme
- **Tek Dokunuşla Arama**: 112, 155, 183 acil hatlara hızlı erişim
- **KADES Entegrasyonu**: iOS ve Android'de KADES uygulamasını açma
- **Konum Paylaşımı**: Web ve mobil platformlarda konum paylaşma
- **Anlık Bildirim**: Güvenilir kişiye otomatik konum gönderme

### 📱 Ana Özellikler
- **AI Sohbet Asistanı**: Backend RAG sistemi ile entegre akıllı chatbot
- **Harita ve Konum Servisleri**: React Native Maps ile destek merkezlerini bulma
- **Adım Adım Rehber**: 4 farklı şiddet türü için detaylı rehberlik (accordion yapısı)
- **Delil Kontrol Listesi**: Şiddet vakalarında delil toplama rehberi (4 kategori)
- **Gizlilik Politikası**: Detaylı veri koruma bilgilendirmesi

### ✅ Teknik Özellikler
- **Modern UI**: React Native Paper ile Material Design
- **Stack Navigation**: React Navigation ile profesyonel sayfa yönlendirmesi
- **Backend Entegrasyonu**: FastAPI backend ile gerçek zamanlı veri
- **Offline Destek**: AsyncStorage ile yerel veri saklama
- **Platform Spesifik**: iOS, Android ve Web için optimize edilmiş kod
- **Form Validasyonu**: React Hook Form + Zod ile güçlü form yönetimi

## Teknoloji Yığını

### Core
- **React Native**: v0.81.5
- **React**: v19.1.0
- **Expo**: SDK 54

### Navigasyon
- **@react-navigation/native**: v7.1.18
- **@react-navigation/native-stack**: v7.3.27
- **@react-navigation/bottom-tabs**: v7.4.8

### UI ve Stil
- **react-native-paper**: v5.14.5 (Material Design)
- **@expo/vector-icons**: v15.0.3
- **react-native-safe-area-context**: v5.6.0

### Harita ve Konum
- **react-native-maps**: v1.20.1
- **expo-location**: v19.0.7

### Form ve Validasyon
- **react-hook-form**: v7.65.0
- **@hookform/resolvers**: v5.2.2
- **zod**: v3.25.76

### Depolama ve State
- **@react-native-async-storage/async-storage**: v2.2.0

### AI ve API
- **@google/generative-ai**: v0.24.1

### Kimlik Doğrulama
- **firebase**: v12.4.0

### Geliştirme
- **TypeScript**: v5.9.2 (Opsiyonel)
- **@types/react**: v19.1.0

## Kurulum

### Gereksinimler
- Node.js 16 veya üzeri
- npm veya yarn
- Expo CLI
- iOS: Xcode (Mac için) veya Expo Go uygulaması
- Android: Android Studio veya Expo Go uygulaması

### Adım 1: Bağımlılıkları Yükleme

```bash
cd frontend
npm install
```

veya yarn kullanıyorsanız:
```bash
yarn install
```

### Adım 2: Expo CLI Kurulumu

```bash
npm install -g expo-cli
```

### Adım 3: Ortam Değişkenlerini Ayarlama

`.env` dosyasını proje ana dizininde (frontend değil, root) düzenleyin:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Not**: Gemini API Key almak için [Google AI Studio](https://makersuite.google.com/app/apikey) adresini ziyaret edin.

### Adım 4: Uygulamayı Başlatma

```bash
# Geliştirme sunucusunu başlat
npm start

# veya
expo start
```

### Platform Spesifik Başlatma

```bash
# iOS (Mac gerekli)
npm run ios

# Android
npm run android

# Web
npm run web
```

## Yapılandırma

### Backend API URL

Backend API URL'ini yapılandırmak için servis dosyalarınızı düzenleyin:

```javascript
// Örnek: src/services/chatService.js
const API_BASE_URL = __DEV__
  ? 'http://localhost:8000'  // Geliştirme
  : 'https://api.sidas.com'; // Üretim
```

### app.json

Expo yapılandırma dosyası temel ayarları içerir:

```json
{
  "expo": {
    "name": "SIDAS",
    "slug": "sidas",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android", "web"]
  }
}
```

## Proje Yapısı

```
src/
├── components/
│   ├── common/         # Ortak bileşenler (Logo, Footer)
│   └── ui/            # UI bileşenleri (Button, Card)
├── config/            # Yapılandırma dosyaları (theme, firebase)
├── navigation/        # React Navigation yapılandırması
├── screens/           # Uygulama ekranları
├── hooks/            # Custom hooks
├── services/         # API servisleri
├── types/            # TypeScript tipleri
└── utils/            # Yardımcı fonksiyonlar
```

## Ekranlar

### 1. WelcomeScreen (Hoş Geldiniz)
İlk açılış ekranı, uygulamayı tanıtır.

**Özellikler:**
- Uygulama tanıtımı
- "Başla" butonu ile ana ekrana geçiş
- Kullanıcı karşılama mesajı

### 2. TriageScreen (Güvenlik Değerlendirmesi)
Kullanıcının güvenlik durumunu değerlendirir.

**Özellikler:**
- Güvenlik durumu soruları
- Acil durum tespiti
- Uygun ekrana yönlendirme (Acil veya Ana Menü)

### 3. EmergencyScreen (Acil Durum)
Acil durumlarda hızlı erişim sağlar.

**Özellikler:**
- 112 (Acil Yardım), 155 (Polis), 183 (Şiddet Hattı) numaraları
- Tek dokunuşla arama
- KADES uygulamasını açma
- Konum paylaşımı

### 4. HomeScreen (Ana Ekran)
Uygulamanın merkezi, tüm özelliklere erişim.

**Özellikler:**
- AI Asistan'a hızlı erişim
- Harita görünümü
- Acil durum butonu
- Rehber ve diğer özelliklere navigasyon

### 5. AIAssistantScreen (AI Sohbet Asistanı)
Backend RAG sistemi ile entegre chatbot.

**Özellikler:**
- Gerçek zamanlı mesajlaşma
- Konum paylaşımı (opsiyonel)
- Harita entegrasyonu (yakın yerler için)
- Konuşma geçmişi
- Hızlı yanıt butonları

**API Entegrasyonu:**
```javascript
const response = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    question: userMessage,
    location: {
      latitude: 39.9334,
      longitude: 32.8597
    }
  })
});
```

### 6. SupportMapScreen (Destek Haritası)
Google Maps ile destek merkezlerini gösterir.

**Özellikler:**
- ŞÖNIM merkezleri
- Polis karakolları
- Hastaneler
- Kadın sığınma evleri
- Yol tarifi
- Telefon numarası ile arama

**Kullanım:**
```javascript
import MapView, { Marker } from 'react-native-maps';

<MapView
  initialRegion={{
    latitude: 39.9334,
    longitude: 32.8597,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  <Marker
    coordinate={{ latitude: 39.9334, longitude: 32.8597 }}
    title="Ankara ŞÖNIM"
    description="Mithatpaşa Cad. No:3"
  />
</MapView>
```

### 7. GuideScreen (Rehber)
Yasal haklar ve süreçler hakkında bilgi.

**Özellikler:**
- 6284 sayılı kanun bilgilendirmesi
- 4 farklı şiddet türü için rehber (accordion yapısı)
- Yasal süreçler
- Adım adım yönergeler

### 8. EvidenceChecklistScreen (Delil Kontrol Listesi)
Şiddet vakalarında delil toplama rehberi.

**Özellikler:**
- 4 kategori (mesajlar, fotoğraflar, ses kayıtları, videolar)
- Kontrol listesi formatı
- Delil saklama önerileri
- Yasal geçerlilik bilgilendirmesi

### 9. PrivacyScreen (Gizlilik)
Gizlilik ve güvenlik bilgileri.

**Özellikler:**
- Gizlilik politikası
- Veri saklama bilgileri
- Kullanıcı hakları
- İletişim bilgileri

## API Entegrasyonu

### Chat API Servisi

```javascript
// src/services/chatService.js
export const sendMessage = async (message, location = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: message,
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        } : null
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
};
```

### Konum Servisi

```javascript
// src/services/locationService.js
import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Konum izni verilmedi');
    }

    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    console.error('Location Error:', error);
    throw error;
  }
};
```

### AsyncStorage Kullanımı

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kaydet
await AsyncStorage.setItem('chatHistory', JSON.stringify(messages));

// Oku
const history = await AsyncStorage.getItem('chatHistory');
const messages = JSON.parse(history);

// Sil
await AsyncStorage.removeItem('chatHistory');
```

## Geliştirme

### Yeni Ekran Ekleme

1. `src/screens/` klasörüne yeni dosya oluşturun:
```javascript
// src/screens/NewScreen.js
import React from 'react';
import { View, Text } from 'react-native';

export default function NewScreen() {
  return (
    <View>
      <Text>Yeni Ekran</Text>
    </View>
  );
}
```

2. Navigator'a ekleyin:
```javascript
// src/navigation/AppNavigator.js
import NewScreen from '../screens/NewScreen';

<Stack.Screen name="New" component={NewScreen} />
```

### Form Validasyonu (Zod + React Hook Form)

```javascript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir email girin')
});

export default function FormScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Controller
      control={control}
      name="name"
      render={({ field: { onChange, value } }) => (
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="İsim"
        />
      )}
    />
  );
}
```

### Platform Spesifik Kodlar

```javascript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  }
});

// Platform select
const fontFamily = Platform.select({
  ios: 'Helvetica',
  android: 'Roboto',
  default: 'system'
});
```

## Performans Optimizasyonu

### FlatList Optimizasyonu
```javascript
<FlatList
  data={messages}
  renderItem={renderMessage}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
/>
```

### Memoization
```javascript
import { memo, useMemo, useCallback } from 'react';

const MessageItem = memo(({ message }) => {
  return <Text>{message.text}</Text>;
});

const messages = useMemo(() =>
  rawMessages.filter(m => m.visible),
  [rawMessages]
);

const handlePress = useCallback(() => {
  // ...
}, [dependencies]);
```

## Build ve Deployment

### Development Build

```bash
# Android
expo build:android

# iOS
expo build:ios
```

### EAS Build (Önerilen)

```bash
# EAS CLI kurulumu
npm install -g eas-cli

# Login
eas login

# Build
eas build --platform android
eas build --platform ios
```

### APK Export

```bash
expo build:android -t apk
```

## Sorun Giderme

### Metro Bundler hatası
```bash
# Cache temizle
expo start -c
```

### Node modules hatası
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### iOS build hatası
```bash
cd ios
pod install
cd ..
```

### Android build hatası
```bash
cd android
./gradlew clean
cd ..
```

## Güvenlik

- API anahtarlarını `.env` dosyasında saklayın
- Hassas verileri encrypt edin
- HTTPS kullanın
- SSL pinning uygulayın (üretim)
- Token yönetimi için güvenli depolama kullanın

## Yapılacaklar

### Tamamlananlar
- [x] AI asistanı (Google Gemini) entegrasyonu
- [x] React Native Maps entegrasyonu
- [x] KADES entegrasyonu (iOS/Android)
- [x] Konum paylaşma (Web + Mobil)
- [x] Adım adım rehber içeriği (4 kategori)
- [x] Delil toplama checklist'i (4 kategori)

### Devam Edenler
- [ ] Uygulama ikonları tasarımı ve entegrasyonu
- [ ] Firebase backend tam entegrasyonu
- [ ] Offline mod desteği
- [ ] Çoklu dil desteği
- [ ] Bildirim sistemi
- [ ] Panik butonu (gizli çıkış)
- [ ] Dark mode desteği

## Renk Paleti

```javascript
Primary: #7DD3FC      // Açık mavi - güven
Background: #F0F9FF   // Çok açık mavi
Foreground: #1A1F2C   // Koyu - metin
Accent: #D8B4E2       // Mor - vurgu
Destructive: #EF4444  // Kırmızı - acil durum
```

## Erişilebilirlik

```javascript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Mesaj gönder"
  accessibilityHint="Mesajınızı chatbot'a gönderir"
  accessibilityRole="button"
>
  <Text>Gönder</Text>
</TouchableOpacity>
```

## Katkıda Bulunma

Frontend geliştirmesine katkıda bulunmak için:

1. UI/UX standartlarını koruyun
2. Kod kalitesine dikkat edin
3. Bileşenleri yeniden kullanılabilir yapın
4. Erişilebilirlik özelliklerini ekleyin
5. Performans optimizasyonlarına dikkat edin

## Kaynaklar

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://reactnativepaper.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

## İletişim ve Destek

Acil durumlarda:
- **112**: Acil Çağrı Merkezi
- **155**: Polis İmdat
- **183**: ALO Sosyal Destek Hattı (7/24)
- **Kadın Danışma Hattı**: 0 312 656 92 95

## Lisans

Bu proje sosyal fayda amacıyla geliştirilmiştir.

---

**Not**: Bu uygulama gerçek acil durumlarda profesyonel yardım almanın yerini tutmaz. Her zaman yetkili mercilere başvurun.

**Ana README**: [Proje Ana Sayfası](../README.md)
**Backend README**: [Backend Dokümantasyonu](../backend/README.md)
