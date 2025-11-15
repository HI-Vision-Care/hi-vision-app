import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const WhatToExpect = () => {
  const { t } = useTranslation();

  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <Text className="text-gray-800 text-lg font-bold mb-4">
        {t("services.whatToExpect")}
      </Text>
      <View className="space-y-3">
        <View className="flex-row items-start">
          <View className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
            <Ionicons name="checkmark" size={12} color="#0f67fe" />
          </View>
          <Text className="text-gray-600 flex-1">
            {t("services.comprehensiveConsultation")}
          </Text>
        </View>
        <View className="flex-row items-start">
          <View className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
            <Ionicons name="checkmark" size={12} color="#0f67fe" />
          </View>
          <Text className="text-gray-600 flex-1">
            {t("services.detailedExamination")}
          </Text>
        </View>
        <View className="flex-row items-start">
          <View className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
            <Ionicons name="checkmark" size={12} color="#0f67fe" />
          </View>
          <Text className="text-gray-600 flex-1">
            {t("services.personalizedTreatment")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WhatToExpect;
