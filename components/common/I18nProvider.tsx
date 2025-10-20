import i18n from "@/i18n";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface I18nProviderProps {
  children: React.ReactNode;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for i18n to be initialized
    const checkI18n = () => {
      if (
        i18n.isInitialized &&
        i18n.hasResourceBundle(i18n.language, "translation")
      ) {
        setIsReady(true);
      } else {
        setTimeout(checkI18n, 100);
      }
    };

    checkI18n();
  }, []);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text>Loading translations...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default I18nProvider;
