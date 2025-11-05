import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { theme, spacing } from '../config/theme';

const evidenceItems = [
  {
    title: 'Mesajlar ve E-postalar',
    description: 'Tehdit, hakaret veya taciz içeren tüm yazılı iletişimleri (SMS, WhatsApp, sosyal medya mesajları, e-postalar) silmeyin. Ekran görüntülerini alın.',
    icon: 'message-text',
  },
  {
    title: 'Fotoğraflar ve Ekran Görüntüleri',
    description: 'Fiziksel şiddet sonucu oluşan yaralanmaları, zarar verilen eşyaları veya ısrarlı takibe dair kanıtları (örneğin, sürekli aynı yerde beliren bir araba) fotoğraflayın.',
    icon: 'camera',
  },
  {
    title: 'Ses Kayıtları',
    description: 'Tehdit veya hakaret içeren telefon görüşmelerini veya ortam konuşmalarını, yasal koşulları göz önünde bulundurarak kaydetmek önemli bir delil olabilir. (Not: Gizli ses kaydının yasal durumu karmaşık olabilir, bir avukata danışın.)',
    icon: 'microphone',
  },
  {
    title: 'Video Kayıtları',
    description: 'Şiddet veya taciz anlarını videoya kaydetmek, olayın ciddiyetini göstermek için güçlü bir kanıttır. Güvenlik kamerası kayıtları da talep edilebilir.',
    icon: 'video',
  },
];

export default function EvidenceChecklistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Kanıt Toplama Rehberi</Text>
          <Text style={styles.subtitle}>
            Hukuki süreçte size yardımcı olabilecek delilleri nasıl toplayacağınızı öğrenin.
          </Text>
        </View>
        <View style={styles.content}>
          {evidenceItems.map((item, index) => (
            <Card key={index} style={styles.card}>
              <View style={styles.cardIcon}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={32}
                  color={theme.light.primary}
                />
              </View>
              <CardHeader style={styles.cardHeader}>
                <CardTitle style={styles.cardTitle}>{item.title}</CardTitle>
              </CardHeader>
              <View style={styles.cardContent}>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </Card>
          ))}
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
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.light.foreground,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.light.mutedForeground,
    lineHeight: 22,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  cardIcon: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    padding: 0,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContent: {
    paddingTop: spacing.sm,
  },
  description: {
    fontSize: 15,
    color: theme.light.mutedForeground,
    lineHeight: 22,
  },
});
