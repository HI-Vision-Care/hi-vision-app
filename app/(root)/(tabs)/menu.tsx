import { icons, images } from "@/constants";
import { useMedicalServices } from "@/services/medical-services/hooks";
import { useRouter } from "expo-router";
import {
  DollarSign,
  Stethoscope,
  User,
  Wifi,
  WifiOff,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
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
    "General Medicine": { bg: "#F8FAFC", border: "#E2E8F0", text: "#475569" }, // Xám xanh dịu
    "Infectious Diseases": {
      bg: "#F0F9FF",
      border: "#BAE6FD",
      text: "#0C4A6E",
    }, // Xanh biển nhạt
    "Sexual Health": { bg: "#FDF4FF", border: "#F3E8FF", text: "#7C2D12" }, // Hồng tím nhẹ
    "Laboratory Medicine": {
      bg: "#F5F3FF",
      border: "#DDD6FE",
      text: "#6D28D9",
    }, // Tím nhạt
  };

  return colors[specialty as keyof typeof colors] || colors["General"];
};

const Menu = () => {
  const { data: services, isLoading, isError } = useMedicalServices();
  const router = useRouter();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
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
      <SafeAreaView className="flex-1 bg-slate-50">
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
    <SafeAreaView
      edges={["top", "left", "right", "bottom"]}
      className="flex-1 bg-[#f2f5f9]"
    >
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-slate-100">
        <Text className="text-slate-900 text-2xl font-bold">
          Medical Services
        </Text>
        <Text className="text-slate-600 text-sm mt-1">
          Choose from our available healthcare services across specialties
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: isTablet ? 24 : 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className={isTablet ? "flex-row flex-wrap -mx-2" : ""}>
          {services?.map((item) => {
            const specialtyColors = getSpecialtyColor(
              item.specialty || "General"
            );

            return (
              <View
                key={item.serviceID}
                className={isTablet ? "w-1/2 px-2 mb-4" : "mb-4"}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!item.isActive}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name} service in ${
                    item.specialty || "General"
                  } specialty, ${item.price}`}
                  accessibilityHint={
                    item.isActive
                      ? "Tap to select this service"
                      : "This service is currently unavailable"
                  }
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 ${
                    !item.isActive ? "opacity-60" : ""
                  }`}
                  onPress={() =>
                    router.push({
                      pathname: "/services/[id]",
                      params: {
                        id: item.serviceID,
                        data: JSON.stringify(item),
                        image: item.img,
                      },
                    })
                  }
                >
                  {/* Header with illustration */}
                  <View className="relative">
                    {/* Illustration - Moved down to accommodate specialty badge */}
                    {item.illustrationUri && (
                      <View className="absolute right-4 top-16 z-10">
                        <Image
                          source={images.gonorrhea}
                          className="w-32 h-32 rounded-xl"
                          resizeMode="cover"
                          accessible={true}
                          accessibilityLabel={`${item.name} illustration`}
                        />
                      </View>
                    )}

                    <View className="p-5 pb-4">
                      {/* Service icon and title */}
                      <View className="flex-row items-start mb-3">
                        <View
                          className="w-12 h-12 rounded-xl items-center justify-center mr-3 shadow-sm"
                          style={{
                            backgroundColor: item.iconBgColor || "#3B82F6",
                          }}
                        >
                          <Image
                            source={icons.virus103}
                            className="w-6 h-6"
                            resizeMode="contain"
                            style={{ tintColor: "white" }}
                          />
                        </View>

                        <View className="flex-1 pr-28">
                          <Text className="text-slate-900 text-lg font-bold leading-tight">
                            {item.name}
                          </Text>
                          {!item.isActive && (
                            <Text className="text-red-500 text-xs font-medium mt-1">
                              Currently Unavailable
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* Description */}
                      <Text
                        className="text-slate-600 text-sm leading-relaxed mb-4"
                        numberOfLines={4} // Tối đa 4 dòng, còn lại sẽ "..."
                        ellipsizeMode="tail"
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>

                  {/* Service details with enhanced layout */}
                  <View className="px-5 pb-5">
                    {/* Primary badges row */}
                    <View className="flex-row flex-wrap gap-2 mb-2">
                      {/* Price */}
                      <View className="flex-row items-center bg-emerald-50 px-3 py-2 rounded-full border border-emerald-100">
                        <DollarSign size={14} color="#059669" />
                        <Text className="text-emerald-700 text-xs font-bold ml-1">
                          {item.price}
                        </Text>
                      </View>

                      {/* Doctor requirement */}
                      <View
                        className={`flex-row items-center px-3 py-2 rounded-full ${
                          item.isRequireDoctor
                            ? "bg-blue-50 border border-blue-100"
                            : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <User
                          size={14}
                          color={item.isRequireDoctor ? "#2563EB" : "#6B7280"}
                        />
                        <Text
                          className={`text-xs font-medium ml-1.5 ${
                            item.isRequireDoctor
                              ? "text-blue-700"
                              : "text-gray-600"
                          }`}
                        >
                          {item.isRequireDoctor
                            ? "Doctor Required"
                            : "No Doctor"}
                        </Text>
                      </View>
                    </View>

                    {/* Secondary badges row */}
                    <View className="flex-row flex-wrap gap-2">
                      {/* Online/Offline */}
                      <View
                        className={`flex-row items-center px-3 py-2 rounded-full ${
                          item.isOnline
                            ? "bg-purple-50 border border-purple-100"
                            : "bg-orange-50 border border-orange-100"
                        }`}
                      >
                        {item.isOnline ? (
                          <Wifi size={14} color="#7C3AED" />
                        ) : (
                          <WifiOff size={14} color="#EA580C" />
                        )}
                        <Text
                          className={`text-xs font-medium ml-1.5 ${
                            item.isOnline
                              ? "text-purple-700"
                              : "text-orange-700"
                          }`}
                        >
                          {item.isOnline ? "Online" : "In-Person"}
                        </Text>
                      </View>

                      {/* Specialty badge for mobile layout (duplicate for better visibility) */}
                      {item.specialty && !isTablet && (
                        <View
                          className="flex-row items-center px-3 py-2 rounded-full border"
                          style={{
                            backgroundColor: specialtyColors.bg,
                            borderColor: specialtyColors.border,
                          }}
                        >
                          <Stethoscope size={12} color={specialtyColors.text} />
                          <Text
                            className="text-xs font-medium ml-1"
                            style={{ color: specialtyColors.text }}
                          >
                            {item.specialty}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Availability indicator */}
                  {item.isActive && (
                    <View className="absolute top-3 left-3">
                      <View className="w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

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
  );
};

export default Menu;
