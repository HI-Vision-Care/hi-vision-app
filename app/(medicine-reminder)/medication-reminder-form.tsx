import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { WidgetBridge } from "../../native/WidgetBridge";
import { WidgetManager } from "../../native/WidgetManager";
import {
  requestNotificationPermissions,
  scheduleNotifications as scheduleNotif,
  testNotification,
  type NotificationSchedule,
} from "../../services/notification/prep-notification";

// Configure notification behavior when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type RegimenType = "Daily PrEP" | "On-demand (2-1-1)";

type WidgetScheduleItem = {
  timeISO: string;
  pills: number;
  note: string;
  label: string;
};

type WidgetSchedulePayload = {
  version: number;
  regimen: RegimenType;
  createdAt: string;
  timezone: string;
  totalSchedules: number;
  notes?: string;
  next?: WidgetScheduleItem;
  preview: WidgetScheduleItem[];
};

const WIDGET_WEEKDAY = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"] as const;

const pad = (value: number): string => value.toString().padStart(2, "0");

const formatWidgetDateTime = (date: Date): string => {
  const weekday = WIDGET_WEEKDAY[date.getDay()];
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  return `${weekday} ${hours}:${minutes} • ${day}/${month}`;
};

const buildWidgetPayload = (
  schedules: NotificationSchedule[],
  regimen: RegimenType,
  notes: string
): WidgetSchedulePayload | null => {
  if (!schedules.length) return null;

  const sorted = [...schedules].sort(
    (a, b) => a.time.getTime() - b.time.getTime()
  );
  const now = Date.now();
  const upcoming =
    sorted.find((item) => item.time.getTime() > now) ?? sorted[0];
  const deviceTimezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

  const mapItem = (item: NotificationSchedule): WidgetScheduleItem => ({
    timeISO: item.time.toISOString(),
    pills: item.pills,
    note: item.note,
    label: `${formatWidgetDateTime(item.time)} • ${item.pills} viên`,
  });

  return {
    version: 1,
    regimen,
    createdAt: new Date().toISOString(),
    timezone: deviceTimezone,
    totalSchedules: schedules.length,
    notes: notes.trim() ? notes : undefined,
    next: mapItem(upcoming),
    preview: sorted.slice(0, 10).map(mapItem),
  };
};

const syncWidgetReminder = (
  schedules: NotificationSchedule[],
  regimen: RegimenType,
  notes: string
) => {
  if (Platform.OS !== "android") return;
  if (!WidgetBridge?.setMedicationReminder) return;

  const payload = buildWidgetPayload(schedules, regimen, notes);
  if (!payload) return;

  try {
    WidgetBridge.setMedicationReminder(JSON.stringify(payload));
  } catch (error) {
    console.warn("Failed to sync widget schedule", error);
  }
};

export default function MedicationReminderForm() {
  const insets = useSafeAreaInsets();
  const [regimen, setRegimen] = useState<RegimenType>("Daily PrEP");
  const [isLoading, setIsLoading] = useState(false);

  // Daily PrEP state
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [dailyTime, setDailyTime] = useState<Date>(new Date());
  const [showDailyTimePicker, setShowDailyTimePicker] = useState(false);
  const [days, setDays] = useState<string>("30");

  // On-demand state - Split into separate date and time
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [showEventDatePicker, setShowEventDatePicker] = useState(false);
  const [eventTime, setEventTime] = useState<Date>(new Date());
  const [showEventTimePicker, setShowEventTimePicker] = useState(false);
  const [preHours, setPreHours] = useState<string>("2");

  // Common notes
  const [notes, setNotes] = useState<string>("");

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Date pickers handlers
  const onChangeStartDate = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowStartPicker(false);
    if (selected) setStartDate(selected);
  };

  const onChangeDailyTime = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowDailyTimePicker(false);
    if (selected) setDailyTime(selected);
  };

  const onChangeEventDate = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowEventDatePicker(false);
    if (selected) setEventDate(selected);
  };

  const onChangeEventTime = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowEventTimePicker(false);
    if (selected) setEventTime(selected);
  };

  // Formatters
  const formatDate = (d: Date): string => d.toLocaleDateString("vi-VN");
  const formatTime = (d: Date): string =>
    d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const formatDateTime = (d: Date): string => d.toLocaleString("vi-VN");

  // Get combined event datetime for On-demand
  const getEventDateTime = (): Date => {
    const combined = new Date(eventDate);
    combined.setHours(eventTime.getHours(), eventTime.getMinutes(), 0, 0);
    return combined;
  };

  // Input validation
  const validateInputs = (): string | null => {
    if (regimen === "Daily PrEP") {
      const totalDays = Number.parseInt(days, 10);
      if (isNaN(totalDays) || totalDays < 1 || totalDays > 365) {
        return "Số ngày phải từ 1 đến 365";
      }
      if (startDate < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        return "Ngày bắt đầu không thể là quá khứ";
      }
    } else {
      const h = Number.parseInt(preHours, 10);
      if (isNaN(h) || h < 1 || h > 72) {
        return "Số giờ nhắc trước phải từ 1 đến 72";
      }
      const eventDateTime = getEventDateTime();
      if (eventDateTime <= new Date()) {
        return "Thời gian sự kiện phải trong tương lai";
      }
      const minNotificationTime = new Date(
        eventDateTime.getTime() - h * 60 * 60 * 1000
      );
      if (minNotificationTime <= new Date()) {
        return "Thời gian nhắc nhở đầu tiên phải trong tương lai";
      }
    }
    return null;
  };

  // Generate notification schedules
  const generateDailySchedule = (): NotificationSchedule[] => {
    const count = Number.parseInt(days, 10) || 0;
    const schedules: NotificationSchedule[] = [];

    for (let i = 0; i < count; i++) {
      const scheduleDate = new Date(startDate);
      scheduleDate.setDate(scheduleDate.getDate() + i);
      scheduleDate.setHours(dailyTime.getHours(), dailyTime.getMinutes(), 0, 0);

      // Skip past dates
      if (scheduleDate > new Date()) {
        schedules.push({
          time: scheduleDate,
          pills: 1,
          note: `Daily PrEP - Ngày ${i + 1}/${count}`,
        });
      }
    }
    return schedules;
  };

  const generateOnDemandSchedule = (): NotificationSchedule[] => {
    const h = Number.parseInt(preHours, 10) || 0;
    const eventDateTime = getEventDateTime();

    const dose1Time = new Date(eventDateTime);
    dose1Time.setHours(dose1Time.getHours() - h);

    const dose2Time = new Date(eventDateTime);
    dose2Time.setHours(dose2Time.getHours() + 24);

    const dose3Time = new Date(eventDateTime);
    dose3Time.setHours(dose3Time.getHours() + 48);

    const schedules: NotificationSchedule[] = [];

    // Only add notifications that are in the future
    if (dose1Time > new Date()) {
      schedules.push({
        time: dose1Time,
        pills: 2,
        note: `On-demand PrEP - Liều trước sự kiện (${h}h trước)`,
      });
    }

    schedules.push(
      {
        time: dose2Time,
        pills: 1,
        note: "On-demand PrEP - Liều sau 24h",
      },
      {
        time: dose3Time,
        pills: 1,
        note: "On-demand PrEP - Liều sau 48h",
      }
    );

    return schedules;
  };

  // Main function to schedule notifications using service
  const onSave = async (): Promise<void> => {
    try {
      // 1. Validate inputs
      const validationError = validateInputs();
      if (validationError) {
        Alert.alert("Lỗi nhập liệu", validationError);
        return;
      }

      // 2. Request permissions
      if (!(await requestNotificationPermissions())) return;

      // 3. Cancel existing notifications
      // await cancelAll()

      // 4. Build schedules
      const schedules: NotificationSchedule[] =
        regimen === "Daily PrEP"
          ? generateDailySchedule()
          : generateOnDemandSchedule();

      if (schedules.length === 0) {
        Alert.alert(
          "Thông báo",
          "Không có lịch nhắc nào được tạo (có thể do thời gian đã qua)"
        );
        return;
      }

      // 5. Schedule notifications using service
      setIsLoading(true);
      const { success, totalPills } = await scheduleNotif(
        schedules,
        regimen,
        notes
      );

      syncWidgetReminder(schedules, regimen, notes);
      if (Platform.OS === "android") {
        WidgetManager.requestPinWidget();
      }
      setIsLoading(false);

      // 6. Show success message
      Alert.alert(
        "✅ Thành công!",
        `Đã lên lịch ${success}/${schedules.length} thông báo\n` +
          `Tổng cộng: ${totalPills} viên\n` +
          `Chế độ: ${regimen}` +
          (notes ? `\nGhi chú: ${notes}` : ""),
        [
          {
            text: "Xem chi tiết",
            onPress: () => showScheduleDetails(schedules),
          },
          { text: "OK" },
        ]
      );
    } catch (error) {
      console.error("Error scheduling notifications:", error);
      Alert.alert("Lỗi", "Không thể lên lịch thông báo. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  const showScheduleDetails = (schedules: NotificationSchedule[]): void => {
    const details = schedules
      .slice(0, 5) // Show first 5 schedules
      .map((s, i) => `${i + 1}. ${formatDateTime(s.time)} - ${s.pills} viên`)
      .join("\n");

    const moreText =
      schedules.length > 5 ? `\n... và ${schedules.length - 5} lịch khác` : "";

    Alert.alert("Chi tiết lịch nhắc", details + moreText);
  };

  // Test notification function using service
  const handleTestNotification = async (): Promise<void> => {
    try {
      await testNotification();
      Alert.alert("Test", "Thông báo test sẽ hiển thị sau 3 giây");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể gửi thông báo test");
    }
  };

  // Show pickers
  const showStart = () => setShowStartPicker(true);
  const showTime = () => setShowDailyTimePicker(true);
  const showEventTimePickerHandler = () => setShowEventTimePicker(true);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f5f5f5", paddingTop: insets.top }}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: "#4285F4",
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 15,
          paddingHorizontal: 15,
        }}
      >
        <TouchableOpacity style={{ marginRight: 15 }}>
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            ←
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
          }}
        >
          Tạo lịch nhắc PrEP
        </Text>
        <TouchableOpacity
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
          onPress={handleTestNotification}
        >
          <Text style={{ fontSize: 16 }}>🧪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Regimen Picker */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 16,
              fontWeight: "600",
              color: "#333",
            }}
          >
            Chế độ PrEP:
          </Text>
          <View
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
            }}
          >
            <Picker
              selectedValue={regimen}
              onValueChange={(v) => setRegimen(v as RegimenType)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Daily PrEP (Hàng ngày)" value="Daily PrEP" />
              <Picker.Item
                label="On-demand (2-1-1)"
                value="On-demand (2-1-1)"
              />
            </Picker>
          </View>
        </View>

        {regimen === "Daily PrEP" ? (
          <>
            {/* Start Date */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  marginBottom: 8,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Ngày bắt đầu:
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 15,
                }}
                onPress={showStart}
              >
                <Text style={{ fontSize: 16, color: "#333" }}>
                  📅 {formatDate(startDate)}
                </Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onChangeStartDate}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Daily Time */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  marginBottom: 8,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Giờ uống hàng ngày:
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 15,
                }}
                onPress={showTime}
              >
                <Text style={{ fontSize: 16, color: "#333" }}>
                  ⏰ {formatTime(dailyTime)}
                </Text>
              </TouchableOpacity>
              {showDailyTimePicker && (
                <DateTimePicker
                  value={dailyTime}
                  mode="time"
                  display="default"
                  onChange={onChangeDailyTime}
                />
              )}
            </View>

            {/* Days */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  marginBottom: 8,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Số ngày uống:
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                }}
                keyboardType="numeric"
                value={days}
                onChangeText={setDays}
                placeholder="30"
                maxLength={3}
              />
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                Tối đa 365 ngày
              </Text>
            </View>

            {/* Daily Preview */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 15,
                borderWidth: 1,
                borderColor: "#ddd",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: 10,
                }}
              >
                Xem trước lịch uống:
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#333",
                  marginBottom: 4,
                }}
              >
                📅 Bắt đầu: {formatDate(startDate)} lúc {formatTime(dailyTime)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#333",
                  marginBottom: 4,
                }}
              >
                📊 Tổng cộng: {days} ngày × 1 viên = {days} viên
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Event Date */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  marginBottom: 8,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Ngày sự kiện:
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 15,
                }}
                onPress={() => setShowEventDatePicker(true)}
              >
                <Text style={{ fontSize: 16, color: "#333" }}>
                  📅 {formatDate(eventDate)}
                </Text>
              </TouchableOpacity>
              {showEventDatePicker && (
                <DateTimePicker
                  value={eventDate}
                  mode="date"
                  display="default"
                  onChange={onChangeEventDate}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Event Time */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  marginBottom: 8,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Giờ sự kiện:
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 15,
                }}
                onPress={showEventTimePickerHandler}
              >
                <Text style={{ fontSize: 16, color: "#333" }}>
                  ⏰ {formatTime(eventTime)}
                </Text>
              </TouchableOpacity>
              {showEventTimePicker && (
                <DateTimePicker
                  value={eventTime}
                  mode="time"
                  display="default"
                  onChange={onChangeEventTime}
                />
              )}
            </View>

            {/* Pre-hours */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  marginBottom: 8,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                Nhắc trước sự kiện (giờ):
              </Text>
              <TextInput
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                }}
                keyboardType="numeric"
                value={preHours}
                onChangeText={setPreHours}
                placeholder="2"
                maxLength={2}
              />
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                Từ 1 đến 72 giờ
              </Text>
            </View>

            {/* On-demand Preview */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 15,
                borderWidth: 1,
                borderColor: "#ddd",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: 10,
                }}
              >
                Lịch uống tự động (2-1-1):
              </Text>
              {generateOnDemandSchedule().map((item, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: "500", color: "#333" }}
                  >
                    {idx === 0 ? "🔴" : idx === 1 ? "🟡" : "🟢"} {item.pills}{" "}
                    viên - {formatDateTime(item.time)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#666",
                      marginLeft: 16,
                      marginTop: 2,
                    }}
                  >
                    {item.note}
                  </Text>
                </View>
              ))}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#4285F4",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Tổng cộng: 4 viên
              </Text>
            </View>
          </>
        )}

        {/* Notes */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 16,
              fontWeight: "600",
              color: "#333",
            }}
          >
            Ghi chú:
          </Text>
          <TextInput
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              height: 80,
              textAlignVertical: "top",
            }}
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Nhập ghi chú (tuỳ chọn)"
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={{
            backgroundColor: isLoading ? "#ccc" : "#4285F4",
            paddingVertical: 15,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 24,
            marginBottom: 40,
          }}
          onPress={onSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              💾 Lưu & Kích hoạt nhắc nhở
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
