// app/about.tsx
import { images } from "@/constants";
import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>

        {/* Logo & Version */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Image
            source={images.logo}
            style={{ width: 80, height: 80, marginBottom: 12 }}
          />
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#111827" }}>
            {t("about.appName")}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>
            {t("about.version")}
          </Text>
        </View>

        {/* Mission */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 6,
            color: "#111827",
          }}
        >
          {t("about.mission")}
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 22,
            color: "#374151",
            marginBottom: 20,
          }}
        >
          {t("about.missionDescription")}
        </Text>

        {/* Organization */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 6,
            color: "#111827",
          }}
        >
          {t("about.organization")}
        </Text>
        <Text style={{ fontSize: 14, color: "#374151", marginBottom: 20 }}>
          {t("about.organizationDescription")}
        </Text>

        {/* Contact */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 6,
            color: "#111827",
          }}
        >
          {t("about.contactSupport")}
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:support@hi-vision.io")}
        >
          <Text style={{ fontSize: 14, color: "#2563EB", marginBottom: 4 }}>
            {t("about.email")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("tel:19001009")}>
          <Text style={{ fontSize: 14, color: "#2563EB", marginBottom: 20 }}>
            {t("about.hotline")}
          </Text>
        </TouchableOpacity>

        {/* Legal */}
        <TouchableOpacity onPress={() => router.push("/privacy")}>
          <Text style={{ fontSize: 14, color: "#2563EB", marginBottom: 8 }}>
            {t("about.privacyPolicy")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/terms")}>
          <Text style={{ fontSize: 14, color: "#2563EB" }}>
            {t("about.termsOfService")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
