import { useCancelAppointment } from "@/services/appointment/hooks";
import { useGetLabResultsByAppointmentId } from "@/services/lab-results/hooks";
import { useGetMedicalRecordByAppointmentId } from "@/services/medical-record/hooks";
import { useTransferToAppointment } from "@/services/transaction/hooks";
import capitalize from "@/utils/capitalize";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppointmentDetail = () => {
  const { data } = useLocalSearchParams<{ id: string; data?: string }>();
  const appointment = data ? JSON.parse(data) : undefined;

  const { data: medicalRecord, isLoading: isMedicalLoading } =
    useGetMedicalRecordByAppointmentId(appointment?.appointmentID);

  const { data: labResults, isLoading: isLabLoading } =
    useGetLabResultsByAppointmentId(appointment?.appointmentID);

  const { mutate: cancelAppointment, isLoading: isCancelling } =
    useCancelAppointment();

  const { mutate: transferToAppointment, isLoading: isPaying } =
    useTransferToAppointment();

  const handlePayment = () => {
    transferToAppointment(
      {
        appointmentId: appointment.appointmentID,
        accountId: appointment.patient.account.id,
      },
      {
        onSuccess: () => {
          Alert.alert("Thanh toán thành công!");
          // có thể refetch lại thông tin appointment nếu muốn
        },
        onError: (error) => {
          // error.message sẽ lấy message trả về từ backend (nếu có)
          Alert.alert(
            "Lỗi thanh toán",
            error?.message || "Có lỗi xảy ra, vui lòng thử lại"
          );
        },
      }
    );
  };

  const handleCancelAppointment = () => {
    cancelAppointment(
      {
        appointmentId: appointment.appointmentID,
        patientId: appointment.patient.patientID,
      },
      {
        onSuccess: () => {
          Alert.alert("Appointment cancelled successfully!");
          router.back(); // hoặc refetch data, hoặc điều hướng lại
        },
        onError: (error) => {
          Alert.alert(
            "Cancel Failed",
            error?.message || "An error occurred, please try again."
          );
        },
      }
    );
  };

  const formatDateUTC = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      timeZone: "UTC",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "UNPAID":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Appointment Details
          </Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Appointment Information */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm border border-gray-200">
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center mb-2">
              <FontAwesome5 name="stethoscope" size={20} color="#3b82f6" />
              <Text className="text-lg font-semibold text-gray-900 ml-2">
                {appointment.medicalService.name}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View
                className={`px-2 py-1 rounded-full ${getStatusColor(
                  appointment.status
                )}`}
              >
                <Text className="text-xs font-medium">
                  {capitalize(appointment.status)}
                </Text>
              </View>
              {appointment.isAnonymous && (
                <View className="bg-purple-100 px-2 py-1 rounded-full">
                  <Text className="text-xs font-medium text-purple-800">
                    Anonymous
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="p-4 space-y-3">
            {/* Date & Time */}
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              <Text className="text-gray-900 ml-3 flex-1">
                {formatDateUTC(appointment.appointmentDate)}
              </Text>
            </View>

            {/* Doctor */}
            <View className="flex-row items-center">
              <FontAwesome5 name="user-md" size={18} color="#6b7280" />
              <Text className="text-gray-900 ml-3 flex-1">
                {appointment.doctor.name}
              </Text>
            </View>

            {/* Payment Status */}
            {appointment.status !== "cancelled" && (
              <View className="flex-row items-center">
                <MaterialIcons name="payment" size={20} color="#6b7280" />
                <View
                  className={`ml-3 px-2 py-1 rounded-full ${getPaymentStatusColor(
                    appointment.paymentStatus
                  )}`}
                >
                  <Text className="text-xs font-medium">
                    {appointment.paymentStatus}
                  </Text>
                </View>
              </View>
            )}

            {/* Online Status */}
            <View className="flex-row items-center">
              <Ionicons
                name={appointment.isOnline ? "videocam" : "location-outline"}
                size={20}
                color="#6b7280"
              />
              <Text className="text-gray-900 ml-3 flex-1">
                {appointment.isOnline
                  ? "Online Consultation"
                  : "In-Person Visit"}
              </Text>
            </View>

            {/* URL Link (if online) */}
            {appointment.isOnline && appointment.urlLink && (
              <View className="flex-row items-center">
                <Ionicons name="link-outline" size={20} color="#6b7280" />
                <TouchableOpacity className="ml-3 flex-1">
                  <Text className="text-blue-600 underline" numberOfLines={1}>
                    {appointment.urlLink}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Notes */}
            {appointment.notes && (
              <View className="mt-2">
                <View className="flex-row items-start">
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#6b7280"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-medium text-gray-700 mb-1">
                      Notes:
                    </Text>
                    <Text className="text-gray-600 leading-5">
                      {appointment.notes}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Medical Record Section */}
        {!isMedicalLoading && medicalRecord && (
          <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm border border-gray-200">
            <View className="p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <FontAwesome5 name="file-medical" size={20} color="#ef4444" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Medical Record
                </Text>
              </View>
            </View>
            <View className="p-4 space-y-3">
              {/* Diagnosis */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Diagnosis:
                </Text>
                <Text className="text-gray-900">{medicalRecord.diagnosis}</Text>
              </View>

              {/* Creation Date */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Record Created:
                </Text>
                <Text className="text-gray-600">
                  {formatDateUTC(medicalRecord.createDate || "")}
                </Text>
              </View>

              {/* Medical Notes */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Medical Notes:
                </Text>
                <Text className="text-gray-600 leading-5">
                  {medicalRecord.note}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Lab Results Section */}
        {!isLabLoading && labResults && labResults.length > 0 && (
          <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm border border-gray-200">
            <View className="p-4 border-b border-gray-100">
              <View className="flex-row items-center">
                <FontAwesome5 name="flask" size={20} color="#8b5cf6" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Lab Results
                </Text>
              </View>
            </View>
            <View className="p-4">
              {labResults.map((result, index) => (
                <View
                  key={result.recordId}
                  className={`${
                    index > 0 ? "mt-4 pt-4 border-t border-gray-100" : ""
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-base font-medium text-gray-900 flex-1">
                      {result.testType}
                    </Text>
                    <View
                      className={`px-2 py-1 rounded-full ${
                        result.resultText === "Normal"
                          ? "bg-green-100"
                          : result.resultText === "Slightly Elevated"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          result.resultText === "Normal"
                            ? "text-green-800"
                            : result.resultText === "Slightly Elevated"
                            ? "text-yellow-800"
                            : "text-red-800"
                        }`}
                      >
                        {result.resultText}
                      </Text>
                    </View>
                  </View>

                  <View className="space-y-1">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">
                        Result Value:
                      </Text>
                      <Text className="text-sm font-medium text-gray-900">
                        {result.resultValue} {result.unit}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">
                        Reference Range:
                      </Text>
                      <Text className="text-sm text-gray-700">
                        {result.referenceRange}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Test Date:</Text>
                      <Text className="text-sm text-gray-700">
                        {formatDateUTC(result.testDate)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-gray-600">Lab:</Text>
                      <Text className="text-sm text-gray-700">
                        {result.performedBy}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom spacing for footer */}
        <View className="h-20" />
      </ScrollView>

      {/* Footer with Action Buttons */}
      <View className="bg-white border-t border-gray-200 px-4 py-3 ">
        <View className="flex-row space-x-3">
          {/* Make Payment: Chỉ ẩn khi đã thanh toán hoặc đã hủy */}
          {appointment.paymentStatus !== "PAID" &&
            appointment.status?.toLowerCase?.() !== "cancelled" && (
              <TouchableOpacity
                className="flex-1 bg-blue-600 py-3 rounded-lg"
                onPress={handlePayment}
                disabled={isPaying}
              >
                <View className="flex-row items-center justify-center">
                  <MaterialIcons name="payment" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    {isPaying ? "Đang thanh toán..." : "Make Payment"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          {/* Cancel Appointment: chỉ cho phép nếu chưa cancelled */}
          {appointment.status?.toLowerCase?.() !== "cancelled" &&
            appointment.status?.toLowerCase?.() !== "completed" && (
              <TouchableOpacity
                className="flex-1 bg-red-600 py-3 rounded-lg ml-3"
                onPress={handleCancelAppointment}
                disabled={isCancelling}
              >
                <View className="flex-row items-center justify-center">
                  <MaterialIcons name="cancel" size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    {isCancelling ? "Cancelling..." : "Cancel Appointment"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AppointmentDetail;
