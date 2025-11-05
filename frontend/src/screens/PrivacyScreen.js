import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme, spacing } from '../config/theme';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Gizlilik Politikası</Text>

          <Text style={styles.sectionTitle}>Veri Toplama</Text>
          <Text style={styles.text}>
            ŞİDAS uygulaması, kullanıcıların kişisel güvenliğini en üst düzeyde tutmayı hedefler. Bu doğrultuda, uygulama içinde paylaştığınız konum bilgisi gibi hassas veriler sunucularımızda saklanmaz. Konum paylaşma özelliği, yalnızca sizin tarafınızdan başlatıldığında ve sizin seçtiğiniz kişilerle, cihazınızın standart paylaşım menüsü aracılığıyla anlık olarak paylaşılır.
          </Text>

          <Text style={styles.sectionTitle}>Yapay Zeka Asistanı</Text>
          <Text style={styles.text}>
            "Haklarım Neler?" bölümünde sorduğunuz sorular, size daha iyi yanıtlar sunabilmek amacıyla anonim olarak işlenebilir. Bu sorular, kişisel kimliğinizle ilişkilendirilmez ve yalnızca hizmet kalitesini artırmak için kullanılır.
          </Text>

          <Text style={styles.sectionTitle}>Çerezler ve Üçüncü Taraf Servisler</Text>
          <Text style={styles.text}>
            Uygulamanın temel işlevselliği için gerekli olan minimum düzeyde çerezler kullanılabilir. Harita özelliği gibi üçüncü taraf servisler (Google Maps), kendi gizlilik politikalarına tabidir.
          </Text>

          <Text style={styles.sectionTitle}>Veri Güvenliği</Text>
          <Text style={styles.text}>
            Uygulama, herhangi bir kullanıcı hesabı veya giriş sistemi gerektirmez. Bu sayede, kişisel verilerinizin toplanma riskini en aza indiririz.
          </Text>

          <Text style={[styles.text, styles.footnote]}>
            Bu politika zamanla güncellenebilir.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.light.foreground,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.light.foreground,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: 16,
    color: theme.light.foreground,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  footnote: {
    marginTop: spacing.xl,
    color: theme.light.mutedForeground,
    fontStyle: 'italic',
  },
});
