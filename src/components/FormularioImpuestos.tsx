import { useAuth } from "@/context/AuthContext";
import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View,
} from "react-native";

// ─── Datos ────────────────────────────────────────────────────────────────────
const DEPARTAMENTOS = [
  "Acevedo", "Alsina 1138", "Alsina 1905", "Araoz", "Artigas", "Austria",
  "Av la Plata", "Avellaneda", "Ayacucho 1085", "Ayacucho 331",
  "Bernardo de Irigoyen", "Beruti", "Billinghurst", "Bulnes", "Cervantes",
  "Charcas", "Cramer", "Don Bosco", "El Potrero", "Esmeralda 3 K",
  "Esmeralda 5 A", "Esmeralda 5 D", "Eva Peron", "Formosa 129",
  "Formosa 380", "G Lorca cochera 340", "G Lorca cochera 97",
  "G Lorca piso 22", "G Lorca piso 3", "H Irigoyen", "Independencia",
  "La Rioja", "Lacarra", "Lapida 1898", "Las Heras", "Lavalle",
  "Lavalleja", "Libertad 844", "Libertad 960", "M T de Alvear",
  "Mar de las Pampas", "Mario Bravo 5 A", "Matheu 1 A", "Matheu 2 G",
  "Matheu 4 E", "Ortega y Gasset", "Paraguay 754", "Paraguay 783",
  "Pilar dormi", "Pueyrredon 1655", "Pueyrredon 1978", "Quimo Costa",
  "R Pena 10 C", "R Pena 10 D", "R Pena 2 B", "R Pena 2 C",
  "R Pena 2 D", "R Pena 3 D", "R Pena 4 C", "R Pena 4 D", "Ravignani",
  "Rawson", "Riobamba", "Rivadavia 1525", "Rivadavia 1611",
  "Rivadavia 4085", "Rivadavia 822", "Saavedra 2", "Saavedra PB",
  "San Benito", "San Juan", "Santa Fe 2545", "Scalabrini Ortiz 2364",
  "Siria 5 A", "Siria 7 27", "Talcahuano 1242", "Uruguay 14 D",
  "Uruguay 7 B", "Valle", "Vidt 2052", "Vidt 2137", "Yapeyu", "Yatay",
];

const IMPUESTOS = ["ABL", "ABLUC", "ARBA", "AYSA", "AYSAUC", "EDESUR", "EXPENSAS", "METROGAS", "MUNICIPAL", "TELECOM"];

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// ─── Picker genérico ──────────────────────────────────────────────────────────
function PickerModal({
  visible, title, options, value, onSelect, onClose,
}: {
  visible: boolean; title: string; options: string[];
  value: string; onSelect: (v: string) => void; onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={pm.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <View style={pm.sheet}>
          <View style={pm.handle} />
          <Text style={pm.title}>{title}</Text>
          <TextInput
            style={pm.search}
            placeholder="Buscar..."
            placeholderTextColor="#94a3b8"
            value={q}
            onChangeText={setQ}
            autoFocus
          />
          <FlatList
            data={filtered}
            keyExtractor={i => i}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[pm.option, item === value && pm.optionActive]}
                onPress={() => { onSelect(item); onClose(); setQ(""); }}
              >
                <Text style={[pm.optionText, item === value && pm.optionTextActive]}>{item}</Text>
                {item === value && <Text style={pm.check}>✓</Text>}
              </TouchableOpacity>
            )}
            style={pm.list}
          />
          <TouchableOpacity style={pm.closeBtn} onPress={onClose}>
            <Text style={pm.closeTxt}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: theme.colors.overlay.dark, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: theme.colors.surface[100], borderTopLeftRadius: theme.borderRadius.xl, borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg, paddingBottom: Platform.OS === "ios" ? theme.spacing.lg : theme.spacing.md,
    maxHeight: "82%",
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: theme.colors.border.light, alignSelf: "center", marginBottom: theme.spacing.md,
  },
  title: { fontSize: 18, fontWeight: "700", color: theme.colors.text.primary, marginBottom: theme.spacing.md },
  search: {
    borderWidth: 1.5, borderColor: theme.colors.border.light, borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, fontSize: 14,
    color: theme.colors.text.primary, marginBottom: theme.spacing.sm, backgroundColor: theme.colors.surface[200],
  },
  option: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border.light,
  },
  optionActive: { backgroundColor: 'rgba(99, 102, 241, 0.15)', borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.sm },
  optionText: { flex: 1, fontSize: 14, color: theme.colors.text.secondary },
  optionTextActive: { color: theme.colors.primary[400], fontWeight: "600" },
  check: { color: theme.colors.primary[400], fontWeight: "700" },
  closeBtn: {
    marginTop: theme.spacing.md, alignItems: "center", paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface[200], borderRadius: theme.borderRadius.lg,
  },
  closeTxt: { fontSize: 14, fontWeight: "600", color: theme.colors.text.tertiary },
  list: { borderTopWidth: 1, borderTopColor: theme.colors.border.light, marginBottom: theme.spacing.md },
});

// ─── Componente selector ──────────────────────────────────────────────────────
function FieldSelect({
  label, required, placeholder, value, onPress, error,
}: {
  label: string; required?: boolean; placeholder: string;
  value: string; onPress: () => void; error?: boolean;
}) {
  return (
    <View style={fs.wrap}>
      <Text style={fs.label}>
        {label} {required && <Text style={fs.req}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[fs.row, error && fs.rowError]}
        onPress={onPress} activeOpacity={0.7}
      >
        <Text style={value ? fs.val : fs.placeholder}>{value || placeholder}</Text>
        <Text style={fs.chevron}>⌄</Text>
      </TouchableOpacity>
    </View>
  );
}

const fs = StyleSheet.create({
  wrap: { gap: theme.spacing.sm },
  label: { fontSize: 14, fontWeight: "600", color: theme.colors.text.primary },
  req: { color: theme.colors.error[500] },
  row: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: theme.colors.border.light, borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md, height: 56, backgroundColor: theme.colors.surface[200],
  },
  rowError: { backgroundColor: theme.colors.error[900], borderColor: theme.colors.error[500] },
  val: { flex: 1, fontSize: 15, color: theme.colors.text.primary, fontWeight: "500" },
  placeholder: { flex: 1, fontSize: 15, color: theme.colors.text.tertiary },
  chevron: { fontSize: 18, color: theme.colors.text.tertiary, fontWeight: "700", transform: [{ translateY: -4 }] },
});

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function FormularioImpuestos() {
  const { user, isAdmin } = useAuth();
  const [resetKey, setResetKey] = useState(0);

  const [form, setForm] = useState({
    departamento: "", impuesto: "", mes: "", importe: "",
  });
  const [comprobante, setComprobante] = useState<{ name: string; uri: string; type: string; size: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Modals
  const [showDepto, setShowDepto] = useState(false);
  const [showImpuesto, setShowImpuesto] = useState(false);
  const [showMes, setShowMes] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (user?.departamento && !isAdmin()) {
      setForm(f => ({ ...f, departamento: user.departamento }));
    }
  }, [user]);

  const getMesActual = () => MESES[new Date().getMonth()];

  const mesesDisponibles = isAdmin()
    ? MESES
    : MESES.slice(0, new Date().getMonth() + 1);

  const seleccionarComprobante = () => {
    Alert.alert("Subir comprobante", "¿Cómo querés subir el comprobante?", [
      {
        text: "Archivo (PDF / imagen)",
        onPress: async () => {
          const res = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*"], copyToCacheDirectory: true });
          if (res.assets?.[0]) {
            const a = res.assets[0];
            if ((a.size ?? 0) > 1024 * 1024) { Alert.alert("Archivo demasiado grande", "Máximo 1 MB"); return; }
            setComprobante({ name: a.name, uri: a.uri, type: a.mimeType ?? "application/octet-stream", size: a.size ?? 0 });
            setErrors(e => ({ ...e, comprobante: false }));
          }
        },
      },
      {
        text: "Cámara",
        onPress: async () => {
          const p = await ImagePicker.requestCameraPermissionsAsync();
          if (!p.granted) { Alert.alert("Permiso denegado"); return; }
          const r = await ImagePicker.launchCameraAsync({ quality: 0.8 });
          if (!r.canceled) {
            setComprobante({ name: "foto.jpg", uri: r.assets[0].uri, type: "image/jpeg", size: 0 });
            setErrors(e => ({ ...e, comprobante: false }));
          }
        },
      },
      {
        text: "Galería",
        onPress: async () => {
          const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!p.granted) { Alert.alert("Permiso denegado"); return; }
          const r = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
          if (!r.canceled) {
            setComprobante({ name: "imagen.jpg", uri: r.assets[0].uri, type: "image/jpeg", size: 0 });
            setErrors(e => ({ ...e, comprobante: false }));
          }
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const validar = () => {
    const e: Record<string, boolean> = {
      departamento: !form.departamento,
      impuesto: !form.impuesto,
      mes: !form.mes,
      importe: !form.importe || isNaN(parseFloat(form.importe)),
      comprobante: !isAdmin() && !comprobante,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    setLoading(true);
    try {
      const data = new FormData();
      data.append("departamento", form.departamento);
      data.append("impuesto", form.impuesto);
      data.append("mes", form.mes);
      data.append("importe", form.importe);
      if (comprobante) {
        data.append("comprobante", { uri: comprobante.uri, name: comprobante.name, type: comprobante.type } as any);
      }
      const res = await fetch(`${API_URL}/api/impuestos`, { method: "POST", body: data });
      if (!res.ok) throw new Error(await res.text());
      Alert.alert("Guardado", "Impuesto registrado correctamente.", [
        {
          text: "Cargar otro",
          onPress: () => {
            setForm({ departamento: isAdmin() ? "" : user?.departamento ?? "", impuesto: "", mes: "", importe: "" });
            setComprobante(null);
            setErrors({});
            setResetKey(k => k + 1);
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Intentá de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Gestión de Impuestos</Text>
          <Text style={s.subtitle}>Cargá los impuestos de manera simple y organizada</Text>
        </View>

        {/* Card */}
        <View style={s.card}>

          {/* Departamento */}
          {isAdmin() ? (
            <FieldSelect
              label="Departamento" required
              placeholder="Buscar departamento…"
              value={form.departamento}
              onPress={() => setShowDepto(true)}
              error={errors.departamento}
            />
          ) : (
            <View style={s.readOnlyField}>
              <Text style={s.fieldLabel}>Departamento <Text style={{ color: "#ef4444" }}>*</Text></Text>
              <View style={s.readOnlyInput}>
                <Text style={s.readOnlyText}>{form.departamento}</Text>
              </View>
            </View>
          )}

          {/* Impuesto */}
          <FieldSelect
            label="Impuesto" required
            placeholder="Buscar impuesto…"
            value={form.impuesto}
            onPress={() => setShowImpuesto(true)}
            error={errors.impuesto}
          />

          {/* Mes */}
          <View>
            <Text style={s.fieldLabel}>
              Mes <Text style={{ color: "#ef4444" }}>*</Text>
              {!isAdmin() && <Text style={s.fieldHint}>  (hasta {getMesActual()})</Text>}
            </Text>
            <TouchableOpacity
              style={[s.selectRow, errors.mes && s.selectRowError]}
              onPress={() => setShowMes(true)} activeOpacity={0.7}
            >
              <Text style={form.mes ? s.selectVal : s.selectPlaceholder}>{form.mes || "Buscar mes…"}</Text>
              <Text style={s.selectChevron}>⌄</Text>
            </TouchableOpacity>
          </View>

          {/* Importe */}
          <View>
            <Text style={s.fieldLabel}>Importe (ARS) <Text style={{ color: "#ef4444" }}>*</Text></Text>
            <View style={[s.importeRow, errors.importe && s.importeRowError]}>
              <Text style={s.peso}>$</Text>
              <TextInput
                style={s.importeInput}
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
                keyboardType="decimal-pad"
                value={form.importe}
                onChangeText={v => { setForm(f => ({ ...f, importe: v })); setErrors(e => ({ ...e, importe: false })); }}
              />
            </View>
            <Text style={s.hint}>Incluí centavos si corresponde (ej: 1250.75)</Text>
          </View>

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>
              Comprobante {!isAdmin() ? <Text style={{ color: "#ef4444" }}>*</Text> : <Text style={{ color: "#94a3b8" }}>(opcional)</Text>}
            </Text>
            <View style={s.dividerLine} />
          </View>

          {/* Upload */}
          {comprobante ? (
            <View style={s.filePreview}>
              {comprobante.type.startsWith("image/") && (
                <Image source={{ uri: comprobante.uri }} style={s.previewImg} resizeMode="cover" />
              )}
              <View style={s.fileInfo}>
                <View style={s.fileInfoLeft}>
                  <View style={s.fileCheck}>
                    <Ionicons name="checkmark" size={16} color="#16a34a" />
                  </View>
                  <View>
                    <Text style={s.fileName} numberOfLines={1}>{comprobante.name}</Text>
                    {comprobante.size > 0 && (
                      <Text style={s.fileSize}>{(comprobante.size / 1024).toFixed(1)} KB</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={seleccionarComprobante}>
                  <Text style={s.changeFile}>Cambiar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[s.uploadArea, errors.comprobante && s.uploadAreaError]}
              onPress={seleccionarComprobante}
              activeOpacity={0.75}
            >
              <Ionicons name="cloud-upload-outline" size={28} color="#94a3b8" />
              <Text style={s.uploadTitle}>Subir comprobante</Text>
              <Text style={s.uploadSub}>Tocá para seleccionar</Text>
              {errors.comprobante && (
                <Text style={s.errorText}>El comprobante es obligatorio</Text>
              )}
              <Text style={s.uploadTypes}>PDF, JPG, PNG  •  Máx. 1 MB</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Cargar Impuesto</Text>
            }
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modals */}
      <PickerModal visible={showDepto} title="Departamento" options={DEPARTAMENTOS}
        value={form.departamento}
        onSelect={v => { setForm(f => ({ ...f, departamento: v })); setErrors(e => ({ ...e, departamento: false })); }}
        onClose={() => setShowDepto(false)}
      />
      <PickerModal visible={showImpuesto} title="Impuesto" options={IMPUESTOS}
        value={form.impuesto}
        onSelect={v => { setForm(f => ({ ...f, impuesto: v })); setErrors(e => ({ ...e, impuesto: false })); }}
        onClose={() => setShowImpuesto(false)}
      />
      <PickerModal visible={showMes} title="Mes" options={mesesDisponibles}
        value={form.mes}
        onSelect={v => { setForm(f => ({ ...f, mes: v })); setErrors(e => ({ ...e, mes: false })); }}
        onClose={() => setShowMes(false)}
      />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1 },

  topBar: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md, gap: theme.spacing.sm,
  },
  topBtn: {
    flexDirection: "row", alignItems: "center", gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface[200], paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },
  topBtnRight: { maxWidth: 180 },
  topBtnIcon: { fontSize: 14 },
  topBtnText: { fontSize: 13, fontWeight: "600", color: theme.colors.text.primary },
  adminBadge: { color: theme.colors.primary[400] },

  scroll: { paddingHorizontal: theme.spacing.lg, paddingBottom: 120 },

  header: { alignItems: "center", paddingVertical: theme.spacing.xl },
  headerIcon: {
    width: 72, height: 72, borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface[200], alignItems: "center",
    justifyContent: "center", marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  title: { fontSize: 28, fontWeight: "700", color: theme.colors.text.primary, textAlign: "center" },
  subtitle: { fontSize: 15, color: theme.colors.text.tertiary, textAlign: "center", marginTop: theme.spacing.xs, fontWeight: "500" },

  card: {
    backgroundColor: theme.colors.surface[100], borderRadius: theme.borderRadius.xl, padding: theme.spacing.xl,
    gap: theme.spacing.lg,
    borderWidth: 1, borderColor: theme.colors.border.light,
    ...theme.shadows.md,
  },

  // Read-only field
  readOnlyField: { gap: theme.spacing.sm },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: theme.colors.text.primary, marginBottom: theme.spacing.xs },
  fieldHint: { fontSize: 12, color: theme.colors.text.tertiary, fontWeight: "500" },
  readOnlyInput: {
    height: 56, borderWidth: 1, borderColor: theme.colors.border.light, borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md, justifyContent: "center",
    backgroundColor: theme.colors.surface[200],
  },
  readOnlyText: { fontSize: 15, color: theme.colors.text.primary, fontWeight: "500" },

  // Select
  selectRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: theme.colors.border.light, borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md, height: 56, backgroundColor: theme.colors.surface[200],
  },
  selectRowError: { backgroundColor: theme.colors.error[900], borderColor: theme.colors.error[500] },
  selectVal: { flex: 1, fontSize: 15, color: theme.colors.text.primary, fontWeight: "500" },
  selectPlaceholder: { flex: 1, fontSize: 15, color: theme.colors.text.tertiary },
  selectChevron: { fontSize: 18, color: theme.colors.text.tertiary, fontWeight: "700", transform: [{ translateY: -4 }] },

  // Importe
  importeRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: theme.colors.border.light, borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md, height: 56, backgroundColor: theme.colors.surface[200],
  },
  importeRowError: { backgroundColor: theme.colors.error[900], borderColor: theme.colors.error[500] },
  peso: { fontSize: 16, color: theme.colors.text.tertiary, fontWeight: "600", marginRight: theme.spacing.xs },
  importeInput: { flex: 1, fontSize: 16, color: theme.colors.text.primary, fontWeight: "500" },
  hint: { fontSize: 12, color: theme.colors.text.tertiary, marginTop: theme.spacing.xs, fontWeight: "500" },
  errorText: { fontSize: 12, color: theme.colors.error[500], fontWeight: "600", marginTop: theme.spacing.xs },

  // Divider
  divider: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  dividerLine: { flex: 1, height: 1.5, backgroundColor: theme.colors.border.light },
  dividerText: { fontSize: 13, fontWeight: "600", color: theme.colors.text.tertiary },

  // Upload
  uploadArea: {
    borderWidth: 2, borderStyle: "dashed", borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.lg, padding: theme.spacing.xl, alignItems: "center", gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface[200],
  },
  uploadAreaError: { borderColor: theme.colors.error[500], backgroundColor: theme.colors.error[900] },
  uploadIcon: { fontSize: 32, color: theme.colors.primary[400] },
  uploadTitle: { fontSize: 15, fontWeight: "700", color: theme.colors.text.primary },
  uploadSub: { fontSize: 13, color: theme.colors.text.tertiary },
  uploadTypes: { fontSize: 12, color: theme.colors.text.tertiary, marginTop: theme.spacing.xs, fontWeight: "500" },

  // File preview
  filePreview: {
    borderWidth: 2, borderColor: theme.colors.border.light, borderRadius: theme.borderRadius.lg,
    overflow: "hidden", backgroundColor: theme.colors.surface[200],
  },
  previewImg: { width: "100%", height: 160 },
  fileInfo: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", padding: theme.spacing.md, gap: theme.spacing.sm,
  },
  fileInfoLeft: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md, flex: 1 },
  fileCheck: {
    width: 40, height: 40, borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(99, 102, 241, 0.15)', alignItems: "center", justifyContent: "center",
  },
  fileName: { fontSize: 14, fontWeight: "600", color: theme.colors.text.primary, maxWidth: 160 },
  fileSize: { fontSize: 12, color: theme.colors.text.tertiary, fontWeight: "500" },
  changeFile: { fontSize: 13, fontWeight: "700", color: theme.colors.primary[400] },

  // Submit button
  btn: {
    backgroundColor: theme.colors.primary[600], borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md, alignItems: "center",
    ...theme.shadows.primary,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: theme.colors.white, fontSize: 17, fontWeight: "700" },

  footer: {
    textAlign: "center", fontSize: 13, color: theme.colors.text.tertiary, marginTop: theme.spacing.lg, fontWeight: "500",
  },
});