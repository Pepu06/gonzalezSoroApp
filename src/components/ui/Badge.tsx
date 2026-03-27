import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'paid' | 'pending' | 'overdue' | 'upcoming' | 'default';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'paid':
        return theme.colors.success[500];
      case 'pending':
        return theme.colors.warning[500];
      case 'overdue':
        return theme.colors.error[500];
      case 'upcoming':
        return theme.colors.info[500];
      default:
        return theme.colors.surface[200];
    }
  };

  const getTextColor = () => {
    return variant === 'default'
      ? theme.colors.text.primary
      : theme.colors.white;
  };

  const getSizeStyle = (): ViewStyle => {
    return size === 'sm'
      ? {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: 2,
        }
      : {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs,
        };
  };

  const getTextSize = () => {
    return size === 'sm' ? 10 : 12;
  };

  return (
    <View
      style={[
        styles.container,
        getSizeStyle(),
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: getTextColor(), fontSize: getTextSize() },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
