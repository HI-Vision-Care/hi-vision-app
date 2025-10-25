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

  const menuItems = [
    {
      icon: "shield-checkmark-outline",
      title: "Privacy Policy",
      onPress: () => Linking.openURL("https://hi-vision.io/privacy"),
    },

    {
      icon: "star-outline",
      title: "Rate Our App",
      onPress: () => {
        // App Store rating logic
        console.log("Rate app");
      },
    },

    {
      icon: "people-outline",
      title: "Partner With Us",
      onPress: () => Linking.openURL("https://hi-vision.io/partners"),
    },
    {
      icon: "chatbubble-outline",
      title: "Submit Feedback",
      onPress: () => Linking.openURL("mailto:support@hi-vision.io"),
    },
  ];

  const socialLinks = [
    {
      icon: "logo-facebook",
      url: "https://www.facebook.com/profile.php?id=61580889901766",
    },
    {
      icon: "logo-instagram",
      url: "https://www.instagram.com/hivision14092025/",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#374151" }}>
            About Us
          </Text>
        </View>

        {/* App Logo & Info */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Image source={images.logo} style={{ width: 100, height: 100 }} />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 4,
            }}
          >
            Hi-Vision
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>v1.1.4</Text>
        </View>

        {/* Menu Items */}
        <View style={{ marginBottom: 32 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Ionicons name={item.icon as any} size={20} color="#6B7280" />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "#374151",
                  fontWeight: "500",
                }}
              >
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Social Media Icons */}
        <View style={{ alignItems: "center" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "center", gap: 24 }}
          >
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(social.url)}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name={social.icon as any} size={24} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
