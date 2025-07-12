import { icons, images } from "@/constants";
import { useSignUp } from "@/services/auth/hooks";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from "@/utils/validate-auth";
import { CustomButton, InputField } from "@components";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SignUp: React.FC = () => {
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
      setErrorMessage("Invalid email address.");
      return;
    }
    if (!isValidPassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters and contain no spaces."
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!isValidPhone(phone)) {
      setErrorMessage("Invalid phone number. Only digits, 9 to 11 characters.");
      return;
    }
    setErrorMessage("");

    try {
      await signUp({ email, password, phone });
      router.replace("/(onboarding)/patient-name");
    } catch (error: any) {
      Alert.alert("Error", error.message);
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
        <Text className="text-white text-2xl font-semibold">Sign Up</Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 py-8">
        {/* Email */}
        <InputField
          label="Email Address"
          icon={icons.email}
          placeholder="Enter your email"
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
            Invalid email address.
          </Text>
        )}

        {/* Password */}
        <InputField
          label="Password"
          icon={icons.password}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
          }}
        />
        {password.length > 0 && !isValidPassword(password) && (
          <Text className="text-red-500 text-lg mt-1">
            Password must be at least 8 characters, no spaces.
          </Text>
        )}

        {/* Confirm Password */}
        <InputField
          label="Confirm Password"
          icon={icons.password}
          placeholder="Confirm your password"
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
            Passwords do not match.
          </Text>
        )}

        {/* Phone Number */}
        <InputField
          label="Phone Number"
          icon={icons.phone}
          placeholder="Enter your phone number"
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
            Invalid phone number.
          </Text>
        )}

        {/* Error general */}
        {errorMessage && !errorMessage.includes("match") && (
          <Text className="text-red-500 mb-2">{errorMessage}</Text>
        )}

        {/* Sign Up Button */}
        <CustomButton
          title="Sign Up"
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
          <Text className="mx-4 text-gray-500 text-sm">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Google Sign In */}
        <TouchableOpacity
          className="
            w-16 h-16
            bg-white
            border border-gray-300
            rounded-xl
            items-center justify-center
            mb-8
            self-center
          "
          onPress={() => {
            console.log("Google Sign In pressed");
          }}
        >
          <Text className="text-gray-700 text-2xl font-bold">G</Text>
        </TouchableOpacity>

        {/* Link to Sign In */}
        <View className="flex-row justify-center mb-8 ">
          <Text className="text-gray-600 text-base">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
            <Text className="text-red-500 font-medium underline text-base">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
