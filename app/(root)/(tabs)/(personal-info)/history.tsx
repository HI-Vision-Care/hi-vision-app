"use client"

import React from "react"
import { useState } from "react"
import { Text, View, TouchableOpacity, ScrollView, StatusBar } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

interface ActivityItem {
  id: string
  restaurantName: string
  date: string
  time: string
  status: string
  orderNumber: string
  logo: string
}

interface TabItem {
  id: string
  title: string
  isActive: boolean
}

const ActivityHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState("lich-hen")

  const tabs: TabItem[] = [
    { id: "giao-dich", title: "Giao dịch", isActive: activeTab === "giao-dich" },
    { id: "lich-hen", title: "Lịch hẹn", isActive: activeTab === "lich-hen" },
  ]

  const transactionData: ActivityItem[] = [
    {
      id: "1",
      restaurantName: "Thanh toán K-Pub Aeon Mall",
      date: "24/06/2025",
      time: "18:15",
      status: "Thành công",
      orderNumber: "#28853458",
      logo: "💳",
    },
    {
      id: "2",
      restaurantName: "Thanh toán GoGi House",
      date: "31/05/2025",
      time: "18:15",
      status: "Thành công",
      orderNumber: "#28236391",
      logo: "💳",
    },
    {
      id: "3",
      restaurantName: "Nạp tiền vào ví",
      date: "12/03/2025",
      time: "20:15",
      status: "Thành công",
      orderNumber: "#26365924",
      logo: "💰",
    },
  ]

  const appointmentData: ActivityItem[] = [
    {
      id: "1",
      restaurantName: "K-Pub Aeon Mall Tân Phú",
      date: "24/06/2025",
      time: "18:15",
      status: "Thành công",
      orderNumber: "#28853458",
      logo: "🍖",
    },
    {
      id: "2",
      restaurantName: "GoGi House An Dương Vương",
      date: "31/05/2025",
      time: "18:15",
      status: "Thành công",
      orderNumber: "#28236391",
      logo: "🥩",
    },
    {
      id: "3",
      restaurantName: "Gogi House Nguyễn Hồng Đào",
      date: "12/03/2025",
      time: "20:15",
      status: "Thành công",
      orderNumber: "#26365924",
      logo: "🥩",
    },
    {
      id: "4",
      restaurantName: "Gogi House Lê Văn Sỹ",
      date: "07/03/2025",
      time: "13:00",
      status: "Thành công",
      orderNumber: "#26203306",
      logo: "🥩",
    },
    {
      id: "5",
      restaurantName: "Gogi House Âu Cơ",
      date: "12/02/2025",
      time: "17:30",
      status: "Thành công",
      orderNumber: "#25598731",
      logo: "🥩",
    },
  ]

  const getCurrentData = () => (activeTab === "giao-dich" ? transactionData : appointmentData)

  const handleGoBack = () => router.back()
  const handleTabPress = (tabId: string) => setActiveTab(tabId)

  const handleActionPress = (item: ActivityItem) => {
    if (activeTab === "giao-dich") {
      console.log("View transaction details:", item.restaurantName)
    } else {
      console.log("Book again:", item.restaurantName)
    }
  }

  const renderTabItem = (tab: TabItem) => (
    <TouchableOpacity
      key={tab.id}
      onPress={() => handleTabPress(tab.id)}
      className={`flex-1 py-4 items-center border-b-2 ${tab.isActive ? 'border-orange-500' : 'border-transparent'
        }`}
    >
      <Text className={`${tab.isActive ? 'text-gray-900 font-semibold' : 'text-gray-500 font-normal'} text-base`}>
        {tab.title}
      </Text>
    </TouchableOpacity>
  )

  const renderActivityItem = (item: ActivityItem) => (
    <View key={item.id} className="bg-white px-5 py-4 border-b border-gray-100">
      <View className="flex-row items-start">
        <View className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-3">
          <Text className="text-xl">{item.logo}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">{item.restaurantName}</Text>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm text-gray-500">{item.date} - {item.time}</Text>
            <Text className="text-sm text-gray-500">{item.orderNumber}</Text>
          </View>
          <Text className="text-sm text-gray-500 mb-2">{item.status}</Text>
          <TouchableOpacity onPress={() => handleActionPress(item)} className="self-start">
            <Text className="text-sm text-blue-500 font-medium">
              {activeTab === "giao-dich" ? "Xem chi tiết →" : "Đặt lại →"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-5 py-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={handleGoBack} className="w-10 h-10 justify-center items-center mr-4">
            <Text className="text-xl text-gray-700">‹</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Lịch sử hoạt động</Text>
        </View>
        <View className="flex-row bg-white border-b border-gray-100">{tabs.map(renderTabItem)}</View>
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
          {getCurrentData().map(renderActivityItem)}
          <View className="h-5" />
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default ActivityHistory
