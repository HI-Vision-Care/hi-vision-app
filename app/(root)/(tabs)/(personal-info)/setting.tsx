"use client"

import React, { useState } from "react"
import { Text, View, TouchableOpacity, Image, ScrollView, StatusBar, Switch } from "react-native"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"

interface MenuItem {
  id: string
  title: string
  icon: string
  hasArrow?: boolean
  isToggle?: boolean
  toggleValue?: boolean
  isDanger?: boolean
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

interface FeatureCard {
  id: string
  title: string
  icon: string
  hasBadge?: boolean
  badgeCount?: number
}

const Setting: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false)

  const featureCards: FeatureCard[] = [
    { id: "gold", title: "Gold", icon: "👑" },
    { id: "activity-history", title: "Lịch sử hoạt động", icon: "📅", hasBadge: true, badgeCount: 1 },
  ]

  const menuSections: MenuSection[] = [
    {
      title: "General Settings",
      items: [
        { id: "personal", title: "Personal Info", icon: "👤", hasArrow: true },
        { id: "notification", title: "Notification", icon: "🔔", hasArrow: true },
        { id: "preferences", title: "Preferences", icon: "⚙️", hasArrow: true },
        { id: "security", title: "Security", icon: "🔒", hasArrow: true },
      ],
    },
    {
      title: "Accessibility",
      items: [
        { id: "language", title: "Language", icon: "🌐", hasArrow: true },
        { id: "darkmode", title: "Dark Mode", icon: "👁️", isToggle: true, toggleValue: darkMode },
      ],
    },
    {
      title: "Help & Support",
      items: [
        { id: "about", title: "About", icon: "ℹ️", hasArrow: true },
        { id: "help", title: "Help Center", icon: "💬", hasArrow: true },
        { id: "contact", title: "Contact Us", icon: "📞", hasArrow: true },
      ],
    },
    {
      title: "Sign Out",
      items: [{ id: "signout", title: "Sign Out", icon: "🚪", hasArrow: true }],
    },
    {
      title: "Danger Zone",
      items: [
        { id: "delete", title: "Delete Account", icon: "🗑️", hasArrow: true, isDanger: true },
      ],
    },
  ]

  const handleGoBack = () => router.back()

  const handleMenuPress = (itemId: string) => {
    console.log("Menu pressed:", itemId)
    if (itemId === "personal") router.push("/personalinfo")
    // Add other navigation cases here
  }

  const handleCardPress = (cardId: string) => {
    console.log("Card pressed:", cardId)
    if (cardId === "gold") router.push("/gold")
    else if (cardId === "activity-history") router.push("/history")
  }

  const handleToggle = (itemId: string, value: boolean) => {
    if (itemId === "darkmode") setDarkMode(value)
  }

  const renderFeatureCard = (card: FeatureCard) => (
    <TouchableOpacity
      key={card.id}
      onPress={() => handleCardPress(card.id)}
      className="flex-1 bg-[#f5f3f0] rounded-[16px] p-[5px] mx-[6px] items-center justify-center min-h-[50px] relative shadow-md"
    >
      {card.hasBadge && card.badgeCount && (
        <View className="absolute top-[12px] right-[12px] bg-black rounded-[12px] min-w-[24px] h-[24px] justify-center items-center px-2">
          <Text className="text-[12px] font-semibold text-white">{card.badgeCount}</Text>
        </View>
      )}
      <Text className="text-[32px] mb-3">{card.icon}</Text>
      <Text className="text-base font-semibold text-[#374151] text-center">{card.title}</Text>
    </TouchableOpacity>
  )

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleMenuPress(item.id)}
      className="flex-row items-center justify-between bg-white px-5 py-4 border-b border-[#f1f5f9]"
    >
      <View className="flex-row items-center flex-1">
        <View className={`w-10 h-10 rounded-[10px] justify-center items-center mr-4 ${item.isDanger ? 'bg-red-50' : 'bg-gray-50'}`}>
          <Text className="text-lg">{item.icon}</Text>
        </View>
        <Text className={`text-base font-medium ${item.isDanger ? 'text-red-600' : 'text-[#374151]'}`}>{item.title}</Text>
      </View>

      {item.isToggle ? (
        <Switch
          value={item.toggleValue}
          onValueChange={(value) => handleToggle(item.id, value)}
          trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
          thumbColor={item.toggleValue ? '#ffffff' : '#ffffff'}
        />
      ) : item.hasArrow ? (
        <Text className="text-base text-[#9ca3af]">›</Text>
      ) : null}
    </TouchableOpacity>
  )

  const renderSection = (section: MenuSection, index: number) => (
    <View key={index} className="mb-6">
      {/* Section Header */}
      <View className="flex-row justify-between items-center px-5 mb-2">
        <Text className="text-base font-semibold text-gray-500">{section.title}</Text>
        <TouchableOpacity>
          <Text className="text-base text-[#9ca3af]">⋯</Text>
        </TouchableOpacity>
      </View>
      {/* Section Items */}
      <View className="bg-white rounded-[16px] mx-4 overflow-hidden shadow-sm">
        {section.items.map((item, itemIndex) => (
          <View key={item.id}>
            {renderMenuItem(item)}
            {itemIndex < section.items.length - 1 && <View className="h-px bg-[#f1f5f9] ml-20" />}
          </View>
        ))}
      </View>
    </View>
  )

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f5f9" />
      <SafeAreaView className="flex-1 bg-[#f2f5f9]">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center px-5 py-4 bg-[#f2f5f9]">
            <TouchableOpacity onPress={handleGoBack} className="w-10 h-10 rounded-lg bg-white justify-center items-center mr-4 shadow-sm">
              <Text className="text-lg text-[#374151]">‹</Text>
            </TouchableOpacity>
            <Text className="text-xl font-bold text-[#111827]">My Account</Text>
          </View>

          {/* Profile Card */}
          <View className="px-4 mb-5">
            <View className="bg-blue-500 rounded-[20px] p-5 flex-row items-center justify-between shadow-lg">
              <View className="flex-row items-center flex-1">
                <View className="w-[60px] h-[60px] rounded-[16px] bg-white p-0.5 mr-4">
                  <Image source={{ uri: "https://i.pravatar.cc/60?img=1" }} className="w-full h-full rounded-[14px]" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-white mb-1">Dekomori Sanae</Text>
                  <Text className="text-sm text-white opacity-80">dekomori@fuwa.jp</Text>
                </View>
              </View>
              <TouchableOpacity className="w-[36px] h-[36px] bg-white/20 rounded-[10px] justify-center items-center">
                <Text className="text-base text-white">✏️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Feature Cards Section */}
          <View className="px-4 mb-5">
            <View className="flex-row justify-between">
              {featureCards.map((card) => renderFeatureCard(card))}
            </View>
          </View>

          {/* Menu Sections */}
          {menuSections.map((section, index) => renderSection(section, index))}

          {/* Bottom Spacing */}
          <View className="h-[100px]" />
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default Setting
