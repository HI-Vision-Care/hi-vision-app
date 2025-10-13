// PaymentOption.tsx
import { useTranslation } from "@/hooks/useTranslation";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  selectedOption: "PAY_NOW" | "PAY_LATER";
  onSelectOption: (value: "PAY_NOW" | "PAY_LATER") => void;
};

const PaymentOption = ({ selectedOption, onSelectOption }: Props) => {
  const { t } = useTranslation();
  return (
    <View className="mx-4 mt-4">
      <Text className="text-base font-bold mb-2">
        {t("booking.selectPaymentMethod")}
      </Text>
      <View className="flex-row space-x-4">
        {/* <TouchableOpacity
          className={`flex-1 p-4 rounded-xl border-2 ${
            selectedOption === "PAY_NOW"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
          onPress={() => onSelectOption("PAY_NOW")}
        >
          <Text className="font-semibold text-center mb-2">Pay By Wallet</Text>
          <Text className="text-gray-500 text-center text-xs">
            Pay immediately after booking
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          className={`flex-1 p-4 rounded-xl border-2 ${
            selectedOption === "PAY_LATER"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
          onPress={() => onSelectOption("PAY_LATER")}
        >
          <Text className="font-semibold text-center mb-2">
            {t("booking.payLater")}
          </Text>
          <Text className="text-gray-500 text-center text-xs">
            {t("booking.payLaterDescription")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentOption;
