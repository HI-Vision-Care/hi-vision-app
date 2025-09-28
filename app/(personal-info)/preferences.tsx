// app/preferences.tsx
import { HeaderBack } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ThemeMode = "system" | "light" | "dark";
type Units = "metric" | "imperial";
type DateFmt = "DMY" | "MDY";

const PREF_KEYS = {
  THEME: "pref_theme",
  FONT_SCALE: "pref_font_scale",
  REDUCE_MOTION: "pref_reduce_motion",
  HIGH_CONTRAST: "pref_high_contrast",
  HAPTIC: "pref_haptic",
  AUTOPLAY: "pref_autoplay",
  DATA_SAVER: "pref_data_saver",
  UNITS: "pref_units",
  DATEFMT: "pref_datefmt",
};

export default function PreferencesScreen() {
  const router = useRouter();

  const [theme, setTheme] = useState<ThemeMode>("system");
  const [fontScale, setFontScale] = useState<number>(1); // 0.9–1.3
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [haptic, setHaptic] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [units, setUnits] = useState<Units>("metric");
  const [datefmt, setDatefmt] = useState<DateFmt>("DMY");

  // Load persisted values
  useEffect(() => {
    (async () => {
      const [t, fs, rm, hc, hp, ap, ds, u, df] = await Promise.all([
        AsyncStorage.getItem(PREF_KEYS.THEME),
        AsyncStorage.getItem(PREF_KEYS.FONT_SCALE),
        AsyncStorage.getItem(PREF_KEYS.REDUCE_MOTION),
        AsyncStorage.getItem(PREF_KEYS.HIGH_CONTRAST),
        AsyncStorage.getItem(PREF_KEYS.HAPTIC),
        AsyncStorage.getItem(PREF_KEYS.AUTOPLAY),
        AsyncStorage.getItem(PREF_KEYS.DATA_SAVER),
        AsyncStorage.getItem(PREF_KEYS.UNITS),
        AsyncStorage.getItem(PREF_KEYS.DATEFMT),
      ]);
      if (t) setTheme(t as ThemeMode);
      if (fs) setFontScale(parseFloat(fs));
      if (rm) setReduceMotion(rm === "1");
      if (hc) setHighContrast(hc === "1");
      if (hp) setHaptic(hp === "1");
      if (ap) setAutoplay(ap === "1");
      if (ds) setDataSaver(ds === "1");
      if (u) setUnits(u as Units);
      if (df) setDatefmt(df as DateFmt);
    })();
  }, []);

  // Persist helpers
  const save = (k: string, v: string) => AsyncStorage.setItem(k, v);

  const ThemePill = ({ value, label }: { value: ThemeMode; label: string }) => (
    <TouchableOpacity
      onPress={() => {
        setTheme(value);
        save(PREF_KEYS.THEME, value);
      }}
      style={[styles.pill, theme === value && styles.pillActive]}
    >
      <Text style={[styles.pillText, theme === value && styles.pillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const Stepper = () => (
    <View style={styles.stepperRow}>
      <TouchableOpacity
        style={styles.stepperBtn}
        onPress={() => {
          const next = Math.max(0.9, parseFloat((fontScale - 0.05).toFixed(2)));
          setFontScale(next);
          save(PREF_KEYS.FONT_SCALE, String(next));
        }}
      >
        <Ionicons name="remove" size={18} color="#0F172A" />
      </TouchableOpacity>
      <Text style={styles.stepperValue}>{Math.round(fontScale * 100)}%</Text>
      <TouchableOpacity
        style={styles.stepperBtn}
        onPress={() => {
          const next = Math.min(1.3, parseFloat((fontScale + 0.05).toFixed(2)));
          setFontScale(next);
          save(PREF_KEYS_FONT_SCALE, String(next)); // fix in-line below after block
        }}
      >
        <Ionicons name="add" size={18} color="#0F172A" />
      </TouchableOpacity>
    </View>
  );

  // (quick fix small typo)
  const PREF_KEYS_FONT_SCALE = PREF_KEYS.FONT_SCALE;

  const Row = ({
    title,
    subtitle,
    right,
  }: {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
  }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderBack title="Preferences" />

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Theme</Text>
            <View style={styles.pillsRow}>
              <ThemePill value="system" label="System" />
              <ThemePill value="light" label="Light" />
              <ThemePill value="dark" label="Dark" />
            </View>

            <Row
              title="Text size"
              subtitle="Điều chỉnh kích thước chữ trong ứng dụng"
              right={<Stepper />}
            />

            <Row
              title="High contrast"
              right={
                <Switch
                  value={highContrast}
                  onValueChange={(v) => {
                    setHighContrast(v);
                    save(PREF_KEYS.HIGH_CONTRAST, v ? "1" : "0");
                  }}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                  thumbColor="#FFFFFF"
                />
              }
            />

            <Row
              title="Reduce motion"
              subtitle="Giảm hiệu ứng chuyển cảnh/animation"
              right={
                <Switch
                  value={reduceMotion}
                  onValueChange={(v) => {
                    setReduceMotion(v);
                    save(PREF_KEYS.REDUCE_MOTION, v ? "1" : "0");
                  }}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          <View style={styles.card}>
            <Row
              title="Haptic feedback"
              subtitle="Rung nhẹ khi chạm nút"
              right={
                <Switch
                  value={haptic}
                  onValueChange={(v) => {
                    setHaptic(v);
                    save(PREF_KEYS.HAPTIC, v ? "1" : "0");
                  }}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content & Behavior</Text>
          <View style={styles.card}>
            <Row
              title="Autoplay animations"
              right={
                <Switch
                  value={autoplay}
                  onValueChange={(v) => {
                    setAutoplay(v);
                    save(PREF_KEYS.AUTOPLAY, v ? "1" : "0");
                  }}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <Row
              title="Data saver"
              subtitle="Giảm chất lượng ảnh/kích thước tải về trên mạng di động"
              right={
                <Switch
                  value={dataSaver}
                  onValueChange={(v) => {
                    setDataSaver(v);
                    save(PREF_KEYS.DATA_SAVER, v ? "1" : "0");
                  }}
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Region & Units</Text>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Units</Text>
            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={[styles.pill, units === "metric" && styles.pillActive]}
                onPress={() => {
                  setUnits("metric");
                  save(PREF_KEYS.UNITS, "metric");
                }}
              >
                <Text
                  style={[
                    styles.pillText,
                    units === "metric" && styles.pillTextActive,
                  ]}
                >
                  Metric
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pill, units === "imperial" && styles.pillActive]}
                onPress={() => {
                  setUnits("imperial");
                  save(PREF_KEYS.UNITS, "imperial");
                }}
              >
                <Text
                  style={[
                    styles.pillText,
                    units === "imperial" && styles.pillTextActive,
                  ]}
                >
                  Imperial
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.cardLabel, { marginTop: 14 }]}>
              Date format
            </Text>
            <View style={styles.pillsRow}>
              <TouchableOpacity
                style={[styles.pill, datefmt === "DMY" && styles.pillActive]}
                onPress={() => {
                  setDatefmt("DMY");
                  save(PREF_KEYS.DATEFMT, "DMY");
                }}
              >
                <Text
                  style={[
                    styles.pillText,
                    datefmt === "DMY" && styles.pillTextActive,
                  ]}
                >
                  DD/MM/YYYY
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pill, datefmt === "MDY" && styles.pillActive]}
                onPress={() => {
                  setDatefmt("MDY");
                  save(PREF_KEYS.DATEFMT, "MDY");
                }}
              >
                <Text
                  style={[
                    styles.pillText,
                    datefmt === "MDY" && styles.pillTextActive,
                  ]}
                >
                  MM/DD/YYYY
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFBFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A" },

  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  rowTitle: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  rowSub: { fontSize: 12, color: "#64748B", marginTop: 2 },

  pillsRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  pill: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillActive: { backgroundColor: "#DBEAFE", borderColor: "#93C5FD" },
  pillText: { color: "#0F172A", fontWeight: "700", fontSize: 12 },
  pillTextActive: { color: "#1E40AF" },

  stepperRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  stepperValue: {
    minWidth: 56,
    textAlign: "center",
    fontWeight: "800",
    color: "#0F172A",
  },
});
