import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const PreparationInstructions = () => {
  const { t } = useTranslation();

  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <Text className="text-gray-800 text-lg font-bold mb-4">
        {t("services.preparation")}
      </Text>
      <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={20} color="#f59e0b" />
          <View className="ml-3 flex-1">
            <Text className="text-yellow-800 font-medium mb-2">
              {t("services.beforeAppointment")}
            </Text>
            <Text className="text-yellow-700 text-sm">
              {t("services.bringIdInsurance")}
              {"\n"}
              {t("services.listMedications")}
              {"\n"}
              {t("services.arriveEarly")}
              {"\n"}
              {t("services.bringMedicalRecords")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PreparationInstructions;
