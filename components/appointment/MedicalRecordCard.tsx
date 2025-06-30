import { MedicalRecord } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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

export default MedicalRecordCard;
