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
  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0F67FE" />
        <Text className="text-gray-500 mt-2">Loading appointments...</Text>
      </View>
    );
  if (isError)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">
          {error?.message || "Failed to load data."}
        </Text>
      </View>
    );
  if (!appointments || appointments.length === 0)
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text className="text-gray-500">No upcoming appointments.</Text>
      </View>
    );
  const upcoming = appointments.filter(
    (a) => a.status?.toLowerCase?.() === "scheduled"
  );

  if (upcoming.length === 0)
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text className="text-gray-500">No upcoming appointments.</Text>
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
  // Nếu muốn "lịch hẹn sớm nhất" lên đầu thì đổi b, a thành a, b

  return (
    <View>
      {sortedUpcoming.map((record) => (
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

export default TabAppointments;
