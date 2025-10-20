import { SuccessModal } from "@/components/modals";
import { icons } from "@/constants";
import { useResetPassword, useVerifyOtp } from "@/services/auth/hooks";
import { OtpCode } from "@components";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const OtpSecurity: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email: string }>();

  // Lưu giá trị OTP
  const [otpValue, setOtpValue] = useState<string>("");
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPwd, setShowNewPwd] = useState<boolean>(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState<boolean>(false);

  // Password strength evaluation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    // Map to 0..4 tier
    const tier = Math.min(4, Math.max(0, score - 1));
    const labels = ["Very weak", "Weak", "Good", "Strong", "Excellent"];
    const colors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981", "#16A34A"];
    return { score, tier, label: labels[tier], color: colors[tier] };
  };

  // Hooks để gọi API
  const verifyOtpMutation = useVerifyOtp();
  const resetPasswordMutation = useResetPassword();
  const [showVerifySuccess, setShowVerifySuccess] = useState<boolean>(false);
  const [showResetSuccess, setShowResetSuccess] = useState<boolean>(false);

  // Callback khi nhập đủ 6 chữ số
  const handleComplete = (code: string) => {
    setOtpValue(code);
  };

  // Xử lý verify OTP
  const handleVerifyOtp = () => {
    if (otpValue.length < 6) {
      Alert.alert("Error", "Please enter complete 6-digit OTP code");
      return;
    }

    if (!params.email) {
      Alert.alert("Error", "Email not found. Please go back and try again.");
      return;
    }

    verifyOtpMutation.mutate(
      { email: params.email, otp: otpValue },
      {
        onSuccess: (data) => {
          setShowVerifySuccess(true);
          setIsOtpVerified(true);
        },
        onError: (error) => {
          Alert.alert("Error", error.message || "Invalid OTP code");
        },
      }
    );
  };

  // Xử lý reset password
  const handleResetPassword = () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate(
      {
        email: params.email,
        otp: otpValue,
        newPassword: newPassword,
      },
      {
        onSuccess: (data) => {
          setShowResetSuccess(true);
        },
        onError: (error) => {
          Alert.alert("Error", error.message || "Failed to reset password");
        },
      }
    );
  };

  const handleResend = () => {
    // Note: Backend cần có API resend OTP riêng, hoặc có thể dùng lại forgotPassword
    Alert.alert("Info", "Please use the Resend button in the previous screen");
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
      <View className="pt-16 items-center px-6">
        <Text className="text-xl font-semibold text-gray-900">
          {isOtpVerified ? "Reset Password" : "OTP Security"}
        </Text>
      </View>

      {/* Nội dung chính */}
      <View className="flex-1 px-6 mt-6">
        {!isOtpVerified ? (
          <>
            {/* Subtitle */}
            <View className="mb-6 px-2">
              <Text className="text-center text-gray-600 text-base leading-6">
                Please enter the 6 digit code sent to{"\n"}
                <Text className="font-semibold text-gray-900">
                  {params.email || "your email"}
                </Text>
              </Text>
            </View>

            {/* OTPInput (6 ô) */}
            <View className="mb-6 items-center">
              <OtpCode
                length={6}
                onComplete={handleComplete}
                onChangeText={setOtpValue}
              />
            </View>

            {/* Resend */}
            <View className="items-center mb-10">
              <Text className="text-gray-600 text-sm">
                Didn't see any OTP code?{" "}
                <Text className="text-red-500 underline" onPress={handleResend}>
                  Resend.
                </Text>
              </Text>
            </View>

            {/* Verify OTP Button */}
            <TouchableOpacity
              onPress={handleVerifyOtp}
              disabled={otpValue.length < 6 || verifyOtpMutation.isPending}
              className={`
                w-full
                ${
                  otpValue.length === 6 && !verifyOtpMutation.isPending
                    ? "bg-blue-600"
                    : "bg-blue-300"
                }
                rounded-xl py-4 shadow items-center
                ${otpValue.length === 6 ? "active:opacity-90" : "opacity-50"}
              `}
            >
              <View className="flex-row items-center">
                <Text className="text-white text-base font-semibold mr-2">
                  {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                </Text>
                {!verifyOtpMutation.isPending && (
                  <Text className="text-white text-lg">→</Text>
                )}
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Password Reset Card */}
            <View
              className="mb-6 bg-white rounded-2xl p-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              {/* New Password */}
              <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                New Password
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4 mb-3">
                <TextInput
                  className="flex-1 py-3.5 text-gray-900 text-base"
                  placeholder="Enter new password"
                  placeholderTextColor="#9ca3af"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPwd}
                  autoCapitalize="none"
                />
                <Text
                  className="text-blue-600 text-sm font-semibold ml-2"
                  onPress={() => setShowNewPwd((v) => !v)}
                >
                  {showNewPwd ? "Hide" : "Show"}
                </Text>
              </View>

              {/* Strength bar */}
              {newPassword ? (
                <View className="mb-2">
                  {(() => {
                    const s = getPasswordStrength(newPassword);
                    return (
                      <View>
                        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <View
                            style={{
                              width: `${(s.score / 5) * 100}%`,
                              backgroundColor: s.color,
                            }}
                            className="h-2 rounded-full"
                          />
                        </View>
                        <Text
                          className="text-xs mt-1"
                          style={{ color: s.color }}
                        >
                          {s.label}
                        </Text>
                      </View>
                    );
                  })()}
                </View>
              ) : null}

              {/* Confirm Password */}
              <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1 mt-2">
                Confirm Password
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-xl px-4">
                <TextInput
                  className="flex-1 py-3.5 text-gray-900 text-base"
                  placeholder="Confirm new password"
                  placeholderTextColor="#9ca3af"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPwd}
                  autoCapitalize="none"
                />
                <Text
                  className="text-blue-600 text-sm font-semibold ml-2"
                  onPress={() => setShowConfirmPwd((v) => !v)}
                >
                  {showConfirmPwd ? "Hide" : "Show"}
                </Text>
              </View>
            </View>

            {/* Reset Password Button */}
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={
                !newPassword ||
                !confirmPassword ||
                resetPasswordMutation.isPending
              }
              className={`
                w-full
                ${
                  newPassword &&
                  confirmPassword &&
                  !resetPasswordMutation.isPending
                    ? "bg-blue-600"
                    : "bg-blue-300"
                }
                rounded-xl py-4 shadow items-center
                ${
                  newPassword && confirmPassword
                    ? "active:opacity-90"
                    : "opacity-50"
                }
              `}
            >
              <View className="flex-row items-center">
                <Text className="text-white text-base font-semibold mr-2">
                  {resetPasswordMutation.isPending
                    ? "Resetting..."
                    : "Reset Password"}
                </Text>
                {!resetPasswordMutation.isPending && (
                  <Text className="text-white text-lg">→</Text>
                )}
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
      {/* Success Modals */}
      <SuccessModal
        visible={showVerifySuccess}
        onClose={() => setShowVerifySuccess(false)}
        title="OTP Verified"
        subtitle="Your OTP has been verified successfully. Please set your new password."
        buttonText="Continue"
      />

      <SuccessModal
        visible={showResetSuccess}
        onClose={() => router.replace("/(auth)/sign-in")}
        title="Password Updated"
        subtitle="Your password has been reset successfully. You can now sign in with the new password."
        buttonText="Go to Sign In"
      />
    </SafeAreaView>
  );
};

export default OtpSecurity;
