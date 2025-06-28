import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface BookingData {
  service: string;
  doctor: string;
  date: Date;
  isAnonymous: boolean;
  notes: string;
}

const ServiceBookingScreen: React.FC = () => {
  const [bookingData, setBookingData] = useState<BookingData>({
    service: "",
    doctor: "",
    date: new Date(),
    isAnonymous: false,
    notes: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const services = [
    { label: "Select a service...", value: "" },
    { label: "HIV Testing & Counseling", value: "hiv_testing" },
    { label: "PrEP Consultation", value: "prep_consultation" },
    { label: "HIV Treatment Follow-up", value: "hiv_treatment" },
    { label: "Sexual Health Screening", value: "sexual_health" },
    { label: "Support & Counseling", value: "counseling" },
  ];

  const doctors = [
    { label: "Select a doctor...", value: "" },
    { label: "Dr. Sarah Johnson - HIV Specialist", value: "dr_johnson" },
    { label: "Dr. Michael Chen - Infectious Disease", value: "dr_chen" },
    { label: "Dr. Emily Rodriguez - Sexual Health", value: "dr_rodriguez" },
    { label: "Dr. David Thompson - General Practice", value: "dr_thompson" },
    { label: "Any Available Doctor", value: "any_doctor" },
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setBookingData({ ...bookingData, date: selectedDate });
    }
  };

  const validateForm = (): boolean => {
    if (!bookingData.service) {
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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Booking Confirmed",
        "Your appointment has been successfully booked. You will receive a confirmation shortly.",
        [{ text: "OK", onPress: () => console.log("Booking confirmed") }]
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
    <ScrollView className="flex-1 bg-[#f2f5f9]">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Book Your Appointment
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            Schedule your confidential HIV services appointment. All information
            is kept strictly private.
          </Text>
        </View>

        {/* Service Selection */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Service Required *
          </Text>
          <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <Picker
              selectedValue={bookingData.service}
              onValueChange={(value) =>
                setBookingData({ ...bookingData, service: value })
              }
              style={{ height: 50 }}
            >
              {services.map((service) => (
                <Picker.Item
                  key={service.value}
                  label={service.label}
                  value={service.value}
                  color={service.value === "" ? "#9CA3AF" : "#111827"}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Doctor Selection */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Preferred Doctor *
          </Text>
          <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <Picker
              selectedValue={bookingData.doctor}
              onValueChange={(value) =>
                setBookingData({ ...bookingData, doctor: value })
              }
              style={{ height: 50 }}
            >
              {doctors.map((doctor) => (
                <Picker.Item
                  key={doctor.value}
                  label={doctor.label}
                  value={doctor.value}
                  color={doctor.value === "" ? "#9CA3AF" : "#111827"}
                />
              ))}
            </Picker>
          </View>
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
  );
};

export default ServiceBookingScreen;
