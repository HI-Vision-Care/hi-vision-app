import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BookButtonProps {
  onBook: () => void;
  disabled: boolean;
}

const BookButton: React.FC<BookButtonProps> = ({ onBook, disabled }) => {
  return (
    <View className="mx-4 mt-6 mb-8">
      <TouchableOpacity
        onPress={onBook}
        disabled={disabled}
        className={`py-4 rounded-xl ${
          disabled ? "bg-gray-300" : "bg-blue-500"
        }`}
      >
        <Text
          className={`text-center font-bold text-lg ${
            disabled ? "text-gray-500" : "text-white"
          }`}
        >
          Book Appointment
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookButton;
