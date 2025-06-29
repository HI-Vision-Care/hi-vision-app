import { featureCards, images, menuSections } from "@/constants";
import { useDeleteAccount } from "@/services/patient/hooks";
import { FeatureCard, MenuItem, MenuSection } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Setting: React.FC = () => {
  const params = useLocalSearchParams();
  const accountId = params.accountId as string;
  const username = params.username ?? "Guest";
  const avatar = Array.isArray(params.avatar)
    ? params.avatar[0] ?? ""
    : params.avatar ?? "";
  const email = params.email ?? "";
  const imageSource = avatar ? { uri: avatar } : images.avatarPlaceholder;

  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.push("/(auth)/sign-in");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const { mutate: deleteAccount } = useDeleteAccount();

  const handleGoBack = () => router.back();

  const handleMenuPress = (itemId: string) => {
    console.log("Menu pressed:", itemId);
    if (itemId === "personal") router.push("/personalinfo");
    // Add other navigation cases here
  };

  const handleCardPress = (cardId: string) => {
    console.log("Card pressed:", cardId);
    if (cardId === "gold") router.push("/gold");
    else if (cardId === "activity-history") router.push("/history");
  };

  const handleToggle = (itemId: string, value: boolean) => {
    if (itemId === "darkmode") setDarkMode(value);
  };

  const renderFeatureCard = (card: FeatureCard) => (
    <TouchableOpacity
      key={card.id}
      onPress={() => handleCardPress(card.id)}
      className="flex-1 bg-[#f5f3f0] rounded-[16px] p-[5px] mx-[6px] items-center justify-center min-h-[50px] relative shadow-md"
    >
      {card.hasBadge && card.badgeCount && (
        <View className="absolute top-[12px] right-[12px] bg-black rounded-[12px] min-w-[24px] h-[24px] justify-center items-center px-2">
          <Text className="text-[12px] font-semibold text-white">
            {card.badgeCount}
          </Text>
        </View>
      )}
      <Text className="text-[32px] mb-3">{card.icon}</Text>
      <Text className="text-base font-semibold text-[#374151] text-center">
        {card.title}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        if (item.id === "signout") {
          handleLogout();
        } else if (item.id === "delete") {
          // gọi deleteAccount, và sau khi xóa thành công nhớ xóa token + back to sign-in
          deleteAccount(accountId, {
            onSuccess: async () => {
              await AsyncStorage.removeItem("token");
              router.replace("/(auth)/sign-in");
            },
          });
        } else {
          handleMenuPress(item.id);
        }
      }}
      className="flex-row items-center justify-between bg-white px-5 py-4 border-b border-[#f1f5f9]"
    >
      {/* icon + title */}
      <View className="flex-row items-center flex-1">
        <View
          className={`w-10 h-10 rounded-[10px] justify-center items-center mr-4 ${
            item.isDanger ? "bg-red-50" : "bg-gray-50"
          }`}
        >
          <Text className="text-lg">{item.icon}</Text>
        </View>
        <Text
          className={`text-base font-medium ${
            item.isDanger ? "text-red-600" : "text-[#374151]"
          }`}
        >
          {item.title}
        </Text>
      </View>

      {item.isToggle ? (
        <Switch
          value={item.toggleValue}
          onValueChange={(value) => handleToggle(item.id, value)}
          trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
          thumbColor={item.toggleValue ? "#ffffff" : "#ffffff"}
        />
      ) : item.hasArrow ? (
        <Text className="text-base text-[#9ca3af]">›</Text>
      ) : null}
    </TouchableOpacity>
  );

  const renderSection = (section: MenuSection, index: number) => (
    <View key={index} className="mb-6">
      {/* Section Header */}
      <View className="flex-row justify-between items-center px-5 mb-2">
        <Text className="text-base font-semibold text-gray-500">
          {section.title}
        </Text>
        <TouchableOpacity>
          <Text className="text-base text-[#9ca3af]">⋯</Text>
        </TouchableOpacity>
      </View>
      {/* Section Items */}
      <View className="bg-white rounded-[16px] mx-4 overflow-hidden shadow-sm">
        {section.items.map((item, itemIndex) => (
          <View key={item.id}>
            {renderMenuItem(item)}
            {itemIndex < section.items.length - 1 && (
              <View className="h-px bg-[#f1f5f9] ml-20" />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f5f9" />
      <SafeAreaView className="flex-1 bg-[#f2f5f9]">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center px-5 py-4 bg-[#f2f5f9]">
            <TouchableOpacity
              onPress={handleGoBack}
              className="w-10 h-10 rounded-lg bg-white justify-center items-center mr-4 shadow-sm"
            >
              <Text className="text-lg text-[#374151]">‹</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-[#111827]">My Account</Text>
          </View>

          {/* Profile Card */}
          <View className="px-4 mb-5">
            <View className="bg-blue-500 rounded-[20px] p-5 flex-row items-center justify-between shadow-lg">
              <View className="flex-row items-center flex-1">
                <View className="w-[60px] h-[60px] rounded-[16px] bg-white p-0.5 mr-4">
                  <Image
                    source={imageSource}
                    className="w-full h-full rounded-[14px]"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-white mb-1">
                    {username}
                  </Text>
                  <Text className="text-sm text-white opacity-80">{email}</Text>
                </View>
              </View>
              <TouchableOpacity className="w-[36px] h-[36px] bg-white/20 rounded-[10px] justify-center items-center">
                <Text className="text-base text-white">✏️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Feature Cards Section */}
          <View className="px-4 mb-5">
            <View className="flex-row justify-between">
              {featureCards.map((card) => renderFeatureCard(card))}
            </View>
          </View>

          {/* Menu Sections */}
          {menuSections.map((section, index) => renderSection(section, index))}

          {/* Bottom Spacing */}
          <View className="h-[100px]" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Setting;
