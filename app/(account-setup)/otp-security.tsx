import OTPInput from "@/components/OtpCode";
import { icons } from "@/constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OtpSecurity: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Lưu giá trị OTP
  const [otpValue, setOtpValue] = useState<string>("");

  // Callback khi nhập đủ 4 chữ số
  const handleComplete = (code: string) => {
    setOtpValue(code);
  };

  // Xử lý Continue
  const handleContinue = () => {
    if (otpValue.length < 4) {
      // Chưa nhập đủ 4 chữ số, có thể hiện alert hoặc thông báo
      return;
    }
    // Ví dụ: xác thực OTP xong, điều hướng
    // router.push("/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Back Button (absolute) */}
      <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/"); // Hoặc "/login" nếu bạn muốn
          }
        }}
        className="absolute left-4 w-10 h-10 rounded-lg  border border-gray-600 items-center justify-center"
        style={{ top: insets.top + 8 }}
      >
        <Image
          source={icons.chevronLeft}
          className="w-7 h-7 "
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Title */}
      <View className="pt-16 items-center">
        <Text className="text-xl font-semibold text-gray-900">
          OTP Security
        </Text>
      </View>

      {/* Nội dung chính */}
      <View className="flex-1 px-6 mt-6">
        {/* Subtitle */}
        <View className="mb-8 px-4">
          <Text className="text-center text-gray-600 text-base leading-6">
            Please enter the 4 digit code you got on your phone! 🙏
          </Text>
        </View>

        {/* OTPInput (4 ô) */}
        <View className="mb-6">
          <OTPInput
            length={4}
            onComplete={handleComplete}
            onChangeText={setOtpValue}
          />
        </View>

        {/* Resend */}
        <View className="items-center mb-12">
          <Text className="text-gray-600 text-sm">
            Didn’t see any OTP code?{" "}
            <Text
              className="text-red-500 underline"
              onPress={() => {
                // Xử lý gửi lại OTP ở đây
              }}
            >
              Resend.
            </Text>
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={otpValue.length < 4}
          className={`
            w-full
            ${otpValue.length === 4 ? "bg-blue-600" : "bg-blue-300"}
            rounded-xl py-4 shadow items-center
            ${otpValue.length === 4 ? "active:opacity-90" : "opacity-50"}
          `}
        >
          <View className="flex-row items-center">
            <Text className="text-white text-base font-semibold mr-2">
              Continue
            </Text>
            <Text className="text-white text-lg">→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OtpSecurity;
