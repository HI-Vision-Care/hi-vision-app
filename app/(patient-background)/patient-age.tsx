import { HealthBackgroundContext } from "@/context/HealthBackgroundContext";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PatientAgeScreen() {
    const ctx = useContext(HealthBackgroundContext);
    const router = useRouter();
    const [ageText, setAgeText] = useState<string>(
        ctx?.data.age != null ? String(ctx.data.age) : "18"
    );

    if (!ctx) {
        router.replace("/");
        return null;
    }

    const onContinue = () => {
        const num = parseInt(ageText, 10);
        if (isNaN(num) || num <= 0) return;
        ctx.setData((prev) => ({ ...prev, age: num }));

        // ← CHỈNH LẠI NHƯ SAU: thêm "./" trước tên file
        router.push("./patient-bloodtype");
    };

    return (
        <View className="flex-1 items-center px-6 pt-8 bg-gray-50">
            <Text className="text-2xl font-semibold text-gray-800 mb-6">
                What is your age?
            </Text>

            <TextInput
                value={ageText}
                onChangeText={setAgeText}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="Enter your age"
                className="w-2/3 h-16 border border-gray-300 bg-white rounded-lg text-center text-3xl mb-8"
            />

            <TouchableOpacity
                onPress={onContinue}
                className="w-full py-3 rounded-lg items-center bg-blue-600"
            >
                <Text className="text-base font-semibold text-white">Continue →</Text>
            </TouchableOpacity>
        </View>
    );
}
