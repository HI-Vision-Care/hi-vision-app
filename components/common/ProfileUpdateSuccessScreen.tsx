import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileUpdateSuccessScreen() {
  const handleBackToSettings = () => {
    router.push("/(root)/(tabs)/setting");
  };
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1 bg-white">
        {/* Header with back button */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity
            onPress={handleBackToSettings}
            className="w-10 h-10 border border-gray-200 rounded-lg items-center justify-center"
          >
            <Ionicons name="chevron-back" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View className="flex-1 items-center justify-center px-6">
          {/* Success illustration */}
          <View className="items-center mb-8">
            <Image
              source={require("@/assets/images/update-account.png")}
              className="w-80 h-80"
              resizeMode="contain"
            />
          </View>

          {/* Success text */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              Account successfully updated! 🌈
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Thanks for updating your account!
            </Text>
          </View>

          {/* Back to Settings button */}
          <TouchableOpacity
            onPress={handleBackToSettings}
            className="w-full bg-blue-600 rounded-2xl py-4 flex-row items-center justify-center"
          >
            <Text className="text-white font-bold text-lg mr-2">
              Back to Settings
            </Text>
            <Ionicons name="settings-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Bottom indicator line */}
        <View className="h-1 bg-gray-200 mx-4 rounded-full" />
      </SafeAreaView>
    </>
  );
}
