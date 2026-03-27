import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  style,
}) => {
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 18;
      case 'lg':
        return 28;
      default:
        return 24;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 32;
      case 'lg':
        return 56;
      default:
        return 44;
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary[600];
      case 'secondary':
        return theme.colors.surface[200];
      default:
        return 'transparent';
    }
  };

  const getIconColor = () => {
    if (disabled) return theme.colors.text.disabled;
    switch (variant) {
      case 'primary':
        return theme.colors.white;
      case 'secondary':
        return theme.colors.text.primary;
      default:
        return theme.colors.primary[400];
    }
  };

  const buttonSize = getButtonSize();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor: getBackgroundColor(),
          opacity: disabled ? 0.5 : 1,
        },
        variant !== 'ghost' && theme.shadows.sm,
        style,
      ]}
    >
      <Ionicons name={icon} size={getIconSize()} color={getIconColor()} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
