import { weekDays } from "@/constants";
import { Service } from "@/types/type";
import { formatVND } from "@/utils/format";
import React from "react";
import { Text, View } from "react-native";

interface BookingSummaryProps {
  service: Service;
  selectedDay: string;
  selectedTime: string;
  weekDates: Date[];
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  service,
  selectedDay,
  selectedTime,
  weekDates,
}) => {
  const date = weekDates[weekDays.indexOf(selectedDay)];

  return (
    <View className="mx-4 mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
      <Text className="font-bold text-blue-900 mb-2">Booking Summary</Text>
      <View className="space-y-1">
        <Text className="text-blue-800">Service: {service.name}</Text>
        <Text className="text-blue-800">
          Date: {selectedDay}, {date.toLocaleDateString("vi-VN")}
        </Text>
        <Text className="text-blue-800">Time: {selectedTime}</Text>

        <Text className="font-bold text-blue-900 mt-2">
          Total: {formatVND(service.price)}
        </Text>
      </View>
    </View>
  );
};

export default BookingSummary;
