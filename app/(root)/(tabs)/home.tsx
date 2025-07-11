
import { ActivityList, ChatbotCard, ChatbotSectionHeader, HeaderHome, HealthServicesSwiper, MedicationSection, MetricCarousel } from "@components";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <>
      {/* Cho StatusBar xuyên thấu nền */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Chỉ safe cho top, nền full header */}
      <HeaderHome />

      {/* Phần content còn lại safe cho left/right/bottom */}
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        className="flex-1 bg-[#f2f5f9]"
      >
        <ScrollView className="flex-1 px-4 pt-6">
          {/* Health Score */}
          <HealthServicesSwiper />



          {/* Smart Health Metrics */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-semibold">
              Smart Health Metrics
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 text-sm font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          {/* Metrics Cards */}
          <MetricCarousel />

          {/* Fitness & Activity Tracker Section */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-semibold">
              Fitness & Activity Tracker
            </Text>
            <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
          </View>
          <ActivityList />

          <ChatbotSectionHeader
            title="Wellness AI Chatbot"
            onHelpPress={() => console.log("Help tapped")}
          />
          <ChatbotCard
            plan="BASIC"
            count={1922}
            onAddPress={() => console.log("Add tapped")}
          />

          {/* Medication Management Section */}
          <MedicationSection />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;
