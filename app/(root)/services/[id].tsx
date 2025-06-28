import { HeaderBack } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceDetail() {
  const { id, data } = useLocalSearchParams<{
    id: string;
    data?: string;
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
            <View className="bg-white/20 p-4 rounded-full mb-4">
              <Ionicons name={service.icon} size={48} color="white" />
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
              <View className="bg-blue-100 p-2 rounded-full mr-4">
                <Ionicons name="time-outline" size={20} color="#0f67fe" />
              </View>
              <View>
                <Text className="text-gray-600 text-sm">Duration</Text>
                <Text className="text-gray-800 font-semibold">
                  {service.duration} minutes
                </Text>
              </View>
            </View>

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

            <View className="flex-row items-center">
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
          </View>

          {/* What to Expect */}
          <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              What to Expect
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <View className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <Ionicons name="checkmark" size={12} color="#0f67fe" />
                </View>
                <Text className="text-gray-600 flex-1">
                  Comprehensive consultation with experienced healthcare
                  professionals
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <Ionicons name="checkmark" size={12} color="#0f67fe" />
                </View>
                <Text className="text-gray-600 flex-1">
                  Detailed examination and assessment of your health condition
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <Ionicons name="checkmark" size={12} color="#0f67fe" />
                </View>
                <Text className="text-gray-600 flex-1">
                  Personalized treatment recommendations and follow-up care
                </Text>
              </View>
            </View>
          </View>

          {/* Preparation Instructions */}
          <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              Preparation
            </Text>
            <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#f59e0b" />
                <View className="ml-3 flex-1">
                  <Text className="text-yellow-800 font-medium mb-2">
                    Before your appointment:
                  </Text>
                  <Text className="text-yellow-700 text-sm">
                    • Bring your ID and insurance card{"\n"}• List current
                    medications{"\n"}• Arrive 15 minutes early
                    {"\n"}• Bring any relevant medical records
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Available Doctors */}
          <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              Available Doctors
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: "https://via.placeholder.com/50x50" }}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">
                    Dr. Sarah Johnson
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    15+ years experience
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text className="text-gray-600 ml-1">4.9</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Image
                  source={{ uri: "https://via.placeholder.com/50x50" }}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">
                    Dr. Michael Chen
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    12+ years experience
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text className="text-gray-600 ml-1">4.8</Text>
                </View>
              </View>
            </View>
          </View>
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
