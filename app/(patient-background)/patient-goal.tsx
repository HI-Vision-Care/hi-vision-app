// app/(patient-background)/patient-goal.tsx

import { goalOptions } from "@/constants";
import { HealthBackgroundContext } from "@/context/HealthBackgroundContext";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PatientGoalScreen: React.FC = () => {
    const ctx = useContext(HealthBackgroundContext);
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(
        ctx?.data.goal ?? null
    );

    useEffect(() => {
        if (ctx === null) {
            router.replace("/");
        }
    }, [ctx, router]);

    if (!ctx) return null;

    const onContinue = () => {
        if (!selected) return;
        ctx.setData((prev) => ({ ...prev, goal: selected }));
        router.push("./patient-gender");
    };

    const renderOption = ({
        item,
    }: {
        item: { title: string; icon: any };
    }) => {
        const isSelected = item.title === selected;
        return (
            <TouchableOpacity
                onPress={() => setSelected(item.title)}
                activeOpacity={0.7}
                className={`flex-row items-center p-4 mb-4 rounded-lg border ${isSelected ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200"
                    }`}
            >
                <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center mr-4">
                    <Image source={item.icon} className="w-6 h-6" resizeMode="contain" />
                </View>
                <Text
                    className={`flex-1 text-base ${isSelected ? "text-blue-600" : "text-gray-700"
                        }`}
                >
                    {item.title}
                </Text>
                {isSelected ? (
                    <View className="w-6 h-6 rounded-full bg-blue-600 items-center justify-center">
                        <Text className="text-white text-sm">✔︎</Text>
                    </View>
                ) : (
                    <View className="w-6 h-6 border border-gray-300 rounded-full" />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 px-6 pt-4">
                <Text className="text-2xl font-bold text-gray-800 mb-6">
                    What is your health goal for the app?
                </Text>
                <FlatList
                    data={goalOptions}
                    keyExtractor={(item) => item.title}
                    renderItem={renderOption}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <View className="px-6 pb-6 bg-gray-50">
                <TouchableOpacity
                    onPress={onContinue}
                    disabled={!selected}
                    activeOpacity={0.7}
                    className={`w-full py-4 rounded-lg items-center justify-center ${selected ? "bg-blue-600" : "bg-gray-300"
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
        </SafeAreaView>
    );
};

export default PatientGoalScreen;
