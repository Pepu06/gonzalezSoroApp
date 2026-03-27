import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.lg,
      ...getSizeStyle(),
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary[600],
          ...theme.shadows.md,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface[200],
          ...theme.shadows.sm,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary[600],
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 36,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
          minHeight: 56,
        };
      default:
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 48,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    const sizeStyle: TextStyle = {
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
    };

    const colorStyle: TextStyle = {
      color:
        variant === 'outline' || variant === 'ghost'
          ? theme.colors.primary[400]
          : variant === 'secondary'
          ? theme.colors.text.primary
          : theme.colors.white,
    };

    return { ...baseStyle, ...sizeStyle, ...colorStyle };
  };

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          color={
            variant === 'outline' || variant === 'ghost'
              ? theme.colors.primary[400]
              : theme.colors.white
          }
          style={{ marginRight: theme.spacing.sm }}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <View style={{ marginRight: theme.spacing.sm }}>{icon}</View>
      )}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      {!loading && icon && iconPosition === 'right' && (
        <View style={{ marginLeft: theme.spacing.sm }}>{icon}</View>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[{ opacity: isDisabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={theme.colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            getButtonStyle(),
            { backgroundColor: 'transparent' },
            theme.shadows.primary,
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        getButtonStyle(),
        { opacity: isDisabled ? 0.5 : 1 },
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
