// components/history/TabMedicalHistory.tsx
import { useTranslation } from "@/hooks/useTranslation";
import { MedicalRecord } from "@/types/type";
import { ActivityIndicator, Text, View } from "react-native";
import { MedicalRecordCard } from "../appointment";

type Props = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  appointments?: MedicalRecord[];
};

const TabMedicalHistory: React.FC<Props> = ({
  isLoading,
  isError,
  error,
  appointments,
}) => {
  const { t } = useTranslation();
  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0F67FE" />
        <Text className="text-gray-500 mt-2">
          {t("history.loadingMedicalHistory")}
        </Text>
      </View>
    );
  if (isError)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">
          {error?.message || t("history.failedToLoadData")}
        </Text>
      </View>
    );
  if (!appointments || appointments.length === 0)
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text className="text-gray-500">
          {t("history.noMedicalHistoryFound")}
        </Text>
      </View>
    );

  const historyRecords = (appointments || []).filter((a) => {
    const status = (a.status || "").toString().toLowerCase().trim();
    return status === "cancelled" || status === "completed";
  });

  if (historyRecords.length === 0)
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text className="text-gray-500">
          {t("history.noMedicalHistoryFound")}
        </Text>
      </View>
    );

  return (
    <View>
      <View className="px-4 py-3"></View>
      {historyRecords.map((record) => (
        <MedicalRecordCard
          key={record.appointmentID}
          record={{
            ...record,
            status: (record.status?.toLowerCase?.() as any) ?? "pending",
          }}
        />
      ))}
    </View>
  );
};

export default TabMedicalHistory;
