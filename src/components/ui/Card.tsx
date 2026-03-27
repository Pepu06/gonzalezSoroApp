import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../../theme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: keyof typeof theme.spacing;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  onPress,
  ...props
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[padding],
    };

    switch (variant) {
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(30, 41, 59, 0.6)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          ...theme.shadows.md,
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface[100],
          ...theme.shadows.lg,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface[100],
          borderWidth: 1,
          borderColor: theme.colors.border.light,
          ...theme.shadows.sm,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[getCardStyle(), style]}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
};
