import { useAuth } from "@/context/AuthContext";
import { theme } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(tabs)/dashboard");
      } else {
        router.replace("/(tabs)/dashboard");
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