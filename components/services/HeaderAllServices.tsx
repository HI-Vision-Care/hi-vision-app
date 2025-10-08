import { useTranslation } from "@/hooks/useTranslation";
import { Text, View } from "react-native";

const HeaderAllServices = () => {
  const { t } = useTranslation();

  return (
    <View className="px-6 py-4 bg-white border-b border-slate-100">
      <Text className="text-slate-900 text-2xl font-bold">
        {t("menu.title")}
      </Text>
      <Text className="text-slate-600 text-sm mt-1">{t("menu.subtitle")}</Text>
    </View>
  );
};

export default HeaderAllServices;
