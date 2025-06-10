// app/(patient-background)/patient-gender.tsx

import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { HealthBackgroundContext } from "@/context/HealthBackgroundContext";
import { useRouter } from "expo-router";

const PatientGenderScreen: React.FC = () => {
    const ctx = useContext(HealthBackgroundContext);
    const router = useRouter();
    const [selected, setSelected] = useState<string>(ctx?.data.gender || "");

    if (!ctx) {
        router.replace("/");
        return null;
    }

    const options = [
        { key: "male", label: "I Am Male" },
        { key: "female", label: "I Am Female" },
        { key: "other", label: "Other" },
    ];

    const onContinue = () => {
        ctx.setData((prev) => ({ ...prev, gender: selected }));
        router.push("./patient-weight");
    };

    const onSkipThisStep = () => {
        router.push("./patient-weight");
    };

    return (
        <View className="flex-1 px-6 pt-8 bg-gray-50">
            <Text className="text-2xl font-semibold text-gray-800 mb-2">
                What is your Gender?
            </Text>
            <Text className="text-gray-500 mb-6">
                Please select your gender for better personalized health experience.
            </Text>

            {options.map((o) => {
                const isSel = o.key === selected;
                return (
                    <TouchableOpacity
                        key={o.key}
                        onPress={() => setSelected(o.key)}
                        activeOpacity={0.7}
                        className={`flex-row justify-between items-center border rounded-lg px-4 py-3 mb-4 ${isSel ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                            }`}
                    >
                        <Text
                            className={`text-base ${isSel ? "text-blue-600" : "text-gray-700"}`}
                        >
                            {o.label}
                        </Text>
                        {isSel ? (
                            <Text className="text-blue-600 text-xl">✔︎</Text>
                        ) : (
                            <View className="w-5 h-5 border border-gray-300 rounded-full" />
                        )}
                    </TouchableOpacity>
                );
            })}

            <TouchableOpacity
                onPress={onSkipThisStep}
                activeOpacity={0.7}
                className="w-full py-3 mb-4 rounded-lg items-center bg-gray-100"
            >
                <Text className="text-base font-medium text-gray-700">
                    Prefer to skip this →
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onContinue}
                disabled={!selected}
                activeOpacity={0.7}
                className={`w-full py-3 rounded-lg items-center justify-center ${selected ? "bg-blue-600" : "bg-gray-300"
                    }`}
            >
                <Text
                    className={`text-base font-semibold ${selected ? "text-white" : "text-gray-200"
                        }`}
                >
                    Continue →
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default PatientGenderScreen;
