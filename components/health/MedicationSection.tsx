import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const MedicationSection = () => {
  return (
    <>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-gray-900 text-lg font-semibold">
          Medication Management
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-500 text-sm font-medium">See All</Text>
        </TouchableOpacity>
      </View>

      {/* Card chính */}
      <View className="bg-gray-50 rounded-2xl p-4 mb-6">
        {/* Số meds + nút add */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-gray-900 text-3xl font-bold">205</Text>
            <Text className="text-gray-600 text-sm">Medications</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Medication Calendar Grid */}
        <View className="mb-4">
          {[...Array(4)].map((_, rowIndex) => (
            <View key={rowIndex} className="flex-row justify-between mb-2">
              {[...Array(7)].map((_, colIndex) => {
                const pillTypes = ["bg-blue-500", "bg-red-500", "bg-gray-400"];
                const randomType =
                  pillTypes[Math.floor(Math.random() * pillTypes.length)];
                return (
                  <View
                    key={colIndex}
                    className={`w-8 h-8 ${randomType} rounded-lg`}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View className="flex-row justify-between">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
            <Text className="text-gray-600 text-xs">Taken</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
            <Text className="text-gray-600 text-xs">Missed</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-gray-400 rounded-full mr-2" />
            <Text className="text-gray-600 text-xs">Skipped</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default MedicationSection;
