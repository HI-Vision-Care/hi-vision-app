import { icons, images } from "@/constants";
import { useSignUp } from "@/services/auth/hooks";
import { CustomButton, InputField } from "@components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SignUp: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  // 1. State để lưu lỗi (nếu có)
  const [errorMessage, setErrorMessage] = useState<string>("");

  // React Query mutation
  const { mutateAsync: signUp, isLoading } = useSignUp();

  const handleSignUp = async () => {
    // Validate passwords match
    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords do not match");
      return;
    }
    setErrorMessage("");

    try {
      // Call hook: use email input as 'username' for BE
      const { token } = await signUp({ username: email, password });

      // Save token and navigate to Home
      await AsyncStorage.setItem("token", token);
      router.replace("/(root)/(tabs)/home");
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

      {/* === Header: background tràn lên notch === */}
      <View
        className="bg-gray-700 rounded-b-3xl items-center justify-center px-6"
        style={{
          height: 150 + insets.top,
          paddingTop: insets.top,
        }}
      >
        <View className="items-center">
          <View className="w-8 h-8  items-center justify-center mb-4">
            <Image
              source={images.logo}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>
          <Text className="text-white text-2xl font-semibold">Sign Up</Text>
        </View>
      </View>

      {/* === Content phía dưới Header === */}
      <View className="flex-1 px-6 py-8">
        {/* Input Email */}
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
            errorMessage.includes("email") ? errorMessage : undefined
          }
        />

        {/* Input Password */}
        <InputField
          label="Password"
          icon={icons.password}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
          }}
        />

        {/* Input Password Confirmation */}
        <InputField
          label="Phone Number"
          icon={icons.phone}
          placeholder="Confirm your password"
          secureTextEntry
          value={passwordConfirmation}
          onChangeText={(text) => {
            setPasswordConfirmation(text);
            setErrorMessage("");
          }}
          errorMessage={
            errorMessage.includes("match") ? errorMessage : undefined
          }
        />

        {/* Error Message */}
        {errorMessage && !errorMessage.includes("match") && (
          <Text className="text-red-500 mb-2">{errorMessage}</Text>
        )}

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
