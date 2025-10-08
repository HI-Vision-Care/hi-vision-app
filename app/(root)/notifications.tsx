import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "medication" | "appointment" | "system";
  isRead: boolean;
}

const Notifications = () => {
  const { t, isReady } = useTranslation();

  // Empty notifications array - will be populated from API
  const notifications: NotificationItem[] = [];

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "medication":
        return "medical-outline";
      case "appointment":
        return "calendar-outline";
      case "system":
        return "settings-outline";
      default:
        return "information-circle-outline";
    }
  };

  const getNotificationColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "medication":
        return "#FF6B6B";
      case "appointment":
        return "#4ECDC4";
      case "system":
        return "#45B7D1";
      default:
        return "#96CEB4";
    }
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    if (!notification.isRead) {
      // Mark as read logic here
      console.log("Marking notification as read:", notification.id);
    }

    // Handle navigation based on notification type
    switch (notification.type) {
      case "medication":
        router.push("/(medicine-reminder)/medicine-calendar");
        break;
      case "appointment":
        router.push("/(root)/appointments" as any);
        break;
      case "system":
        Alert.alert(t("notifications.systemAlert"), notification.message);
        break;
    }
  };

  const markAllAsRead = () => {
    Alert.alert(
      t("notifications.markAllRead"),
      t("notifications.markAllReadMessage"),
      [{ text: t("common.confirm") }]
    );
  };

  if (!isReady) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#F8FAFC",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{t("common.loading")}</Text>
      </SafeAreaView>
    );
  }

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        marginHorizontal: 20,
        marginVertical: 6,
        padding: 20,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "flex-start",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: item.isRead ? "#F3F4F6" : "#E5E7EB",
        transform: [{ scale: item.isRead ? 1 : 1.02 }],
      }}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.6}
    >
      {/* Icon with gradient background */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: item.isRead
            ? getNotificationColor(item.type) + "15"
            : getNotificationColor(item.type) + "25",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 16,
          borderWidth: 2,
          borderColor: item.isRead
            ? getNotificationColor(item.type) + "30"
            : getNotificationColor(item.type) + "50",
        }}
      >
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={24}
          color={getNotificationColor(item.type)}
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingTop: 2 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: item.isRead ? "600" : "700",
              color: "#111827",
              flex: 1,
              lineHeight: 22,
            }}
          >
            {item.title}
          </Text>
          {!item.isRead && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#EF4444",
                marginLeft: 12,
                marginTop: 2,
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2,
              }}
            />
          )}
        </View>

        <Text
          style={{
            fontSize: 15,
            color: "#4B5563",
            marginBottom: 12,
            lineHeight: 22,
            fontWeight: "400",
          }}
        >
          {item.message}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: item.isRead ? "#F9FAFB" : "#FEF2F2",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: item.isRead ? "#6B7280" : "#DC2626",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {item.type === "medication"
                ? t("notifications.medication")
                : item.type === "appointment"
                ? t("notifications.appointment")
                : t("notifications.system")}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 13,
              color: "#9CA3AF",
              fontWeight: "500",
            }}
          >
            {item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#3B82F6",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          shadowColor: "#3B82F6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: 22,
            }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={{ alignItems: "center", flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
                marginBottom: 2,
              }}
            >
              {t("notifications.title")}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: "500",
              }}
            >
              {notifications.length === 0
                ? t("notifications.noNotifications")
                : t("notifications.newNotifications", {
                    count: notifications.filter((n) => !n.isRead).length,
                  })}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: 22,
            }}
            onPress={markAllAsRead}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-done" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingTop: 20 }}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 30,
              paddingTop: 8,
            }}
            ListHeaderComponent={
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  {t("notifications.allNotifications")}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#9CA3AF",
                    fontWeight: "500",
                  }}
                >
                  {t("notifications.totalNotifications", {
                    count: notifications.length,
                  })}
                </Text>
              </View>
            }
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 40,
            }}
          >
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: "#F8FAFC",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 6,
                borderWidth: 2,
                borderColor: "#E2E8F0",
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#E2E8F0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={40}
                  color="#94A3B8"
                />
              </View>
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#1F2937",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {t("notifications.noNotifications")}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
                lineHeight: 24,
                marginBottom: 32,
              }}
            >
              {t("notifications.emptyStateDescription")}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#3B82F6",
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 25,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#3B82F6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              onPress={() =>
                router.push("/(medicine-reminder)/medicine-calendar")
              }
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginLeft: 8,
                }}
              >
                {t("notifications.createReminder")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
