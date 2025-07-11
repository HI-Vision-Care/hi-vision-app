import { HeaderAllServices, ServiceCard } from "@/components";
import { useMedicalServices } from "@/services/medical-services/hooks";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

// Specialty color mapping for consistent theming
const getSpecialtyColor = (specialty: string) => {
  const colors = {
    Cardiology: { bg: "#FEF3F2", border: "#FECDCA", text: "#B42318" },
    Dermatology: { bg: "#F0FDF4", border: "#BBF7D0", text: "#166534" },
    Neurology: { bg: "#F3F4F6", border: "#D1D5DB", text: "#374151" },
    Orthopedics: { bg: "#FFF7ED", border: "#FED7AA", text: "#C2410C" },
    Pediatrics: { bg: "#FDF4FF", border: "#F3E8FF", text: "#7C2D12" },
    Psychiatry: { bg: "#F0F9FF", border: "#BAE6FD", text: "#0C4A6E" },
    General: { bg: "#F8FAFC", border: "#E2E8F0", text: "#475569" },
    Emergency: { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626" },
    Surgery: { bg: "#FFFBEB", border: "#FDE68A", text: "#D97706" },
    "Internal Medicine": { bg: "#F5F3FF", border: "#DDD6FE", text: "#6D28D9" },
    "General Medicine": { bg: "#F8FAFC", border: "#E2E8F0", text: "#475569" },
    "Infectious Diseases": {
      bg: "#F0F9FF",
      border: "#BAE6FD",
      text: "#0C4A6E",
    },
    "Sexual Health": { bg: "#FDF4FF", border: "#F3E8FF", text: "#7C2D12" },
    "Laboratory Medicine": {
      bg: "#F5F3FF",
      border: "#DDD6FE",
      text: "#6D28D9",
    },
  };

  return colors[specialty as keyof typeof colors] || colors["General"];
};

const Menu = () => {
  const { data: services, isLoading, isError, refetch } = useMedicalServices();
  // State để điều khiển spinner khi refresh
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Callback khi user kéo xuống
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch(); // gọi fetch lại dữ liệu
    } catch (e) {
      console.warn("Refresh error:", e);
    }
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <SafeAreaView
        edges={["top", "left", "right", "bottom"]}
        className="flex-1 bg-white"
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-slate-600 mt-4 text-base font-medium">
            Loading services...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        edges={["top", "left", "right", "bottom"]}
        className="flex-1 bg-white"
      >
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <Text className="text-red-800 text-center text-base font-semibold mb-2">
              Unable to Load Services
            </Text>
            <Text className="text-red-600 text-center text-sm">
              Please check your connection and try again.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* SafeAreaView chỉ cho phần top để có cùng màu với header */}
      <SafeAreaView edges={["top"]} className="bg-white">
        {/* Header */}
        <HeaderAllServices />
      </SafeAreaView>

      {/* SafeAreaView cho phần còn lại với màu nền khác */}
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        className="flex-1 bg-[#f2f5f9]"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: isTablet ? 24 : 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B82F6" // màu spinner trên iOS
              colors={["#3B82F6"]} // màu spinner trên Android
            />
          }
        >
          <ServiceCard
            services={services}
            isTablet={isTablet}
            getSpecialtyColor={getSpecialtyColor}
            router={router}
          />
          {/* Empty state */}
          {services?.length === 0 && (
            <View className="flex-1 justify-center items-center py-12">
              <View className="bg-slate-100 p-6 rounded-2xl">
                <Text className="text-slate-600 text-center text-base font-medium">
                  No services available at the moment
                </Text>
              </View>
            </View>
          )}

          {/* Bottom spacing */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Menu;
