import type React from "react"
import { ScrollView, TouchableOpacity, View, Text, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Clock, DollarSign } from "lucide-react-native"
import { icons, images } from "@/constants"

interface MenuItem {
  key: string
  title: string
  icon: any
  bgColor: string
  duration: string
  price: string
  illustration: any
  iconBgColor: string
}

// STD service menu with updated colors
const menuItems: MenuItem[] = [
  {
    key: "hiv-test",
    title: "HIV Test",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#3B82F6",
    duration: "15 minutes",
    price: "300,000₫",
    illustration: images.hivtest,
  },
  {
    key: "chlamydia-test",
    title: "Chlamydia Test",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#F59E0B",
    duration: "15 minutes",
    price: "350,000₫",
    illustration: images.chlamydia,
  },
  {
    key: "syphilis-test",
    title: "Syphilis Test",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#10B981",
    duration: "15 minutes",
    price: "320,000₫",
    illustration: images.syphilis,
  },
  {
    key: "gonorrhea-test",
    title: "Gonorrhea Test",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#EC4899",
    duration: "15 minutes",
    price: "330,000₫",
    illustration: images.gonorrhea,
  },
  {
    key: "std-consult",
    title: "STD Test Combo",
    icon: icons.virus103,
    bgColor: "#F8FAFC",
    iconBgColor: "#8B5CF6",
    duration: "30 minutes",
    price: "200,000₫",
    illustration: images.combo,
  },
]

const Menu: React.FC = () => {
  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} className="flex-1 bg-[#F1F5F9]">
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.7}
            onPress={() => console.log("Selected", item.key)}
            className="bg-white rounded-3xl p-5 mb-4 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
              position: "relative",
              minHeight: 120, // Add minimum height
            }}
          >
            {/* Illustration section - Background layer */}
            {item.illustration && (
              <Image
                source={item.illustration}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 8,
                  width: 100, // Increased from 80 to 100
                  height: 100, // Increased from 80 to 100
                  zIndex: 0,
                  borderRadius: 16,
                }}
                resizeMode="contain"
              />
            )}

            <View className="flex-row items-center justify-center" style={{ zIndex: 1, minHeight: 80 }}>
              {/* Icon section */}
              <View className="mr-4">
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: item.iconBgColor }}
                >
                  {item.icon && (
                    <Image source={item.icon} className="w-6 h-6" resizeMode="contain" style={{ tintColor: "white" }} />
                  )}
                </View>
              </View>

              {/* Content section */}
              <View className="flex-1">
                <Text className="text-gray-900 text-lg font-bold mb-2">{item.title}</Text>

                {/* Metadata column */}
                <View>
                  <View
                    className="flex-row items-center bg-gray-100 px-2 py-1 rounded-full mb-2"
                    style={{ alignSelf: "flex-start" }}
                  >
                    <Clock size={12} color="#6B7280" />
                    <Text className="text-gray-600 text-xs ml-1 font-medium">{item.duration}</Text>
                  </View>

                  <View
                    className="flex-row items-center bg-green-100 px-2 py-1 rounded-full"
                    style={{ alignSelf: "flex-start" }}
                  >
                    <DollarSign size={12} color="#059669" />
                    <Text className="text-green-700 text-xs ml-1 font-bold">{item.price}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Menu
