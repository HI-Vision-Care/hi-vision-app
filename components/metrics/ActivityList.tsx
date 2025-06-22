// components/ActivityList.tsx
import { fitnessTracker } from "@/constants";
import { ActivityItemProps, ActivityType } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";

const ActivityItem: React.FC<ActivityItemProps> = ({ item }) => {
  const pct =
    item.currentValue !== undefined && item.targetValue !== undefined
      ? (item.currentValue / item.targetValue) * 100
      : 0;

  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center flex-1">
        <View
          className={`${item.icon.bg} w-10 h-10 rounded-full items-center justify-center mr-3`}
        >
          <Ionicons
            name={item.icon.name as any}
            size={20}
            color={item.icon.color}
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold mb-1">{item.title}</Text>

          {item.type === "linear" &&
            item.currentValue !== undefined &&
            item.targetValue !== undefined && (
              <>
                <View className="flex-row items-center justify-between">
                  <Text
                    className="font-bold"
                    style={{ color: item.icon.color }}
                  >
                    {item.currentValue}
                    {item.unit}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {item.targetValue}
                    {item.unit}
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <View
                    className="h-2 rounded-full"
                    style={
                      {
                        width: `${pct}%`,
                        backgroundColor: item.icon.color,
                      } as StyleProp<ViewStyle>
                    }
                  />
                </View>
              </>
            )}

          {item.type === "status" && item.description && (
            <Text className="text-gray-600 text-sm">{item.description}</Text>
          )}

          {item.type === "tags" && item.tags && (
            <View className="flex-row items-center mt-1">
              {item.tags.map((tag) => (
                <View key={tag} className="bg-green-500 px-2 py-1 rounded mr-2">
                  <Text className="text-white text-xs">{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {item.type === "circular" &&
            item.currentValue !== undefined &&
            item.targetValue !== undefined && (
              <Text className="text-gray-600 text-sm">
                {item.currentValue}/{item.targetValue} {item.unit}
              </Text>
            )}
        </View>
      </View>

      {item.type === "status" && (
        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
      )}
      {item.type === "circular" && item.progress !== undefined && (
        <View className="w-10 h-10 items-center justify-center">
          <Text className="text-purple-600 font-bold">
            {Math.round(item.progress * 100)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const ActivityList: React.FC = () => (
  <View className="bg-gray-50 rounded-2xl p-4 mb-6">
    {fitnessTracker.map((item) => (
      <ActivityItem
        key={item.id}
        item={{ ...item, type: item.type as ActivityType }}
      />
    ))}
  </View>
);

export default ActivityList;
