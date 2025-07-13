import { HeaderBack } from "@/components";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MedicalData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  medNo: string;
  medDate: string;
  medFac: string;
  underlyingDiseases: string;
}

const PersonalInfo: React.FC = () => {
  const [medicalData, setMedicalData] = useState<MedicalData>({
    fullName: "John Doe",
    email: "john.doe@email.com",
    phoneNumber: "+1 (555) 123-4567",
    dateOfBirth: "15/03/1985",
    gender: "Male",
    medNo: "HIV-2024-001234",
    medDate: "12/01/2024",
    medFac: "City General Hospital",
    underlyingDiseases: "Hypertension, Diabetes Type 2",
  });

  const [focusedField, setFocusedField] = useState<string>("");

  const handleGoBack = () => {
    router.back();
  };

  const handleInputChange = (field: keyof MedicalData, value: string) => {
    setMedicalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    console.log("Saving medical data:", medicalData);
    // Handle save logic here
  };

  const handleEditField = (field: string) => {
    console.log("Edit field:", field);
    // Handle edit action
  };

  const handleDropdownPress = (field: string) => {
    console.log("Dropdown pressed:", field);
    // Handle dropdown selection
  };

  const renderInputField = (
    label: string,
    value: string,
    field: keyof MedicalData,
    icon: string,
    hasEdit = true,
    hasDropdown = false,
    editable = true,
    multiline = false
  ) => (
    <View className="mb-5">
      <Text className="text-slate-700 text-sm font-semibold mb-2 ml-1">
        {label}
      </Text>
      <TouchableOpacity
        onPress={hasDropdown ? () => handleDropdownPress(field) : undefined}
        className={`bg-white rounded-2xl px-4 py-4 border ${
          focusedField === field ? "border-red-400" : "border-slate-200"
        } shadow-sm`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-11 h-11 bg-red-50 rounded-xl justify-center items-center mr-4">
              <Text className="text-lg">{icon}</Text>
            </View>
            {editable && !hasDropdown ? (
              <TextInput
                value={value}
                onChangeText={(text) => handleInputChange(field, text)}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField("")}
                className="flex-1 text-slate-800 text-base font-medium"
                placeholder={`Enter ${label.toLowerCase()}`}
                placeholderTextColor="#94a3b8"
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
                textAlignVertical={multiline ? "top" : "center"}
              />
            ) : (
              <Text
                className={`flex-1 text-slate-800 text-base font-medium ${
                  multiline ? "leading-6" : ""
                }`}
              >
                {value}
              </Text>
            )}
          </View>
          {hasEdit && (
            <TouchableOpacity
              onPress={() => handleEditField(field)}
              className="w-9 h-9 bg-slate-100 rounded-lg justify-center items-center ml-2"
            >
              <Text className="text-slate-500 text-sm">✏️</Text>
            </TouchableOpacity>
          )}
          {hasDropdown && (
            <TouchableOpacity
              onPress={() => handleDropdownPress(field)}
              className="w-9 h-9 bg-slate-100 rounded-lg justify-center items-center ml-2"
            >
              <Text className="text-slate-500 text-sm">▼</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#dc2626" />
      <SafeAreaView className="flex-1 bg-slate-50">
        <HeaderBack title="Personal Info" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Image Section */}
          <View className="items-center -mt-10 mb-8 z-10">
            <View className="relative">
              <View className="w-28 h-28 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden">
                <Image
                  source={{ uri: "https://i.pravatar.cc/120?img=3" }}
                  className="w-full h-full"
                />
              </View>
              <TouchableOpacity className="absolute bottom-1 right-1 w-10 h-10 bg-red-500 rounded-xl justify-center items-center shadow-lg">
                <Text className="text-white text-sm">📷</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-6">
            {/* Personal Information Section */}
            <View className="mb-6">
              <Text className="text-slate-800 text-lg font-bold mb-4 flex-row items-center">
                <Text className="mr-2">👤</Text> Personal Details
              </Text>

              {renderInputField(
                "Full Name",
                medicalData.fullName,
                "fullName",
                "👤"
              )}
              {renderInputField(
                "Email Address",
                medicalData.email,
                "email",
                "✉️"
              )}
              {renderInputField(
                "Phone Number",
                medicalData.phoneNumber,
                "phoneNumber",
                "📱"
              )}
              {renderInputField(
                "Date of Birth",
                medicalData.dateOfBirth,
                "dateOfBirth",
                "📅",
                false,
                true,
                false
              )}
              {renderInputField(
                "Gender",
                medicalData.gender,
                "gender",
                "⚧️",
                false,
                true,
                false
              )}
            </View>

            {/* Medical Information Section */}
            <View className="mb-6">
              <Text className="text-slate-800 text-lg font-bold mb-4 flex-row items-center">
                <Text className="mr-2">🏥</Text> Medical Information
              </Text>

              {renderInputField(
                "Medical Number",
                medicalData.medNo,
                "medNo",
                "🆔",
                false,
                false,
                false
              )}
              {renderInputField(
                "Medical Date",
                medicalData.medDate,
                "medDate",
                "📋",
                false,
                true,
                false
              )}
              {renderInputField(
                "Medical Facility",
                medicalData.medFac,
                "medFac",
                "🏥",
                false,
                true,
                false
              )}
              {renderInputField(
                "Underlying Diseases",
                medicalData.underlyingDiseases,
                "underlyingDiseases",
                "🩺",
                true,
                false,
                true,
                true
              )}
            </View>

            {/* Action Buttons */}
            <View className="mb-8 space-y-3">
              <TouchableOpacity
                onPress={handleSaveChanges}
                className="bg-red-600 rounded-2xl py-4 shadow-lg flex-row justify-center items-center"
              >
                <Text className="text-white text-lg font-bold mr-2">
                  Save Medical Information
                </Text>
                <Text className="text-white text-base">💾</Text>
              </TouchableOpacity>

              <TouchableOpacity className="bg-white border border-red-200 rounded-2xl py-4 shadow-sm flex-row justify-center items-center">
                <Text className="text-red-600 text-lg font-semibold mr-2">
                  Emergency Contact
                </Text>
                <Text className="text-red-600 text-base">🚨</Text>
              </TouchableOpacity>
            </View>

            {/* Medical Disclaimer */}
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
              <View className="flex-row items-start">
                <Text className="text-amber-600 text-lg mr-3">⚠️</Text>
                <View className="flex-1">
                  <Text className="text-amber-800 font-semibold text-sm mb-1">
                    Medical Information Notice
                  </Text>
                  <Text className="text-amber-700 text-xs leading-5">
                    This information is confidential and protected under HIPAA.
                    Please ensure all medical details are accurate and
                    up-to-date for proper HIV care management.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default PersonalInfo;
