import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, spacing } from '../../config/theme';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function CardHeader({ children, style }) {
  return <View style={[styles.cardHeader, style]}>{children}</View>;
}

export function CardTitle({ children, style }) {
  return <Text style={[styles.cardTitle, style]}>{children}</Text>;
}

export function CardDescription({ children, style }) {
  return <Text style={[styles.cardDescription, style]}>{children}</Text>;
}

export function CardContent({ children, style }) {
  return <View style={[styles.cardContent, style]}>{children}</View>;
}

export function CardFooter({ children, style }) {
  return <View style={[styles.cardFooter, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.light.border,
    backgroundColor: theme.light.card,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.light.cardForeground,
    lineHeight: 28,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.light.mutedForeground,
    lineHeight: 20,
  },
  cardContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 0,
  },
});
