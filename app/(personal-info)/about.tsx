// app/about.tsx
import { images } from "@/constants";
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
            Hi-Vision
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>Version 1.0.0</Text>
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
          Sứ mệnh
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 22,
            color: "#374151",
            marginBottom: 20,
          }}
        >
          Hi-Vision mang đến hệ thống hỗ trợ điều trị và dịch vụ y tế toàn diện
          dành cho người sống chung với HIV, giúp theo dõi điều trị, quản lý
          lịch hẹn và kết nối nhanh chóng với bác sĩ.
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
          Đơn vị phát triển
        </Text>
        <Text style={{ fontSize: 14, color: "#374151", marginBottom: 20 }}>
          Được phát triển bởi Nhóm Penta-Pixel HealthTech, hợp tác cùng các
          chuyên gia y tế và tổ chức hỗ trợ cộng đồng.
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
          Liên hệ & Hỗ trợ
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:support@hi-vision.io")}
        >
          <Text style={{ fontSize: 14, color: "#2563EB", marginBottom: 4 }}>
            support@hi-vision.io
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL("tel:19001009")}>
          <Text style={{ fontSize: 14, color: "#2563EB", marginBottom: 20 }}>
            Hotline: 1900 1009
          </Text>
        </TouchableOpacity>

        {/* Legal */}
        <TouchableOpacity onPress={() => router.push("/privacy")}>
          <Text style={{ fontSize: 14, color: "#2563EB", marginBottom: 8 }}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/terms")}>
          <Text style={{ fontSize: 14, color: "#2563EB" }}>
            Terms of Service
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
