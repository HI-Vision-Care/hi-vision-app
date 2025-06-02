import CustomButton from "@/components/CustomButton"; // path tùy cấu trúc project
import { icons, images } from "@/constants";
import { router } from "expo-router";
import React from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GetStarted = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 relative">
      <StatusBar barStyle="dark-content" />

      {/* Main Content */}
      <View className="flex-1 px-6 pt-8">
        {/* App Icon */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-blue-500 rounded-2xl items-center justify-center shadow-lg">
            <Image
              source={images.logo}
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Welcome Text */}
        <View className="items-center mb-12">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            Welcome to
          </Text>
          <Text className="text-3xl font-bold text-center">
            <Text className="text-blue-500">HI</Text>
            <Text className="text-gray-900">-Vision</Text>
          </Text>
        </View>

        {/* Illustration */}
        <View className="flex-1 items-center justify-center mb-8">
          <Image
            source={images.welcome}
            className="w-[500px] h-[500px]"
            resizeMode="contain"
          />
        </View>

        {/* Get Started Button (dùng CustomButton) */}
        <CustomButton
          title="Get Started"
          onPress={() => router.replace("/(auth)/welcome")}
          variant="primary"
          className="mb-4 mx-6 shadow-lg"
          rightIcon={
            <Image
              source={icons.arrow}
              className="w-6 h-6"
              resizeMode="contain"
            />
          }
        />

        {/* Sign In Link */}
        <View className="flex-row justify-center mb-8">
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

export default GetStarted;
