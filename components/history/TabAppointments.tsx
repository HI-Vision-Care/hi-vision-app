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

const TabAppointments: React.FC<Props> = ({
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
          {t("history.loadingAppointments")}
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
          {t("history.noUpcomingAppointments")}
        </Text>
      </View>
    );
  const upcoming = appointments.filter((a) =>
    ["scheduled", "ongoing"].includes(a.status?.toLowerCase?.() || "")
  );

  if (upcoming.length === 0)
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text className="text-gray-500">
          {t("history.noUpcomingAppointments")}
        </Text>
      </View>
    );

  // --- SORT Ở ĐÂY ---
  const sortedUpcoming = upcoming
    .slice()
    .sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime()
    );

  return (
    <View>
      {sortedUpcoming.map((record) => (
        <MedicalRecordCard
          key={record.appointmentID}
          record={{
            ...record,
            status: (record.status?.toLowerCase?.() as any) ?? "ongoing",
          }}
        />
      ))}
    </View>
  );
};

export default TabAppointments;
