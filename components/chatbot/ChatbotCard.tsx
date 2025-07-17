import { AppointmentDetail } from "@/services/appointment/types";
import { formatVietnameseDate } from "@/utils/format";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  appointment: AppointmentDetail;
};

const steps = [
  { key: "SCHEDULED", label: "Scheduled" },
  { key: "ONGOING", label: "Ongoing" },
  { key: "COMPLETED", label: "Completed" },
];

const ChatbotCard: React.FC<Props> = ({ appointment }) => {
  const { doctor, appointmentDate, status } = appointment;
  const appointmentStatus = (status as string) || "SCHEDULED";

  // Find current step index
  const currentStepIdx =
    appointmentStatus === "CANCELLED"
      ? -1
      : steps.findIndex((s) => s.key === appointmentStatus);

  const getStepCircleStyle = (idx: number) => {
    if (idx < currentStepIdx) return "bg-green-500";
    if (idx === currentStepIdx) return "bg-blue-500";
    return "bg-gray-300";
  };

  const getStepTextStyle = (idx: number) => {
    if (idx < currentStepIdx) return "text-green-400";
    if (idx === currentStepIdx) return "text-blue-400";
    return "text-gray-400";
  };

  const getConnectorStyle = (idx: number) => {
    if (idx < currentStepIdx) return "bg-green-500";
    if (idx === currentStepIdx) return "bg-blue-500";
    return "bg-gray-300";
  };

  return (
    <View className="bg-slate-800 rounded-2xl p-6 mb-6 overflow-hidden relative">
      {/* Doctor & service info */}
      <View className="flex-row items-center mb-3">
        <View className="flex-1">
          {appointment.medicalService?.name && (
            <Text className="text-white font-semibold text-base mb-1">
              {appointment.medicalService.name}
            </Text>
          )}
          <Text className="text-white font-semibold text-lg">
            By: {doctor?.name}
          </Text>
        </View>
      </View>

      {/* Date */}
      <Text className="text-white text-xl font-bold mb-4">
        {formatVietnameseDate(appointment.appointmentDate)}
      </Text>
      {appointment.slot && (
        <Text className="text-white text-base font-medium mb-3">
          {appointment.slot}
        </Text>
      )}

      {/* Progress status bar */}
      <View className="mt-2 mb-1">
        {appointmentStatus === "CANCELLED" ? (
          <View className="flex-1 items-center py-2">
            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-white text-xs font-bold">!</Text>
              </View>
              <Text className="text-red-500 font-bold ml-2 text-base">
                Cancelled
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.key}>
                {/* Step indicator */}
                <View className="items-center flex-1">
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center ${getStepCircleStyle(
                      idx
                    )}`}
                  >
                    <Text className="text-white text-xs font-bold">
                      {idx + 1}
                    </Text>
                  </View>
                  <Text
                    className={`text-xs mt-1 text-center ${getStepTextStyle(
                      idx
                    )}`}
                    style={{ width: 68 }}
                    numberOfLines={2}
                  >
                    {step.label}
                  </Text>
                </View>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <View
                    className={`h-1 flex-1 mx-1 rounded ${getConnectorStyle(
                      idx
                    )}`}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default ChatbotCard;
