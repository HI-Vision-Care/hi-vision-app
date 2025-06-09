import { MetricCardProps } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// map color prop -> className tĩnh
const colorMap = {
  blue: { bg: "bg-blue-500", iconBg: "bg-blue-400", txt: "text-blue-100" },
  red: { bg: "bg-red-500", iconBg: "bg-red-400", txt: "text-red-100" },
  teal: { bg: "bg-cyan-500", iconBg: "bg-cyan-400", txt: "text-cyan-100" }, // <-- map teal thành cyan
  emerald: {
    bg: "bg-emerald-500",
    iconBg: "bg-emerald-400",
    txt: "text-emerald-100",
  },
} as const;

const MetricCard = ({
  color,
  title,
  icon,
  value,
  unit,
  children,
}: MetricCardProps) => {
  const { bg, iconBg, txt } = colorMap[color] || colorMap.blue;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className={`${bg} rounded-3xl p-5 w-40 mr-4 shadow-md`}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3 gap-0">
        <Text className="text-white text-sm font-semibold">{title}</Text>
        <View className={`${iconBg} rounded-full p-1`}>
          <Ionicons name={icon} size={14} color="white" />
        </View>
      </View>

      {/* Content */}
      <View className="h-16 justify-center items-center mb-3">{children}</View>

      {/* Value */}
      <View className="mt-auto">
        <Text className="text-white text-2xl font-bold">{value}</Text>
        <Text className={`${txt} text-xs font-medium mt-0.5`}>{unit}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MetricCard;
