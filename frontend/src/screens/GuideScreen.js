import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme, spacing } from '../config/theme';

const guides = {
  'Fiziksel Şiddet': [
    'Öncelikle güvende olduğunuzdan emin olun.',
    'Tıbbi yardıma ihtiyacınız varsa 112\'yi arayın.',
    'Durumu güvenilir birine anlatın.',
    'Darp raporu almak için en yakın sağlık kuruluşuna başvurun.',
    'En yakın karakola veya savcılığa şikayette bulunun.',
    'Baroların adli yardım bürolarından ücretsiz avukat talep edebilirsiniz.',
  ],
  'Dijital Taciz': [
    'Taciz içeren mesajları, e-postaları veya yorumları silmeyin, ekran görüntüsü alın.',
    'Tacizcinin profilini ve paylaşımlarını belgeleyin.',
    'Tacizciyi engelleyin ve ilgili platforma şikayet edin.',
    'Durumu güvendiğiniz birine anlatın.',
    'Topladığınız kanıtlarla birlikte savcılığa suç duyurusunda bulunun.',
  ],
  'Israrlı Takip': [
    'Takip edildiğinizi fark ettiğinizde halka açık, kalabalık bir yere gidin.',
    'Yaşadığınız olayları (tarih, saat, yer, davranışlar) not alın.',
    'Mümkünse, sizi takip eden kişinin fotoğrafını veya videosunu çekin.',
    'Güvendiğiniz kişileri ve ailenizi durumdan haberdar edin.',
    'Kanıtlarınızla birlikte en yakın karakola gidin ve şikayetçi olun.',
  ],
  'Psikolojik Şiddet': [
    'Yaşadıklarınızın psikolojik şiddet olduğunu kabul etmek ilk adımdır.',
    'Güvendiğiniz bir arkadaşınızla veya aile üyenizle konuşun.',
    'Bir terapist veya psikologdan profesyonel destek almayı düşünün.',
    'ALO 183 Sosyal Destek Hattı\'nı arayabilirsiniz.',
    'Şiddetin kanıtlarını (mesajlar, e-postalar) belgelemeye çalışın.',
  ],
};

function AccordionItem({ title, steps, isExpanded, onPress }) {
  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onPress}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <MaterialCommunityIcons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={theme.light.primary}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.accordionContent}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function GuideScreen() {
  const [expandedItem, setExpandedItem] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Adım Adım Yol Gösterici</Text>
          <Text style={styles.subtitle}>
            Yaşadığınız durumu en iyi hangisi tanımlıyor?
          </Text>
        </View>
        <View style={styles.content}>
          {Object.entries(guides).map(([title, steps]) => (
            <AccordionItem
              key={title}
              title={title}
              steps={steps}
              isExpanded={expandedItem === title}
              onPress={() => setExpandedItem(expandedItem === title ? null : title)}
            />
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
  accordionItem: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.light.border,
    borderRadius: 8,
    backgroundColor: theme.light.card,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.light.foreground,
    flex: 1,
  },
  accordionContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  bullet: {
    fontSize: 20,
    color: theme.light.primary,
    marginRight: spacing.sm,
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: theme.light.foreground,
    lineHeight: 24,
  },
});
