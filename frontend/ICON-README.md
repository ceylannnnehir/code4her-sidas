# ŞİDAS Uygulama İkonları

## Gerekli İkon Dosyaları

ŞİDAS uygulaması için aşağıdaki ikon dosyalarının `assets` klasöründe olması gerekmektedir:

### 1. icon.png
- **Boyut**: 1024x1024 px
- **Açıklama**: Ana uygulama ikonu
- **Öneri**: Kalkan simgesi ile "ŞİDAS" yazısı kombinasyonu
- **Renk Şeması**:
  - Ana renk: #7DD3FC (Açık mavi)
  - Arka plan: #F0F9FF (Çok açık mavi)
  - Vurgu: #1A1F2C (Koyu)

### 2. splash-icon.png
- **Boyut**: En az 2048x2048 px (önerilen: 3000x3000 px)
- **Açıklama**: Uygulama açılış ekranı ikonu
- **Öneri**: icon.png'nin büyütülmüş hali

### 3. adaptive-icon.png (Android)
- **Boyut**: 1024x1024 px
- **Açıklama**: Android adaptive icon foreground layer
- **Not**: Arka plan rengi app.json'da #F0F9FF olarak ayarlandı

### 4. favicon.png (Web)
- **Boyut**: 48x48 px veya daha büyük
- **Açıklama**: Web versiyonu için favicon

## İkon Tasarım Önerileri

### Konsept
ŞİDAS (Şiddete Direkt Acil Sistem) için önerilen ikon konsepti:

1. **Ana Sembol**: Kalkan (güvenlik ve koruma)
2. **İkincil Öğe**: Destek eli veya kelebek (umut ve değişim)
3. **Tipografi**: Modern, güçlü font

### Renk Paleti
```
Primary: #7DD3FC (Açık mavi - güven ve huzur)
Background: #F0F9FF (Çok açık mavi)
Foreground: #1A1F2C (Koyu - profesyonellik)
Accent: #D8B4E2 (Mor - umut)
```

## İkon Oluşturma Araçları

### Online Araçlar
1. **Canva** (https://canva.com) - Ücretsiz, kullanımı kolay
2. **Figma** (https://figma.com) - Profesyonel tasarım aracı
3. **Adobe Express** - Hızlı ikon oluşturma

### İkon Generator Araçları
1. **App Icon Generator** (https://www.appicon.co/)
   - 1024x1024 ana dosyayı yükleyin
   - Tüm platformlar için otomatik boyutlandırma

2. **Expo Icon Generator**
   ```bash
   npx expo-optimize
   ```

## İkonları Projeye Ekleme

1. İkon dosyalarını `studio-mobile/assets/` klasörüne koyun
2. Dosya isimlerinin app.json ile eşleştiğinden emin olun:
   - `icon.png`
   - `splash-icon.png`
   - `adaptive-icon.png`
   - `favicon.png`

## Geçici Çözüm

Eğer henüz özel ikon tasarımınız yoksa, şimdilik aşağıdaki yöntemle placeholder ikon kullanabilirsiniz:

1. Expo'nun varsayılan ikonlarını kullanın
2. Online bir ikon oluşturucu ile basit bir tasarım yapın
3. Daha sonra profesyonel bir grafik tasarımcı ile özel logo çalışması yapabilirsiniz

## Logo Tasarım Brief

**Uygulama Adı**: ŞİDAS
**Tam Adı**: Şiddete Direkt Acil Sistem
**Amaç**: Şiddet mağdurlarına acil destek ve güvenlik sağlama
**Hedef Kitle**: Şiddet mağdurları (özellikle kadınlar)
**Duygu**: Güvenli, destekleyici, umut verici, profesyonel
**Stil**: Modern, minimal, net, erişilebilir

### Olması Gerekenler
- Güven veren
- Hızlıca tanınabilir
- Kolay hatırlanır
- Tüm platformlarda iyi görünür
- Küçük boyutlarda bile okunabilir

### Olmaması Gerekenler
- Korkutucu veya tehditkar
- Aşırı karmaşık
- Çocuksu
- Okunaklığı düşük
