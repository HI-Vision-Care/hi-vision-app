import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ARVReminder() {
    const router = useRouter();

    const handleBackPress = () => {
        router.back();
    };

    const handleSetupPress = () => {
        console.log('Setup ARV reminder');
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-500" edges={['top']}>
            <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

            {/* Header */}
            <View className="bg-blue-500 flex-row items-center justify-between px-4 py-3 h-15">
                <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={handleBackPress}>
                    <Text className="text-3xl text-white font-bold">‹</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-white">Nhắc thuốc ARV</Text>
                <View className="w-10 h-10" />
            </View>

            {/* Content */}
            <View className="flex-1 bg-gray-100">
                <View className="flex-1 px-5 pt-10 items-center">
                    <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-6 shadow-sm">
                        <Text className="text-4xl">💊</Text>
                    </View>

                    <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
                        Thiết lập nhắc nhở thuốc ARV
                    </Text>
                    <Text className="text-base text-gray-600 text-center leading-6 mb-8">
                        Thuốc kháng retrovirus (ARV) cần được uống đúng giờ hàng ngày để đảm bảo hiệu quả điều trị HIV tối ưu.
                    </Text>

                    <View className="w-full mb-10">
                        <View className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm">
                            <Text className="text-xl mr-4">⏰</Text>
                            <Text className="text-base text-gray-800 flex-1">Nhắc nhở đúng giờ hàng ngày</Text>
                        </View>
                        <View className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm">
                            <Text className="text-xl mr-4">📊</Text>
                            <Text className="text-base text-gray-800 flex-1">Theo dõi tuân thủ điều trị</Text>
                        </View>
                        <View className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm">
                            <Text className="text-xl mr-4">🔔</Text>
                            <Text className="text-base text-gray-800 flex-1">Thông báo linh hoạt</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-blue-500 px-10 py-4 rounded-3xl shadow-md"
                        onPress={handleSetupPress}
                    >
                        <Text className="text-lg font-bold text-white">Thiết lập ngay</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-20" />
            </View>
        </SafeAreaView>
    );
}