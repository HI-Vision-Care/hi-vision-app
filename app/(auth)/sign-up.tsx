import { icons, images } from "@/constants";
import { useSignUp } from "@/services/auth/hooks";
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
  // 1. States cho các trường input
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // State để lưu lỗi (nếu có)
  const [errorMessage, setErrorMessage] = useState<string>("");

  // React Query mutation
  const { mutateAsync: signUp, isLoading } = useSignUp();

  const handleSignUp = async () => {
    // 2. Validate các trường bắt buộc
    if (!username.trim()) {
      setErrorMessage("Username is required");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Phone number is required");
      return;
    }
    setErrorMessage("");

    try {
      // 3. Gọi API qua hook với full payload
      await signUp({ username, email, password, phone });

      // 4. Hiển thị thông báo và điều hướng về Sign In
      Alert.alert(
        "Registration Successful",
        "Your account has been created. Please log in to continue.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/sign-in"),
          },
        ]
      );
    } catch (err: any) {
      setErrorMessage(err.message || "Sign up failed. Please try again.");
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
        {/* Username */}
        <InputField
          label="Username"
          icon={icons.user}
          placeholder="Enter your username"
          autoCapitalize="none"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setErrorMessage("");
          }}
          errorMessage={
            errorMessage.includes("Username") ? errorMessage : undefined
          }
        />

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
