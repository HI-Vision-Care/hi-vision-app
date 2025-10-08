import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface LanguageSwitcherProps {
  style?: any;
}

export default function LanguageSwitcher({ style }: LanguageSwitcherProps) {
  const { t, language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "vi" : "en");
  };

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F3F4F6",
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        },
        style,
      ]}
    >
      <Text
        style={{
          marginRight: 8,
          fontSize: 14,
          fontWeight: "600",
          color: "#374151",
        }}
      >
        {language === "en" ? "🇺🇸" : "🇻🇳"}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}>
        {language === "en" ? "English" : "Tiếng Việt"}
      </Text>
    </TouchableOpacity>
  );
}
