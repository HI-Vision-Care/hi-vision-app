import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SUPPORT_EMAIL = "support@hi-vision.io";
const SUPPORT_PHONE = "19001009";

export default function ContactUs() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const openMail = () => {
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject || "[Hi-Vision] Yêu cầu hỗ trợ"
    )}&body=${encodeURIComponent(message || "")}`;
    Linking.openURL(mailto).catch(() =>
      Alert.alert("Lỗi", "Không thể mở ứng dụng email.")
    );
  };

  const callHotline = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() =>
      Alert.alert("Lỗi", "Không thể thực hiện cuộc gọi.")
    );
  };

  const openZalo = () => {
    // nếu có official link của Zalo OA, thay URL bên dưới
    Linking.openURL("https://zalo.me/").catch(() =>
      Alert.alert("Lỗi", "Không thể mở Zalo.")
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Contact Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Quick Cards */}
          <View style={s.cardsRow}>
            <TouchableOpacity
              style={[s.card, { backgroundColor: "#DBEAFE" }]}
              onPress={openMail}
            >
              <Ionicons name="mail-outline" size={22} color="#1E3A8A" />
              <Text style={[s.cardText, { color: "#1E3A8A" }]}>Email</Text>
              <Text style={s.cardSub}>{SUPPORT_EMAIL}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.card, { backgroundColor: "#DCFCE7" }]}
              onPress={callHotline}
            >
              <Ionicons name="call-outline" size={22} color="#166534" />
              <Text style={[s.cardText, { color: "#166534" }]}>Hotline</Text>
              <Text style={s.cardSub}>{SUPPORT_PHONE}</Text>
            </TouchableOpacity>
          </View>

          <View style={s.cardsRow}>
            <TouchableOpacity
              style={[s.card, { backgroundColor: "#FEF3C7" }]}
              onPress={openZalo}
            >
              <Ionicons name="chatbubbles-outline" size={22} color="#92400E" />
              <Text style={[s.cardText, { color: "#92400E" }]}>Zalo/Chat</Text>
              <Text style={s.cardSub}>Kênh hỗ trợ trực tuyến</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.card, { backgroundColor: "#F1F5F9" }]}
              onPress={() => Linking.openURL("https://hi-vision.io")}
            >
              <Ionicons name="globe-outline" size={22} color="#0F172A" />
              <Text style={[s.cardText, { color: "#0F172A" }]}>Website</Text>
              <Text style={s.cardSub}>hi-vision.io</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={s.form}>
            <Text style={s.formTitle}>Gửi yêu cầu hỗ trợ</Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="Chủ đề"
              placeholderTextColor="#94A3B8"
              style={s.input}
            />
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Nội dung..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={[s.input, s.textarea]}
            />
            <TouchableOpacity style={s.submitBtn} onPress={openMail}>
              <Ionicons name="send" size={18} color="#FFFFFF" />
              <Text style={s.submitText}>Gửi Email</Text>
            </TouchableOpacity>
            <Text style={s.hint}>
              * Chúng tôi phản hồi trong giờ hành chính. Nếu khẩn cấp, vui lòng
              gọi hotline.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
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

  cardsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
  },
  cardText: { marginTop: 8, fontWeight: "800", fontSize: 14 },
  cardSub: { marginTop: 2, color: "#334155", fontSize: 12 },

  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    marginTop: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#0F172A",
    marginBottom: 10,
  },
  textarea: { height: 140 },
  submitBtn: {
    backgroundColor: "#2563EB",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  submitText: { color: "#FFFFFF", fontWeight: "800" },
  hint: { marginTop: 8, color: "#64748B", fontSize: 12 },
});
