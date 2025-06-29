import {
  AvailableDoctors,
  HeaderBack,
  PreparationInstructions,
  WhatToExpect,
} from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceDetail() {
  const { id, data, image } = useLocalSearchParams<{
    id: string;
    data?: string;
    image?: string;
  }>();

  const service = data ? JSON.parse(decodeURIComponent(data)) : null;

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={64} color="#818ba0" />
        <Text className="text-gray-500 text-lg mt-4">Service not found</Text>
      </SafeAreaView>
    );
  }

  const handleBookAppointment = () => {
    router.push({
      pathname: "/book-service",
      params: { serviceId: service.id, serviceName: service.name },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <HeaderBack title={"Detail Booking"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Header */}
        <View className="bg-blue-600 px-6 py-8 rounded-b-3xl">
          <View className="items-center">
            <View className="bg-white/20 p-2 rounded-2xl mb-4 overflow-hidden">
              <Image
                source={{ uri: image }}
                className="w-28 h-28 rounded-xl"
                resizeMode="cover"
              />
            </View>
            <Text className="text-white text-2xl font-bold text-center">
              {service.name}
            </Text>
            <Text className="text-white/80 text-base text-center mt-2">
              {service.description}
            </Text>
          </View>
        </View>

        {/* Service Details */}
        <View className="px-6 py-6">
          <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              Service Details
            </Text>

            <View className="flex-row items-center mb-4">
              <View className="bg-green-100 p-2 rounded-full mr-4">
                <Ionicons name="card-outline" size={20} color="#10b981" />
              </View>
              <View>
                <Text className="text-gray-600 text-sm">Price</Text>
                <Text className="text-gray-800 font-semibold">
                  {service.price.toLocaleString()}₫
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="bg-purple-100 p-2 rounded-full mr-4">
                <Ionicons name="location-outline" size={20} color="#8b5cf6" />
              </View>
              <View>
                <Text className="text-gray-600 text-sm">Location</Text>
                <Text className="text-gray-800 font-semibold">
                  Healthcare Center
                </Text>
              </View>
            </View>

            {/* Service Status */}
            <View className="flex-row items-center mb-4">
              <View
                className={`p-2 rounded-full mr-4 ${
                  service.isActive ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Ionicons
                  name={
                    service.isActive
                      ? "checkmark-circle-outline"
                      : "close-circle-outline"
                  }
                  size={20}
                  color={service.isActive ? "#10b981" : "#ef4444"}
                />
              </View>
              <View>
                <Text className="text-gray-600 text-sm">Status</Text>
                <Text
                  className={`font-semibold ${
                    service.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>

            {/* Doctor Requirement */}
            <View className="flex-row items-center mb-4">
              <View
                className={`p-2 rounded-full mr-4 ${
                  service.isRequireDoctor ? "bg-orange-100" : "bg-gray-100"
                }`}
              >
                <Ionicons
                  name={
                    service.isRequireDoctor
                      ? "medical-outline"
                      : "person-outline"
                  }
                  size={20}
                  color={service.isRequireDoctor ? "#f97316" : "#6b7280"}
                />
              </View>
              <View>
                <Text className="text-gray-600 text-sm">
                  Doctor Requirement
                </Text>
                <Text className="text-gray-800 font-semibold">
                  {service.isRequireDoctor
                    ? "Doctor Required"
                    : "No Doctor Required"}
                </Text>
              </View>
            </View>

            {/* Service Availability */}
            <View className="flex-row items-center">
              <View
                className={`p-2 rounded-full mr-4 ${
                  service.isOnline ? "bg-cyan-100" : "bg-indigo-100"
                }`}
              >
                <Ionicons
                  name={service.isOnline ? "globe-outline" : "business-outline"}
                  size={20}
                  color={service.isOnline ? "#06b6d4" : "#6366f1"}
                />
              </View>
              <View>
                <Text className="text-gray-600 text-sm">Availability</Text>
                <Text className="text-gray-800 font-semibold">
                  {service.isOnline ? "Online Available" : "In-Person Only"}
                </Text>
              </View>
            </View>
          </View>

          {/* What to Expect */}
          <WhatToExpect />

          {/* Preparation Instructions */}
          <PreparationInstructions />

          {/* Available Doctors */}
          <AvailableDoctors />
        </View>
      </ScrollView>

      {/* Book Appointment Button */}
      <View className="px-6 pb-6 bg-white border-t border-gray-100">
        <TouchableOpacity
          onPress={handleBookAppointment}
          className="bg-blue-600 p-4 rounded-2xl flex-row items-center justify-center"
        >
          <Ionicons name="calendar-outline" size={24} color="white" />
          <Text className="text-white font-semibold ml-2 text-lg">
            Book Appointment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
