import { icons, images } from "@/constants";
import { Service } from "@/types/type";
import { useRouter } from "expo-router";
import {
  DollarSign,
  Stethoscope,
  User,
  Wifi,
  WifiOff,
} from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ServiceCardProps = {
  services: Service[]; // Kiểu array các service object
  isTablet: boolean;
  getSpecialtyColor: (specialty: string) => {
    bg: string;
    border: string;
    text: string;
  };
  router: ReturnType<typeof useRouter>; // hoặc bạn có thể khai báo kiểu: { push: Function; ... }
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  services = [],
  isTablet = false,
  getSpecialtyColor,
  router,
}) => {
  if (!services || services.length === 0) return null;

  return (
    <View className={isTablet ? "flex-row flex-wrap -mx-2" : ""}>
      {services?.map((item) => {
        const specialtyColors = getSpecialtyColor(item.specialty || "General");

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
                        item.isRequireDoctor ? "text-blue-700" : "text-gray-600"
                      }`}
                    >
                      {item.isRequireDoctor ? "Doctor Required" : "No Doctor"}
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
                        item.isOnline ? "text-purple-700" : "text-orange-700"
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
  );
};

export default ServiceCard;
