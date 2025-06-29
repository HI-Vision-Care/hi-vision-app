import { useGetDoctors } from "@/services/doctor/hooks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

const AvailableDoctors = () => {
  const { data: doctors, isLoading, isError } = useGetDoctors();

  if (isLoading) {
    return (
      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 items-center">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 items-center">
        <Text className="text-red-600">Không tải được danh sách bác sĩ</Text>
      </View>
    );
  }

  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <Text className="text-gray-800 text-lg font-bold mb-4">
        Available Doctors
      </Text>
      <View className="space-y-4">
        {doctors?.map((doctor) => (
          <View key={doctor.doctorID} className="flex-row items-center">
            <Image
              source={{
                uri:
                  // nếu backend có trường avatarUri thì dùng, còn không dùng placeholder
                  doctor.img || "https://via.placeholder.com/50x50",
              }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold">{doctor.name}</Text>
              <Text className="text-gray-500 text-sm">{doctor.specialty}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text className="text-gray-600 ml-1">{doctor.degrees}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AvailableDoctors;
