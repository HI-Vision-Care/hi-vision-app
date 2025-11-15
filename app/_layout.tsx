import ErrorBoundary from "@/components/common/ErrorBoundary";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useTranslation } from "@/hooks/useTranslation";
import "@/i18n"; // Import i18n configuration
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

// Safely set notification handler - only when native module is available
try {
  // Check if Notifications module is available before setting handler
  if (Notifications.setNotificationHandler) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true, // hiển thị banner (iOS 14+)
        shouldShowList: true, // hiển thị trong notification center
      }),
    });
  }
} catch (error) {
  // Silently fail if native module not ready (will be set up in useEffect)
  console.warn("Notification handler setup delayed:", error);
}

// Ngăn màn splash tự ẩn trước khi font load xong

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const { t } = useTranslation();
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

    // Setup additional error handlers to prevent crashes
    // Note: setupSentryErrorTracking() already sets up ErrorUtils handler
    const setupAdditionalErrorHandlers = () => {
      // Handle unhandled promise rejections (web/Expo) - additional to Sentry handler
      if (typeof window !== "undefined" && window.addEventListener) {
        const unhandledRejectionHandler = (
          event: PromiseRejectionEvent | any
        ) => {
          const error =
            event?.reason ||
            event?.error ||
            new Error("Unhandled promise rejection");
          console.error("Unhandled promise rejection:", error);

          // Sentry handler should already catch this, but add extra safety
          try {
            Sentry.captureException(error, {
              tags: { type: "unhandled_rejection" },
            });
          } catch (sentryError) {
            console.error("Failed to send error to Sentry:", sentryError);
          }

          // Prevent default crash behavior on web
          if (event?.preventDefault) {
            event.preventDefault();
          }
        };
        window.addEventListener(
          "unhandledrejection",
          unhandledRejectionHandler
        );
        return () => {
          window.removeEventListener(
            "unhandledrejection",
            unhandledRejectionHandler
          );
        };
      }
      return () => {};
    };

    const cleanupErrorHandlers = setupAdditionalErrorHandlers();

    // Đăng ký category notification ARV khi app khởi động (CHẠY 1 LẦN DUY NHẤT)
    try {
      registerArvNotificationActions().catch((error) => {
        console.warn("Failed to register ARV notification actions:", error);
      });
    } catch (error) {
      console.warn("Error setting up ARV notifications:", error);
    }

    // Lắng nghe action xác nhận
    let subscription: { remove: () => void } | null = null;
    try {
      subscription = listenArvConfirm((doseTime) => {
        // Có thể hiện Toast hoặc reload calendar tại đây nếu muốn
      });
    } catch (error) {
      console.warn("Error setting up ARV confirm listener:", error);
    }

    return () => {
      if (subscription) {
        try {
          subscription.remove();
        } catch (error) {
          console.warn("Error removing subscription:", error);
        }
      }
      // Cleanup error handlers
      cleanupErrorHandlers();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Ensure notification handler is set if it wasn't set at module level
        if (Notifications.setNotificationHandler) {
          try {
            Notifications.setNotificationHandler({
              handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
                shouldShowBanner: true,
                shouldShowList: true,
              }),
            });
          } catch (handlerError) {
            console.warn("Failed to set notification handler:", handlerError);
          }
        }

        // Yêu cầu quyền notifications
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            t("app.missingPermission"),
            t("app.notificationPermissionRequired")
          );
        }

        // 2. TẠO CHANNEL VỚI MỨC IMPORTANCE MAX
        if (Platform.OS === "android") {
          try {
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
          } catch (channelError) {
            console.warn("Failed to set notification channel:", channelError);
          }
        }

        // Khi đã có permission và font load xong thì ẩn splash
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error("Error in notification setup:", error);
        // Still hide splash screen even if notification setup fails
        if (loaded) {
          await SplashScreen.hideAsync();
        }
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
}

export default Sentry.wrap(RootLayout);
