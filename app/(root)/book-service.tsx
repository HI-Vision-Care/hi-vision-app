import { HeaderBack } from "@/components";
import { useGetDoctors } from "@/services/doctor/hooks";
import { BookingData } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ServiceBookingScreen: React.FC = () => {
  const { serviceId, serviceName } = useLocalSearchParams<{
    serviceId: string;
    serviceName?: string;
  }>();

  useEffect(() => {
    console.log("Booking params =>", serviceId, serviceName);
  }, [serviceId, serviceName]);

  const [bookingData, setBookingData] = useState<BookingData>({
    service: serviceId ?? "",
    doctor: "",
    date: new Date(),
    isAnonymous: false,
    notes: "",
  });
  // Sync bookingData.service when param arrives/changes
  useEffect(() => {
    if (serviceId) {
      setBookingData((prev) => ({ ...prev, service: serviceId }));
    }
  }, [serviceId]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: doctorsData,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useGetDoctors();

  const doctorOptions = [
    { label: "Select a doctor...", value: "" },
    ...(doctorsData?.map((d) => ({
      label: `${d.name} – ${d.specialty}`,
      value: d.doctorID,
    })) || []),
    { label: "Any Available Doctor", value: "any_doctor" },
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setBookingData({ ...bookingData, date: selectedDate });
    }
  };

  const validateForm = (): boolean => {
    // If serviceName provided, skip service selection
    const selectedService =
      bookingData.service ||
      serviceId ||
      (serviceName ? serviceId || "unknown" : "");
    if (!selectedService) {
      Alert.alert("Error", "Please select a service");
      return false;
    }
    if (!bookingData.doctor) {
      Alert.alert("Error", "Please select a doctor");
      return false;
    }
    if (bookingData.date < new Date()) {
      Alert.alert("Error", "Please select a future date");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    // TODO: replace with real API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Booking Confirmed",
        `Your appointment for ${
          serviceName || bookingData.service
        } on ${bookingData.date.toDateString()} has been booked.`,
        [{ text: "OK" }]
      );
    }, 2000);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <HeaderBack title={"Booking Screen"} />
      <ScrollView className="flex-1 bg-[#f2f5f9]">
        <View className="px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Book Your Appointment
            </Text>
            <Text className="text-base text-gray-600 leading-6">
              Schedule your confidential HIV services appointment. All
              information is kept strictly private.
            </Text>
          </View>

          {/* Service Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Service Required *
            </Text>
            {serviceName ? (
              <View className="bg-white rounded-xl border border-gray-200 p-4">
                <Text className="text-base text-gray-900">{serviceName}</Text>
              </View>
            ) : (
              <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <Picker
                  selectedValue={bookingData.service}
                  onValueChange={(value) =>
                    setBookingData((prev) => ({
                      ...prev,
                      service: String(value),
                    }))
                  }
                  mode="dropdown"
                  style={{ height: 50, width: "100%" }}
                >
                  <Picker.Item
                    label="Select a service..."
                    value=""
                    color="#9CA3AF"
                  />
                  <Picker.Item
                    label="HIV Testing & Counseling"
                    value="hiv_testing"
                  />
                  <Picker.Item
                    label="PrEP Consultation"
                    value="prep_consultation"
                  />
                  <Picker.Item
                    label="HIV Treatment Follow-up"
                    value="hiv_treatment"
                  />
                  <Picker.Item
                    label="Sexual Health Screening"
                    value="sexual_health"
                  />
                  <Picker.Item
                    label="Support & Counseling"
                    value="counseling"
                  />
                </Picker>
              </View>
            )}
          </View>

          {/* Doctor Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Preferred Doctor *
            </Text>
            <View className="bg-white rounded-xl border border-gray-200 overflow-visible">
              <Picker
                selectedValue={bookingData.doctor}
                onValueChange={(value) =>
                  setBookingData({ ...bookingData, doctor: value })
                }
                enabled={!doctorsLoading}
                mode="dropdown" // ép dùng dropdown trên cả iOS/Android
                style={{
                  height: 50,
                  width: "100%", // bắt buộc phải có width
                }}
              >
                {doctorOptions.map((doc) => (
                  <Picker.Item
                    key={doc.value}
                    label={doc.label}
                    value={doc.value}
                    color={doc.value === "" ? "#9CA3AF" : "#111827"}
                  />
                ))}
              </Picker>
            </View>
            {doctorsLoading && (
              <Text className="mt-2 text-sm text-gray-500">
                Loading doctors…
              </Text>
            )}
            {doctorsError && (
              <Text className="mt-2 text-sm text-red-500">
                Error loading doctors
              </Text>
            )}
          </View>

          {/* Date Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Preferred Date *
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-white rounded-xl border border-gray-200 p-4 flex-row items-center justify-between"
            >
              <Text className="text-base text-gray-900">
                {formatDate(bookingData.date)}
              </Text>
              <Ionicons name="calendar-outline" size={24} color="#0f67fe" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={bookingData.date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Anonymous Option */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={() =>
                setBookingData({
                  ...bookingData,
                  isAnonymous: !bookingData.isAnonymous,
                })
              }
              className="bg-white rounded-xl border border-gray-200 p-4 flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                  Anonymous Appointment
                </Text>
                <Text className="text-sm text-gray-600">
                  Keep your identity private during the appointment
                </Text>
              </View>
              <View
                className={`w-12 h-6 rounded-full ${
                  bookingData.isAnonymous ? "bg-[#0f67fe]" : "bg-gray-300"
                } flex-row items-center ${
                  bookingData.isAnonymous ? "justify-end" : "justify-start"
                } px-1`}
              >
                <View className="w-4 h-4 bg-white rounded-full" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Notes Section */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Additional Notes
            </Text>
            <TextInput
              value={bookingData.notes}
              onChangeText={(text) =>
                setBookingData({ ...bookingData, notes: text })
              }
              placeholder="Any specific concerns, symptoms, or requests you'd like to discuss..."
              multiline
              numberOfLines={4}
              className="bg-white rounded-xl border border-gray-200 p-4 text-base text-gray-900 min-h-[100px]"
              textAlignVertical="top"
            />
          </View>

          {/* Privacy Notice */}
          <View className="bg-[#8a3ffc]/10 rounded-xl p-4 mb-6 border border-[#8a3ffc]/20">
            <View className="flex-row items-start">
              <Ionicons name="shield-checkmark" size={20} color="#8a3ffc" />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-medium text-[#8a3ffc] mb-1">
                  Your Privacy is Protected
                </Text>
                <Text className="text-xs text-gray-600 leading-4">
                  All appointments and medical information are kept strictly
                  confidential in accordance with HIPAA regulations.
                </Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className={`rounded-xl p-4 flex-row items-center justify-center ${
              isLoading ? "bg-gray-400" : "bg-[#0f67fe]"
            }`}
          >
            {isLoading ? (
              <Text className="text-white text-lg font-semibold">
                Booking Appointment...
              </Text>
            ) : (
              <>
                <Text className="text-white text-lg font-semibold mr-2">
                  Book Appointment
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          {/* Help Section */}
          <View className="mt-8 pt-6 border-t border-gray-200">
            <Text className="text-center text-sm text-gray-600 mb-4">
              Need help or have questions?
            </Text>
            <View className="flex-row justify-center space-x-6">
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="call" size={16} color="#0f67fe" />
                <Text className="text-[#0f67fe] text-sm font-medium ml-2">
                  Call Us
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="chatbubble" size={16} color="#0f67fe" />
                <Text className="text-[#0f67fe] text-sm font-medium ml-2">
                  Live Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceBookingScreen;
