// app/coming-soon.tsx
import { images } from "@/constants"; // optional: images.comingSoon
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Clock, Home, Rocket } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ComingSoon() {
  const router = useRouter();
  const { feature, eta } = useLocalSearchParams<{
    feature?: string;
    eta?: string;
  }>();

  const title = feature ? `${feature} • Coming Soon` : "Coming Soon";
  const subtitle = feature
    ? `Tính năng “${feature}” đang được hoàn thiện.`
    : "Tính năng này đang được hoàn thiện.";
  const etaText = eta ? `Dự kiến: ${eta}` : "Dự kiến ra mắt sớm nhất có thể";

  return (
    <LinearGradient
      colors={["#F0F9FF", "#FFFFFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color="#334155" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hi-Vision</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Illustration */}
          <View style={styles.illustrationWrap}>
            {images?.comingSoon ? (
              <Image
                source={images.comingSoon}
                style={styles.illustration}
                resizeMode="contain"
              />
            ) : (
              <Rocket size={84} color="#1D4ED8" />
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {subtitle} Cảm ơn bạn đã kiên nhẫn chờ đợi!
          </Text>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={[styles.badge, styles.badgePrimary]}>
              <Rocket size={16} color="#1E40AF" />
              <Text style={styles.badgePrimaryText}>Đang phát triển</Text>
            </View>
            <View style={[styles.badge, styles.badgeSoft]}>
              <Clock size={16} color="#0F172A" />
              <Text style={styles.badgeSoftText}>{etaText}</Text>
            </View>
          </View>

          {/* Progress fake (mang tính visual) */}
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>~ 70% hoàn thành</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnPrimary]}
            onPress={() => router.push("/")}
          >
            <Home size={18} color="#FFFFFF" />
            <Text style={styles.btnPrimaryText}>Về trang chủ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.btnGhost]}
            onPress={() => router.back()}
          >
            <Text style={styles.btnGhostText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  illustrationWrap: {
    width: 320,
    height: 240,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgePrimary: {
    backgroundColor: "#DBEAFE",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  badgePrimaryText: {
    color: "#1E40AF",
    fontWeight: "700",
    fontSize: 12,
  },
  badgeSoft: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  badgeSoftText: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 12,
  },
  progressWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  progressTrack: {
    width: 240,
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 999,
  },
  progressText: {
    marginTop: 8,
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
  },
  actions: {
    paddingBottom: 22,
    gap: 10,
  },
  actionBtn: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: "#2563EB",
  },
  btnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  btnGhost: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  btnGhostText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
  },
});
