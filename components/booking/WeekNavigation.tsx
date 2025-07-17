import { weekDays } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface WeekNavigationProps {
  weekDates: Date[];
  selectedDate: Date;
  onSelectDay: (date: Date, idx: number) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({
  weekDates,
  selectedDate,
  onSelectDay,
  onPrevWeek,
  onNextWeek,
}) => {
  return (
    <View className="mx-4 mt-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-gray-900">
          Select Date & Time
        </Text>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            onPress={onPrevWeek}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="chevron-back" size={20} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNextWeek}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="chevron-forward" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row space-x-3">
          {weekDays.map((day, idx) => {
            const date = weekDates[idx];
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => onSelectDay(date, idx)}
                className={`items-center p-3 rounded-xl min-w-[70px] ${
                  isSelected
                    ? "bg-blue-500"
                    : isToday
                    ? "bg-blue-100 border-2 border-blue-300"
                    : "bg-white border border-gray-200"
                }`}
              >
                <Text
                  className={`${
                    isSelected
                      ? "text-white"
                      : isToday
                      ? "text-blue-700"
                      : "text-gray-600"
                  }`}
                >
                  {day}
                </Text>
                <Text
                  className={`${
                    isSelected
                      ? "text-white"
                      : isToday
                      ? "text-blue-700"
                      : "text-gray-900"
                  } text-lg font-bold mt-1`}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default WeekNavigation;
