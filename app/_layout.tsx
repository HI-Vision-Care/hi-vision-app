import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "./global.css";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,  // hiển thị banner (iOS 14+)
    shouldShowList: true,  // hiển thị trong notification center
  }),
});

// Ngăn màn splash tự ẩn trước khi font load xong

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    Jakarta: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    (async () => {
      // Yêu cầu quyền notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Thiếu quyền",
          "Ứng dụng cần quyền gửi thông báo để nhắc uống thuốc hoạt động"
        );
      }

      // 2. TẠO CHANNEL VỚI MỨC IMPORTANCE MAX
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'High Priority Channel',
          importance: Notifications.AndroidImportance.MAX,        // heads-up banner
          bypassDnd: true,                                        // vượt chế độ Không làm phiền
          vibrationPattern: [0, 500, 200, 500],                   // pattern rung mạnh
          enableLights: true,                                     // bật LED (nếu có)
          lightColor: '#FF0000',                                  // màu LED đỏ
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, // hiện đầy đủ content trên lock-screen
          showBadge: true,                                        // cho badge trên icon
        });
      }

      // Khi đã có permission và font load xong thì ẩn splash
      if (loaded) {
        await SplashScreen.hideAsync();
      }
    })();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
