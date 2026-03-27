import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/theme";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(tabs)/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [loading, user]);

  return (
    <LinearGradient
      colors={theme.colors.gradients.dark}
      style={s.loader}
    >
      <ActivityIndicator size="large" color={theme.colors.primary[400]} />
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});