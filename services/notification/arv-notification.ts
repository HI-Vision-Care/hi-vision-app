import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

// ARV notification identifiers
export const ARV_CATEGORY = "ARV_REMINDER_CATEGORY";
export const ARV_ACTION_CONFIRM = "CONFIRM";
export const ARV_ACTION_SNOOZE = "SNOOZE";

type MedicineDose = {
  id: string;
  doseTime: string;
  confirmed: boolean;
  confirmedTime?: string;
};

// 1. Đăng ký actions khi khởi tạo app
export async function registerArvNotificationActions() {
  await Notifications.setNotificationCategoryAsync(ARV_CATEGORY, [
    {
      identifier: ARV_ACTION_CONFIRM,
      buttonTitle: "Đã uống",
      options: { isDestructive: false, opensAppToForeground: false },
    },
    {
      identifier: ARV_ACTION_SNOOZE,
      buttonTitle: "Báo lại 15 phút",
      options: { isDestructive: false, opensAppToForeground: false },
    },
  ]);
}

/**
 * 2. Lên lịch ARV notifications: countdown, warning, reminder với action Confirm & Snooze
 */
export async function scheduleArvNotifications(
  doseTime: Date,
  confirmed: boolean
): Promise<void> {
  if (confirmed) return;
  const now = Date.now();
  let warningId: string | undefined;
  let reminderId: string | undefined;

  // Warning: 30 phút sau doseTime
  const warningTime = new Date(doseTime.getTime() + 1 * 60 * 1000);
  if (warningTime.getTime() > now) {
    warningId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ ARV Warning",
        body: "Bạn đã trễ >30 phút. Xin hãy uống thuốc đúng giờ",
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: warningTime,
        channelId: "default",
      },
    });
  }

  // Reminder: đúng giờ, có action Confirm & Snooze
  if (doseTime.getTime() > now) {
    reminderId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 ARV Reminder",
        body: "Đến giờ uống ARV, vui lòng xác nhận hoặc báo lại.",
        categoryIdentifier: ARV_CATEGORY,
        data: { doseTime: doseTime.toISOString(), warningId },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: doseTime,
        channelId: "default",
      },
    });
  }

  // Countdown: 30 phút trước
  const countdownTime = new Date(doseTime.getTime() - 1 * 60 * 1000);
  if (countdownTime.getTime() > now) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏳ ARV Countdown",
        body: "Còn 30 phút nữa tới giờ uống ARV",
        categoryIdentifier: ARV_CATEGORY,
        data: { doseTime: doseTime.toISOString(), warningId, reminderId },
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: countdownTime,
        channelId: "default",
      },
    });
  }
}

/**
 * 3. Lắng nghe Confirm & Snooze, xử lý hành động tương ứng
 */
export function listenArvConfirm(onConfirm: (doseTime: string) => void): {
  remove: () => void;
} {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    async (response) => {
      if (
        response.notification.request.content.categoryIdentifier !==
        ARV_CATEGORY
      )
        return;
      // 1. Hủy notification vừa thao tác, cả scheduled và delivered!
      await Notifications.cancelScheduledNotificationAsync(
        response.notification.request.identifier
      );
      await Notifications.dismissNotificationAsync(
        response.notification.request.identifier
      );
      const { doseTime, warningId, reminderId } = response.notification.request
        .content.data as {
        doseTime: string;
        warningId?: string;
        reminderId?: string;
      };

      if (response.actionIdentifier === ARV_ACTION_CONFIRM) {
        // Hủy warning nếu có
        if (warningId) {
          await Notifications.cancelScheduledNotificationAsync(warningId);
        }
        if (reminderId) {
          await Notifications.cancelScheduledNotificationAsync(reminderId);
        }
        // Lưu thông tin confirm vào AsyncStorage, chỉ khi chưa có
        try {
          const stored = await AsyncStorage.getItem("confirmedDoses");
          const arr: string[] = stored ? JSON.parse(stored) : [];
          if (!arr.includes(doseTime)) {
            arr.push(doseTime);
            await AsyncStorage.setItem("confirmedDoses", JSON.stringify(arr));
          }
        } catch (e) {
          console.error("Error saving confirm:", e);
        }
        // Callback cho UI
        onConfirm(doseTime);
      }
      // ==== BỔ SUNG SNOOZE ====
      else if (response.actionIdentifier === ARV_ACTION_SNOOZE) {
        // Lập lại notification reminder sau 15 phút
        const snoozeDate = new Date(Date.now() + 1 * 60 * 1000);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "💊 Nhắc lại: Uống thuốc ARV!",
            body: "Đừng quên xác nhận khi đã uống nhé.",
            categoryIdentifier: ARV_CATEGORY,
            data: { doseTime },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: snoozeDate,
            channelId: "default",
          },
        });
        if (Platform.OS === "android") {
          Alert.alert("Nhắc lại sau 15 phút!");
        }
      }
    }
  );
  return subscription;
}

/**
 * Xóa hết notification ARV
 */
export async function cancelAllArvNotifications(): Promise<void> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const arvNotifications = scheduledNotifications.filter(
      (notification) =>
        notification.content.categoryIdentifier === ARV_CATEGORY ||
        notification.content.title?.includes("ARV")
    );

    for (const notification of arvNotifications) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  } catch (error) {
    console.error("Error canceling ARV notifications:", error);
  }
}

export async function clearAllConfirmedDoses() {
  try {
    await AsyncStorage.removeItem("confirmedDoses");
    Alert.alert("Đã xóa tất cả xác nhận đã uống!");
  } catch (e) {
    Alert.alert("Lỗi", "Không thể xóa xác nhận!");
  }
}
