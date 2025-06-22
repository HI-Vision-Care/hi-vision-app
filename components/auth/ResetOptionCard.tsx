import { icons } from "@/constants";
import { ResetOptionCardProps } from "@/types/type";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ResetOptionCard: React.FC<ResetOptionCardProps> = ({
  icon,
  title,
  subtitle,
  selected = false,
  onPress,
}) => {
  const borderColor = selected ? "border-blue-500" : "border-gray-200";
  const bgColor = "bg-white";
  const titleColor = selected ? "text-blue-600" : "text-gray-800";
  const subtitleColor = selected ? "text-blue-400" : "text-gray-400";
  const iconTintColor = selected ? "#2563EB" : "#9CA3AF";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`
        ${bgColor} ${borderColor} border-[1px]
        rounded-xl
        flex-row items-center
        px-10 py-8
        mb-4
      `}
    >
      {/* Xử lý icon */}
      <View
        className={`
          w-16 h-16 rounded-lg
          items-center justify-center
          ${selected ? "bg-blue-100" : "bg-gray-100"}
        `}
      >
        <Image
          source={icon}
          className="w-8 h-8"
          style={{ tintColor: iconTintColor }}
          resizeMode="contain"
        />
      </View>

      {/* Text container luôn dùng <Text> bọc */}
      <View className="ml-5 flex-1">
        <Text className={`text-lg font-JakartaSemiBold ${titleColor}`}>
          {title}
        </Text>
        <Text className={`text-base mt-1 ${subtitleColor}`}>{subtitle}</Text>
      </View>

      {/* Chevron icon */}
      <Image
        source={icons.chevronRight}
        className="w-7 h-7"
        style={{ tintColor: selected ? "#2563EB" : "#9CA3AF" }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default ResetOptionCard;
