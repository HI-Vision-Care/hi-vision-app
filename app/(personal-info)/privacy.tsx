import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">Privacy Policy</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-base text-gray-700 leading-6 mb-4">
          Chúng tôi cam kết bảo mật dữ liệu cá nhân và thông tin y tế của bạn.
          Hi-Vision không chia sẻ dữ liệu người dùng với bên thứ ba nếu không có
          sự đồng ý.
        </Text>

        <Text className="text-base text-gray-700 leading-6 mb-4">
          Các dữ liệu được thu thập bao gồm: thông tin tài khoản, hồ sơ bệnh án,
          và lịch sử sử dụng dịch vụ nhằm cải thiện trải nghiệm và đảm bảo điều
          trị chính xác.
        </Text>

        <Text className="text-base text-gray-700 leading-6">
          Nếu có bất kỳ câu hỏi nào về quyền riêng tư, vui lòng liên hệ qua
          email: support@hi-vision.io.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
