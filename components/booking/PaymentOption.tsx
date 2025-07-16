// PaymentOption.tsx
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  selectedOption: "PAY_NOW" | "PAY_LATER";
  onSelectOption: (value: "PAY_NOW" | "PAY_LATER") => void;
};

const PaymentOption = ({ selectedOption, onSelectOption }: Props) => {
  return (
    <View className="mx-4 mt-4">
      <Text className="text-base font-bold mb-2">
        Chọn hình thức thanh toán
      </Text>
      <View className="flex-row space-x-4">
        <TouchableOpacity
          className={`flex-1 p-4 rounded-xl border-2 ${
            selectedOption === "PAY_NOW"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
          onPress={() => onSelectOption("PAY_NOW")}
        >
          <Text className="font-semibold text-center mb-2">Trả tiền trước</Text>
          <Text className="text-gray-500 text-center text-xs">
            Thanh toán ngay sau khi đặt lịch
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 p-4 rounded-xl border-2 ${
            selectedOption === "PAY_LATER"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
          onPress={() => onSelectOption("PAY_LATER")}
        >
          <Text className="font-semibold text-center mb-2">Trả tiền sau</Text>
          <Text className="text-gray-500 text-center text-xs">
            Thanh toán tại quầy/sau khi khám
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentOption;
