// app/(patient-background)/patient-bloodtype.tsx
"use client";

import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { HealthBackgroundContext } from "@/context/HealthBackgroundContext";
import { useRouter } from "expo-router";

export default function PatientBloodTypeScreen() {
  const ctx = useContext(HealthBackgroundContext);
  const router = useRouter();
  const [bloodType, setBloodType] = useState<string>(ctx?.data.bloodType || "");

  if (!ctx) {
    router.replace("/");
    return null;
  }

  const options = ["A", "B", "AB", "O"];

  const onContinue = async () => {
    if (!bloodType) return;
    const finalData = { ...ctx.data, bloodType };
    ctx.setData(finalData);

    // Ví dụ gọi API POST lên server
    try {
      const res = await fetch("https://your-api-endpoint.com/api/patient-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      if (!res.ok) throw new Error("Server error");
      // Nếu thành công, chuyển về màn Home (hoặc Dashboard)
      router.replace("/");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Không thể lưu thông tin. Vui lòng thử lại.");
    }
  };

  return (
    <View className="flex-1 px-6 pt-8 bg-gray-50">
      <Text className="text-2xl font-semibold text-gray-800 mb-8">
        What’s your official blood type?
      </Text>

      <View className="flex-row justify-between mb-8">
        {options.map((o) => {
          const isSel = o === bloodType;
          return (
            <TouchableOpacity
              key={o}
              onPress={() => setBloodType(o)}
              className={`flex-1 mx-1 py-6 items-center rounded-lg 
                ${isSel ? "bg-blue-600" : "bg-gray-200"}`}
            >
              <Text className={`text-2xl font-bold ${isSel ? "text-white" : "text-gray-700"}`}>
                {o}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={onContinue}
        disabled={!bloodType}
        className={`w-full py-3 rounded-lg items-center ${bloodType ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <Text className={`text-base font-semibold ${bloodType ? "text-white" : "text-gray-200"}`}>
          Continue →
        </Text>
      </TouchableOpacity>
    </View>
  );
}
