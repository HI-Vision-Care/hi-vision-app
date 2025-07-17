import {
  AvailableDoctors,
  HeaderBack,
  PreparationInstructions,
  WhatToExpect,
} from "@/components";
import { DetailItemProps, TestItemProps } from "@/types/type";
import { formatVND } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceDetail() {
  const { data, image } = useLocalSearchParams<{
    id: string;
    data?: string;
    image?: string;
  }>();

  const service = data ? JSON.parse(decodeURIComponent(data)) : null;
  const [noDoctor, setNoDoctor] = useState(false);

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-white p-8 rounded-3xl shadow-lg items-center">
            <View className="bg-red-50 p-4 rounded-full mb-4">
              <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            </View>
            <Text className="text-gray-800 text-xl font-bold mb-2">
              Service Not Found
            </Text>
            <Text className="text-gray-500 text-center leading-6">
              The requested service could not be loaded. Please try again.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const payload = encodeURIComponent(JSON.stringify(service));

  const handleBookAppointment = () => {
    router.push({
      pathname: "/book-service",
      params: { data: payload },
    });
  };

  const DetailItem = ({
    icon,
    iconColor,
    iconBg,
    label,
    value,
    valueColor = "text-gray-800",
  }: DetailItemProps) => (
    <View className="flex-row items-center py-4 border-b border-gray-50 last:border-b-0">
      <View className={`${iconBg} p-3 rounded-xl mr-4 shadow-sm`}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-gray-500 text-sm font-medium mb-1">{label}</Text>
        <Text className={`${valueColor} font-semibold text-base`}>{value}</Text>
      </View>
    </View>
  );

  const TestItem = ({ item, index }: TestItemProps) => (
    <View className="bg-blue-50 p-4 rounded-xl mb-3 border-l-4 border-blue-400">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="font-bold text-gray-800 text-base flex-1 mr-2">
          {item.testName}
        </Text>
        <View className="bg-blue-100 px-2 py-1 rounded-full">
          <Text className="text-blue-600 text-xs font-medium">
            #{index + 1}
          </Text>
        </View>
      </View>
      <Text className="text-gray-600 text-sm leading-5 mb-3">
        {item.testDescription}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        <View className="bg-white px-3 py-1 rounded-full border border-gray-200">
          <Text className="text-gray-600 text-xs">
            <Text className="font-medium">Unit:</Text> {item.unit}
          </Text>
        </View>
        <View className="bg-white px-3 py-1 rounded-full border border-gray-200">
          <Text className="text-gray-600 text-xs">
            <Text className="font-medium">Range:</Text> {item.referenceRange}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <HeaderBack title="Service Details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Enhanced Service Header */}
        <LinearGradient
          colors={["#2563eb", "#1d4ed8", "#1e40af"]}
          className="px-6 py-10 rounded-b-[32px]"
          style={{
            shadowColor: "#2563eb",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          }}
        >
          <View className="items-center">
            <View className="bg-white/20 p-1 rounded-3xl mb-6 backdrop-blur-sm">
              <View className="bg-white p-2 rounded-2xl">
                <Image
                  source={{ uri: image }}
                  className="w-32 h-32 rounded-xl"
                  resizeMode="cover"
                />
              </View>
            </View>
            <Text className="text-white text-2xl font-bold text-center mb-3 leading-8">
              {service.name}
            </Text>
            <Text className="text-white/90 text-base text-center leading-6 px-4">
              {service.description}
            </Text>
          </View>
        </LinearGradient>

        <View className="px-4 mt-6">
          {/* Enhanced Service Details Card */}
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <View className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <Text className="text-gray-800 text-xl font-bold">
                Service Information
              </Text>
            </View>

            <View className="px-6 py-2">
              <DetailItem
                icon="card-outline"
                iconColor="#10b981"
                iconBg="bg-green-100"
                label="Service Price"
                value={formatVND(service.price)}
                valueColor="text-green-600"
              />

              <DetailItem
                icon="location-outline"
                iconColor="#8b5cf6"
                iconBg="bg-purple-100"
                label="Location"
                value="Healthcare Center"
              />

              <DetailItem
                icon={
                  service.isActive
                    ? "checkmark-circle-outline"
                    : "close-circle-outline"
                }
                iconColor={service.isActive ? "#10b981" : "#ef4444"}
                iconBg={service.isActive ? "bg-green-100" : "bg-red-100"}
                label="Service Status"
                value={
                  service.isActive ? "Active & Available" : "Currently Inactive"
                }
                valueColor={
                  service.isActive ? "text-green-600" : "text-red-600"
                }
              />

              <DetailItem
                icon={
                  service.isRequireDoctor ? "medical-outline" : "person-outline"
                }
                iconColor={service.isRequireDoctor ? "#f97316" : "#6b7280"}
                iconBg={
                  service.isRequireDoctor ? "bg-orange-100" : "bg-gray-100"
                }
                label="Doctor Requirement"
                value={
                  service.isRequireDoctor
                    ? "Doctor Consultation Required"
                    : "Self-Service Available"
                }
              />

              <DetailItem
                icon={service.isOnline ? "globe-outline" : "business-outline"}
                iconColor={service.isOnline ? "#06b6d4" : "#6366f1"}
                iconBg={service.isOnline ? "bg-cyan-100" : "bg-indigo-100"}
                label="Service Type"
                value={
                  service.isOnline
                    ? "Online & In-Person Available"
                    : "In-Person Only"
                }
              />
            </View>
          </View>

          {/* Enhanced Test Items Section */}
          {service.testItems && service.testItems.length > 0 && (
            <View className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
              <View className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-800 text-xl font-bold">
                    Medical Tests
                  </Text>
                  <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-600 text-sm font-medium">
                      {service.testItems.length} test
                      {service.testItems.length > 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-600 text-sm mt-1">
                  Comprehensive testing included in this service
                </Text>
              </View>

              <View className="px-6 py-4">
                <FlatList
                  data={service.testItems}
                  keyExtractor={(item, idx) => `${item.testName}-${idx}`}
                  renderItem={({ item, index }) => (
                    <TestItem item={item} index={index} />
                  )}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          )}

          {/* Additional Information Sections */}
          <WhatToExpect />
          <PreparationInstructions />
          <AvailableDoctors
            specialty={service.specialty}
            onDoctorsLoaded={setNoDoctor}
          />
        </View>
      </ScrollView>

      {/* Enhanced Booking Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <View className="bg-gray-50 rounded-2xl p-1">
          <TouchableOpacity
            onPress={handleBookAppointment}
            disabled={noDoctor}
            className={`rounded-xl p-4 flex-row items-center justify-center ${
              noDoctor ? "bg-gray-300" : "bg-blue-600 shadow-lg"
            }`}
            style={
              noDoctor
                ? {}
                : {
                    shadowColor: "#2563eb",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }
            }
          >
            <View
              className={`p-2 rounded-full mr-3 ${
                noDoctor ? "bg-gray-400" : "bg-white/20"
              }`}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={noDoctor ? "#6b7280" : "white"}
              />
            </View>
            <Text
              className={`font-bold text-lg ${
                noDoctor ? "text-gray-500" : "text-white"
              }`}
            >
              {noDoctor ? "No Doctors Available" : "Book Appointment Now"}
            </Text>
          </TouchableOpacity>
        </View>

        {noDoctor && (
          <Text className="text-center text-gray-500 text-sm mt-2">
            Please check back later for doctor availability
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
