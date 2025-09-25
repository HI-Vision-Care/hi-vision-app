import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsOfService() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          Terms of Service
        </Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-base text-gray-700 leading-6 mb-4">
          Việc sử dụng ứng dụng Hi-Vision đồng nghĩa với việc bạn đồng ý với các
          điều khoản sau:
        </Text>

        <Text className="text-base text-gray-700 leading-6 mb-4">
          1. Ứng dụng chỉ hỗ trợ tham khảo và quản lý hồ sơ y tế. Các quyết định
          điều trị cuối cùng cần được thực hiện bởi bác sĩ chuyên môn.
        </Text>

        <Text className="text-base text-gray-700 leading-6 mb-4">
          2. Người dùng chịu trách nhiệm cung cấp thông tin chính xác để đảm bảo
          hiệu quả điều trị và tránh sai sót.
        </Text>

        <Text className="text-base text-gray-700 leading-6">
          3. Chúng tôi có quyền cập nhật điều khoản mà không cần thông báo
          trước. Vui lòng kiểm tra định kỳ để nắm rõ các thay đổi.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
