import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const WhatToExpect = () => {
  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <Text className="text-gray-800 text-lg font-bold mb-4">
        What to Expect
      </Text>
      <View className="space-y-3">
        <View className="flex-row items-start">
          <View className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
            <Ionicons name="checkmark" size={12} color="#0f67fe" />
          </View>
          <Text className="text-gray-600 flex-1">
            Comprehensive consultation with experienced healthcare professionals
          </Text>
        </View>
        <View className="flex-row items-start">
          <View className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
            <Ionicons name="checkmark" size={12} color="#0f67fe" />
          </View>
          <Text className="text-gray-600 flex-1">
            Detailed examination and assessment of your health condition
          </Text>
        </View>
        <View className="flex-row items-start">
          <View className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
            <Ionicons name="checkmark" size={12} color="#0f67fe" />
          </View>
          <Text className="text-gray-600 flex-1">
            Personalized treatment recommendations and follow-up care
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WhatToExpect;
