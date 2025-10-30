import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

export type NotificationType = "medication" | "appointment" | "system";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string; // ISO string or formatted string
  type: NotificationType;
  isRead: boolean;
};

const STORAGE_KEY = "@notifications";
export const NOTIFICATIONS_UPDATED_EVENT = "notificationsUpdated";

export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as NotificationItem[];
  } catch {
    return [];
  }
}

async function setNotifications(notifs: NotificationItem[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
  DeviceEventEmitter.emit(NOTIFICATIONS_UPDATED_EVENT);
}

export async function addNotification(n: NotificationItem): Promise<void> {
  const list = await getNotifications();
  // Newest first
  const next = [n, ...list];
  await setNotifications(next);
}

export async function markRead(id: string): Promise<void> {
  const list = await getNotifications();
  const next = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  await setNotifications(next);
}

export async function markAllRead(): Promise<void> {
  const list = await getNotifications();
  const next = list.map((n) => (n.isRead ? n : { ...n, isRead: true }));
  await setNotifications(next);
}

export async function clearAll(): Promise<void> {
  await setNotifications([]);
}

// Convenience creator
export function createNotification(params: Omit<NotificationItem, "id" | "time" | "isRead"> & { id?: string; time?: string; isRead?: boolean }): NotificationItem {
  return {
    id: params.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: params.title,
    message: params.message,
    type: params.type,
    time: params.time || new Date().toISOString(),
    isRead: params.isRead ?? false,
  };
}


