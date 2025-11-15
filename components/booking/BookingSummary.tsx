import { useTranslation } from "@/hooks/useTranslation";
import { Service } from "@/types/type";
import { formatDate, formatVND } from "@/utils/format";
import React from "react";
import { Text, View } from "react-native";

interface BookingSummaryProps {
  service: Service;
  selectedDate: Date; // <- Đổi sang Date
  selectedTime: string;
  weekDates: Date[];
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  service,
  selectedDate,
  selectedTime,
  weekDates,
}) => {
  const { t } = useTranslation();
  return (
    <View className="mx-4 mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
      <Text className="font-bold text-blue-900 mb-2">
        {t("booking.bookingSummary")}
      </Text>
      <View className="space-y-1">
        <Text className="text-blue-800">
          {t("booking.service")} {service.name}
        </Text>
        <Text className="text-blue-800">
          {t("booking.date")} {formatDate(selectedDate)}
        </Text>
        <Text className="text-blue-800">
          {t("booking.time")} {selectedTime}
        </Text>

        <Text className="font-bold text-blue-900 mt-2">
          {t("booking.total")} {formatVND(service.price)}
        </Text>
      </View>
    </View>
  );
};

export default BookingSummary;
