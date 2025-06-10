// app/(patient-background)/_layout.tsx
import { Slot, useSegments, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { HealthBackgroundContext } from '@/context/HealthBackgroundContext';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function PatientBackgroundLayout() {
    const segments = useSegments();
    const router = useRouter();
    // segments là một array, ví dụ ['patient-goal'] hoặc ['patient-gender'], ...
    // Giả sử sequence của chúng ta là: 
    const STEP_ORDER = ['patient-goal', 'patient-gender', 'patient-weight', 'patient-age', 'patient-bloodtype'];
    // Lấy segment cuối (current route): 
    const current = segments[segments.length - 1];
    const currentIndex = STEP_ORDER.findIndex((s) => s === current);
    // Nếu không tìm thấy, set = -1 (không hiển thị progress). 
    const progress = currentIndex >= 0 ? (currentIndex + 1) / STEP_ORDER.length : 0;

    // Hàm Skip => reset về “Home” route (hoặc bất kỳ nơi nào bạn muốn)
    const onSkip = () => {
        router.replace('/');
        // Có thể thay thành `/dashboard` hoặc route chính của bạn
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* ===== Header (Back + ProgressBar + Skip) ===== */}
            <View className="flex-row items-center px-4 py-2 border-b border-gray-200 bg-white">
                {/* Back Button */}
                {router.canGoBack() ? (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2"
                    >
                        <Text className="text-lg text-gray-700">←</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="w-8" />
                    // placeholder để giữ khoảng trống nếu không có back
                )}

                {/* Progress Bar */}
                <View className="flex-1 mx-4">
                    <View className="w-full h-2 bg-gray-200 rounded-full">
                        <View
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </View>
                </View>

                {/* Skip Button */}
                <TouchableOpacity onPress={onSkip} className="p-2">
                    <Text className="text-sm text-gray-500">Skip</Text>
                </TouchableOpacity>
            </View>

            {/* ===== Nội dung các màn con sẽ được render ở đây ===== */}
            <View className="flex-1">
                <Slot />
            </View>
        </SafeAreaView>
    );
}
