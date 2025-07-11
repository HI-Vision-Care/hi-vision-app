import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export interface ServiceDetailsProps {
  duration: number;
  price: number;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ duration, price }) => (
  <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
    <Text className="text-gray-800 text-lg font-bold mb-4">
      Service Details
    </Text>
    <View className="flex-row items-center mb-4">
      <View className="bg-blue-100 p-2 rounded-full mr-4">
        <Ionicons name="time-outline" size={20} color="#0f67fe" />
      </View>
      <View>
        <Text className="text-gray-600 text-sm">Duration</Text>
        <Text className="text-gray-800 font-semibold">{duration} minutes</Text>
      </View>
    </View>
    <View className="flex-row items-center">
      <View className="bg-green-100 p-2 rounded-full mr-4">
        <Ionicons name="card-outline" size={20} color="#10b981" />
      </View>
      <View>
        <Text className="text-gray-600 text-sm">Price</Text>
        <Text className="text-gray-800 font-semibold">
          {price.toLocaleString()}₫
        </Text>
      </View>
    </View>
  </View>
);

export default ServiceDetails;
