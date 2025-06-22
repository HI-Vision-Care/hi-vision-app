import { icons } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HeaderHome = () => {
  // Xử lý logout: xóa token và chuyển về màn Sign In
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/(auth)/sign-in");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className="bg-[#242e49] px-4 pb-6 rounded-3xl"
    >
      {/* Date + notification + logout */}
      <View className="flex-row justify-between items-center mb-4 mt-4">
        {/* Date */}
        <View className="flex-row items-center">
          <Image
            source={icons.calendar}
            resizeMode="contain"
            className="w-6 h-6"
            style={{ tintColor: "white" }}
          />
          <Text className="text-gray-400 text-sm ml-2">Tue, 25 Jan 2025</Text>
        </View>

        {/* Notification and Logout icons */}
        <View className="flex-row items-center">
          <View className="relative mr-4">
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">1</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User profile */}
      <TouchableOpacity className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          <Image
            source={{
              uri: "https://i.pinimg.com/736x/d6/4a/91/d64a91a7255ffb918d590592f711da94.jpg",
            }}
            className="w-12 h-12 rounded-xl"
          />
          <View className="ml-3 flex-1">
            <Text className="text-white text-lg font-bold">
              Hi, Dkhoa-Happy! 👋
            </Text>
            <View className="flex-row items-center mt-1">
              <View className="flex-row items-center">
                <Image
                  source={icons.healthPlus}
                  resizeMode="contain"
                  className="w-5 h-5"
                  style={{ tintColor: "blue" }}
                />
                <Text className="text-blue-400 text-sm font-semibold ml-1">
                  88%
                </Text>
              </View>
              <View className="flex-row items-center ml-4">
                <Ionicons name="star" size={16} color="#FCD34D" />
                <Text className="text-gray-300 text-sm ml-1">Pro Member</Text>
              </View>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Search bar */}
      <View className="flex-row items-center bg-slate-700 rounded-xl px-4 py-3">
        <Image
          source={icons.search}
          resizeMode="contain"
          className="w-7 h-7"
          style={{ tintColor: "gray" }}
        />
        <TextInput
          placeholder="Search asklepios..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 ml-3 text-white"
        />
      </View>
    </SafeAreaView>
  );
};

export default HeaderHome;
