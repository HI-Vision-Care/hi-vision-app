import React, { useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyPrescriptions() {
    const [activeTab, setActiveTab] = useState('active'); // 'active', 'inactive', 'expired'

    const tabs = [
        { id: 'active', label: 'Đang nhắc' },
        { id: 'inactive', label: 'Không nhắc' },
        { id: 'expired', label: 'Hết hạn' }
    ];

    const handleTabPress = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-500" edges={['top']}>
            <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

            {/* Header */}
            <View className="bg-blue-500 flex-row items-center justify-between px-4 py-3 h-15">
                <View className="w-10 h-10" />
                <Text className="text-lg font-bold text-white">Đơn thuốc</Text>
                <View className="w-10 h-10" />
            </View>

            {/* Content */}
            <View className="flex-1 bg-gray-100">
                {/* Tab Navigation */}
                <View className="bg-white">
                    <View className="flex-row">
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.id}
                                className="flex-1 py-4 items-center"
                                onPress={() => handleTabPress(tab.id)}
                            >
                                <Text
                                    className={`text-base font-medium ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-600'
                                        }`}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Tab Indicator */}
                    <View className="flex-row">
                        {tabs.map((tab, index) => (
                            <View
                                key={tab.id}
                                className={`flex-1 h-0.5 ${activeTab === tab.id ? 'bg-blue-500' : 'bg-transparent'
                                    }`}
                            />
                        ))}
                    </View>
                </View>

                {/* Empty State */}
                <View className="flex-1 items-center justify-center px-8">
                    <View className="w-60 h-40 items-center justify-center mb-8 relative">
                        {/* Medicine bottles and prescription pad illustration */}
                        <View className="absolute left-16 top-8">
                            <View className="w-16 h-20 bg-gray-300 rounded-lg" />
                            <View className="w-14 h-4 bg-gray-400 rounded-lg absolute -top-2 left-1" />
                            <View className="w-2 h-2 bg-pink-300 rounded-full absolute -right-2 top-8" />
                            <View className="w-1.5 h-1.5 bg-blue-300 rounded-full absolute -right-4 top-12" />
                            <View className="w-1 h-1 bg-green-300 rounded-full absolute -right-2 top-16" />
                        </View>

                        {/* Prescription pad */}
                        <View className="absolute right-12 top-12 transform rotate-12">
                            <View className="w-20 h-16 bg-gray-200 rounded-lg" />
                            <View className="w-18 h-3 bg-gray-400 rounded-md absolute top-2 left-1" />
                            {/* Lines on prescription pad */}
                            <View className="absolute top-6 left-2 right-2">
                                <View className="w-full h-0.5 bg-gray-300 mb-1" />
                                <View className="w-full h-0.5 bg-gray-300 mb-1" />
                                <View className="w-3/4 h-0.5 bg-gray-300" />
                            </View>
                            {/* Dots indicating pills */}
                            <View className="absolute -right-3 top-8">
                                <View className="w-1 h-1 bg-gray-400 rounded-full mb-1" />
                                <View className="w-1 h-1 bg-gray-400 rounded-full mb-1" />
                                <View className="w-1 h-1 bg-gray-400 rounded-full" />
                            </View>
                        </View>

                        {/* Shadow */}
                        <View className="w-32 h-6 bg-gray-300 rounded-full absolute bottom-0 opacity-30" />
                    </View>

                    <Text className="text-lg font-semibold text-gray-600 text-center mb-3">
                        Danh sách đơn thuốc trống
                    </Text>
                    <Text className="text-sm text-gray-400 text-center leading-6">
                        Thêm lịch để được nhắc nhở{'\n'}uống thuốc mỗi ngày bạn nhé!
                    </Text>
                </View>

                {/* Bottom padding for tab bar */}
                <View className="h-20" />
            </View>
        </SafeAreaView>
    );
}