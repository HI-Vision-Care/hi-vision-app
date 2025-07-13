import { OnboardingLayout } from "@/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import { isValidDob, isValidName } from "@/utils/validation-setup";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const PatientName = () => {
  const { handleContinue, handleBack, handleSkip, progress } =
    useOnboardingNavigation();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { setData } = useOnboarding();

  const handleContinueAndSave = () => {
    setData({ name, dob }); // lưu lại data, có thể gọi xong rồi gọi handleContinue()
    handleContinue();
  };

  const formatDateInput = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, "");

    // Add slashes automatically
    if (cleaned.length >= 2 && cleaned.length < 4) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    } else if (cleaned.length >= 4) {
      return (
        cleaned.slice(0, 2) +
        "/" +
        cleaned.slice(2, 4) +
        "/" +
        cleaned.slice(4, 8)
      );
    }
    return cleaned;
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDateInput(text);
    setDob(formatted);
  };

  return (
    <OnboardingLayout
      question="Nhập tên & ngày sinh của bạn"
      progress={progress}
      onContinue={handleContinueAndSave}
      onBack={handleBack}
      onSkip={handleSkip}
      disabled={!isValidName(name) || !isValidDob(dob)}
      childrenWrapperClassName="flex-1 px-6 pt-8"
    >
      <View className="flex-1">
        {/* Header Section */}
        <View className="mb-8">
          <Text className="text-gray-600 text-base leading-6">
            Vui lòng cung cấp thông tin cá nhân để chúng tôi có thể hỗ trợ bạn
            tốt hơn
          </Text>
        </View>

        {/* Form Section */}
        <View className="space-y-6">
          {/* Full Name Input */}
          <View className="space-y-3">
            <Text className="text-gray-800 font-semibold text-lg">
              Tên đầy đủ
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border-2 ${
                focusedField === "name"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={focusedField === "name" ? "#3B82F6" : "#9CA3AF"}
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Nhập tên của bạn"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className="flex-1 text-gray-800 text-base"
                autoCapitalize="words"
                autoCorrect={false}
              />

              {name.length > 0 && (
                <TouchableOpacity onPress={() => setName("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            {name.length > 0 && !isValidName(name) && (
              <Text className="text-red-500 text-lg mt-1 ml-1">
                Tên không hợp lệ
              </Text>
            )}
          </View>

          {/* Date of Birth Input */}
          <View className="space-y-3">
            <Text className="text-gray-800 font-semibold text-lg">
              Ngày sinh
            </Text>
            <View
              className={`flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border-2 ${
                focusedField === "dob"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={focusedField === "dob" ? "#3B82F6" : "#9CA3AF"}
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                value={dob}
                onChangeText={handleDateChange}
                onFocus={() => setFocusedField("dob")}
                onBlur={() => setFocusedField(null)}
                className="flex-1 text-gray-800 text-base"
                keyboardType="numeric"
                maxLength={10}
              />

              {dob.length > 0 && (
                <TouchableOpacity onPress={() => setDob("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            {dob.length === 10 && !isValidDob(dob) && (
              <Text className="text-red-500 text-lg mt-1 ml-1">
                Ngày sinh không hợp lệ
              </Text>
            )}
            <Text className="text-gray-500 text-sm ml-1">
              Ví dụ: 15/08/1990
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <View className="flex-row items-start">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#3B82F6"
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <View className="flex-1">
              <Text className="text-blue-800 font-medium text-sm mb-1">
                Bảo mật thông tin
              </Text>
              <Text className="text-blue-700 text-sm leading-5">
                Thông tin của bạn được bảo mật và chỉ được sử dụng để cung cấp
                dịch vụ chăm sóc sức khỏe tốt nhất.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
};

export default PatientName;
