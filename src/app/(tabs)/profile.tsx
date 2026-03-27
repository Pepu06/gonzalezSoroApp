import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Badge, Input, IconButton } from '@/components/ui';
import { theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 4) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 4 caracteres');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/cambiar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departamento: user?.departamento,
          passwordActual: currentPassword,
          passwordNueva: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar contraseña');
      }

      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error cambiar password:', error);
      Alert.alert('Error', error.message || 'No se pudo cambiar la contraseña');
    } finally {
      setLoading(false);
    }
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
              <Card
                variant="glass"
                padding="md"
                style={styles.menuItem}
                onPress={() => setShowChangePassword(true)}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={24}
                      color={theme.colors.primary[400]}
                    />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>Cambiar Contraseña</Text>
                    <Text style={styles.menuSubtitle}>
                      Actualizar tu contraseña de acceso
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.text.tertiary}
                  />
                </View>
              </Card>
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
                    color={theme.colors.primary[400]}
                  />
                }
              />
            </Animated.View>

            {/* Version */}
            <Text style={styles.version}>Versión 2.0.0</Text>

            <View style={{ height: 120 }} />
          </ScrollView>
        </SafeAreaView>

        {/* Change Password Modal */}
        <Modal
          visible={showChangePassword}
          transparent
          animationType="fade"
          onRequestClose={() => setShowChangePassword(false)}
        >
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
                  <IconButton
                    icon="close"
                    onPress={() => setShowChangePassword(false)}
                    variant="ghost"
                    size="sm"
                  />
                </View>

                <Card variant="glass" padding="lg">
                  <Input
                    label="Contraseña Actual"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    showPasswordToggle
                    icon="lock-closed"
                    autoCapitalize="none"
                    editable={!loading}
                  />

                  <Input
                    label="Nueva Contraseña"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    showPasswordToggle
                    icon="key"
                    autoCapitalize="none"
                    editable={!loading}
                  />

                  <Input
                    label="Confirmar Nueva Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    showPasswordToggle
                    icon="key"
                    autoCapitalize="none"
                    editable={!loading}
                  />

                  <View style={styles.modalButtons}>
                    <Button
                      title="Cancelar"
                      onPress={() => setShowChangePassword(false)}
                      variant="ghost"
                      disabled={loading}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Guardar"
                      onPress={handleChangePassword}
                      variant="gradient"
                      loading={loading}
                      disabled={loading}
                      style={{ flex: 1 }}
                    />
                  </View>
                </Card>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
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
  menuItem: {},
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
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
    backgroundColor: theme.colors.overlay.dark,
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
