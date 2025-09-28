"use client"

import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useMemo, useState } from "react";
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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { WidgetManager } from "@/native/WidgetManager";
import { createMedicationPlan } from "@/services/medication/scheduler";
import type { MedicationSlot } from "@/services/medication/types";
import { requestNotificationPermissions } from "@/services/notification/prep-notification";

const SLOT_METADATA: Record<MedicationSlot, { label: string; emoji: string; defaultHour: number; defaultMinute: number }> = {
  morning: { label: "Buổi sáng", emoji: "🌅", defaultHour: 7, defaultMinute: 0 },
  noon: { label: "Buổi trưa", emoji: "☀️", defaultHour: 12, defaultMinute: 0 },
  afternoon: { label: "Buổi chiều", emoji: "🌇", defaultHour: 16, defaultMinute: 0 },
  evening: { label: "Buổi tối", emoji: "🌙", defaultHour: 21, defaultMinute: 0 },
  custom: { label: "Tùy chỉnh", emoji: "🕑", defaultHour: 10, defaultMinute: 0 },
};

type SlotState = {
  id: string;
  slot: MedicationSlot;
  time: Date;
  quantity: string;
  note: string;
  labelOverride: string;
};

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const createSlotState = (slot: MedicationSlot, dateRef: Date): SlotState => {
  const meta = SLOT_METADATA[slot];
  const time = new Date(dateRef);
  time.setHours(meta.defaultHour, meta.defaultMinute, 0, 0);
  return {
    id: createId(),
    slot,
    time,
    quantity: "1",
    note: "",
    labelOverride: "",
  };
};

const PRESET_CONFIGS = {
  prep: {
    planName: "Nhắc PrEP hàng ngày",
    medicineName: "PrEP",
    notes: "Uống mỗi ngày cùng thời điểm.",
    slots: [
      { slot: "evening" as MedicationSlot, hour: 20, minute: 0, note: "Uống đều đặn", quantity: "1" },
    ],
  },
  arv: {
    planName: "Nhắc ARV",
    medicineName: "ARV",
    notes: "Nhắc gồm cảnh báo và đếm ngược.",
    slots: [
      { slot: "evening" as MedicationSlot, hour: 19, minute: 30, note: "Sau khi ăn tối", quantity: "1" },
    ],
  },
};

function applySlotPreset(baseDate: Date, preset: (typeof PRESET_CONFIGS)["prep" | "arv"]["slots"]) {
  return preset.map((config) => {
    const slotDate = new Date(baseDate);
    slotDate.setHours(config.hour, config.minute, 0, 0);
    return {
      id: createId(),
      slot: config.slot,
      time: slotDate,
      quantity: config.quantity ?? "1",
      note: config.note ?? "",
      labelOverride: "",
    } as SlotState;
  });
}

export default function MedicationReminderForm() {
  const insets = useSafeAreaInsets();
  const today = useMemo(() => new Date(), []);

  const [planName, setPlanName] = useState("Kế hoạch thuốc mới");
  const [medicineName, setMedicineName] = useState("Thuốc");
  const [planNotes, setPlanNotes] = useState("");
  const [totalDays, setTotalDays] = useState("7");
  const [regimenType, setRegimenType] = useState<"custom" | "prep" | "arv">("custom");

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [slots, setSlots] = useState<SlotState[]>(() => [createSlotState("morning", today)]);

  const formatDate = (date: Date) => date.toLocaleDateString("vi-VN");
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });

  const updateSlot = useCallback(
    (id: string, partial: Partial<SlotState>) => {
      setSlots((prev) => prev.map((item) => (item.id === id ? { ...item, ...partial } : item)));
    },
    [],
  );

  const removeSlot = useCallback((id: string) => {
    setSlots((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addSlot = useCallback(
    (slot: MedicationSlot) => {
      setSlots((prev) => [...prev, createSlotState(slot, startDate)]);
    },
    [startDate],
  );

  const onChangeStartDate = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (!selected) return;
    selected.setHours(0, 0, 0, 0);
    setStartDate(selected);
    setSlots((prev) =>
      prev.map((item) => {
        const nextTime = new Date(selected);
        nextTime.setHours(item.time.getHours(), item.time.getMinutes(), 0, 0);
        return { ...item, time: nextTime };
      }),
    );
  };

  const handlePreset = (type: "prep" | "arv") => {
    const preset = PRESET_CONFIGS[type];
    const baseDate = new Date(startDate);
    setPlanName(preset.planName);
    setMedicineName(preset.medicineName);
    setPlanNotes(preset.notes);
    setRegimenType(type);
    setSlots(applySlotPreset(baseDate, preset.slots));
  };

  const validateInputs = () => {
    if (!medicineName.trim()) {
      return "Bạn cần nhập tên thuốc";
    }
    const days = Number.parseInt(totalDays, 10);
    if (Number.isNaN(days) || days < 1 || days > 365) {
      return "Số ngày phải trong khoảng 1-365";
    }
    if (!slots.length) {
      return "Thêm ít nhất một thời điểm uống";
    }
    return null;
  };

  const handleSave = async () => {
    const error = validateInputs();
    if (error) {
      Alert.alert("Thiếu thông tin", error);
      return;
    }

    if (!(await requestNotificationPermissions())) return;

    setIsSaving(true);
    try {
      const days = Number.parseInt(totalDays, 10);
      await createMedicationPlan({
        name: planName.trim() || medicineName.trim(),
        medicineName: medicineName.trim(),
        regimenType,
        notes: planNotes.trim() ? planNotes : undefined,
        startDate,
        totalDays: days,
        slots: slots.map((slot) => ({
          slot: slot.slot,
          time: slot.time,
          note: slot.note?.trim() || undefined,
          quantity: Number.parseInt(slot.quantity, 10) || 1,
          label: slot.labelOverride.trim() || undefined,
        })),
      });

      if (Platform.OS === "android") {
        WidgetManager.requestPinWidget();
      }

      Alert.alert(
        "Đã tạo kế hoạch",
        `Đã lưu lịch uống cho ${medicineName}\nBắt đầu từ ${formatDate(startDate)}\nSố ngày: ${days}`,
      );
    } catch (err) {
      console.error("createMedicationPlan failed", err);
      Alert.alert("Lỗi", "Không thể lưu kế hoạch thuốc. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 12 }}>📋 Kế hoạch uống thuốc</Text>

        <View style={{ backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 4 }}>Tên kế hoạch</Text>
          <TextInput
            value={planName}
            onChangeText={setPlanName}
            placeholder="Ví dụ: Liệu trình tháng 9"
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
            }}
          />

          <Text style={{ fontWeight: "600", fontSize: 16, marginTop: 12, marginBottom: 4 }}>Tên thuốc</Text>
          <TextInput
            value={medicineName}
            onChangeText={setMedicineName}
            placeholder="Ví dụ: PrEP, ARV, Vitamin C"
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
            }}
          />

          <Text style={{ fontWeight: "600", fontSize: 16, marginTop: 12, marginBottom: 4 }}>Ghi chú chung</Text>
          <TextInput
            value={planNotes}
            onChangeText={setPlanNotes}
            placeholder="Ví dụ: Uống sau ăn sáng"
            multiline
            style={{
              backgroundColor: "#F1F5F9",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 15,
              minHeight: 64,
              textAlignVertical: "top",
            }}
          />
        </View>

        <View style={{ backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>Ngày bắt đầu</Text>
          <TouchableOpacity
            style={{
              marginTop: 8,
              backgroundColor: "#E0F2FE",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ fontSize: 16 }}>📅 {formatDate(startDate)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
              minimumDate={new Date()}
            />
          )}

          <Text style={{ fontWeight: "600", fontSize: 16, marginTop: 16 }}>Số ngày áp dụng</Text>
          <TextInput
            value={totalDays}
            onChangeText={setTotalDays}
            keyboardType="numeric"
            placeholder="Ví dụ: 7, 14, 30"
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
              marginTop: 8,
            }}
          />

          <Text style={{ fontWeight: "600", fontSize: 16, marginTop: 16 }}>Loại kế hoạch</Text>
          <View
            style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              marginTop: 8,
              overflow: "hidden",
            }}
          >
            <Picker selectedValue={regimenType} onValueChange={(value) => setRegimenType(value)}>
              <Picker.Item label="Tùy chỉnh" value="custom" />
              <Picker.Item label="PrEP nhanh" value="prep" />
              <Picker.Item label="ARV nhanh" value="arv" />
            </Picker>
          </View>

          <View style={{ flexDirection: "row", marginTop: 12, columnGap: 12 }}>
            <TouchableOpacity
              onPress={() => handlePreset("prep")}
              style={{
                flex: 1,
                backgroundColor: "#3B82F6",
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Áp preset PrEP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePreset("arv")}
              style={{
                flex: 1,
                backgroundColor: "#0EA5E9",
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Áp preset ARV</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: "white", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>⏰ Thời điểm uống</Text>

          {slots.map((slot) => {
            const meta = SLOT_METADATA[slot.slot];
            return (
              <View
                key={slot.id}
                style={{
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: "#F8FAFC",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "600", fontSize: 16 }}>
                    {meta.emoji} {meta.label}
                  </Text>
                  <TouchableOpacity onPress={() => removeSlot(slot.id)}>
                    <Text style={{ color: "#DC2626", fontWeight: "600" }}>Xóa</Text>
                  </TouchableOpacity>
                </View>

                <InlineTimePicker
                  value={slot.time}
                  onChange={(date) => updateSlot(slot.id, { time: date })}
                  formatTime={formatTime}
                />

                <Text style={{ marginTop: 12, fontWeight: "500" }}>Số viên</Text>
                <TextInput
                  value={slot.quantity}
                  onChangeText={(value) => updateSlot(slot.id, { quantity: value })}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginTop: 6,
                  }}
                />

                <Text style={{ marginTop: 12, fontWeight: "500" }}>Ghi chú</Text>
                <TextInput
                  value={slot.note}
                  onChangeText={(value) => updateSlot(slot.id, { note: value })}
                  placeholder="Ví dụ: Uống sau ăn"
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginTop: 6,
                  }}
                />

                {slot.slot === "custom" && (
                  <>
                    <Text style={{ marginTop: 12, fontWeight: "500" }}>Tên hiển thị</Text>
                    <TextInput
                      value={slot.labelOverride}
                      onChangeText={(value) => updateSlot(slot.id, { labelOverride: value })}
                      placeholder="Ví dụ: Sau tập thể dục"
                      style={{
                        backgroundColor: "#FFF",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#E2E8F0",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginTop: 6,
                      }}
                    />
                  </>
                )}
              </View>
            );
          })}

          <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>Thêm thời điểm</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {(Object.keys(SLOT_METADATA) as MedicationSlot[]).map((slotKey) => (
              <TouchableOpacity
                key={slotKey}
                style={{
                  backgroundColor: "#E0E7FF",
                  borderRadius: 24,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                }}
                onPress={() => addSlot(slotKey)}
              >
                <Text style={{ fontWeight: "600", color: "#312E81" }}>
                  {SLOT_METADATA[slotKey].emoji} {SLOT_METADATA[slotKey].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          style={{
            backgroundColor: isSaving ? "#CBD5F5" : "#2563EB",
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>💾 Lưu kế hoạch</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

type InlineTimePickerProps = {
  value: Date;
  onChange: (value: Date) => void;
  formatTime: (date: Date) => string;
};

function InlineTimePicker({ value, onChange, formatTime }: InlineTimePickerProps) {
  const [open, setOpen] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setOpen(false);
    if (selected) {
      onChange(selected);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          marginTop: 12,
          backgroundColor: "#DBEAFE",
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 12,
        }}
      >
        <Text style={{ fontSize: 16 }}>🕒 {formatTime(value)}</Text>
      </TouchableOpacity>
      {open && (
        <DateTimePicker value={value} mode="time" display="default" onChange={handleChange} />
      )}
    </>
  );
}
