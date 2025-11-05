import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Linking, Alert, Share, Platform } from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import { theme, spacing } from '../config/theme';

export default function EmergencyScreen() {
  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Hata', 'Arama yapılamadı');
    });
  };

  const handleOpenKades = () => {
    // KADES uygulamasını açmaya çalış
    const kadesUrl = Platform.select({
      ios: 'kades://',
      android: 'intent://kades#Intent;scheme=kades;package=tr.gov.egm.kades;end',
    });

    Linking.canOpenURL(kadesUrl).then(supported => {
      if (supported) {
        Linking.openURL(kadesUrl);
      } else {
        Alert.alert(
          'KADES Yüklü Değil',
          'KADES uygulamasını uygulama mağazasından indirmeniz gerekiyor.',
          [
            { text: 'İptal', style: 'cancel' },
            {
              text: 'İndir',
              onPress: () => {
                const storeUrl = Platform.select({
                  ios: 'https://apps.apple.com/tr/app/kades/id1360309770',
                  android: 'https://play.google.com/store/apps/details?id=tr.gov.egm.kades',
                });
                Linking.openURL(storeUrl);
              },
            },
          ]
        );
      }
    });
  };

  const handleSendLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web için navigator.geolocation kullan
        if (!navigator.geolocation) {
          Alert.alert(
            'Konum Desteklenmiyor',
            'Tarayıcınız konum servislerini desteklemiyor.'
          );
          return;
        }

        Alert.alert('Konum Alınıyor', 'Lütfen bekleyin...');

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            const message = `Yardıma ihtiyacım var! Konumum: ${locationUrl}`;

            if (navigator.share) {
              navigator.share({
                title: 'Acil Yardım İsteği',
                text: message,
              }).catch((error) => {
                console.log('Error sharing', error);
                // Fallback: Panoya kopyala
                navigator.clipboard.writeText(message).then(() => {
                  Alert.alert('Konum Kopyalandı', 'Mesaj ve konumunuz panoya kopyalandı.');
                });
              });
            } else {
              // Fallback: Panoya kopyala
              navigator.clipboard.writeText(message).then(() => {
                Alert.alert('Konum Kopyalandı', 'Mesaj ve konumunuz panoya kopyalandı. Güvendiğiniz kişiye yapıştırıp gönderin.');
              }).catch(() => {
                Alert.alert('İşlem Başarısız', 'Konum kopyalanamadı.');
              });
            }
          },
          (error) => {
            console.error('Geolocation error', error);
            let description = 'Lütfen tarayıcı ayarlarından konum izinlerinizi kontrol edin.';
            if (error.code === error.PERMISSION_DENIED) {
              description = 'Konum izni reddedildi. Lütfen site ayarlarından izin verin.';
            }
            Alert.alert('Konum Alınamadı', description);
          }
        );
      } else {
        // Mobil için expo-location kullan
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Konum İzni Gerekli',
            'Konumunuzu paylaşabilmek için konum izni vermeniz gerekiyor.'
          );
          return;
        }

        Alert.alert('Konum Alınıyor', 'Lütfen bekleyin...');
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = location.coords;
        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const message = `Yardıma ihtiyacım var! Konumum: ${locationUrl}`;

        await Share.share({
          message: message,
          title: 'Acil Yardım İsteği',
        });
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Konum Alınamadı',
        'Konumunuz alınamadı. Lütfen konum servislerinizin açık olduğundan emin olun.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HEMEN HAREKETE GEÇ</Text>
        <View style={styles.buttonContainer}>
          <Button
            variant="destructive"
            size="lg"
            onPress={() => handleCall('112')}
            style={styles.emergencyButton}
            textStyle={styles.buttonText}
          >
            <MaterialCommunityIcons name="phone" size={32} color="white" />
            {'\n'}112 ACİL'İ ARA
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onPress={handleOpenKades}
            style={styles.emergencyButton}
            textStyle={styles.buttonText}
          >
            <MaterialCommunityIcons name="shield-alert" size={32} color="white" />
            {'\n'}KADES'İ AÇ
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onPress={handleSendLocation}
            style={styles.emergencyButton}
            textStyle={styles.buttonText}
          >
            <MaterialCommunityIcons name="map-marker" size={32} color="white" />
            {'\n'}GÜVENDİĞİM KİŞİYE KONUM GÖNDER
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF2F2',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
    color: '#B91C1C',
  },
  buttonContainer: {
    gap: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  emergencyButton: {
    height: 112,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helplineButton: {
    height: 80,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  helplineButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B91C1C',
  },
});
