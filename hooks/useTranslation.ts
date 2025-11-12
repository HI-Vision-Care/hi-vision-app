import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation as useI18nextTranslation } from "react-i18next";

export function useTranslation() {
  const { t, i18n } = useI18nextTranslation();

  const changeLanguage = async (language: "en" | "vi") => {
    await i18n.changeLanguage(language);
    // Persist user preference for next launches
    try {
      await AsyncStorage.setItem("app_language", language);
    } catch {}
  };

  return {
    t,
    language: i18n.language as "en" | "vi",
    setLanguage: changeLanguage,
    isReady:
      i18n.isInitialized &&
      i18n.hasResourceBundle(i18n.language, "translation"),
  };
}

export default useTranslation;
