import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const PreparationInstructions = () => {
  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <Text className="text-gray-800 text-lg font-bold mb-4">Preparation</Text>
      <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={20} color="#f59e0b" />
          <View className="ml-3 flex-1">
            <Text className="text-yellow-800 font-medium mb-2">
              Before your appointment:
            </Text>
            <Text className="text-yellow-700 text-sm">
              • Bring your ID and insurance card{"\n"}• List current medications
              {"\n"}• Arrive 15 minutes early
              {"\n"}• Bring any relevant medical records
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PreparationInstructions;
