import { useState } from "react";
import { router } from "expo-router";
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

interface PersonalData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  country: string;
}

const PersonalInfo: React.FC = () => {
  const [personalData, setPersonalData] = useState<PersonalData>({
    fullName: "Sanae Dekomori",
    email: "dekomori@fuwa.jp",
    phoneNumber: "+123 456 789",
    dateOfBirth: "20/05/2005",
    address: "Nevada Street 132",
    country: "Japan",
  });

  const [focusedField, setFocusedField] = useState<string>("");

  const handleGoBack = () => {
    router.back();
  };

  const handleInputChange = (field: keyof PersonalData, value: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", personalData);
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
    field: keyof PersonalData,
    icon: string,
    hasEdit = true,
    hasDropdown = false,
    editable = true
  ) => (
    <View className="mb-6">
      <Text className="text-gray-700 text-base font-semibold mb-2">
        {label}
      </Text>
      <TouchableOpacity
        onPress={hasDropdown ? () => handleDropdownPress(field) : undefined}
        className="bg-white rounded-xl px-4 py-4 border border-gray-200 shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-gray-100 rounded-lg justify-center items-center mr-3">
              <Text className="text-base">{icon}</Text>
            </View>
            {editable && !hasDropdown ? (
              <TextInput
                value={value}
                onChangeText={(text) => handleInputChange(field, text)}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField("")}
                className="flex-1 text-gray-900 text-base font-medium"
                placeholder={`Enter ${label.toLowerCase()}`}
                placeholderTextColor="#9ca3af"
              />
            ) : (
              <Text className="flex-1 text-gray-900 text-base font-medium">
                {value}
              </Text>
            )}
          </View>
          {hasEdit && (
            <TouchableOpacity
              onPress={() => handleEditField(field)}
              className="w-8 h-8 justify-center items-center"
            >
              <Text className="text-gray-400 text-base">✏️</Text>
            </TouchableOpacity>
          )}
          {hasDropdown && (
            <TouchableOpacity
              onPress={() => handleDropdownPress(field)}
              className="w-8 h-8 justify-center items-center"
            >
              <Text className="text-gray-400 text-base">▼</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <StatusBar />
      <SafeAreaView className="flex-1 bg-gray-100">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header with geometric background */}
          <View className="bg-gray-600 px-5 py-6 relative overflow-hidden">
            <View className="flex-row items-center relative z-10">
              <TouchableOpacity
                onPress={handleGoBack}
                className="w-20 h-20  rounded-lg bg-opacity-20 justify-center items-center mr-4"
              >
                <Text className="text-white text-xl font-light">‹</Text>
              </TouchableOpacity>
              <Text className="text-white text-xl font-bold">
                Personal Information
              </Text>
            </View>
          </View>

          {/* Profile Image Section */}
          <View className="items-center -mt-8 mb-8 z-10">
            <View className="relative">
              <View className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-lg overflow-hidden">
                <Image
                  source={{ uri: "https://i.pravatar.cc/100?img=1" }}
                  className="w-full h-full"
                />
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 w-9 h-9 bg-blue-500 rounded-lg justify-center items-center shadow-md">
                <Text className="text-white text-sm">✏️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-5">
            {renderInputField(
              "Full Name",
              personalData.fullName,
              "fullName",
              "👤"
            )}
            {renderInputField(
              "Email Address",
              personalData.email,
              "email",
              "✉️"
            )}
            {renderInputField(
              "Phone Number",
              personalData.phoneNumber,
              "phoneNumber",
              "📱"
            )}
            {renderInputField(
              "Date of Birth",
              personalData.dateOfBirth,
              "dateOfBirth",
              "📅",
              false,
              true,
              false
            )}
            {renderInputField("Address", personalData.address, "address", "📍")}
            {renderInputField(
              "Country",
              personalData.country,
              "country",
              "🏳️",
              false,
              true,
              false
            )}

            <TouchableOpacity
              onPress={handleSaveChanges}
              className="bg-blue-500 rounded-xl py-4 mb-24 shadow-md flex-row justify-center items-center"
            >
              <Text className="text-white text-lg font-bold mr-2">
                Save Changes
              </Text>
              <Text className="text-white text-base">✓</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default PersonalInfo;
