import { CustomButtonProps } from "@/types/type";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function CustomButton({
  title,
  onPress,
  variant = "primary", // 'primary' | 'outline' | 'secondary'
  disabled = false,
  isLoading = false,
  className = "",
  leftIcon = null,
  rightIcon = null,
}: CustomButtonProps) {
  const variants = {
    primary: "bg-blue-500",
    outline: "border border-blue-500 bg-transparent",
    secondary: "bg-gray-200",
  };

  const baseClass = variants[variant] || variants.primary;
  const disableClass = disabled ? "opacity-50" : "opacity-100";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`
        ${baseClass}
        ${disableClass}
        rounded-2xl        /* bo góc 2xl giống nền code gốc */
        px-6 py-4          /* padding giống code gốc */
        flex-row items-center justify-center
        ${className}
      `}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#3b82f6" : "white"}
        />
      ) : (
        <>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text
            className={`
              ${variant === "outline" ? "text-blue-500" : "text-white"}
              text-lg font-semibold
            `}
          >
            {title}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}
