import { icons, images } from "@/constants";
import { useRouter } from "expo-router";
import { ArrowLeft, Home } from "lucide-react-native";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#4B5563" />
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          <Image
            source={images.notFound} // ảnh local trong thư mục assets
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Not Found</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Whoops! Dr. A can&apos;t find this page :(
        </Text>

        {/* Status Code Badge */}
        <View style={styles.statusBadge}>
          <View style={styles.statusContent}>
            <Image source={icons.warning} style={styles.warningIcon} />
            <Text style={styles.statusText}>Status Code: 404</Text>
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push("/")}
        >
          <Home size={20} color="white" />
          <Text style={styles.homeButtonText}>Take Me Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  illustrationImage: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    width: 320, // trước là 280
    height: 240, // trước là 200
    marginBottom: 40,
    position: "relative",
  },
  magnifyingGlass: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  magnifyingGlassBorder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#374151",
    borderWidth: 6,
    borderColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
  },
  magnifyingGlassInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1D5DB",
    position: "relative",
  },
  magnifyingGlassHandle: {
    position: "absolute",
    right: -25,
    bottom: -25,
    width: 30,
    height: 8,
    backgroundColor: "#6B7280",
    borderRadius: 4,
    transform: [{ rotate: "45deg" }],
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9CA3AF",
  },
  dot1: {
    top: 15,
    left: 20,
  },
  dot2: {
    top: 35,
    right: 15,
  },
  dot3: {
    bottom: 20,
    left: 25,
  },
  character: {
    position: "absolute",
    right: 40,
    bottom: 20,
  },
  characterHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    marginBottom: 5,
  },
  characterBody: {
    width: 35,
    height: 60,
    backgroundColor: "#1F2937",
    borderRadius: 18,
    alignSelf: "center",
  },
  decorativeShape: {
    position: "absolute",
    borderRadius: 15,
  },
  shape1: {
    width: 30,
    height: 30,
    backgroundColor: "#FCA5A5",
    top: 40,
    right: 20,
    borderRadius: 15,
  },
  shape2: {
    width: 25,
    height: 25,
    backgroundColor: "#BFDBFE",
    bottom: 40,
    left: 40,
    borderRadius: 12,
  },
  questionMark: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FCA5A5",
    justifyContent: "center",
    alignItems: "center",
  },
  question1: {
    top: 10,
    right: 80,
  },
  question2: {
    bottom: 10,
    left: 10,
  },
  questionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  statusBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },

  statusContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // khoảng cách icon và chữ
  },

  statusText: {
    fontSize: 14,
    color: "black",
    fontWeight: "600",
  },

  warningIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  homeButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
