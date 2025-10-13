import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FAQ = { q: string; a: string; id: string };

export default function HelpCenter() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  // Get FAQs from translation
  const faqs: FAQ[] = [
    {
      id: "1",
      q: t("help.faqs.0.question"),
      a: t("help.faqs.0.answer"),
    },
    {
      id: "2",
      q: t("help.faqs.1.question"),
      a: t("help.faqs.1.answer"),
    },
    {
      id: "3",
      q: t("help.faqs.2.question"),
      a: t("help.faqs.2.answer"),
    },
    {
      id: "4",
      q: t("help.faqs.3.question"),
      a: t("help.faqs.3.answer"),
    },
    {
      id: "5",
      q: t("help.faqs.4.question"),
      a: t("help.faqs.4.answer"),
    },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [query, faqs, t]);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{t("help.title")}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search" size={18} color="#64748B" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("help.searchPlaceholder")}
          placeholderTextColor="#94A3B8"
          style={s.searchInput}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Quick links */}
      <View style={s.quickRow}>
        <TouchableOpacity
          style={[
            s.chip,
            { backgroundColor: "#DBEAFE", borderColor: "#93C5FD" },
          ]}
          onPress={() => router.push("/contact")}
        >
          <Ionicons name="chatbubbles-outline" size={16} color="#1E40AF" />
          <Text style={[s.chipText, { color: "#1E40AF" }]}>
            {t("help.contactSupport")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.chip}
          onPress={() => router.push("/privacy")}
        >
          <Ionicons name="shield-checkmark-outline" size={16} color="#0F172A" />
          <Text style={s.chipText}>{t("help.privacy")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.chip} onPress={() => router.push("/terms")}>
          <Ionicons name="document-text-outline" size={16} color="#0F172A" />
          <Text style={s.chipText}>{t("help.terms")}</Text>
        </TouchableOpacity>
      </View>

      {/* FAQ */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filtered.length === 0 ? (
          <Text style={s.empty}>{t("help.noResults")}</Text>
        ) : (
          filtered.map((f) => (
            <View key={f.id} style={s.item}>
              <TouchableOpacity style={s.itemHead} onPress={() => toggle(f.id)}>
                <Text style={s.itemTitle}>{f.q}</Text>
                <Ionicons
                  name={openId === f.id ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
              {openId === f.id && <Text style={s.itemBody}>{f.a}</Text>}
            </View>
          ))
        )}
        {/* Contact CTA */}
        <TouchableOpacity style={s.cta} onPress={() => router.push("/contact")}>
          <Ionicons name="help-circle-outline" size={18} color="#FFFFFF" />
          <Text style={s.ctaText}>{t("help.stillNeedHelp")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
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
  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, color: "#0F172A" },
  quickRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 999,
  },
  chipText: { fontSize: 12, fontWeight: "700", color: "#0F172A" },
  empty: { color: "#64748B", paddingHorizontal: 16, paddingTop: 8 },
  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    marginBottom: 10,
  },
  itemHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    flex: 1,
    marginRight: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  itemBody: { marginTop: 8, color: "#475569", lineHeight: 20 },
  cta: {
    marginTop: 8,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: { color: "#FFFFFF", fontWeight: "800" },
});
