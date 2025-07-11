import { AvailabilityMap } from "@/app/(root)/book-service";
import { Text, TouchableOpacity, View } from "react-native";

interface TimeSlotsProps {
  timeSlots: string[];
  availability: AvailabilityMap;
  selectedDay: string;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  timeSlots,
  availability,
  selectedDay,
  selectedTime,
  onSelectTime,
}) => {
  const allUnavailable =
    timeSlots.length === 0 ||
    timeSlots.every((time) => {
      const status = availability[selectedDay]?.[time] ?? "";
      return status !== "Available";
    });

  return (
    <View className="bg-white rounded-xl p-4 shadow-sm mx-4">
      <Text className="font-semibold text-gray-900 mb-3">Available Times</Text>
      <View className="flex-row flex-wrap gap-3">
        {allUnavailable ? (
          <View className="w-full items-center py-4">
            <Text className="text-gray-400 italic">No available slots</Text>
          </View>
        ) : (
          timeSlots.map((time) => {
            const status = availability[selectedDay]?.[time] ?? "";
            const isAvailable = status === "Available";
            const isSelected = time === selectedTime;
            return (
              <TouchableOpacity
                key={time}
                onPress={() => isAvailable && onSelectTime(time)}
                disabled={!isAvailable}
                className={`px-4 py-3 rounded-lg border ${
                  isSelected
                    ? "bg-blue-500 border-blue-500"
                    : isAvailable
                    ? "bg-white border-gray-300"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                <View className="items-center">
                  <Text
                    className={`font-medium ${
                      isSelected
                        ? "text-white"
                        : isAvailable
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {time}
                  </Text>
                  <Text className="text-xs text-red-500 mt-1">
                    {status === "Booked"
                      ? "Booked"
                      : status === "Cancelled"
                      ? "Cancelled"
                      : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};

export default TimeSlots;
