import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation as useI18nextTranslation } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "app_language";

export function useTranslation() {
  const { t, i18n } = useI18nextTranslation();

  const changeLanguage = async (language: "en" | "vi") => {
    await i18n.changeLanguage(language);
    // Save language preference to AsyncStorage
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      console.log("Language preference saved:", language);
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
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
