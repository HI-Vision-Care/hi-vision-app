import { icons } from "@/constants";
import { PasswordSentModal, ResetOptionCard } from "@components";
import { router, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ForgotPassword: React.FC = () => {
  const insets = useSafeAreaInsets();
  const nav = useRouter();

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [emailToSend, setEmailToSend] = useState<string>("elem221b@gmail.com");

  const handleResetPress = () => {
    if (selectedOption === "email") {
      setShowEmailModal(true);
      // TODO: Gọi API gửi mail lần đầu
    } else {
      // TODO: Xử lý 2FA / Google / SMS
      console.log("Reset bằng:", selectedOption);
    }
  };

  const handleResendCode = () => {
    // TODO: Gọi API resend code
    console.log("Re-send code đến:", emailToSend);
  };

  return (
    // Dùng SafeAreaView từ `react-native-safe-area-context`
    // edges={['bottom']} sẽ chỉ “safe” phần dưới, bỏ safe‐area ở trên để header phủ lên notch
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-white">
      {/* === StatusBar trong suốt để header đè lên notch === */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* === HEADER: background tràn lên notch, bo cong đáy === */}
      <View
        className="bg-gray-700 rounded-b-3xl items-center justify-center px-6"
        style={{
          // Chiều cao = baseHeight (150) + phần inset trên (notch)
          height: 150 + insets.top,
          paddingTop: insets.top, // đẩy nội dung header xuống dưới notch
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => nav.back()}
          className="absolute left-4 top-0 w-8 h-8 rounded-lg bg-gray-700 border border-gray-600 items-center justify-center"
          style={{ marginTop: insets.top }} // để nút back nằm ngay phía dưới notch
        >
          <Image
            source={icons.arrowBack}
            className="w-5 h-5"
            style={{ tintColor: "#FFFFFF" }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Title & Subtitle căn giữa */}
        <View className="flex-1 justify-center px-6">
          <Text className="text-white text-3xl font-bold">
            Forgot Password?
          </Text>
          <Text className="text-gray-300 text-base mt-1">
            Then let&apos;s submit password reset.
          </Text>
        </View>
      </View>

      {/* === NỘI DUNG CHÍNH: dùng ScrollView để cuộn nếu nội dung dài === */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
        }}
      >
        <ResetOptionCard
          icon={icons.email}
          title="Send via Email"
          subtitle="Reset password via email."
          selected={selectedOption === "email"}
          onPress={() => setSelectedOption("email")}
        />

        <ResetOptionCard
          icon={icons.password}
          title="Send via 2FA"
          subtitle="Reset password via 2FA."
          selected={selectedOption === "2fa"}
          onPress={() => setSelectedOption("2fa")}
        />

        <ResetOptionCard
          icon={icons.key}
          title="Send via Google Auth"
          subtitle="Reset password via G–Auth."
          selected={selectedOption === "google"}
          onPress={() => setSelectedOption("google")}
        />

        <ResetOptionCard
          icon={icons.phone}
          title="Send via SMS"
          subtitle="Reset password via SMS."
          selected={selectedOption === "sms"}
          onPress={() => router.push("/(account-setup)/otp-setup")}
        />
      </ScrollView>

      {/* === FOOTER: nút "Reset Password" dính đáy === */}
      <View
        className="px-4 pb-4"
        style={{
          paddingBottom: insets.bottom + 16, // tránh home indicator / navigation bar
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full bg-blue-600 rounded-xl py-4 flex-row items-center justify-center"
          onPress={handleResetPress}
        >
          <Text className="text-white text-lg font-semibold mr-2">
            Reset Password
          </Text>
          <Image
            source={icons.password}
            className="w-5 h-5"
            style={{ tintColor: "#FFFFFF" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* MODAL Password Sent (sử dụng NativeWind) */}
      <PasswordSentModal
        visible={showEmailModal}
        email={emailToSend}
        onResend={handleResendCode}
        onClose={() => setShowEmailModal(false)}
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;
