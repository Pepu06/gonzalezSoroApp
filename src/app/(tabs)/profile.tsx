import CambiarPassword from '@/components/CambiarPassword';
import { Badge, Button } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;


  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={theme.colors.gradients.dark}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Header */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(600)}
              style={styles.header}
            >
              <LinearGradient
                colors={theme.colors.gradients.primary}
                style={styles.avatar}
              >
                <Ionicons
                  name="person"
                  size={48}
                  color={theme.colors.white}
                />
              </LinearGradient>
              <Text style={styles.userName}>
                {user?.departamento || 'Usuario'}
              </Text>
              {user?.rol && (
                <Badge
                  label={user.rol === 'admin' ? 'ADMINISTRADOR' : 'USUARIO'}
                  variant={user.rol === 'admin' ? 'upcoming' : 'default'}
                  style={{ marginTop: theme.spacing.sm }}
                />
              )}
            </Animated.View>

            {/* Menu Items */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.menu}
            >
              <CambiarPassword />
            </Animated.View>

            {/* Logout Button */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(600)}
              style={styles.logoutContainer}
            >
              <Button
                title="Cerrar Sesión"
                onPress={handleLogout}
                variant="outline"
                size="lg"
                fullWidth
                icon={
                  <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={theme.colors.error[500]}
                  />
                }
                style={{
                  borderColor: theme.colors.error[500],
                  backgroundColor: theme.colors.error[50],
                }}
                textStyle={{
                  color: theme.colors.error[500],
                }}
              />
            </Animated.View>

            {/* Version */}
            <Text style={styles.version}>Versión 2.0.0</Text>

            <View style={{ height: 120 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.primary,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  menu: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  menuItem: {
    backgroundColor: theme.colors.background.card,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary[500]}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  menuSubtitle: {
    fontSize: 13,
    color: theme.colors.text.tertiary,
  },
  logoutContainer: {
    marginBottom: theme.spacing.lg,
  },
  version: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay.medium,
  },
  modalSafeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    margin: theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
});
