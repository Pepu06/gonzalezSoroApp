import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { theme } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  containerStyle,
  inputStyle,
  secureTextEntry = false,
  showPasswordToggle = false,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const labelPosition = useSharedValue(value ? 1 : 0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    labelPosition.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      labelPosition.value = withTiming(0, { duration: 200 });
    }
    onBlur?.(e);
  };

  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: interpolate(labelPosition.value, [0, 1], [18, -10]),
      fontSize: interpolate(labelPosition.value, [0, 1], [16, 12]),
    };
  });

  const containerBorderColor = error
    ? theme.colors.error[500]
    : isFocused
    ? theme.colors.primary[500]
    : theme.colors.border.light;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View
        style={[
          styles.container,
          {
            borderColor: containerBorderColor,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon}
            size={20}
            color={
              error
                ? theme.colors.error[500]
                : isFocused
                ? theme.colors.primary[500]
                : theme.colors.text.tertiary
            }
            style={styles.iconLeft}
          />
        )}

        <View style={styles.inputWrapper}>
          {label && (
            <Animated.Text
              style={[
                styles.label,
                labelAnimatedStyle,
                {
                  color: error
                    ? theme.colors.error[500]
                    : isFocused
                    ? theme.colors.primary[500]
                    : theme.colors.text.tertiary,
                },
              ]}
            >
              {label}
            </Animated.Text>
          )}
          <RNTextInput
            style={[styles.input, inputStyle]}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={theme.colors.text.tertiary}
            secureTextEntry={
              secureTextEntry && showPasswordToggle
                ? !isPasswordVisible
                : secureTextEntry
            }
            {...props}
          />
        </View>

        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconRight}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        )}

        {icon && iconPosition === 'right' && !showPasswordToggle && (
          <Ionicons
            name={icon}
            size={20}
            color={
              error
                ? theme.colors.error[500]
                : isFocused
                ? theme.colors.primary[500]
                : theme.colors.text.tertiary
            }
            style={styles.iconRight}
          />
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface[100],
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    minHeight: 56,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 0,
    backgroundColor: theme.colors.surface[100],
    paddingHorizontal: 4,
    fontWeight: '500',
    zIndex: 1,
  },
  input: {
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingTop: 10,
    paddingBottom: 6,
    minHeight: 24,
  },
  iconLeft: {
    marginRight: theme.spacing.sm,
  },
  iconRight: {
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error[500],
    fontSize: 12,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.md,
  },
});
