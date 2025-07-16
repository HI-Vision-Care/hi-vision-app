import { UIMedicalService } from "@/services/medical-services/types";
import { formatVND } from "@/utils/format";
import { useRouter } from "expo-router";
import { FlaskConical, User, Wifi, WifiOff } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ServiceCardProps = {
  services: UIMedicalService[];
  isTablet: boolean;
  getSpecialtyColor: (specialty: string) => {
    bg: string;
    border: string;
    text: string;
  };
  router: ReturnType<typeof useRouter>;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  services = [],
  isTablet = false,
  getSpecialtyColor,
  router,
}) => {
  if (!services || services.length === 0) return null;

  return (
    <View className={isTablet ? "flex-row flex-wrap -mx-2" : "px-4"}>
      {services?.map((item) => {
        const specialtyColors = getSpecialtyColor(item.specialty || "General");

        return (
          <View
            key={item.serviceID}
            className={isTablet ? "w-1/2 px-2 mb-6" : "mb-6"}
          >
            <TouchableOpacity
              activeOpacity={0.7}
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
              className={`bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 ${
                !item.isActive ? "opacity-50" : ""
              } ${item.isActive ? "active:scale-98" : ""}`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
              }}
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
              {/* Header Section */}
              <View className="relative bg-gradient-to-br from-slate-50 to-slate-100">
                {item.isActive && (
                  <View className="absolute top-4 right-4 z-20">
                    <View className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md" />
                  </View>
                )}

                {item.illustrationUri && (
                  <View className="absolute right-4 top-4 z-10">
                    <View className="bg-white rounded-2xl p-2 shadow-sm">
                      <Image
                        source={item.illustrationUri}
                        className="w-20 h-20 rounded-xl"
                        resizeMode="cover"
                        accessible={true}
                        accessibilityLabel={`${item.name} illustration`}
                      />
                    </View>
                  </View>
                )}

                <View className="p-6 pb-5">
                  <View className="flex-row items-start mb-4">
                    <View
                      className="w-14 h-14 rounded-2xl items-center justify-center mr-4 shadow-md"
                      style={{
                        backgroundColor: item.iconBgColor || "#3B82F6",
                      }}
                    >
                      <Image
                        source={item.iconUri}
                        className="w-7 h-7"
                        resizeMode="contain"
                        style={{ tintColor: "white" }}
                      />
                    </View>

                    <View className="flex-1 pr-24">
                      <Text className="text-slate-900 text-xl font-bold leading-tight mb-1">
                        {item.name}
                      </Text>
                      {!item.isActive && (
                        <View className="bg-red-100 px-3 py-1 rounded-full self-start">
                          <Text className="text-red-600 text-xs font-semibold">
                            Currently Unavailable
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <Text
                    className="text-slate-600 text-base leading-relaxed mb-5"
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {item.description}
                  </Text>
                </View>
              </View>

              {/* Service Details Section */}
              <View className="px-6 pb-6">
                <View className="mb-4">
                  <View className="bg-emerald-500 px-4 py-3 rounded-2xl shadow-sm">
                    <Text className="text-white text-lg font-bold text-center">
                      {formatVND(item.price)}
                    </Text>
                  </View>
                </View>

                <View className="space-y-3">
                  {/* Row 1: Doctor requirement and Type */}
                  <View className="flex-row flex-wrap gap-2">
                    <View
                      className={`flex-row items-center px-4 py-2.5 rounded-xl flex-1 min-w-0 ${
                        item.isRequireDoctor
                          ? "bg-gray-100 border border-gray-200"
                          : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <User size={16} color="#6B7280" />
                      <Text
                        className="text-sm font-semibold ml-2 flex-1 text-gray-600"
                        numberOfLines={1}
                      >
                        {item.isRequireDoctor ? "Doctor Required" : "No Doctor"}
                      </Text>
                    </View>
                    {item.type && (
                      <View className="flex-row items-center bg-gray-100 px-4 py-2.5 rounded-xl border border-gray-200 flex-1 min-w-0">
                        <FlaskConical size={15} color="#6B7280" />
                        <Text
                          className="text-sm font-semibold text-gray-700 ml-2 flex-1"
                          numberOfLines={1}
                        >
                          {item.type}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Row 2: Online/Offline (always full width, below badges) */}
                  <View
                    className={`flex-row items-center w-full px-4 py-2.5 rounded-xl ${
                      item.isOnline
                        ? "bg-purple-100 border border-purple-200"
                        : "bg-orange-100 border border-orange-200"
                    }`}
                    style={{ marginTop: 10 }}
                  >
                    {item.isOnline ? (
                      <Wifi size={16} color="#7C3AED" />
                    ) : (
                      <WifiOff size={16} color="#EA580C" />
                    )}
                    <Text
                      className={`text-sm font-semibold ml-2 flex-1 ${
                        item.isOnline ? "text-purple-700" : "text-orange-700"
                      }`}
                      numberOfLines={1}
                    >
                      {item.isOnline ? "Online" : "In-Person"}
                    </Text>
                  </View>
                </View>

                {/* Test items - block spacing rõ ràng */}
                {item.testItems && item.testItems.length > 0 && (
                  <View className="mt-6">
                    <View className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-slate-100">
                      <Text className="text-sm text-slate-700 font-bold mb-3">
                        Test Panel:
                      </Text>
                      <View className="space-y-1">
                        {item.testItems.slice(0, 2).map((test, idx) => (
                          <View
                            key={idx}
                            className="flex-row items-center mb-1"
                          >
                            <View className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3" />
                            <Text className="text-sm text-slate-600 flex-1">
                              {test.testName}
                              {test.unit ? ` (${test.unit})` : ""}
                            </Text>
                          </View>
                        ))}
                        {item.testItems.length > 2 && (
                          <View className="flex-row items-center mt-2">
                            <View className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3" />
                            <Text className="text-sm text-blue-600 font-medium">
                              +{item.testItems.length - 2} more tests included
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                )}
              </View>
              {item.isActive && (
                <View className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-3xl" />
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default ServiceCard;
