import { Text, View } from "react-native";

const HeaderAllServices = () => {
  return (
    <View className="px-6 py-4 bg-white border-b border-slate-100">
      <Text className="text-slate-900 text-2xl font-bold">
        Medical Services
      </Text>
      <Text className="text-slate-600 text-sm mt-1">
        Choose from our available healthcare services across specialties
      </Text>
    </View>
  );
};

export default HeaderAllServices;
