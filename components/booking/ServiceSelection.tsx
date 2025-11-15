// ServiceSelection.tsx
import { useTranslation } from "@/hooks/useTranslation";
import { formatVND } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ServiceImage from "../common/ServiceImage";

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
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedService = services.find(
    (service) => service.serviceID === selectedServiceId
  );

  const toggleDropdown = () => {
    setIsExpanded(!isExpanded);
  };

  const handleServiceSelect = (service: Service) => {
    onSelect(service);
    setIsExpanded(false);
  };

  return (
    <View className="mx-4 mt-6">
      <Text className="text-lg font-bold text-gray-900 mb-3">
        {t("booking.selectService")}
      </Text>

      {/* Selected Service Display */}
      <TouchableOpacity
        onPress={toggleDropdown}
        className="flex-row items-center p-4 rounded-xl border-2 border-blue-200 bg-blue-50"
      >
        {selectedService ? (
          <>
            {/* Thumbnail */}
            <View className="relative">
              <ServiceImage
                imageUri={selectedService.img}
                size="medium"
                onError={(error) => {
                  console.log(
                    "Selected service image load error:",
                    selectedService.serviceID,
                    error.nativeEvent.error
                  );
                }}
              />
            </View>

            {/* Selected Service Info */}
            <View className="flex-1 ml-4">
              <Text className="font-semibold text-blue-700">
                {selectedService.name}
              </Text>
              <Text numberOfLines={1} className="text-gray-600 text-sm mt-1">
                {selectedService.description}
              </Text>
              <View className="flex-row flex-wrap mt-1">
                <View
                  className={`px-2 py-1 rounded-full mr-2 ${
                    selectedService.isOnline ? "bg-green-100" : "bg-orange-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selectedService.isOnline
                        ? "text-green-700"
                        : "text-orange-700"
                    }`}
                  >
                    <Ionicons
                      name={selectedService.isOnline ? "wifi" : "location"}
                      size={10}
                      color={selectedService.isOnline ? "#15803d" : "#c2410c"}
                    />{" "}
                    {selectedService.isOnline
                      ? t("booking.online")
                      : t("booking.inPerson")}
                  </Text>
                </View>
                <View
                  className={`px-2 py-1 rounded-full ${
                    selectedService.isRequireDoctor
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selectedService.isRequireDoctor
                        ? "text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    <Ionicons
                      name={
                        selectedService.isRequireDoctor ? "medical" : "person"
                      }
                      size={10}
                      color={
                        selectedService.isRequireDoctor ? "#1d4ed8" : "#6b7280"
                      }
                    />{" "}
                    {selectedService.isRequireDoctor
                      ? t("booking.doctorRequired")
                      : t("booking.selfService")}
                  </Text>
                </View>
              </View>
            </View>

            {/* Price */}
            <Text className="font-bold text-blue-700">
              {formatVND(selectedService.price)}
            </Text>
          </>
        ) : (
          <View className="flex-1">
            <Text className="text-gray-500 font-medium">
              {t("booking.tapToSelectService")}
            </Text>
          </View>
        )}

        {/* Dropdown Arrow */}
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#6b7280"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {/* Dropdown Options */}
      {isExpanded && (
        <View className="bg-white border-x-2 border-b-2 border-gray-200 rounded-b-xl">
          {services.map((service) => {
            const selected = service.serviceID === selectedServiceId;
            const inactive = !service.isActive;

            return (
              <TouchableOpacity
                key={`service-${service.serviceID}`}
                onPress={() => service.isActive && handleServiceSelect(service)}
                disabled={inactive}
                className={`flex-row items-center p-4 border-b border-gray-100 ${
                  selected ? "bg-blue-50" : "bg-white"
                } ${inactive ? "opacity-50" : ""}`}
              >
                {/* Thumbnail */}
                <View className="relative">
                  <ServiceImage
                    imageUri={service.img}
                    size="small"
                    onError={(error) => {
                      console.log(
                        "Image load error for service:",
                        service.serviceID,
                        error.nativeEvent.error
                      );
                    }}
                  />
                </View>

                {/* Service Info */}
                <View className="flex-1 ml-3">
                  <Text
                    className={`font-medium text-sm ${
                      selected ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {service.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-gray-500 text-xs mt-1"
                  >
                    {service.description}
                  </Text>
                  <View className="flex-row flex-wrap mt-1">
                    <View
                      className={`px-2 py-1 rounded-full mr-2 ${
                        service.isOnline ? "bg-green-100" : "bg-orange-100"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          service.isOnline
                            ? "text-green-700"
                            : "text-orange-700"
                        }`}
                      >
                        <Ionicons
                          name={service.isOnline ? "wifi" : "location"}
                          size={8}
                          color={service.isOnline ? "#15803d" : "#c2410c"}
                        />{" "}
                        {service.isOnline
                          ? t("booking.online")
                          : t("booking.inPerson")}
                      </Text>
                    </View>
                    <View
                      className={`px-2 py-1 rounded-full ${
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
                          size={8}
                          color={
                            service.isRequireDoctor ? "#1d4ed8" : "#6b7280"
                          }
                        />{" "}
                        {service.isRequireDoctor
                          ? t("booking.doctorRequired")
                          : t("booking.selfService")}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Price */}
                <Text
                  className={`font-bold text-sm ${
                    selected ? "text-blue-700" : "text-gray-900"
                  }`}
                >
                  {formatVND(service.price)}
                </Text>

                {/* Selection Indicator */}
                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#1d4ed8"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ServiceSelection;
