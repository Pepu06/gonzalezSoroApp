import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '../../theme';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.tabBar}>
        <View style={styles.tabBarInner}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const iconName = getIconName(route.name, isFocused);

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TabBarButton
                key={route.key}
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                iconName={iconName}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
}

const TabBarButton: React.FC<TabBarButtonProps> = ({
  onPress,
  onLongPress,
  isFocused,
  iconName,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isFocused ? 1.1 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isFocused ? -2 : 0, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={styles.tab}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        {isFocused && <View style={styles.activeBackground} />}
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons
            name={iconName}
            size={24}
            color={
              isFocused
                ? theme.colors.primary[400]
                : theme.colors.text.tertiary
            }
          />
        </Animated.View>
      </Animated.View>
      {isFocused && <View style={styles.indicator} />}
    </TouchableOpacity>
  );
};

const getIconName = (
  routeName: string,
  isFocused: boolean
): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, [string, string]> = {
    dashboard: ['home', 'home-outline'],
    new: ['add-circle', 'add-circle-outline'],
    history: ['time', 'time-outline'],
    stats: ['stats-chart', 'stats-chart-outline'],
    profile: ['person', 'person-outline'],
  };

  const [focused, outline] = iconMap[routeName] || ['home', 'home-outline'];
  return (isFocused ? focused : outline) as keyof typeof Ionicons.glyphMap;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    marginHorizontal: theme.spacing.md,
    marginBottom: Platform.OS === 'ios' ? theme.spacing.lg : theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.lg,
  },
  tabBarInner: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${theme.colors.primary[500]}20`,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary[400],
  },
});
