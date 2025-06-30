import { Text, TouchableOpacity } from "react-native";

const TabButton: React.FC<{
  title: string;
  isActive: boolean;
  onPress: () => void;
}> = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 py-4 items-center border-b-2 ${
      isActive ? "border-[#0F67FE]" : "border-transparent"
    }`}
  >
    <Text
      className={`text-base ${
        isActive ? "text-[#0F67FE] font-semibold" : "text-gray-500 font-normal"
      }`}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export default TabButton;
