import { icons, images } from "@/constants";
import { useTranslation } from "@/hooks/useTranslation";
import { useGoogleAuth } from "@/services/auth/google-auth";
import { useSignUp } from "@/services/auth/hooks";
import {
  authErrorHandler,
  validationErrorHandler,
} from "@/utils/error-handler";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from "@/utils/validate-auth";
import { CustomButton, InputField } from "@components";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // State để lưu lỗi (nếu có)
  const [errorMessage, setErrorMessage] = useState<string>("");

  // React Query mutation
  const { mutateAsync: signUp, isLoading } = useSignUp();

  const handleSignUp = async () => {
    if (!isValidEmail(email)) {
      const errorMsg = "Invalid email address.";
      setErrorMessage(errorMsg);
      validationErrorHandler(errorMsg);
      return;
    }
    if (!isValidPassword(password)) {
      const errorMsg =
        "Password must be at least 8 characters and contain no spaces.";
      setErrorMessage(errorMsg);
      validationErrorHandler(errorMsg);
      return;
    }
    if (password !== confirmPassword) {
      const errorMsg = "Passwords do not match.";
      setErrorMessage(errorMsg);
      validationErrorHandler(errorMsg);
      return;
    }
    if (!isValidPhone(phone)) {
      const errorMsg = "Invalid phone number. Only digits, 9 to 11 characters.";
      setErrorMessage(errorMsg);
      validationErrorHandler(errorMsg);
      return;
    }
    setErrorMessage("");

    try {
      await signUp({ email, password, phone });
      router.replace("/(onboarding)/patient-name");
    } catch (error: any) {
      authErrorHandler(error);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-white">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Header */}
      <View
        className="bg-gray-700 rounded-b-3xl items-center justify-center px-6"
        style={{
          height: 150 + insets.top,
          paddingTop: insets.top,
        }}
      >
        <Image
          source={images.logo}
          className="w-14 h-14 mb-4"
          resizeMode="contain"
        />
        <Text className="text-white text-2xl font-semibold">
          {t("auth.signUp")}
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-8">
        {/* Email */}
        <InputField
          label={t("auth.emailAddress")}
          icon={icons.email}
          placeholder={t("auth.enterEmail")}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage("");
          }}
          errorMessage={
            errorMessage.includes("Email") ? errorMessage : undefined
          }
        />
        {email.length > 0 && !isValidEmail(email) && (
          <Text className="text-red-500 text-lg mt-1">
            {t("auth.invalidEmail")}
          </Text>
        )}

        {/* Password */}
        <InputField
          label={t("auth.password")}
          icon={icons.password}
          placeholder={t("auth.enterPassword")}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
          }}
        />
        {password.length > 0 && !isValidPassword(password) && (
          <Text className="text-red-500 text-lg mt-1">
            {t("auth.invalidPassword")}
          </Text>
        )}

        {/* Confirm Password */}
        <InputField
          label={t("auth.confirmPassword")}
          icon={icons.password}
          placeholder={t("auth.confirmPasswordPlaceholder")}
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrorMessage("");
          }}
          errorMessage={
            errorMessage.includes("match") ? errorMessage : undefined
          }
        />
        {confirmPassword.length > 0 && password !== confirmPassword && (
          <Text className="text-red-500 text-lg mt-1">
            {t("auth.passwordsNotMatch")}
          </Text>
        )}

        {/* Phone Number */}
        <InputField
          label={t("auth.phoneNumber")}
          icon={icons.phone}
          placeholder={t("auth.enterPhone")}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setErrorMessage("");
          }}
          errorMessage={
            errorMessage.includes("Phone") ? errorMessage : undefined
          }
        />
        {phone.length > 0 && !isValidPhone(phone) && (
          <Text className="text-red-500 text-lg mt-1">
            {t("auth.invalidPhone")}
          </Text>
        )}

        {/* Error general */}
        {errorMessage && !errorMessage.includes("match") && (
          <Text className="text-red-500 mb-2">{errorMessage}</Text>
        )}

        {/* Sign Up Button */}
        <CustomButton
          title={t("auth.signUp")}
          onPress={handleSignUp}
          variant="primary"
          className="mb-6 mx-0 shadow-lg"
          rightIcon={
            <Image
              source={icons.arrow}
              className="w-6 h-6"
              resizeMode="contain"
            />
          }
          isLoading={isLoading}
        />

        {/* OR Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500 text-sm">{t("auth.or")}</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Link to Sign In */}
        <View className="flex-row justify-center mb-8 ">
          <Text className="text-gray-600 text-base">
            {t("auth.haveAccount")}{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
            <Text className="text-red-500 font-medium underline text-base">
              {t("auth.signIn")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
