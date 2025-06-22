// components/BackButton.tsx
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

const BackButton: React.FC = () => {
  const router = useRouter();

  const handlePress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Nếu không có màn hình để quay lại, bạn có thể đẩy đến một route mặc định, ví dụ đường dẫn "/" hoặc "login"
      router.replace("/"); // hoặc router.replace("/login") nếu bạn có route login
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow"
    >
      <ChevronLeft size={20} color="#374151" />
    </TouchableOpacity>
  );
};

export default BackButton;
