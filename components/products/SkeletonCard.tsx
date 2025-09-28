import { Dimensions, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - 48) / 2;

const SkeletonCard = () => (
  <View
    className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    style={{ width: cardWidth, marginBottom: 16 }}
  >
    <View className="w-full h-36 bg-gray-200" />
    <View className="p-3 space-y-2">
      <View className="w-20 h-4 bg-gray-200 rounded-full" />
      <View className="w-full h-4 bg-gray-200 rounded" />
      <View className="w-16 h-5 bg-gray-200 rounded" />
    </View>
  </View>
);

export default SkeletonCard;
