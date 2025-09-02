import { useFacility } from "@/services/clinics/hooks";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import type React from "react";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Money = ({ value }: { value: number }) => {
  const text = useMemo(() => {
    try {
      return new Intl.NumberFormat("vi-VN").format(value) + "đ";
    } catch {
      return `${value}đ`;
    }
  }, [value]);
  return <Text className="text-[14px] font-semibold text-red-500">{text}</Text>;
};

const TabNavigation = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    { key: "details", label: "Chi tiết" },
    { key: "services", label: "Dịch vụ" },
    { key: "reviews", label: "Hỏi đáp" },
    { key: "feedback", label: "Nhận xét" },
  ];

  return (
    <View className="flex-row bg-gray-100 mx-4 rounded-xl p-1 mb-4">
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          className={`flex-1 py-2 px-3 rounded-lg ${
            activeTab === tab.key ? "bg-white" : ""
          }`}
        >
          <Text
            className={`text-center text-[13px] font-medium ${
              activeTab === tab.key ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const ClinicDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");

  const { data, isLoading, isError, error, refetch } = useFacility(
    id ? String(id) : undefined
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator color="#3B82F6" />
        <Text className="mt-2 text-gray-500 text-[13px]">
          Đang tải chi tiết phòng khám...
        </Text>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-red-600 font-semibold">
          Không tải được dữ liệu
        </Text>
        {!!error && (
          <Text className="text-[12px] text-gray-500 mt-1" numberOfLines={3}>
            {(error as Error).message}
          </Text>
        )}
        <Pressable
          onPress={() => refetch()}
          className="mt-3 px-4 py-2 bg-blue-600 rounded-xl"
        >
          <Text className="text-white text-[13px]">Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const clinic = data;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-2 pb-4 flex-row items-center justify-between">
        <Pressable onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </Pressable>
        <View className="flex-row items-center space-x-3">
          <Pressable className="p-2">
            <Ionicons name="heart-outline" size={24} color="#6B7280" />
          </Pressable>
          <Pressable className="p-2">
            <Ionicons name="share-outline" size={24} color="#6B7280" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Thông tin chính */}
        <View className="px-4 mb-4 flex-row items-start space-x-4">
          <Image
            source={{
              uri:
                clinic.img ||
                "https://via.placeholder.com/80x80.png?text=Clinic",
            }}
            className="w-20 h-20 rounded-xl"
          />
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 mb-1">
              {clinic.name}
            </Text>
            <Pressable className="bg-blue-600 rounded-lg px-4 py-2 self-start">
              <View className="flex-row items-center">
                <Ionicons name="calendar" size={16} color="white" />
                <Text className="text-white text-[13px] font-medium ml-2">
                  Đặt lịch
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Giờ làm việc & địa chỉ */}
        <View className="px-4 mb-4">
          {!!clinic.time && (
            <View className="flex-row items-start mb-2">
              <Ionicons name="time" size={16} color="#6B7280" />
              <Text className="ml-3 text-[13px] text-gray-700 flex-1">
                {clinic.time}
              </Text>
            </View>
          )}
          {!!clinic.address && (
            <View className="flex-row items-start mb-2">
              <Ionicons name="location" size={16} color="#6B7280" />
              <Text className="ml-3 text-[13px] text-gray-700 flex-1">
                {clinic.address}
              </Text>
            </View>
          )}
        </View>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Danh sách bác sĩ */}
        {Array.isArray(clinic.doctors) && clinic.doctors.length > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Đội ngũ bác sĩ
            </Text>
            <FlatList
              horizontal
              data={clinic.doctors}
              keyExtractor={(d, idx) => `${d.name}-${idx}`}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View className="w-4" />}
              renderItem={({ item }) => (
                <View className="bg-gray-50 rounded-xl p-4 w-64 border border-gray-200">
                  <View className="flex-row items-start mb-2">
                    <Image
                      source={{
                        uri:
                          item.avatar ||
                          "https://via.placeholder.com/60x60.png?text=Dr",
                      }}
                      className="w-14 h-14 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-bold text-gray-900 text-[15px]">
                        {item.name}
                      </Text>
                      {!!item.specialty && (
                        <Text className="text-[12px] text-gray-500 mt-1">
                          {item.specialty}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Pressable className="bg-blue-600 rounded-lg py-2">
                    <Text className="text-white text-[12px] text-center">
                      Đặt lịch
                    </Text>
                  </Pressable>
                </View>
              )}
            />
          </View>
        )}

        {/* Gói khám */}
        {Array.isArray(clinic.medicalServices) &&
          clinic.medicalServices.length > 0 && (
            <View className="px-4 mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Gói khám
              </Text>
              <FlatList
                horizontal
                data={clinic.medicalServices}
                keyExtractor={(sv) => sv.serviceID}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-4" />}
                renderItem={({ item: sv }) => (
                  <View className="bg-gray-50 rounded-xl p-4 w-64 border border-gray-200">
                    <Text className="font-bold text-gray-900 text-[15px] mb-2">
                      {sv.name}
                    </Text>
                    <Money value={sv.price} />
                    {!!sv.description && (
                      <Text
                        className="text-[12px] text-gray-600 mt-2"
                        numberOfLines={3}
                      >
                        {sv.description}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          )}

        {/* Giới thiệu */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Giới thiệu
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-[13px] text-gray-700 leading-5">
              {clinic.description ||
                "Phòng khám chuyên khoa với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại và dịch vụ chăm sóc sức khỏe toàn diện."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClinicDetail;
