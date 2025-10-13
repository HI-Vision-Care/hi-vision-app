import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          {t("privacy.title")}
        </Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-base text-gray-700 leading-6 mb-4">
          {t("privacy.content1")}
        </Text>

        <Text className="text-base text-gray-700 leading-6 mb-4">
          {t("privacy.content2")}
        </Text>

        <Text className="text-base text-gray-700 leading-6">
          {t("privacy.content3")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
