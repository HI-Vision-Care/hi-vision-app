import { Text, View } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl text-red-500 font-extrabold">
        Screen này làm một việc là khi chưa có signedIn thì chuyển sang đăng
        nhập còn có rồi thì qua trang home
      </Text>
    </View>
  );
}
