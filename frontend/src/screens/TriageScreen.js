import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/ui/Button';
import { theme, spacing } from '../config/theme';

export default function TriageScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Şu An Güvende Misin?</Text>
        <View style={styles.buttonContainer}>
          <Button
            variant="destructive"
            size="lg"
            onPress={() => navigation.navigate('Emergency')}
            style={styles.dangerButton}
            textStyle={styles.buttonText}
          >
            HAYIR, TEHLİKEDEYİM
          </Button>
          <Button
            size="lg"
            onPress={() => navigation.navigate('Home')}
            style={styles.safeButton}
            textStyle={styles.buttonText}
          >
            EVET, GÜVENLİ BİR YERDEYİM
          </Button>
        </View>
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
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 64,
    color: theme.light.foreground,
  },
  buttonContainer: {
    gap: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  dangerButton: {
    width: 320,
    height: 160,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  safeButton: {
    width: 320,
    height: 160,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    backgroundColor: theme.light.primary,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
