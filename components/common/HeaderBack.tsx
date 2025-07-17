import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface DetailHeaderProps {
  title: string;
  hideBack?: boolean;
}

export default function DetailHeader({ title, hideBack }: DetailHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between bg-gradient-to-r from-white to-slate-50 border-b border-slate-200/60 px-6 pb-4 shadow-sm pt-2">
      {/* Back */}
      {!hideBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-3 bg-white/90 rounded-xl border border-slate-200/80 shadow-lg shadow-slate-200/50 active:scale-95 active:bg-slate-50"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#334155" />
        </TouchableOpacity>
      )}

      <View className="flex-1 mx-4">
        <Text
          className="text-center text-xl font-bold text-slate-800 tracking-tight"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      {/* Home */}
      <TouchableOpacity
        onPress={() => router.push("/(root)/(tabs)/home")}
        className="p-3 bg-white/90 rounded-xl border border-slate-200/80 shadow-lg shadow-slate-200/50 active:scale-95 active:bg-slate-50 mr-2"
        activeOpacity={0.7}
      >
        <Ionicons name="home-outline" size={22} color="#334155" />
      </TouchableOpacity>

      {/* Menu */}
      <TouchableOpacity
        onPress={() => {}}
        className="p-3 bg-white/90 rounded-xl border border-slate-200/80 shadow-lg shadow-slate-200/50 active:scale-95 active:bg-slate-50"
        activeOpacity={0.7}
      >
        <Ionicons name="ellipsis-vertical" size={22} color="#334155" />
      </TouchableOpacity>
    </View>
  );
}
