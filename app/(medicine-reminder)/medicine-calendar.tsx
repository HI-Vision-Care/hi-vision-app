import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const MedicineCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(30)
  const [currentDate] = useState('Hôm nay, 30/06/2025')

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const dates = [30, 1, 2, 3, 4, 5, 6]

  const handleDatePress = (date: number) => {
    setSelectedDate(date)
  }

  const handleCreateReminder = () => {
    console.log('Create reminder pressed')
  }

  const handleHomePress = () => {
    console.log('Home pressed')
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-500" edges={['top']}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

      {/* Header */}
      <View className="bg-blue-500 flex-row items-center justify-between px-4 py-3 h-15">
        <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={handleHomePress}>
          <Text className="text-2xl text-white">🏠</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Nhắc uống thuốc</Text>
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <View className="w-6 h-6 rounded-full bg-white items-center justify-center">
            <Text className="text-base font-bold text-blue-500">!</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View className="flex-1 bg-gray-100">
        {/* Date Navigation */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white">
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Text className="text-2xl text-gray-600">‹</Text>
          </TouchableOpacity>
          <Text className="text-base font-semibold text-blue-500">{currentDate}</Text>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Text className="text-2xl text-gray-600">›</Text>
          </TouchableOpacity>
        </View>

        {/* Week Calendar */}
        <View className="flex-row bg-white px-4 pb-4">
          {weekDays.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-sm text-gray-400 mb-2">{day}</Text>
              <TouchableOpacity
                className={`w-10 h-10 rounded-lg items-center justify-center ${selectedDate === dates[index] ? 'bg-blue-500' : 'bg-transparent'
                  }`}
                onPress={() => handleDatePress(dates[index])}
              >
                <Text
                  className={`text-base font-semibold ${selectedDate === dates[index] ? 'text-white' : 'text-gray-800'
                    }`}
                >
                  {dates[index]}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Empty State */}
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-base font-semibold text-gray-600 text-center mb-2">
            Hôm nay bạn chưa có lịch nhắc uống thuốc
          </Text>
          <Text className="text-sm text-gray-400 text-center mb-8">
            Hãy <Text className="text-blue-500 font-semibold">Tạo lịch nhắc uống thuốc</Text> mới
          </Text>

          <TouchableOpacity
            className="bg-blue-500 px-8 py-4 rounded-3xl shadow-md"
            onPress={handleCreateReminder}
          >
            <Text className="text-base font-semibold text-white">Tạo lịch nhắc</Text>
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </View>
    </SafeAreaView>
  )
}

export default MedicineCalendar