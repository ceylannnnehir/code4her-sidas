import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../../config/theme';

export default function Button({
  children,
  variant = 'default',
  size = 'default',
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'default'
              ? theme.light.primaryForeground
              : theme.light.primary
          }
        />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  // Variants
  default: {
    backgroundColor: theme.light.primary,
  },
  destructive: {
    backgroundColor: theme.light.destructive,
  },
  outline: {
    backgroundColor: theme.light.background,
    borderWidth: 1,
    borderColor: theme.light.border,
  },
  secondary: {
    backgroundColor: theme.light.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  size_default: {
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  size_sm: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  size_lg: {
    height: 44,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  // Text styles
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  text_default: {
    color: theme.light.primaryForeground,
  },
  text_destructive: {
    color: theme.light.destructiveForeground,
  },
  text_outline: {
    color: theme.light.foreground,
  },
  text_secondary: {
    color: theme.light.secondaryForeground,
  },
  text_ghost: {
    color: theme.light.foreground,
  },
  // Text sizes
  textSize_default: {
    fontSize: 14,
  },
  textSize_sm: {
    fontSize: 13,
  },
  textSize_lg: {
    fontSize: 16,
  },
  // Disabled
  disabled: {
    opacity: 0.5,
  },
  textDisabled: {
    opacity: 0.5,
  },
});
