import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AddReminder() {
    const router = useRouter();

    const handleARVPress = () => {
        console.log('ARV reminder pressed');
        router.push('/(medicine-reminder)/arv-reminder');
    };

    const handlePrEPPress = () => {
        console.log('PrEP reminder pressed');
        router.push('/(medicine-reminder)/prep-reminder');
    };

    const handleBackPress = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-500" edges={['top']}>
            <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

            {/* Header */}
            <View className="bg-blue-500 flex-row items-center justify-between px-4 py-3 h-15">
                <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={handleBackPress}>
                    <Text className="text-3xl text-white font-bold">‹</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-white">Thêm lịch nhắc mới</Text>
                <View className="w-10 h-10" />
            </View>

            {/* Content */}
            <View className="flex-1 bg-gray-100">
                <View className="flex-1 px-5 pt-6">
                    <Text className="text-base text-gray-600 text-center mb-8 leading-6">
                        Chọn loại thuốc bạn muốn tạo lịch nhắc
                    </Text>

                    {/* ARV Option */}
                    <TouchableOpacity
                        className="bg-white rounded-xl p-5 mb-4 flex-row items-center shadow-sm"
                        onPress={handleARVPress}
                    >
                        <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
                            <Text className="text-2xl">💊</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-800 mb-1">Nhắc thuốc ARV</Text>
                            <Text className="text-sm text-gray-600 leading-5">
                                Thuốc kháng retrovirus dùng để điều trị HIV
                            </Text>
                        </View>
                        <View className="w-6 h-6 items-center justify-center">
                            <Text className="text-xl text-blue-500 font-bold">›</Text>
                        </View>
                    </TouchableOpacity>

                    {/* PrEP Option */}
                    <TouchableOpacity
                        className="bg-white rounded-xl p-5 mb-4 flex-row items-center shadow-sm"
                        onPress={handlePrEPPress}
                    >
                        <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
                            <Text className="text-2xl">🛡️</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-800 mb-1">Nhắc thuốc PrEP</Text>
                            <Text className="text-sm text-gray-600 leading-5">
                                Thuốc dự phòng trước phơi nhiễm HIV
                            </Text>
                        </View>
                        <View className="w-6 h-6 items-center justify-center">
                            <Text className="text-xl text-blue-500 font-bold">›</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Info Section */}
                    <View className="bg-blue-50 rounded-xl p-4 mt-6 flex-row">
                        <View className="mr-3 mt-0.5">
                            <Text className="text-base">ℹ️</Text>
                        </View>
                        <Text className="flex-1 text-sm text-blue-500 leading-5">
                            Việc tuân thủ đúng lịch uống thuốc là rất quan trọng để đảm bảo hiệu quả điều trị và dự phòng.
                        </Text>
                    </View>
                </View>

                {/* Bottom padding for tab bar */}
                <View className="h-20" />
            </View>
        </SafeAreaView>
    );
}