// services/notification.ts
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

export type NotificationSchedule = {
  time: Date;
  pills: number;
  note: string;
};

// 1. Yêu cầu quyền
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== "granted") {
    Alert.alert(
      "Cần quyền thông báo",
      "Vui lòng bật quyền thông báo để app hoạt động tốt.",
      [{ text: "OK" }]
    );
    return false;
  }
  return true;
}

// 2. Hủy tất cả
export async function cancelAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// 3. Lên lịch notifications
export async function scheduleNotifications(
  schedules: NotificationSchedule[],
  regimen: string,
  notes: string
): Promise<{ success: number; totalPills: number }> {
  let success = 0;
  const totalPills = schedules.reduce((sum, s) => sum + s.pills, 0);

  for (const sch of schedules) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💊 Nhắc nhở uống thuốc PrEP",
          body: `${sch.pills} viên – ${sch.note}`,
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.MAX, // Android priority nữa
          data: {
            regimen,
            pills: sch.pills,
            note: sch.note,
            scheduledTime: sch.time.toISOString(),
            notes,
          },
        },
        trigger: {
          // Sử dụng enum để có đúng kiểu:
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: sch.time, // Date hoặc số timestamp đều được chấp nhận
          channelId: "default", // dùng channel max
        },
      });
      success++;
    } catch (e) {
      console.error("Lên lịch thất bại", e);
    }
  }

  return { success, totalPills };
}

// 4. Test notification
export async function testNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🧪 Test Notification",
      body: "Ứng dụng đang hoạt động bình thường!",
      sound: "default",
    },
    trigger: {
      // Cũng yêu cầu type:
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
      repeats: false,
    },
  });
}
