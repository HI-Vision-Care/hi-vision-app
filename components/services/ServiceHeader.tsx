import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export interface ServiceHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  description: string;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({
  icon,
  name,
  description,
}) => (
  <View className="bg-blue-600 px-6 py-8 rounded-b-3xl">
    <View className="items-center">
      <View className="bg-white/20 p-4 rounded-full mb-4">
        <Ionicons name={icon} size={48} color="white" />
      </View>
      <Text className="text-white text-2xl font-bold text-center">{name}</Text>
      <Text className="text-white/80 text-base text-center mt-2">
        {description}
      </Text>
    </View>
  </View>
);

export default ServiceHeader;
