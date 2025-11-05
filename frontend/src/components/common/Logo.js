import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '../../config/theme';

export default function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/shield-check.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Şİ<Text style={styles.titleAccent}>DAS</Text>
        </Text>
      </View>
      <Text style={styles.subtitle}>Şiddete Direkt Acil Sistem</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    tintColor: theme.light.primary,
  },
  textContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.light.foreground,
    letterSpacing: 2,
  },
  titleAccent: {
    color: theme.light.primary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.light.mutedForeground,
    marginTop: 12,
  },
});
