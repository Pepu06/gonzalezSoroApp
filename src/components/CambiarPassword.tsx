import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator, Alert,
    KeyboardAvoidingView,
    Modal,
    Platform, ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View,
} from "react-native";

const Field = React.memo(({
  id, label, placeholder, form, show, setForm, setShow,
}: {
  id: "actual" | "nueva" | "confirmar";
  label: string;
  placeholder?: string;
  form: any;
  show: any;
  setForm: any;
  setShow: any;
}) => (
  <View style={s.fieldWrap}>
    <Text style={s.label}>{label}</Text>
    <View style={s.inputRow}>
      <TextInput
        style={s.input}
        value={form[id]}
        onChangeText={v => setForm((f: any) => ({ ...f, [id]: v }))}
        secureTextEntry={!show[id]}
        placeholder={placeholder || "••••••••"}
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        onPress={() => setShow((sh: any) => ({ ...sh, [id]: !sh[id] }))}
        style={s.eye}
      >
        <Ionicons
          name={show[id] ? "eye-off-outline" : "eye-outline"}
          size={20}
          color="#475569"
        />
      </TouchableOpacity>
    </View>
  </View>
));

export default function CambiarPassword() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ actual: "", nueva: "", confirmar: "" });
  const [show, setShow] = useState({ actual: false, nueva: false, confirmar: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const canSubmit =
    !!form.actual.trim() &&
    !!form.nueva.trim() &&
    !!form.confirmar.trim() &&
    !loading;

  const close = () => { setOpen(false); setForm({ actual: "", nueva: "", confirmar: "" }); setError(""); };

  const handleSubmit = async () => {
    setError("");

    if (!user?.departamento) {
      setError("Sesión inválida. Volvé a iniciar sesión.");
      return;
    }

    if (form.nueva.length < 6) { setError("La nueva contraseña debe tener al menos 6 caracteres"); return; }
    if (form.nueva !== form.confirmar) { setError("Las contraseñas no coinciden"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/cambiar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departamento: user.departamento, passwordActual: form.actual, passwordNueva: form.nueva }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar contraseña");
      Alert.alert("Listo", "Contraseña actualizada. Volvé a iniciar sesión.");
      close();
      await logout();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        style={s.triggerCard}
      >
        <View style={s.menuItemContent}>
          <View style={s.menuIconContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#62AB37" />
          </View>
          <View style={s.menuText}>
            <Text style={s.menuTitle}>Cambiar Contraseña</Text>
            <Text style={s.menuSubtitle}>Actualizar tu contraseña de acceso</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={close}
        statusBarTranslucent
      >
        <View style={s.overlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={close}
            activeOpacity={1}
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View style={s.sheet}>
              <View style={s.handle} />
              <View style={s.sheetHeader}>
                <Text style={s.sheetTitle}>Cambiar Contraseña</Text>
                <Text style={s.sheetSub}>Dpto: <Text style={{ fontWeight: "700" }}>{user?.departamento}</Text></Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={s.fields}>
                  <Field id="actual" label="Contraseña actual" form={form} show={show} setForm={setForm} setShow={setShow} />
                  <Field id="nueva" label="Nueva contraseña" placeholder="Mínimo 6 caracteres" form={form} show={show} setForm={setForm} setShow={setShow} />
                  <Field id="confirmar" label="Confirmar nueva contraseña" placeholder="Repetí la nueva contraseña" form={form} show={show} setForm={setForm} setShow={setShow} />
                  {error ? (
                    <View style={s.errorBox}>
                      <Text style={s.errorTxt}>{error}</Text>
                    </View>
                  ) : null}
                  <View style={s.actions}>
                    <TouchableOpacity style={s.cancelBtn} onPress={close}>
                      <Text style={s.cancelTxt}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.saveBtn, (!canSubmit || loading) && s.saveBtnDisabled]}
                      onPress={handleSubmit}
                      disabled={!canSubmit || loading}
                    >
                      {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.saveTxt}>Guardar</Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  trigger: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14, borderWidth: 0,
    shadowColor: "#0d9488", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  triggerText: { fontSize: 13, fontWeight: "700", color: "#0f766e" },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: "#d1fae5", alignSelf: "center", marginTop: 14, marginBottom: 20,
  },
  sheetHeader: { paddingHorizontal: 24, marginBottom: 24 },
  sheetTitle: { fontSize: 22, fontWeight: "900", color: "#0f766e" },
  sheetSub: { fontSize: 14, color: "#0d9488", marginTop: 4, fontWeight: "600" },

  fields: { paddingHorizontal: 24, gap: 18 },
  fieldWrap: { gap: 8 },
  label: { fontSize: 14, fontWeight: "700", color: "#0f766e" },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 0, borderRadius: 16,
    paddingHorizontal: 16, backgroundColor: "#f0fdfa",
  },
  input: { flex: 1, height: 56, fontSize: 15, color: "#0f766e", fontWeight: "500" },
  eye: { padding: 10 },

  errorBox: {
    backgroundColor: "#fee2e2", borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: "#fca5a5",
  },
  errorTxt: { color: "#dc2626", fontSize: 13, textAlign: "center", fontWeight: "600" },

  actions: { flexDirection: "row", gap: 10, marginTop: 8, marginBottom: 12 },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: "#f0fdfa", alignItems: "center",
  },
  cancelTxt: { fontSize: 15, fontWeight: "700", color: "#0f766e" },
  saveBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: "#0f766e", alignItems: "center",
    shadowColor: "#0f766e", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 3,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveTxt: { fontSize: 15, fontWeight: "800", color: "#fff" },
  triggerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemContent: { flexDirection: 'row', alignItems: 'center' },
  menuIconContainer: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#62AB3720',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 2 },
  menuSubtitle: { fontSize: 13, color: '#64748b' },
});