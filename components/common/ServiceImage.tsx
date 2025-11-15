import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, View } from "react-native";

interface ServiceImageProps {
  imageUri?: string;
  size?: "small" | "medium" | "large";
  className?: string;
  onError?: (error: any) => void;
  onLoad?: () => void;
}

const ServiceImage: React.FC<ServiceImageProps> = ({
  imageUri,
  size = "medium",
  className = "",
  onError,
  onLoad,
}) => {
  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const iconSizes = {
    small: 20,
    medium: 24,
    large: 32,
  };

  const hasValidImage =
    imageUri &&
    imageUri.trim() !== "" &&
    imageUri !== "null" &&
    imageUri !== "undefined";

  if (hasValidImage) {
    return (
      <Image
        source={{ uri: imageUri }}
        className={`${sizeClasses[size]} rounded-lg ${className}`}
        style={{ backgroundColor: "#f3f4f6" }}
        onError={onError}
        onLoad={onLoad}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      className={`${sizeClasses[size]} rounded-lg bg-gray-200 items-center justify-center ${className}`}
    >
      <Ionicons name="medical" size={iconSizes[size]} color="#9ca3af" />
    </View>
  );
};

export default ServiceImage;
