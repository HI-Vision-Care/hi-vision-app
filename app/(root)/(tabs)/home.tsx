import { usePatientProfile } from "@/hooks/usePatientId";
import { useTranslation } from "@/hooks/useTranslation";
import { useGetAppointmentByPatientId } from "@/services/appointment/hooks";
import { useSyncWidgetWithBlog } from "@/services/blog/hooks";
import {
  ActivityList,
  ChatbotCard,
  ChatbotSectionHeader,
  HeaderHome,
  HealthServicesSwiper,
  MedicationSection,
  MetricCarousel,
} from "@components";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { t, isReady } = useTranslation();
  const { data: profile, refetch: refetchProfile } = usePatientProfile();
  const patientId = profile?.patientID;

  const { data: appointments = [], refetch: refetchAppointments } =
    useGetAppointmentByPatientId(patientId || "");

  const latestAppointment = appointments.length
    ? appointments[appointments.length - 1]
    : null;

  useSyncWidgetWithBlog(patientId);

  // Refresh data when page comes into focus to ensure fresh data
  useFocusEffect(
    useCallback(() => {
      // Refresh patient profile data
      if (profile?.patientID) {
        refetchProfile();
      }

      // Refresh appointments data
      if (patientId) {
        refetchAppointments();
      }
    }, [profile?.patientID, patientId, refetchProfile, refetchAppointments])
  );

  if (!isReady) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#f2f5f9",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      {/* Cho StatusBar xuyên thấu nền */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <HeaderHome />

      <SafeAreaView
        edges={["left", "right", "bottom"]}
        className="flex-1 bg-[#f2f5f9]"
      >
        <ScrollView
          className="flex-1 px-4 pt-6"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Language Switcher for testing */}
          {/* <View className="mb-4">
            <LanguageSwitcher />
          </View> */}

          {/* Health Service Swiper */}
          <HealthServicesSwiper />

          <ChatbotSectionHeader
            title={t("home.appointmentScheduled")}
            onHelpPress={() => console.log("Help tapped")}
          />

          {latestAppointment && <ChatbotCard appointment={latestAppointment} />}

          {/* Smart Health Metrics */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-semibold">
              {t("home.smartHealthMetrics")}
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 text-sm font-medium">
                {t("home.seeAll")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Metrics Cards */}
          <MetricCarousel />

          {/* <UpdateWidgetButton /> */}

          {/* Fitness & Activity Tracker Section */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-semibold">
              {t("home.fitnessActivityTracker")}
            </Text>
            <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
          </View>
          <ActivityList />

          {/* Medication Management Section */}
          <MedicationSection />

          {/* Extra spacing to prevent bottom nav overlap */}
          <View className="h-1" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;
