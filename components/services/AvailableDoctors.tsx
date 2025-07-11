import { useDoctorsBySpecialty } from "@/services/medical-services/hooks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

type Props = { specialty: string; onDoctorsLoaded?: (empty: boolean) => void };

const AvailableDoctors = ({ specialty, onDoctorsLoaded }: Props) => {
  const {
    data: doctors,
    isLoading,
    isError,
  } = useDoctorsBySpecialty(specialty);

  React.useEffect(() => {
    if (!isLoading && !isError && onDoctorsLoaded) {
      onDoctorsLoaded(!(doctors && doctors.length > 0));
    }
  }, [doctors, isLoading, isError, onDoctorsLoaded]);

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
        <Text className="text-red-600">Unable to load doctor list</Text>
      </View>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 items-center">
        <Ionicons name="alert-circle" size={32} color="#ef4444" />
        <Text className="text-gray-800 mt-2 text-center">
          There are no doctors suitable for this specialty.
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <Text className="text-gray-800 text-lg font-bold mb-4">
        Available Doctors
      </Text>
      <View className="space-y-4">
        {doctors.map((doctor) => (
          <View key={doctor.doctorID} className="flex-row items-center">
            <Image
              source={{
                uri: doctor.avatar || "https://via.placeholder.com/50x50",
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
