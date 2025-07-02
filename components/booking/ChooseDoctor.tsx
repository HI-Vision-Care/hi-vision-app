import type { Doctor } from "@/services/doctor/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  doctors?: Doctor[];
  isLoading: boolean;
  error: Error | null;
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doc: Doctor) => void;
};

const { height: screenHeight } = Dimensions.get("window");

export default function ChooseDoctor({
  doctors,
  isLoading,
  error,
  selectedDoctor,
  onSelectDoctor,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectDoctor = (doctor: Doctor) => {
    onSelectDoctor(doctor);
    setModalVisible(false);
  };

  const renderTriggerButton = () => (
    <TouchableOpacity
      onPress={() => setModalVisible(true)}
      className="mx-4 mt-4 p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            Choose Doctor
          </Text>
          {selectedDoctor ? (
            <View className="flex-row items-center mt-2">
              {selectedDoctor.avatar ? (
                <Image
                  source={{ uri: selectedDoctor.avatar }}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="person" size={20} color="#3b82f6" />
                </View>
              )}
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  {selectedDoctor.name}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {selectedDoctor.specialty}
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-gray-500 mt-1">Tap to select a doctor</Text>
          )}
        </View>
        <View className="ml-4">
          <Ionicons name="chevron-down" size={24} color="#6b7280" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDoctorItem = (doctor: Doctor) => {
    const isSelected = doctor.doctorID === selectedDoctor?.doctorID;

    return (
      <TouchableOpacity
        key={doctor.doctorID}
        onPress={() => handleSelectDoctor(doctor)}
        className={`flex-row items-center p-4 mx-4 mb-3 rounded-xl border-2 ${
          isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
        }`}
        activeOpacity={0.7}
      >
        {doctor.avatar ? (
          <Image
            source={{ uri: doctor.avatar }}
            className="w-14 h-14 rounded-full"
          />
        ) : (
          <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center">
            <Ionicons name="person" size={28} color="#3b82f6" />
          </View>
        )}
        <View className="ml-4 flex-1">
          <Text
            className={`font-semibold text-lg ${
              isSelected ? "text-blue-700" : "text-gray-900"
            }`}
          >
            {doctor.name}
          </Text>
          <Text className="text-gray-600 text-base mt-1">
            {doctor.specialty}
          </Text>
        </View>
        {isSelected && (
          <View className="ml-2">
            <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderModalContent = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <Pressable className="flex-1" onPress={() => setModalVisible(false)} />
        <View
          className="bg-white rounded-t-3xl w-full"
          style={{ height: screenHeight * 0.8 }}
        >
          <SafeAreaView>
            {/* Modal Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
              <Text className="text-xl font-bold text-gray-900">
                Select Doctor
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16 }}
            >
              {isLoading ? (
                <View className="items-center justify-center py-12">
                  <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="medical" size={24} color="#3b82f6" />
                  </View>
                  <Text className="text-gray-600 text-lg">
                    Loading doctors...
                  </Text>
                </View>
              ) : error ? (
                <View className="items-center justify-center py-12 mx-4">
                  <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="alert-circle" size={24} color="#ef4444" />
                  </View>
                  <Text className="text-red-600 text-lg font-semibold mb-2">
                    Error Loading Doctors
                  </Text>
                  <Text className="text-gray-600 text-center">
                    {error.message}
                  </Text>
                </View>
              ) : doctors && doctors.length > 0 ? (
                doctors.map(renderDoctorItem)
              ) : (
                <View className="items-center justify-center py-12">
                  <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-4">
                    <Ionicons name="person-outline" size={24} color="#6b7280" />
                  </View>
                  <Text className="text-gray-600 text-lg">
                    No doctors available
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      {renderTriggerButton()}
      {renderModalContent()}
    </>
  );
}
