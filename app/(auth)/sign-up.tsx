// src/screens/SignIn.tsx

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const insets = useSafeAreaInsets();

  const handleSignUp = () => {
    console.log(
      "User tries to sign up with:",
      email,
      password,
      passwordConfirmation
    );
    // TODO: kiểm tra password vs passwordConfirmation, rồi tiến hành đăng ký
  };

  return (
    // Chỉ safe-area cho 'bottom' để tránh navigation bar ở Android/iOS,
    // không áp cho 'top' để background header tràn lên notch
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-white">
      {/* Đặt StatusBar trong suốt để background view dưới nó (header) hiển thị xuyên lên notch */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* === Header: background tràn lên notch === */}
      <View
        className="bg-gray-700 rounded-b-3xl items-center justify-center px-6"
        style={{
          // Đặt chiều cao header = base height + inset top để background phủ hết notch
          height: 150 + insets.top, // 48 tương đương h-12 (khoảng 192px/4 = 48pt), thay đổi tùy ý
          paddingTop: insets.top, // Đẩy nội dung bên trong xuống dưới notch
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
        <InputField
          label="Email Address"
          icon={icons.email}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <InputField
          label="Password"
          icon={icons.password}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <InputField
          label="Password Confirmation"
          icon={icons.password}
          placeholder="Confirm your password"
          secureTextEntry={true}
          value={passwordConfirmation} // dùng state mới
          onChangeText={setPasswordConfirmation}
        />

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

        {/* Sign Up Link */}
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
