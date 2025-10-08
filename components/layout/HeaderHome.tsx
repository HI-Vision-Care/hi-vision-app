import { icons, images } from "@/constants";
import { useTranslation } from "@/hooks/useTranslation";
import { useGetPatientProfile } from "@/services/patient/hooks";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface JWTPayload {
  sub: string; // sub là accountId
  iat: number;
  exp: number;
}

const HeaderHome = () => {
  const { t, language, isReady } = useTranslation();
  const [accountId, setAccountId] = useState<string>();

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        try {
          // decode sub thay cho accountId
          const { sub } = jwtDecode<JWTPayload>(token);
          setAccountId(sub);
        } catch {
          console.warn("Invalid token");
        }
      }
    });
  }, []);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetPatientProfile(accountId ?? "");

  // 3. Lấy ra avatar + username (có fallback)
  const avatarUri = profile?.account?.avatar
    ? profile.account.avatar
    : images.avatarPlaceholder;
  const name = profile?.name ?? t("common.guest");

  if (!isReady) {
    return (
      <SafeAreaView
        edges={["top"]}
        className="bg-[#242e49] px-4 pb-6 rounded-3xl"
      >
        <View className="flex-row justify-between items-center mb-4 mt-4">
          <View className="flex-row items-center">
            <Text className="text-gray-400 text-sm">{t("common.loading")}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text className="text-gray-400 text-sm ml-2">
            {new Date().toLocaleDateString(
              language === "vi" ? "vi-VN" : "en-US",
              {
                weekday: "short", // Tue / T2
                day: "2-digit", // 25
                month: "short", // Jan / Th1
                year: "numeric", // 2025
              }
            )}
          </Text>
        </View>

        {/* Notification and Logout icons */}
        <View className="flex-row items-center">
          <TouchableOpacity
            className="relative mr-4"
            onPress={() => {
              router.push("/(root)/notifications");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* User profile */}
      <TouchableOpacity
        className="flex-row items-center justify-between mb-4"
        onPress={() => {
          // build các param cần truyền
          router.replace({
            pathname: "/(root)/(tabs)/setting",
          });
        }}
      >
        <View className="flex-row items-center flex-1">
          {/* Avatar */}
          {profileLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Image
              source={
                typeof avatarUri === "string" ? { uri: avatarUri } : avatarUri
              }
              style={{ width: 48, height: 48, borderRadius: 12 }}
              resizeMode="cover"
            />
          )}

          <View className="ml-3 flex-1">
            <Text className="text-white text-lg font-bold">
              {profileLoading
                ? t("common.loading")
                : profileError
                ? t("common.error")
                : `${t("common.greeting")}, ${name}! 👋`}
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
          placeholder={t("common.searchPlaceholder")}
          placeholderTextColor="#9CA3AF"
          className="flex-1 ml-3 text-white"
        />
      </View>
    </SafeAreaView>
  );
};

export default HeaderHome;
