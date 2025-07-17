import {
  HeaderBack,
  TabAppointments,
  TabButton,
  TabLabResults,
  TabMedicalHistory,
} from "@/components";
import { usePatientProfile } from "@/hooks/usePatientId";
import { useGetAppointmentByPatientId } from "@/services/appointment/hooks";
import { useGetLabResults } from "@/services/patient/hooks";
import { useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Main Component
const MedicalHistory = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const { data: profile } = usePatientProfile();
  const patientId = profile?.patientID;

  const {
    data: labResults,
    isLoading: isLoadingLabResults,
    isError: isErrorLabResults,
    error: errorLabResults,
  } = useGetLabResults(patientId as string);

  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
    error: errorAppointments,
  } = useGetAppointmentByPatientId(patientId as string);

  console.log(appointments);

  const tabs = [
    { id: "appointments", title: "Appointments" },
    { id: "history", title: "Medical History" },
    { id: "labResults", title: "Lab Results" },
  ];

  const renderContent = () => {
    if (activeTab === "appointments")
      return (
        <TabAppointments
          isLoading={isLoadingAppointments}
          isError={isErrorAppointments}
          error={errorAppointments}
          appointments={(Array.isArray(appointments)
            ? appointments
            : appointments
            ? [appointments]
            : []
          ).map((a: any) => ({
            ...a,
            medicalService: a.medicalService ?? "",
          }))}
        />
      );
    if (activeTab === "history")
      return (
        <TabMedicalHistory
          isLoading={isLoadingAppointments}
          isError={isErrorAppointments}
          error={errorAppointments}
          appointments={(Array.isArray(appointments)
            ? appointments
            : appointments
            ? [appointments]
            : []
          ).map((a: any) => ({
            ...a,
            medicalService: a.medicalService ?? "", // Provide a default or map as needed
          }))}
        />
      );
    if (activeTab === "labResults")
      return (
        <TabLabResults
          isLoading={isLoadingLabResults}
          isError={isErrorLabResults}
          error={errorLabResults}
          labResults={labResults}
        />
      );
    return null;
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView className="flex-1 bg-gray-50">
        <HeaderBack title="Medical History" />

        {/* Tabs */}
        <View className="flex-row bg-white border-b border-gray-100">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              title={tab.title}
              isActive={activeTab === tab.id}
              onPress={() => setActiveTab(tab.id)}
            />
          ))}
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default MedicalHistory;
