import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Contraseña incorrecta');
      }

      // AuthContext espera (departamento, rol)
      await login(data.departamento, data.rol);
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      console.error('Error login:', error);
      Alert.alert('Error', error.message || 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={theme.colors.gradients.dark as unknown as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              entering={FadeInUp.delay(200).duration(1000)}
              style={styles.header}
            >
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={theme.colors.gradients.primary as unknown as readonly [string, string, ...string[]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoGradient}
                >
                  <Ionicons
                    name="business"
                    size={48}
                    color={theme.colors.white}
                  />
                </LinearGradient>
              </View>

              <Text style={styles.title}>González Soro</Text>
              <Text style={styles.subtitle}>Gestión de Impuestos</Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(1000)}
              style={styles.card}
            >
              <Text style={styles.welcomeText}>Bienvenido</Text>
              <Text style={styles.loginText}>
                Ingresa tu contraseña para continuar
              </Text>

              <View style={styles.form}>
                <Input
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  showPasswordToggle
                  icon="lock-closed"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!loading}
                />

                <Button
                  title={loading ? 'Ingresando...' : 'Ingresar'}
                  onPress={handleLogin}
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  style={styles.loginButton}
                />
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(600).duration(1000)}
              style={styles.footer}
            >
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Ionicons
                    name="shield-checkmark"
                    size={20}
                    color={theme.colors.success[400]}
                  />
                </View>
                <Text style={styles.featureText}>Seguro y encriptado</Text>
              </View>

              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Ionicons
                    name="cloud-done"
                    size={20}
                    color={theme.colors.info[400]}
                  />
                </View>
                <Text style={styles.featureText}>Sincronizado en la nube</Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  loginText: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xl,
  },
  form: {
    gap: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
  },
});