import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

// Guardián de rutas: redirige según estado de autenticación
function RouteGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "login";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!user && !inAuthGroup) {
      // No logueado → ir a login
      router.replace("/login");
    } else if (user && !inTabsGroup && !inAuthGroup) {
      // Ya logueado → ir a dashboard
      router.replace("/(tabs)/dashboard");
    }
  }, [user, loading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RouteGuard />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
      </Stack>
    </AuthProvider>
  );
}