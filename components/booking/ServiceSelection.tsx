// ServiceSelection.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Service = {
  serviceID: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isRequireDoctor: boolean;
  isOnline: boolean;
  img: string;
  specialty: string;
};

interface ServiceSelectionProps {
  services: Service[];
  selectedServiceId: number | null;
  onSelect: (service: Service) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  services,
  selectedServiceId,
  onSelect,
}) => {
  return (
    <View className="mx-4 mt-6">
      <Text className="text-lg font-bold text-gray-900 mb-3">
        Select Service
      </Text>

      <View className="space-y-3">
        {services.map((service) => {
          const selected = service.serviceID === selectedServiceId;
          const inactive = !service.isActive;

          return (
            <TouchableOpacity
              key={`service-${service.serviceID}`}
              onPress={() => service.isActive && onSelect(service)}
              disabled={inactive}
              className="flex-row items-center p-4 rounded-xl border-2 border-gray-200 bg-gray-100  "
            >
              {/* Thumbnail */}
              <View className="relative">
                <Image
                  source={{ uri: service.img }}
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: "#f3f4f6" }}
                />
              </View>

              {/* Nội dung chính */}
              <View className="flex-1 ml-4">
                {/* Tên */}
                <Text
                  className={`font-semibold ${
                    selected ? "text-blue-700" : "text-gray-900"
                  }`}
                >
                  {service.name}
                </Text>

                {/* Mô tả */}
                <Text numberOfLines={2} className="text-gray-600 text-sm mt-1">
                  {service.description}
                </Text>

                {/* Badges */}
                <View className="flex-row flex-wrap">
                  <View
                    className={`px-2 py-1 rounded-full mr-2 mb-1 ${
                      service.isOnline ? "bg-green-100" : "bg-orange-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        service.isOnline ? "text-green-700" : "text-orange-700"
                      }`}
                    >
                      <Ionicons
                        name={service.isOnline ? "wifi" : "location"}
                        size={10}
                        color={service.isOnline ? "#15803d" : "#c2410c"}
                      />{" "}
                      {service.isOnline ? "Online" : "In-Person"}
                    </Text>
                  </View>

                  <View
                    className={`px-2 py-1 rounded-full mb-1 ${
                      service.isRequireDoctor ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        service.isRequireDoctor
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      <Ionicons
                        name={service.isRequireDoctor ? "medical" : "person"}
                        size={10}
                        color={service.isRequireDoctor ? "#1d4ed8" : "#6b7280"}
                      />{" "}
                      {service.isRequireDoctor
                        ? "Doctor Required"
                        : "Self-Service"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Giá */}
              <Text
                className={`font-bold ml-4 ${
                  selected ? "text-blue-700" : "text-gray-900"
                }`}
              >
                ${service.price}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ServiceSelection;
