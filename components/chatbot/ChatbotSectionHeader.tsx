// components/ChatbotSectionHeader.tsx
import React from "react";
import { Text, View } from "react-native";

interface ChatbotSectionHeaderProps {
  title: string;
  onHelpPress?: () => void;
}

const ChatbotSectionHeader: React.FC<ChatbotSectionHeaderProps> = ({
  title,
  onHelpPress,
}) => (
  <View className="flex-row justify-between items-center mb-4">
    <Text className="text-gray-900 text-lg font-semibold">{title}</Text>
    {/* <TouchableOpacity onPress={onHelpPress}>
      <View className="bg-gray-400 rounded-md p-2 flex items-center justify-center">
        <Image
          source={icons.question}
          resizeMode="contain"
          className="w-6 h-6"
          style={{ tintColor: "white" }}
        />
      </View>
    </TouchableOpacity> */}
  </View>
);

export default ChatbotSectionHeader;
