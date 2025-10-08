import ErrorBoundary from "@/components/common/ErrorBoundary";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  listenArvConfirm,
  registerArvNotificationActions,
} from "@/services/notification/arv-notification";
import { setupSentryErrorTracking } from "@/utils/sentry-setup";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import "react-native-reanimated";
import "./global.css";

Sentry.init({
  dsn: "https://9e57e53f05d54f6d42a07a317053c2d0@o4508410080919552.ingest.us.sentry.io/4510153604661248",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // hiển thị banner (iOS 14+)
    shouldShowList: true, // hiển thị trong notification center
  }),
});

// Ngăn màn splash tự ẩn trước khi font load xong

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const queryClient = new QueryClient();
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
    // Setup automatic error tracking
    setupSentryErrorTracking();

    // Đăng ký category notification ARV khi app khởi động (CHẠY 1 LẦN DUY NHẤT)
    registerArvNotificationActions();

    // Lắng nghe action xác nhận
    const subscription = listenArvConfirm((doseTime) => {
      // Có thể hiện Toast hoặc reload calendar tại đây nếu muốn
    });
    return () => subscription.remove();
  }, []);

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
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "High Priority Channel",
          importance: Notifications.AndroidImportance.MAX, // heads-up banner
          bypassDnd: true, // vượt chế độ Không làm phiền
          vibrationPattern: [0, 500, 200, 500], // pattern rung mạnh
          enableLights: true, // bật LED (nếu có)
          lightColor: "#FF0000", // màu LED đỏ
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC, // hiện đầy đủ content trên lock-screen
          showBadge: true, // cho badge trên icon
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
    <ErrorBoundary>
      <GluestackUIProvider mode="light">
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
      </GluestackUIProvider>
    </ErrorBoundary>
  );
});
