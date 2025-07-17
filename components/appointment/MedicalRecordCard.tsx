import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";

// Enhanced MedicalRecord type with new fields
interface MedicalRecord {
  id?: string;
  appointmentDate?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  status: "completed" | "ongoing" | "cancelled" | "in-progress" | "scheduled";
  isAnonymous?: boolean;
  urlLink?: string;
  note?: string;
  paymentStatus?: "PAID" | "UNPAID" | "ongoing" | string;
  medicalService?: {
    name: string;
    price?: number;
  };
  doctor: {
    name: string;
    account: {
      email: string;
      phone: string;
    };
  };
}

const getPaymentConfig = (status: string) => {
  const configs = {
    PAID: {
      color: "#10B981",
      bgColor: "#ECFDF5",
      icon: "checkmark-done",
      label: "Paid",
    },
    UNPAID: {
      color: "#EF4444",
      bgColor: "#FEE2E2",
      icon: "close-circle",
      label: "Unpaid",
    },
    ONGOING: {
      color: "#F59E0B",
      bgColor: "#FEF3C7",
      icon: "time",
      label: "ONGOING",
    },
  };
  // fallback (e.g. missing status)
  return (
    configs[status as keyof typeof configs] || {
      color: "#6B7280",
      bgColor: "#F3F4F6",
      icon: "help-circle",
      label: "Unknown",
    }
  );
};

const MedicalRecordCard: React.FC<{
  record: MedicalRecord;
  onViewDetails?: (record: MedicalRecord) => void;
}> = ({ record, onViewDetails }) => {
  const [expanded, setExpanded] = useState(false);

  const utcDateString = record.appointmentDate ?? "";
  const datePart = utcDateString.slice(0, 10);
  const timePart = utcDateString.slice(11, 16);
  const formatted = datePart.split("-").reverse().join("/") + " " + timePart;

  // Status config
  const getStatusConfig = (status: string) => {
    const configs = {
      completed: {
        color: "#10B981",
        bgColor: "#D1FAE5",
        icon: "checkmark-circle" as const,
        label: "Completed",
      },
      ongoing: {
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        icon: "time" as const,
        label: "Ongoing",
      },
      cancelled: {
        color: "#EF4444",
        bgColor: "#FEE2E2",
        icon: "close-circle" as const,
        label: "Cancelled",
      },
      "in-progress": {
        color: "#3B82F6",
        bgColor: "#DBEAFE",
        icon: "play-circle" as const,
        label: "In Progress",
      },
      scheduled: {
        color: "#6366F1",
        bgColor: "#E0E7FF",
        icon: "calendar" as const,
        label: "Scheduled",
      },
    };
    return configs[status as keyof typeof configs] || configs.ongoing;
  };

  const statusConfig = getStatusConfig(record.status);
  const paymentConfig = getPaymentConfig(record.paymentStatus ?? "");

  console.log(utcDateString);

  return (
    <View className="bg-white mx-4 mt-3 rounded-xl shadow-sm border border-gray-100">
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className="p-4 active:bg-gray-50"
        accessibilityRole="button"
        accessibilityLabel={`Medical record for ${
          record.medicalService?.name ?? "Unknown service"
        }, tap to ${expanded ? "collapse" : "expand"} details`}
      >
        <View className="flex-row items-start">
          {/* Service Icon */}
          <View className="w-12 h-12 bg-[#9EEFF0] rounded-full items-center justify-center mr-3">
            <Ionicons name="medical" size={20} color="#0F67FE" />
          </View>

          <View className="flex-1">
            {/* Header with Service Name and Status & Payment */}
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1 mr-2">
                <View className="flex- items-start">
                  <Text
                    className="text-base font-semibold text-gray-900"
                    numberOfLines={1}
                  >
                    {record.medicalService?.name ?? "Unknown service"}
                  </Text>
                  {typeof record.medicalService?.price === "number" && (
                    <View className="flex-row items-center ml-2 px-2 py-0.5 bg-blue-50 rounded-full">
                      <Ionicons name="pricetag" size={13} color="#2563EB" />
                      <Text className="ml-1 text-blue-700 font-semibold text-xs">
                        {record.medicalService.price.toLocaleString()}₫
                      </Text>
                    </View>
                  )}
                </View>

                {record.urlLink && (
                  <Ionicons
                    name="videocam"
                    size={16}
                    color="#0F67FE"
                    style={{ marginLeft: 4 }}
                  />
                )}
                {record.isAnonymous && (
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="eye-off" size={12} color="#6B7280" />
                    <Text className="text-xs text-gray-500 ml-1">
                      Anonymous Record
                    </Text>
                  </View>
                )}
              </View>

              {/* Status & Payment Status (stacked vertically on small screen, horizontally on larger) */}
              <View className="items-end">
                <View
                  className="px-2 py-1 rounded-full flex-row items-center mb-1"
                  style={{
                    backgroundColor: statusConfig.bgColor,
                    minWidth: 88,
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={statusConfig.icon}
                    size={12}
                    color={statusConfig.color}
                  />
                  <Text
                    className="text-xs font-medium ml-1"
                    style={{
                      color: statusConfig.color,
                      textAlign: "center",
                      width: "auto",
                    }}
                    numberOfLines={1}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
                <View
                  className="px-2 py-1 rounded-full flex-row items-center"
                  style={{
                    backgroundColor: paymentConfig.bgColor,
                    minWidth: 88,
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name={paymentConfig.icon as any}
                    size={12}
                    color={paymentConfig.color}
                  />
                  <Text
                    className="text-xs font-medium ml-1"
                    style={{
                      color: paymentConfig.color,
                      textAlign: "center",
                      width: "auto",
                    }}
                    numberOfLines={1}
                  >
                    {paymentConfig.label}
                  </Text>
                </View>
              </View>

              {/* Expand/Collapse Icon */}
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#0F67FE"
                style={{ marginLeft: 8 }}
              />
            </View>

            {/* Doctor Information */}
            <View className="flex-row items-center mb-1">
              <Ionicons name="person" size={14} color="#666" />
              <Text className="text-sm text-gray-600 ml-1">
                Dr. {record.doctor.name}
              </Text>
            </View>

            {/* Appointment Date */}
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar" size={14} color="#666" />
              <Text className="text-sm text-gray-600 ml-1">
                {utcDateString ? formatted : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Expanded Content */}
        {expanded && (
          <View className="mt-4 pt-4 border-t border-gray-100">
            <View className="space-y-4">
              {/* Doctor Contact Information */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Doctor Contact
                </Text>
                <View className="bg-gray-50 rounded-lg p-3">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="mail" size={14} color="#0F67FE" />
                    <Text className="text-sm text-gray-600 ml-2 flex-1">
                      {record.doctor.account.email}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="call" size={14} color="#0F67FE" />
                    <Text className="text-sm text-gray-600 ml-2">
                      {record.doctor.account.phone}
                    </Text>
                  </View>
                </View>
              </View>

              {record.urlLink && (
                <View className="mb-4">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Online meeting
                  </Text>
                  <Pressable
                    onPress={() => {
                      if (record.urlLink) {
                        Linking.openURL(record.urlLink);
                      }
                    }}
                    className="flex-row items-center bg-blue-100 px-3 py-2 rounded-lg"
                  >
                    <Ionicons name="videocam" size={18} color="#2563EB" />
                    <Text className="text-blue-700 ml-2 font-semibold">
                      Join Meeting
                    </Text>
                  </Pressable>
                </View>
              )}

              {record.diagnosis && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </Text>
                  <View className="bg-blue-50 rounded-lg p-3">
                    <Text className="text-sm text-gray-700 leading-5">
                      {record.diagnosis}
                    </Text>
                  </View>
                </View>
              )}

              {record.treatment && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Treatment
                  </Text>
                  <View className="bg-green-50 rounded-lg p-3">
                    <Text className="text-sm text-gray-700 leading-5">
                      {record.treatment}
                    </Text>
                  </View>
                </View>
              )}

              {(record.notes || record.note) && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </Text>
                  <View className="bg-yellow-50 rounded-lg p-3 space-y-2">
                    {record.notes && (
                      <View>
                        <Text className="text-xs font-medium text-gray-500 mb-1">
                          Medical Notes
                        </Text>
                        <Text className="text-sm text-gray-700 leading-5">
                          {record.notes}
                        </Text>
                      </View>
                    )}
                    {record.note && (
                      <View
                        className={
                          record.notes ? "pt-2 border-t border-yellow-200" : ""
                        }
                      >
                        <Text className="text-xs font-medium text-gray-500 mb-1">
                          Your Note To Doctor
                        </Text>
                        <Text className="text-sm text-gray-700 leading-5">
                          {record.note}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Record Metadata */}
              <View className="bg-gray-50 rounded-lg p-3">
                <Text className="text-xs font-medium text-gray-500 mb-2">
                  Record Information
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={record.isAnonymous ? "eye-off" : "eye"}
                      size={12}
                      color="#6B7280"
                    />
                    <Text className="text-xs text-gray-600 ml-1">
                      {record.isAnonymous ? "Anonymous" : "Identified"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* View Details Button */}
              <View className="mt-3 items-center">
                <Pressable
                  className="flex-row items-center px-6 py-3 rounded-2xl bg-[#0F67FE] shadow-md active:opacity-80"
                  android_ripple={{ color: "#2563EB" }}
                  onPress={() => {
                    router.push({
                      pathname: "/appointments/[id]",
                      params: {
                        id: String(record.id),
                        data: JSON.stringify(record),
                      },
                    });
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="View appointment details"
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#fff"
                  />
                  <Text className="ml-2 text-base font-semibold text-white">
                    View Appointment Details
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default MedicalRecordCard;
