import { icons } from "@/constants";
import { PhoneInputProps } from "@/models/auth/auth.types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type React from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onCountryPress,
}) => {
  return (
    <View className="mx-3 my-2">
      <LinearGradient
        colors={["#ffffff", "#f9fafb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-2xl shadow-lg"
        style={{
          shadowColor: "#3b82f6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="border-2 border-blue-200 rounded-2xl overflow-hidden">
          <View className="flex-row items-center px-4 py-4">
            {/* Country selector with Vietnam flag and dropdown */}
            <Pressable
              onPress={onCountryPress}
              className="flex-row items-center mr-3 px-3 py-1 rounded-xl border border-gray-200 bg-white/50"
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Text className="text-2xl">🇻🇳</Text>
              <Text className="text-gray-700 font-medium text-sm mr-1">
                +84
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </Pressable>

            {/* Phone number input */}
            <View className="flex-1">
              <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder="012 345 6789"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                className="text-gray-900 text-base font-medium"
                style={{
                  fontSize: 15,
                  paddingVertical: 0,
                }}
                selectionColor="#3b82f6"
              />
            </View>

            {/* Phone/Copy button */}

            <Image
              source={icons.phone}
              resizeMode="contain"
              className="w-9 h-7"
            />
          </View>
        </View>
      </LinearGradient>

      {/* Subtle bottom accent */}
      <View className="items-center mt-1">
        <LinearGradient
          colors={["#60a5fa", "#2563eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="w-16 h-1 rounded-full opacity-60"
        />
      </View>
    </View>
  );
};

export default PhoneInput;
