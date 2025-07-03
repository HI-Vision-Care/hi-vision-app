import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ARV notification identifiers
export const ARV_CATEGORY = "ARV_REMINDER_CATEGORY";
export const ARV_ACTION_CONFIRM = "CONFIRM";

type MedicineDose = {
  id: string;         // id notification hoặc tự tạo UUID
  doseTime: string;   // giờ uống định sẵn (ISO string)
  confirmed: boolean; // đã uống chưa
  confirmedTime?: string; // thời gian confirm (ISO string)
}


/**
 * 3. Lên lịch ARV notifications: countdown 30min trước,
 *    warning 30min sau, và reminder đúng giờ với action Confirm
 */
export async function scheduleArvNotifications(
  doseTime: Date,
  confirmed: boolean
): Promise<void> {
  if (confirmed) return;
  const now = Date.now();
  let warningId: string | undefined;
  let reminderId: string | undefined;

  // 3.1 Warning: 30 phút sau doseTime
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

  // 3.2 Reminder at doseTime (với action Confirm và đính kèm warningId)
  if (doseTime.getTime() > now) {
    reminderId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 ARV Reminder",
        body: "Đến giờ uống ARV, vui lòng xác nhận",
        categoryIdentifier: ARV_CATEGORY,
        data: { doseTime: doseTime.toISOString(), warningId },
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: doseTime,
        channelId: "default",
      },
    });
  }

  // 3.3 Countdown: 30 phút trước doseTime (đính kèm warningId và reminderId)
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
 * 4. Lắng nghe Confirm action, hủy đúng warning & reminder và lưu kết quả vào AsyncStorage
 */


export async function cancelAllArvNotifications(): Promise<void> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
    const arvNotifications = scheduledNotifications.filter(
      (notification) =>
        notification.content.categoryIdentifier === ARV_CATEGORY || notification.content.title?.includes("ARV"),
    )

    for (const notification of arvNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier)
    }

    console.log(`Canceled ${arvNotifications.length} ARV notifications`)
  } catch (error) {
    console.error("Error canceling ARV notifications:", error)
  }
}

export function listenArvConfirm(onConfirm: (doseTime: string) => void): {
  remove: () => void;
} {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    async (response) => {
      if (response.actionIdentifier === ARV_ACTION_CONFIRM) {
        const { doseTime, warningId, reminderId } = response.notification
          .request.content.data as {
          doseTime: string;
          warningId?: string;
          reminderId?: string;
        };
        // Hủy các notification liên quan
        if (warningId) {
          await Notifications.cancelScheduledNotificationAsync(warningId);
        }
        if (reminderId) {
          await Notifications.cancelScheduledNotificationAsync(reminderId);
        }
        // Lưu thông tin confirm vào AsyncStorage
        try {
          const stored = await AsyncStorage.getItem("confirmedDoses");
          const arr: string[] = stored ? JSON.parse(stored) : [];
          arr.push(doseTime);
          await AsyncStorage.setItem("confirmedDoses", JSON.stringify(arr));
          console.log("Confirmed doses saved:", arr);
        } catch (e) {
          console.error("Error saving confirm:", e);
        }
        // Callback cho UI
        onConfirm(doseTime);
      }
    }
  );
  return subscription;
}


