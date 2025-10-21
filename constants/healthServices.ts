import { router } from "expo-router";

export const getHealthServices = (t: (key: string) => string) => [
  {
    id: "1",
    title: t("home.chatWithAI"),
    icon: "chatbubble-ellipses",
    iconColor: "#FFFFFF",
    backgroundColor: "#3B82F6",
    gradientColors: ["#3B82F6", "#1D4ED8"],
    onPress: () => {
      router.push("/(chat-bot)/chat-bot");
    },
  },
  {
    id: "2",
    title: t("home.medicationReminder"),
    icon: "medical",
    iconColor: "#FFFFFF",
    backgroundColor: "#10B981",
    gradientColors: ["#10B981", "#059669"],
    onPress: () => {
      router.push("/(medicine-reminder)/medicine-calendar");
    },
  },
  {
    id: "3",
    title: t("home.clinics"),
    icon: "business",
    iconColor: "#FFFFFF",
    backgroundColor: "#0EA5E9",
    gradientColors: ["#0EA5E9", "#0369A1"],
    onPress: () => {
      router.push("/(clinics)/clinics");
    },
  },
  {
    id: "4",
    title: t("home.products"),
    icon: "bag",
    iconColor: "#FFFFFF",
    backgroundColor: "#22C55E",
    gradientColors: ["#22C55E", "#16A34A"],
    onPress: () => router.push("/(product)/products"),
  },
];
