import { DepositButton } from "@/components";
import { featureCards, images, menuSections } from "@/constants";
import { usePatientProfile } from "@/hooks/usePatientId";
import { useDeleteAccount } from "@/services/patient/hooks";
import { useCreateWallet, useWalletByAccountId } from "@/services/wallet/hooks";
import { Account, FeatureCard, MenuItem, MenuSection } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
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

const Setting = () => {
  const { data: profile } = usePatientProfile();

  const account = profile?.account as Account | undefined;
  const accountId = profile?.account?.id;
  const imageSource = account?.avatar
    ? { uri: account.avatar }
    : images.avatarPlaceholder;
  const email = account?.email ?? "";
  const name = profile?.name ?? "User";

  const {
    data: wallet,
    isLoading: isWalletLoading,
    refetch: refetchWallet,
  } = useWalletByAccountId(accountId ?? "");

  const { mutate: createWallet, isLoading: isCreating } = useCreateWallet();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.push("/(auth)/sign-in");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const { mutate: deleteAccount } = useDeleteAccount();

  const handleMenuPress = (itemId: string) => {
    console.log("Menu pressed:", itemId);
    if (itemId === "personal") router.push("/personalinfo");
    // Add other navigation cases here
  };

  const handleCardPress = (cardId: string) => {
    if (cardId === "gold") router.push("/gold");
    else if (cardId === "activity-history")
      router.push("/(personal-info)/history");
  };

  const handleToggle = (itemId: string, value: boolean) => {
    // No-op: darkmode toggle is not implemented
  };

  const getFeatureCardStyle = (card: FeatureCard) => {
    switch (card.id) {
      case "gold":
        return {
          backgroundColor: "#FFD700",
          shadowColor: "#FFD700",
        };
      case "activity-history":
        return {
          backgroundColor: "#3B82F6",
          shadowColor: "#3B82F6",
        };
      default:
        return {
          backgroundColor: "#F3F4F6",
          shadowColor: "#000",
        };
    }
  };

  const getFeatureIconColor = (card: FeatureCard) => {
    switch (card.id) {
      case "gold":
      case "activity-history":
        return "#FFFFFF";
      default:
        return "#374151";
    }
  };

  const renderFeatureCard = (card: FeatureCard) => {
    const cardStyle = getFeatureCardStyle(card);

    return (
      <TouchableOpacity
        key={card.id}
        onPress={() => handleCardPress(card.id)}
        className="flex-1 mx-2 relative rounded-2xl p-4 items-center justify-center min-h-[100px]"
        style={{
          backgroundColor: cardStyle.backgroundColor,
          shadowColor: cardStyle.shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {card.hasBadge && card.badgeCount && (
          <View className="absolute top-3 right-3 bg-black/80 rounded-full min-w-[24px] h-[24px] justify-center items-center px-2">
            <Text className="text-xs font-bold text-white">
              {card.badgeCount}
            </Text>
          </View>
        )}
        <View
          className="rounded-full p-3 mb-3"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <Ionicons
            name={card.icon as React.ComponentProps<typeof Ionicons>["name"]}
            size={28}
            color={getFeatureIconColor(card)}
          />
        </View>
        <Text
          className="text-sm font-bold text-center leading-5"
          style={{
            color:
              card.id === "gold" || card.id === "activity-history"
                ? "#FFFFFF"
                : "#374151",
          }}
        >
          {card.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        if (item.id === "signout") {
          handleLogout();
        } else if (item.id === "delete") {
          if (accountId) {
            deleteAccount(accountId, {
              onSuccess: async () => {
                await AsyncStorage.removeItem("token");
                router.replace("/(auth)/sign-in");
              },
            });
          } else {
            console.error("No accountId found for deleteAccount");
          }
        } else {
          handleMenuPress(item.id);
        }
      }}
      className="flex-row items-center justify-between px-5 py-4"
      style={{
        backgroundColor: item.isDanger ? "#FEF2F2" : "#FFFFFF",
      }}
    >
      <View className="flex-row items-center flex-1">
        <View
          className="w-12 h-12 rounded-xl justify-center items-center mr-4"
          style={{
            backgroundColor: item.isDanger ? "#FEE2E2" : "#F8FAFC",
          }}
        >
          <Ionicons
            name={item.icon as React.ComponentProps<typeof Ionicons>["name"]}
            size={24}
            color={item.iconColor || (item.isDanger ? "#EF4444" : "#64748B")}
          />
        </View>
        <View className="flex-1">
          <Text
            className={`text-base font-semibold ${
              item.isDanger ? "text-red-600" : "text-gray-800"
            }`}
          >
            {item.title}
          </Text>
        </View>
      </View>

      {item.isToggle ? (
        <Switch
          value={item.toggleValue}
          onValueChange={(value) => handleToggle(item.id, value)}
          trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
          thumbColor="#FFFFFF"
          style={{
            transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
          }}
        />
      ) : item.hasArrow ? (
        <View className="bg-gray-100 rounded-full p-2">
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </View>
      ) : null}
    </TouchableOpacity>
  );

  const renderSection = (section: MenuSection, index: number) => (
    <View key={index} className="mb-6">
      {/* Section Header */}
      <View className="flex-row justify-between items-center px-6 mb-3">
        <Text className="text-lg font-bold text-gray-800">{section.title}</Text>
        <TouchableOpacity className="bg-gray-100 rounded-full p-2">
          <Ionicons name="ellipsis-horizontal" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Section Items */}
      <View
        className="bg-white rounded-2xl mx-4 overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {section.items.map((item, itemIndex) => (
          <View key={item.id}>
            {renderMenuItem(item)}
            {itemIndex < section.items.length - 1 && (
              <View className="h-px bg-gray-100 ml-20" />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  // Custom Header Component để match với background
  const CustomHeader = () => (
    <View className="flex-row items-center justify-between px-4 py-3 bg-[#FAFBFC]">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 rounded-full bg-white justify-center items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Ionicons name="chevron-back" size={20} color="#374151" />
      </TouchableOpacity>

      <Text className="text-xl font-bold text-gray-900">Settings</Text>

      <TouchableOpacity
        className="w-10 h-10 rounded-full bg-white justify-center items-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      <SafeAreaView className="flex-1 bg-[#FAFBFC]">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Custom Header - cùng màu với background, không có border */}
          <CustomHeader />

          {/* Profile Card */}
          <View className="px-4 mb-6 mt-4">
            <View
              className="rounded-3xl p-6"
              style={{
                backgroundColor: "#667EEA",
                shadowColor: "#667EEA",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-16 h-16 rounded-2xl p-1 mr-4"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                    }}
                  >
                    <Image
                      source={imageSource}
                      className="w-full h-full rounded-xl"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-white mb-1">
                      {name}
                    </Text>
                    <Text
                      className="text-sm font-medium"
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {email}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <View className="bg-green-400 w-2 h-2 rounded-full mr-2" />
                      <Text
                        className="text-xs"
                        style={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        Active now
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  className="w-12 h-12 rounded-xl justify-center items-center"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <Ionicons name="pencil-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Wallet Card */}
          <View className="px-4 mb-6">
            <View
              className="rounded-3xl p-6 flex-row items-center justify-between"
              style={{
                backgroundColor: "#fff",
                shadowColor: "#667EEA",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  Wallet balance
                </Text>
                <Text className="text-2xl font-extrabold text-green-600">
                  {isWalletLoading
                    ? "Loading..."
                    : wallet
                    ? `${wallet.balance} đ`
                    : "No Wallet"}
                </Text>
              </View>
              {!wallet && !isWalletLoading ? (
                <TouchableOpacity
                  onPress={() => {
                    if (!accountId) return;
                    createWallet({ accountId, payload: { balance: 0 } });
                  }}
                  disabled={isCreating}
                  className="bg-blue-600 rounded-xl px-4 py-3"
                  style={{
                    shadowColor: "#3B82F6",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.18,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="wallet" size={22} color="#fff" />
                    <Text className="text-white font-bold ml-2">
                      {isCreating ? "Đang tạo ví..." : "Tạo ví"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <DepositButton
                  accountId={accountId}
                  refetchWallet={refetchWallet}
                />
              )}
            </View>
          </View>

          {/* Feature Cards Section */}
          <View className="px-4 mb-8">
            <Text className="text-lg font-bold text-gray-800 mb-4 px-2">
              Quick Actions
            </Text>
            <View className="flex-row justify-between">
              {featureCards.map((card) => renderFeatureCard(card))}
            </View>
          </View>

          {/* Menu Sections */}
          {menuSections.map((section, index) => renderSection(section, index))}

          {/* Bottom Spacing */}
          <View className="h-[120px]" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Setting;
