import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme, spacing } from '../config/theme';

const menuItems = [
    {
    title: 'Haklarım Neler? (AI Asistan)',
    screen: 'AIAssistant',
    icon: 'brain',
  },
  
  {
    title: 'Adım Adım Ne Yapmalıyım?',
    screen: 'Guide',
    icon: 'text-box-outline',
  },

  {
    title: 'Destek Noktaları Haritası',
    screen: 'SupportMap',
    icon: 'map-marker',
  },
  {
    title: 'Kanıtları Nasıl Toplarım?',
    screen: 'EvidenceChecklist',
    icon: 'file-check',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Hoş Geldin.</Text>
          <Text style={styles.subtitle}>
            Güvendesin ve yalnız değilsin. Sana nasıl yardımcı olabiliriz?
          </Text>
        </View>
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              onPress={() => navigation.navigate(item.screen)}
              style={styles.cardWrapper}
            >
              <Card style={styles.card}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={40}
                  color={theme.light.primary}
                  style={styles.icon}
                />
                <CardHeader style={styles.cardHeader}>
                  <CardTitle style={styles.cardTitle}>{item.title}</CardTitle>
                </CardHeader>
              </Card>
            </TouchableOpacity>
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
    paddingTop: spacing['2xl'],
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.light.foreground,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: theme.light.mutedForeground,
    lineHeight: 24,
  },
  grid: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  },
  card: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  icon: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    padding: 0,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
});
