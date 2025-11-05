import React, { useEffect } from 'react'; 
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/common/Logo';
import { theme, spacing } from '../config/theme';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Triage');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Anında Güvenlik ve Destek</Text>
        {/* ⚠️ Yasal uyarı metni buraya eklendi */}
        <Text style={styles.warningText}>
          ⚠️ Bu uygulama yalnızca bilgilendirme amaçlıdır, yasal tavsiye vermez.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.light.mutedForeground,
  },
  warningText: {
    fontSize: 12,
    color: theme.light.mutedForeground,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
