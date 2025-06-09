// components/ChatbotCard.tsx
import { icons, images } from "@/constants";
import React from "react";
import {
  Image,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ChatbotCardProps {
  plan: string;
  count: number;
  onAddPress?: () => void;
}

const ChatbotCard: React.FC<ChatbotCardProps> = ({
  plan,
  count,
  onAddPress,
}) => (
  <View className="bg-slate-800 rounded-2xl p-6 mb-6 overflow-hidden relative">
    {/* Pill + Add */}
    <View className="flex-row items-center justify-between">
      <View className="px-3 py-1 rounded bg-blue-600">
        <Text className="text-white text-xs font-semibold">{plan}</Text>
      </View>
      <TouchableOpacity
        className="w-10 h-10 bg-blue-500 rounded-md items-center justify-center"
        onPress={onAddPress}
      >
        <Image
          source={icons.add}
          resizeMode="contain"
          className="w-5 h-5"
          style={{ tintColor: "white" }}
        />
      </TouchableOpacity>
    </View>

    {/* Stats */}
    <Text className="text-white text-4xl font-bold mt-4">
      {count.toLocaleString()}
    </Text>
    <Text className="text-gray-300 text-sm">Total</Text>
    <Text className="text-gray-300 text-sm">AI Health Chatbot</Text>
    <Text className="text-gray-300 text-sm">Conversations</Text>

    {/* Background illustration (thay bằng asset thật của bạn) */}
    <Image
      source={images.robot}
      style={
        {
          position: "absolute",
          right: -30,
          bottom: -20,
          width: 250,
          height: 200,
          opacity: 0.5,
        } as StyleProp<ViewStyle>
      }
      resizeMode="contain"
    />
  </View>
);

export default ChatbotCard;
