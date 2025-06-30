import { HeaderBack, MedicalRecordCard, TabButton } from "@/components";
import { usePatientId } from "@/hooks/usePatientId";
import { useGetAppointmentByPatientId } from "@/services/appointment/hooks";
import { useGetLabResults } from "@/services/patient/hooks";
import { LabResult, MedicalRecord } from "@/types/type";
import { format } from "date-fns";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Main Component
const MedicalHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState("history");
  const patientId = usePatientId();

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

  const tabs = [
    { id: "history", title: "Medical History" },
    { id: "appointments", title: "Appointments" },
    { id: "labResults", title: "Lab Results" },
  ];

  const renderMedicalHistory = () => {
    if (isLoadingAppointments) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F67FE" />
          <Text className="text-gray-500 mt-2">Loading medical history...</Text>
        </View>
      );
    }

    if (isErrorAppointments) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">
            {(errorAppointments as any)?.message || "Failed to load data."}
          </Text>
        </View>
      );
    }

    const appointmentsArray = Array.isArray(appointments)
      ? appointments
      : appointments
      ? [appointments]
      : [];
    if (appointmentsArray.length === 0) {
      return (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500">No medical history found.</Text>
        </View>
      );
    }

    return (
      <View>
        <View className="px-4 py-3">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Medical Records
          </Text>
        </View>
        {/* List medical record cards */}
        {(Array.isArray(appointments) ? appointments : []).map(
          (record: MedicalRecord) => (
            <MedicalRecordCard key={record.appointmentID} record={record} />
          )
        )}
      </View>
    );
  };

  const renderAppointments = () => {
    if (isLoadingAppointments) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F67FE" />
          <Text className="text-gray-500 mt-2">Loading appointments...</Text>
        </View>
      );
    }

    if (isErrorAppointments) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">
            {(errorAppointments as any)?.message || "Failed to load data."}
          </Text>
        </View>
      );
    }

    const appointmentsArray = Array.isArray(appointments)
      ? appointments
      : appointments
      ? [appointments]
      : [];
    const upcoming =
      appointmentsArray.filter(
        (a: MedicalRecord) => a.status === "Scheduled"
      ) || [];

    if (upcoming.length === 0) {
      return (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500">No upcoming appointments.</Text>
        </View>
      );
    }

    return (
      <View>
        {upcoming.map((record: MedicalRecord) => (
          <MedicalRecordCard key={record.appointmentID} record={record} />
        ))}
      </View>
    );
  };

  const renderLabResults = () => {
    if (isLoadingLabResults) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F67FE" />
          <Text className="text-gray-500 mt-2">Loading lab results...</Text>
        </View>
      );
    }

    if (isErrorLabResults) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">
            {(errorLabResults as any)?.message || "Failed to load lab results."}
          </Text>
        </View>
      );
    }

    if (!labResults || labResults.length === 0) {
      return (
        <View className="flex-1 items-center justify-center mt-10">
          <Text className="text-gray-500">No lab results found.</Text>
        </View>
      );
    }

    return (
      <View>
        <View className="px-4 py-3">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Lab Results
          </Text>
        </View>
        {labResults.map((result: LabResult) => (
          <View
            key={result.recordId}
            className="bg-white rounded-2xl shadow mb-4 mx-4 p-4 border border-blue-100"
          >
            <Text className="text-base font-medium text-blue-700 mb-1">
              {result.testType}
            </Text>
            <Text className="text-2xl font-semibold text-gray-900 mb-1">
              {result.resultValue}
            </Text>
            <Text className="text-xs text-gray-500">
              Test Date: {format(new Date(result.testDate), "dd/MM/yyyy HH:mm")}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              Record ID: {result.recordId}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    if (activeTab === "history") return renderMedicalHistory();
    if (activeTab === "appointments") return renderAppointments();
    if (activeTab === "labResults") return renderLabResults();
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
