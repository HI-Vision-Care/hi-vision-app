import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface BookAppointmentButtonProps {
  onPress: () => void;
}

const BookAppointmentButton: React.FC<BookAppointmentButtonProps> = ({
  onPress,
}) => (
  <View className="px-6 pb-6 bg-white border-t border-gray-100">
    <TouchableOpacity
      onPress={onPress}
      className="bg-blue-600 p-4 rounded-2xl flex-row items-center justify-center"
    >
      <Ionicons name="calendar-outline" size={24} color="white" />
      <Text className="text-white font-semibold ml-2 text-lg">
        Book Appointment
      </Text>
    </TouchableOpacity>
  </View>
);
export default BookAppointmentButton;
