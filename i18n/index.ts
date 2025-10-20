import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import en from "../locales/en.json";
import vi from "../locales/vi.json";

const LANGUAGE_STORAGE_KEY = "app_language";

// Initialize i18n immediately with all resources
i18n
  .use(initReactI18next)
  .init({
    lng: "vi", // Start with Vietnamese as default
    fallbackLng: "vi",
    debug: __DEV__,
    compatibilityJSON: "v4",
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
    // Ensure resources are loaded immediately
    initImmediate: true,
  })
  .then(() => {
    console.log("i18n initialized successfully");
    console.log("Available languages:", i18n.languages);
    console.log("Current language:", i18n.language);
    console.log(
      "Has vi resources:",
      i18n.hasResourceBundle("vi", "translation")
    );

    // Load saved language after initialization
    return AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  })
  .then((savedLanguage) => {
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vi")) {
      console.log("Loading saved language:", savedLanguage);
      return i18n.changeLanguage(savedLanguage);
    } else {
      // Try to detect device language
      const deviceLocale = Localization.getLocales()[0]?.languageCode || "vi";
      const languageCode = deviceLocale.split("-")[0];

      if (languageCode === "vi") {
        return i18n.changeLanguage("vi");
      } else {
        return i18n.changeLanguage("en");
      }
    }
  })
  .catch((error) => {
    console.error("Error initializing i18n:", error);
    i18n.changeLanguage("vi"); // Default fallback
  });

export default i18n;
