import { icons } from "@/constants";
import { useTranslation } from "@/hooks/useTranslation";
import { useForgotPassword } from "@/services/auth/hooks";
import {
  EmailInputModal,
  PasswordSentModal,
  ResetOptionCard,
} from "@components";
import { router, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const nav = useRouter();

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showEmailInputModal, setShowEmailInputModal] =
    useState<boolean>(false);
  const [showPasswordSentModal, setShowPasswordSentModal] =
    useState<boolean>(false);
  const [emailToSend, setEmailToSend] = useState<string>("");

  // Hook để gọi API forgot password
  const forgotPasswordMutation = useForgotPassword();

  const handleResetPress = () => {
    if (selectedOption === "email") {
      // Hiển thị modal để nhập email
      setShowEmailInputModal(true);
    } else if (selectedOption === "2fa") {
      Alert.alert("Coming Soon", "2FA feature is not available yet");
    } else if (selectedOption === "google") {
      Alert.alert("Coming Soon", "Google Auth feature is not available yet");
    } else if (selectedOption === "sms") {
      router.push("/(account-setup)/otp-setup");
    } else {
      Alert.alert("Info", "Please select a reset method first");
    }
  };

  const handleEmailSubmit = (email: string) => {
    setEmailToSend(email);

    // Gọi API gửi OTP về email
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          setShowEmailInputModal(false);
          setShowPasswordSentModal(true);
        },
        onError: (error) => {
          Alert.alert("Error", error.message || "Failed to send OTP");
        },
      }
    );
  };

  const handleResendCode = () => {
    // Gọi lại API gửi OTP
    forgotPasswordMutation.mutate(
      { email: emailToSend },
      {
        onSuccess: (data) => {
          Alert.alert("Success", "OTP has been resent to your email");
        },
        onError: (error) => {
          Alert.alert("Error", error.message || "Failed to resend OTP");
        },
      }
    );
  };

  const handlePasswordSentModalClose = () => {
    setShowPasswordSentModal(false);
    // Navigate đến màn hình nhập OTP, truyền email qua params
    router.push({
      pathname: "/(account-setup)/otp-security",
      params: { email: emailToSend },
    });
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
            {t("auth.forgotPassword")}
          </Text>
          <Text className="text-gray-300 text-base mt-1">
            {t("auth.forgotPasswordSubtitle")}
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
          title={t("auth.sendViaEmail")}
          subtitle={t("auth.resetViaEmail")}
          selected={selectedOption === "email"}
          onPress={() => setSelectedOption("email")}
        />

        <ResetOptionCard
          icon={icons.password}
          title={t("auth.sendVia2FA")}
          subtitle={t("auth.resetVia2FA")}
          selected={selectedOption === "2fa"}
          onPress={() => setSelectedOption("2fa")}
        />

        <ResetOptionCard
          icon={icons.key}
          title={t("auth.sendViaGoogle")}
          subtitle={t("auth.resetViaGoogle")}
          selected={selectedOption === "google"}
          onPress={() => setSelectedOption("google")}
        />

        <ResetOptionCard
          icon={icons.phone}
          title={t("auth.sendViaSMS")}
          subtitle={t("auth.resetViaSMS")}
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
            {t("auth.resetPassword")}
          </Text>
          <Image
            source={icons.password}
            className="w-5 h-5"
            style={{ tintColor: "#FFFFFF" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* MODAL Email Input */}
      <EmailInputModal
        visible={showEmailInputModal}
        onClose={() => setShowEmailInputModal(false)}
        onSubmit={handleEmailSubmit}
        isLoading={forgotPasswordMutation.isPending}
      />

      {/* MODAL Password Sent (sử dụng NativeWind) */}
      <PasswordSentModal
        visible={showPasswordSentModal}
        email={emailToSend}
        onResend={handleResendCode}
        onClose={handlePasswordSentModalClose}
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;
