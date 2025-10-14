import { OnboardingLayout } from "@/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import {
  isValidMedDate,
  isValidMedFac,
  isValidMedNo,
} from "@/utils/validation-setup";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PatientMedicalCard = () => {
  const { handleBack, progress, handleContinue } = useOnboardingNavigation();
  const { setData } = useOnboarding();
  const [medNo, setMedNo] = useState("");
  const [medDate, setMedDate] = useState(""); // DD/MM/YYYY hoặc ISO string
  const [medFac, setMedFac] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null); // null = chưa chọn, true = có, false = không

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
    setMedDate(formatted);
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    // Format as XX1234567890123 (2 letters + 13 numbers)
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 15) {
      return cleaned.slice(0, 2) + cleaned.slice(2);
    }
    return cleaned.slice(0, 15);
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setMedNo(formatted);
  };

  const isFormValid =
    hasInsurance === false ||
    (hasInsurance === true &&
      isValidMedNo(medNo) &&
      isValidMedDate(medDate) &&
      isValidMedFac(medFac));

  const handleContinueAndSave = () => {
    if (hasInsurance === false) {
      // Nếu không có bảo hiểm, lưu dữ liệu rỗng
      setData({
        medNo: "",
        medDate: "",
        medFac: "",
        hasInsurance: false,
      });
    } else {
      // Nếu có bảo hiểm, lưu thông tin thẻ BHYT
      setData({
        medNo,
        medDate,
        medFac,
        hasInsurance: true,
      });
    }
    handleContinue();
  };

  return (
    <OnboardingLayout
      question="Thông tin thẻ BHYT"
      progress={progress} // hoặc truyền progress chuẩn từ hook
      onContinue={handleContinueAndSave}
      disabled={!isFormValid}
      onBack={handleBack}
      childrenWrapperClassName="flex-1 px-6 pt-8"
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-green-100 p-3 rounded-full mr-4">
                <Ionicons name="card-outline" size={24} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-800 mb-1">
                  Thẻ Bảo hiểm Y tế
                </Text>
                <Text className="text-gray-600 text-sm">
                  Bước cuối cùng để hoàn tất hồ sơ
                </Text>
              </View>
            </View>
          </View>

          {/* Insurance Selection */}
          <View className="mb-4">
            <Text className="text-gray-800 font-semibold text-lg mb-4">
              Bạn có thẻ Bảo hiểm Y tế không?
            </Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={() => setHasInsurance(true)}
                className={`flex-1 flex-row items-center justify-center py-4 px-6 rounded-xl border-2 ${
                  hasInsurance === true
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Ionicons
                  name={
                    hasInsurance === true
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={hasInsurance === true ? "#059669" : "#9CA3AF"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`font-medium ${
                    hasInsurance === true ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  Có
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setHasInsurance(false)}
                className={`flex-1 flex-row items-center justify-center py-4 px-6 rounded-xl border-2 ${
                  hasInsurance === false
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Ionicons
                  name={
                    hasInsurance === false
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={hasInsurance === false ? "#059669" : "#9CA3AF"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`font-medium ${
                    hasInsurance === false ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  Không có
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Section - Only show when user has insurance */}
          {hasInsurance === true && (
            <View className="space-y-4">
              {/* Medical Card Number */}
              <View className="space-y-3">
                <Text className="text-gray-800 font-semibold text-lg">
                  Mã thẻ BHYT
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border-2 ${
                    focusedField === "medNo"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <Ionicons
                    name="card"
                    size={20}
                    color={focusedField === "medNo" ? "#059669" : "#9CA3AF"}
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    placeholder="VD: AB1234567890123"
                    placeholderTextColor="#9CA3AF"
                    value={medNo}
                    onChangeText={handleCardNumberChange}
                    onFocus={() => setFocusedField("medNo")}
                    onBlur={() => setFocusedField(null)}
                    className="flex-1 text-gray-800 text-base font-mono"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={15}
                  />
                  {medNo.length > 0 && (
                    <TouchableOpacity onPress={() => setMedNo("")}>
                      <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
                {medNo.length > 0 && !isValidMedNo(medNo) && (
                  <Text className="text-red-500 text-lg mt-1 ml-1">
                    Mã thẻ không hợp lệ (2 chữ cái đầu, 13 số).
                  </Text>
                )}
                <Text className="text-gray-500 text-sm ml-1">
                  15 ký tự: 2 chữ cái + 13 số
                </Text>
              </View>

              {/* Issue Date */}
              <View className="space-y-3">
                <Text className="text-gray-800 font-semibold text-lg">
                  Ngày cấp
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border-2 ${
                    focusedField === "medDate"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <Ionicons
                    name="calendar"
                    size={20}
                    color={focusedField === "medDate" ? "#059669" : "#9CA3AF"}
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#9CA3AF"
                    value={medDate}
                    onChangeText={handleDateChange}
                    onFocus={() => setFocusedField("medDate")}
                    onBlur={() => setFocusedField(null)}
                    className="flex-1 text-gray-800 text-base"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  {medDate.length > 0 && (
                    <TouchableOpacity onPress={() => setMedDate("")}>
                      <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
                {medDate.length === 10 && !isValidMedDate(medDate) && (
                  <Text className="text-red-500 text-lg mt-1 ml-1">
                    Ngày cấp không hợp lệ
                  </Text>
                )}
                <Text className="text-gray-500 text-sm ml-1">
                  Ví dụ: 15/01/2024
                </Text>
              </View>

              {/* Issuing Facility */}
              <View className="space-y-3">
                <Text className="text-gray-800 font-semibold text-lg">
                  Nơi cấp
                </Text>
                <View
                  className={`flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border-2 ${
                    focusedField === "medFac"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <Ionicons
                    name="business"
                    size={20}
                    color={focusedField === "medFac" ? "#059669" : "#9CA3AF"}
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    placeholder="Tên cơ quan cấp thẻ"
                    placeholderTextColor="#9CA3AF"
                    value={medFac}
                    onChangeText={setMedFac}
                    onFocus={() => setFocusedField("medFac")}
                    onBlur={() => setFocusedField(null)}
                    className="flex-1 text-gray-800 text-base"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  {medFac.length > 0 && (
                    <TouchableOpacity onPress={() => setMedFac("")}>
                      <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
                {medFac.length > 0 && !isValidMedFac(medFac) && (
                  <Text className="text-red-500 text-xs mt-1 ml-1">
                    Nơi cấp phải có ít nhất 4 ký tự
                  </Text>
                )}
                <Text className="text-gray-500 text-sm ml-1">
                  Ví dụ: BHXH Thành phố Hồ Chí Minh
                </Text>
              </View>
            </View>
          )}

          {/* No Insurance Message */}
          {hasInsurance === false && (
            <View className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <View className="flex-row items-start">
                <Ionicons
                  name="information-circle"
                  size={20}
                  color="#3B82F6"
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="text-blue-800 font-medium text-sm mb-1">
                    Không sao cả!
                  </Text>
                  <Text className="text-blue-700 text-sm leading-5">
                    Bạn có thể bỏ qua bước này và cập nhật thông tin bảo hiểm
                    sau khi đã đăng ký tài khoản.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Benefits Info */}
          <View className="mt-6 bg-green-50 rounded-xl p-4 border border-green-200">
            <View className="flex-row items-start">
              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#059669"
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <View className="flex-1">
                <Text className="text-green-800 font-medium text-sm mb-1">
                  Lợi ích của thẻ BHYT
                </Text>
                <Text className="text-green-700 text-sm leading-5">
                  Được hỗ trợ thanh toán chi phí khám chữa bệnh theo quy định
                  của Bảo hiểm Y tế
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingLayout>
  );
};

export default PatientMedicalCard;
