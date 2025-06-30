import { HeaderBack } from "@/components";
import { usePatientId } from "@/hooks/usePatientId";
import { useGetAppointmentByPatientId } from "@/services/appointment/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types based on your backend data
interface Account {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  isDeleted: boolean;
}

interface Patient {
  patientID: string;
  account: Account;
  name: string;
  dob: string;
  gender: string;
  medNo: string;
  medDate: string;
  medFac: string;
}

interface Doctor {
  doctorID: string;
  account: Account;
  name: string;
  gender: string;
  specialty: string;
  degrees: string;
  img: string | null;
}

interface MedicalRecord {
  appointmentID: string;
  patient: Patient;
  doctor: Doctor;
  date?: string;
  status?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}

// Patient Info Card Component

// Medical Record Card Component
const MedicalRecordCard: React.FC<{ record: MedicalRecord }> = ({ record }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="bg-white mx-4 mt-3 rounded-xl shadow-sm border border-gray-100">
      <TouchableOpacity onPress={() => setExpanded(!expanded)} className="p-4">
        <View className="flex-row items-start">
          <View className="w-12 h-12 bg-[#9EEFF0] rounded-full items-center justify-center mr-3">
            <Ionicons name="medical" size={20} color="#0F67FE" />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold text-gray-900">
                {record.doctor.specialty}
              </Text>
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#0F67FE"
              />
            </View>

            <View className="flex-row items-center mb-1">
              <Ionicons name="person" size={14} color="#666" />
              <Text className="text-sm text-gray-600 ml-1">
                Dr. {record.doctor.name}
              </Text>
            </View>

            <View className="flex-row items-center mb-1">
              <Ionicons name="school" size={14} color="#666" />
              <Text className="text-sm text-gray-600 ml-1">
                {record.doctor.degrees}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="document-text" size={14} color="#666" />
              <Text className="text-sm text-gray-600 ml-1">
                ID: {record.appointmentID.slice(0, 8)}...
              </Text>
            </View>
          </View>
        </View>

        {expanded && (
          <View className="mt-4 pt-4 border-t border-gray-100">
            <View className="space-y-3">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Doctor Contact
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="mail" size={14} color="#0F67FE" />
                  <Text className="text-sm text-gray-600 ml-2">
                    {record.doctor.account.email}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="call" size={14} color="#0F67FE" />
                  <Text className="text-sm text-gray-600 ml-2">
                    {record.doctor.account.phone}
                  </Text>
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Full Appointment ID
                </Text>
                <Text className="text-xs text-gray-500 font-mono">
                  {record.appointmentID}
                </Text>
              </View>

              {record.diagnosis && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Diagnosis
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {record.diagnosis}
                  </Text>
                </View>
              )}

              {record.treatment && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Treatment
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {record.treatment}
                  </Text>
                </View>
              )}

              {record.notes && (
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </Text>
                  <Text className="text-sm text-gray-600">{record.notes}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Tab Component
const TabButton: React.FC<{
  title: string;
  isActive: boolean;
  onPress: () => void;
}> = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 py-4 items-center border-b-2 ${
      isActive ? "border-[#0F67FE]" : "border-transparent"
    }`}
  >
    <Text
      className={`text-base ${
        isActive ? "text-[#0F67FE] font-semibold" : "text-gray-500 font-normal"
      }`}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// Main Component
const MedicalHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState("history");
  const patientId = usePatientId();

  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useGetAppointmentByPatientId(patientId as string);

  const tabs = [
    { id: "history", title: "Medical History" },
    { id: "appointments", title: "Appointments" },
    { id: "prescriptions", title: "Lab Results" },
  ];

  const renderMedicalHistory = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F67FE" />
          <Text className="text-gray-500 mt-2">Loading medical history...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">
            {(error as any)?.message || "Failed to load data."}
          </Text>
        </View>
      );
    }

    if (!appointments || appointments.length === 0) {
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
        {appointments.map((record) => (
          <MedicalRecordCard key={record.appointmentID} record={record} />
        ))}
      </View>
    );
  };

  // Render danh sách lịch hẹn sắp tới (có thể lọc lại nếu cần)
  const renderAppointments = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F67FE" />
          <Text className="text-gray-500 mt-2">Loading appointments...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">
            {(error as any)?.message || "Failed to load data."}
          </Text>
        </View>
      );
    }

    // Lọc các lịch hẹn sắp tới theo status hoặc ngày giờ, ví dụ:
    const upcoming =
      appointments?.filter(
        (a) => a.status === "Scheduled" /*&& isFuture(a.appointmentDate)*/
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
        {upcoming.map((record) => (
          <MedicalRecordCard key={record.appointmentID} record={record} />
        ))}
      </View>
    );
  };

  const renderContent = () => {
    if (activeTab === "history") return renderMedicalHistory();
    if (activeTab === "appointments") return renderAppointments();
    // if (activeTab === "prescriptions") return ...;
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
