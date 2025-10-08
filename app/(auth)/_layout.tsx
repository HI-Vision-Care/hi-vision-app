import I18nProvider from "@/components/common/I18nProvider";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <I18nProvider>
      <Stack>
        <Stack.Screen name="get-started" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      </Stack>
    </I18nProvider>
  );
};

export default Layout;
