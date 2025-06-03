// src/components/ResetOptionCard.tsx
import { icons } from "@/constants";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ResetOptionCardProps {
  /** Icon để hiển thị (ví dụ icons.email, icons.lock, icons.google, icons.sms, v.v.) */
  icon: any;

  /** Tiêu đề chính (ví dụ "Send via Email") */
  title: string;

  /** Dòng mô tả bên dưới (ví dụ "Reset password via email.") */
  subtitle: string;

  /** Nếu true thì hiển thị trạng thái "selected" (viền xanh, icon xanh, text đậm) */
  selected?: boolean;

  /** Hàm gọi khi user bấm vào card */
  onPress: () => void;
}

const ResetOptionCard: React.FC<ResetOptionCardProps> = ({
  icon,
  title,
  subtitle,
  selected = false,
  onPress,
}) => {
  // Màu viền và text khi selected vs. không selected
  const borderColor = selected ? "border-blue-500" : "border-gray-200";
  const bgColor = "bg-white";
  const titleColor = selected ? "text-blue-600" : "text-gray-800";
  const subtitleColor = selected ? "text-blue-400" : "text-gray-400";
  const iconTintColor = selected ? "#2563EB" : "#9CA3AF"; // hay dùng tintColor

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`
        ${bgColor} ${borderColor} border-[1px]
        rounded-xl
        flex-row items-center
        px-4 py-3
        mb-3
      `}
    >
      {/* Icon */}
      <View
        className={`
          w-10 h-10 rounded-lg
          items-center justify-center
          ${selected ? "bg-blue-100" : "bg-gray-100"}
        `}
      >
        <Image
          source={icon}
          className="w-6 h-6"
          style={{ tintColor: iconTintColor }}
          resizeMode="contain"
        />
      </View>

      {/* Phần text: title + subtitle */}
      <View className="ml-4 flex-1">
        <Text className={`text-base font-medium ${titleColor}`}>{title}</Text>
        <Text className={`text-sm mt-1 ${subtitleColor}`}>{subtitle}</Text>
      </View>

      {/* Mũi tên chỉ hướng (chevron) */}
      <Image
        source={icons.chevronRight} // giả sử bạn có icons.arrow (mũi tên)
        className="w-4 h-4"
        style={{ tintColor: selected ? "#2563EB" : "#9CA3AF" }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default ResetOptionCard;
