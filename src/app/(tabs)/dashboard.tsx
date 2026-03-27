import { Badge, Card } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { theme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

interface Registro {
  impuesto: string;
  mes: string;
  importe: number;
  anio: number;
}

interface Stats {
  totalMesActual: number;
  totalAnio: number;
  porImpuesto: { nombre: string; total: number }[];
  cantidadRegistros: number;
}

const formatARS = (valor: number) => {
  const str = String(valor).padStart(3, '0');
  const centavos = str.slice(-2);
  const enteros = str.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${enteros},${centavos}`;
};

function parsearImporte(valor) {
  if (!valor) return 0;
  const float = parseFloat(valor.toString().replace(/[$\s.]/g, '').replace(',', '.')) || 0;
  return Math.round(float * 100); // devuelve centavos como entero
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchData = async () => {
    if (!user?.departamento) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/impuestos?departamento=${encodeURIComponent(user.departamento)}`);
      const data = await response.json();

      if (data.ok) {
        setRegistros(data.registros || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.departamento]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [user?.departamento]);

  const mesActual = MESES[new Date().getMonth()];
  const registrosRecientes = registros
    .sort((a, b) => {
      // Ordenar por mes más reciente
      const indexA = MESES.indexOf(a.mes);
      const indexB = MESES.indexOf(b.mes);
      return indexB - indexA;
    })
    .slice(0, 5);

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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary[400]}
              />
            }
          >
            {/* Header */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(600)}
              style={styles.header}
            >
              <View>
                <Text style={styles.greeting}>Hola! 👋</Text>
                <Text style={styles.userName}>
                  {user?.departamento || 'Usuario'}
                </Text>
                {user?.rol && (
                  <Badge
                    label={user.rol.toUpperCase()}
                    variant={user.rol === 'admin' ? 'upcoming' : 'default'}
                    size="sm"
                    style={{ marginTop: theme.spacing.xs }}
                  />
                )}
              </View>
            </Animated.View>

            {/* Primary Action - Nuevo Impuesto */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.primaryActionContainer}
            >
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/new')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={theme.colors.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryActionCard}
                >
                  <View style={styles.primaryActionContent}>
                    <View style={styles.primaryActionTextContainer}>
                      <Text style={styles.primaryActionLabel}>Crear Nuevo</Text>
                      <Text style={styles.primaryActionTitle}>Impuesto</Text>
                      <Text style={styles.primaryActionSubtitle}>
                        Registrar un nuevo pago
                      </Text>
                    </View>
                    <View style={styles.primaryActionIconContainer}>
                      <Ionicons
                        name="add-circle"
                        size={64}
                        color={theme.colors.white}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Stats Cards */}
            {stats && (
              <Animated.View
                entering={FadeInDown.delay(300).duration(600)}
                style={styles.section}
              >
                <Text style={styles.sectionTitle}>Resumen</Text>
                <Card variant="glass" padding="lg" style={styles.statCardFull}>
                  <View style={styles.statCardHeader}>
                    <LinearGradient
                      colors={theme.colors.gradients.primary}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.statIcon}
                    >
                      <Ionicons name="wallet" size={20} color={theme.colors.white} />
                    </LinearGradient>
                    <Text style={styles.statLabel}>Total {mesActual}</Text>
                  </View>
                  <Text style={styles.statValue}>{formatARS(stats.totalMesActual)}</Text>
                </Card>
              </Animated.View>
            )}

            {/* Historial Reciente */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.section}
            >
              <Text style={styles.sectionTitle}>Historial Reciente</Text>
              {loading ? (
                <Card variant="glass" padding="lg">
                  <Text style={styles.emptyText}>Cargando...</Text>
                </Card>
              ) : registrosRecientes.length === 0 ? (
                <Card variant="glass" padding="xl">
                  <Ionicons
                    name="document-text-outline"
                    size={64}
                    color={theme.colors.text.tertiary}
                    style={{ alignSelf: 'center', marginBottom: theme.spacing.md }}
                  />
                  <Text style={styles.emptyTitle}>Sin registros</Text>
                  <Text style={styles.emptyText}>
                    Aún no hay impuestos cargados para {user?.departamento}
                  </Text>
                </Card>
              ) : (
                <View style={styles.historyList}>
                  {registrosRecientes.map((registro, index) => (
                    <Animated.View
                      key={`${registro.impuesto}-${registro.mes}-${index}`}
                      entering={FadeInRight.delay(500 + index * 100).duration(600)}
                    >
                      <Card
                        variant="elevated"
                        padding="md"
                        style={styles.historyCard}
                      >
                        <View style={styles.historyCardContent}>
                          <View
                            style={[
                              styles.historyIcon,
                              { backgroundColor: `${theme.colors.primary[500]}20` },
                            ]}
                          >
                            <Ionicons
                              name="receipt"
                              size={20}
                              color={theme.colors.primary[500]}
                            />
                          </View>
                          <View style={styles.historyInfo}>
                            <Text style={styles.historyTitle}>
                              {registro.impuesto}
                            </Text>
                            <Text style={styles.historySubtitle}>
                              {registro.mes} {registro.anio}
                            </Text>
                          </View>
                          <Text style={styles.historyAmount}>{formatARS(registro.importe)}</Text>
                        </View>
                      </Card>
                    </Animated.View>
                  ))}
                </View>
              )}
            </Animated.View>

            {/* Estadísticas por Impuesto */}
            {stats && stats.porImpuesto.length > 0 && (
              <Animated.View
                entering={FadeInDown.delay(500).duration(600)}
                style={styles.section}
              >
                <Text style={styles.sectionTitle}>Por Tipo de Impuesto</Text>
                <View style={styles.statsDetailList}>
                  {stats.porImpuesto
                    .sort((a, b) => b.total - a.total)
                    .map((item, index) => (
                      <Animated.View
                        key={item.nombre}
                        entering={FadeInRight.delay(600 + index * 100).duration(600)}
                      >
                        <Card
                          variant="glass"
                          padding="md"
                          style={styles.statsDetailCard}
                        >
                          <View style={styles.statsDetailContent}>
                            <Text style={styles.statsDetailLabel}>
                              {item.nombre}
                            </Text>
                            <Text style={styles.statsDetailValue}>
                              ${item.total.toLocaleString('es-AR')}
                            </Text>
                          </View>
                          <View style={styles.statsDetailBar}>
                            <View
                              style={[
                                styles.statsDetailBarFill,
                                {
                                  width: `${(item.total / stats.totalAnio) * 100}%`,
                                },
                              ]}
                            />
                          </View>
                        </Card>
                      </Animated.View>
                    ))}
                </View>
              </Animated.View>
            )}

            {/* Bottom Padding for Tab Bar */}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: 16,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  primaryActionContainer: {
    marginBottom: theme.spacing.xl,
  },
  primaryActionCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    minHeight: 160,
    ...theme.shadows.lg,
  },
  primaryActionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryActionTextContainer: {
    flex: 1,
  },
  primaryActionLabel: {
    fontSize: 14,
    color: theme.colors.white,
    opacity: 0.9,
    marginBottom: theme.spacing.xs,
  },
  primaryActionTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: theme.colors.white,
    opacity: 0.8,
  },
  primaryActionIconContainer: {
    opacity: 0.9,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  // Reemplazá statsGrid, statCard, statIcon, statLabel, statValue por estos:
  statCardFull: {
    width: '100%',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
  },
  statValue: {
    fontSize: 40,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  statDivider: {
    height: 1,
    backgroundColor: theme.colors.surface[200],
    marginBottom: theme.spacing.md,
  },
  statFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statFooterLabel: {
    fontSize: 13,
    color: theme.colors.text.tertiary,
  },
  statFooterValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primary[400],
  },
  historyList: {
    gap: theme.spacing.sm,
  },
  historyCard: {
    marginBottom: theme.spacing.sm,
  },
  historyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 13,
    color: theme.colors.text.tertiary,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary[400],
  },
  statsDetailList: {
    gap: theme.spacing.sm,
  },
  statsDetailCard: {
    marginBottom: theme.spacing.sm,
  },
  statsDetailContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  statsDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  statsDetailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary[400],
  },
  statsDetailBar: {
    height: 6,
    backgroundColor: theme.colors.surface[200],
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  statsDetailBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
