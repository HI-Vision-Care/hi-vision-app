import { Text, View } from "react-native";

const AsklepiosScoreCard = () => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
      <View className="flex-row items-center">
        {/* Score Section - Purple Container */}
        <View className="bg-purple-500 rounded-2xl w-20 h-20 items-center justify-center mr-4">
          <Text className="text-white text-3xl font-bold">88</Text>
        </View>

        {/* Content Section */}
        <View className="flex-1">
          <Text className="text-gray-900 text-lg font-semibold mb-2">
            Asklepios Score
          </Text>
          <Text className="text-gray-500 text-sm leading-5">
            Based on your data, we think your health status is above average.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AsklepiosScoreCard;
