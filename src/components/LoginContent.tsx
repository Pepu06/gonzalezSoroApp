import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View,
} from "react-native";

export default function LoginContent() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const handleLogin = async () => {
    setError("");
    if (!password) { setError("Ingresá tu contraseña"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Contraseña incorrecta");
      await login(data.departamento, data.rol);
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Icon */}
        <View style={styles.iconWrap}>
          <Ionicons name="business-outline" size={34} color="#2563eb" />
        </View>

        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Ingresá tu contraseña para acceder</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Contraseña <Text style={styles.req}>*</Text></Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!show}
              placeholder="Contraseña..."
              placeholderTextColor="#94a3b8"
              autoFocus
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShow(s => !s)}
              style={styles.eyeBtn}
              accessibilityRole="button"
              accessibilityLabel={show ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <Ionicons
                name={show ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#475569"
              />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Ingresar</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: "#f0fdf9",
  },
  scroll: {
    flexGrow: 1, justifyContent: "center",
    paddingHorizontal: 24, paddingVertical: 48,
  },
  iconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: "#ffffff",
    alignItems: "center", justifyContent: "center",
    alignSelf: "center", marginBottom: 24,
    shadowColor: "#0d9488", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 5,
  },
  title: {
    fontSize: 32, fontWeight: "900", color: "#0f766e",
    textAlign: "center", marginBottom: 8,
  },
  subtitle: {
    fontSize: 15, color: "#0d9488",
    textAlign: "center", marginBottom: 36, fontWeight: "500",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28, padding: 28,
    shadowColor: "#000", shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
    gap: 18,
  },
  label: { fontSize: 14, fontWeight: "700", color: "#0f766e" },
  req: { color: "#ef4444" },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 0, 
    borderRadius: 16, backgroundColor: "#f0fdfa",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1, height: 56, fontSize: 16,
    color: "#0f766e", letterSpacing: 1, fontWeight: "500",
  },
  eyeBtn: { padding: 10 },
  errorBox: {
    backgroundColor: "#fee2e2", borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: "#fca5a5",
  },
  errorText: { color: "#dc2626", fontSize: 13, textAlign: "center", fontWeight: "600" },
  btn: {
    backgroundColor: "#0f766e", borderRadius: 16,
    paddingVertical: 16, alignItems: "center",
    shadowColor: "#0f766e", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 5,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "800" },
});