"use client";

import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useTranslation } from "@/hooks/useTranslation";
import { createMedicationPlan } from "@/services/medication/scheduler";
import type { MedicationSlot } from "@/services/medication/types";
import { requestNotificationPermissions } from "@/services/notification/prep-notification";

const getSlotMetadata = (
  t: any
): Record<
  MedicationSlot,
  { label: string; emoji: string; defaultHour: number; defaultMinute: number }
> => ({
  morning: {
    label: t("medicine.medicationReminderForm.morning"),
    emoji: "🌅",
    defaultHour: 7,
    defaultMinute: 0,
  },
  noon: {
    label: t("medicine.medicationReminderForm.noon"),
    emoji: "☀️",
    defaultHour: 12,
    defaultMinute: 0,
  },
  afternoon: {
    label: t("medicine.medicationReminderForm.afternoon"),
    emoji: "🌇",
    defaultHour: 16,
    defaultMinute: 0,
  },
  evening: {
    label: t("medicine.medicationReminderForm.evening"),
    emoji: "🌙",
    defaultHour: 21,
    defaultMinute: 0,
  },
  custom: {
    label: t("medicine.medicationReminderForm.custom"),
    emoji: "🕑",
    defaultHour: 10,
    defaultMinute: 0,
  },
});

type SlotState = {
  id: string;
  slot: MedicationSlot;
  time: Date;
  quantity: string;
  note: string;
  labelOverride: string;
};

const createId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const createSlotState = (
  slot: MedicationSlot,
  dateRef: Date,
  t: any
): SlotState => {
  const meta = getSlotMetadata(t)[slot];
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

const getPresetConfigs = (t: any) => ({
  prep: {
    planName: t("medicine.medicationReminderForm.prepDailyReminder"),
    medicineName: t("medicine.medicationReminderForm.prep"),
    notes: t("medicine.medicationReminderForm.takeDailySameTime"),
    slots: [
      {
        slot: "evening" as MedicationSlot,
        hour: 20,
        minute: 0,
        note: t("medicine.medicationReminderForm.prepSlot"),
        quantity: "1",
      },
    ],
  },
  arv: {
    planName: t("medicine.medicationReminderForm.arvReminder"),
    medicineName: t("medicine.medicationReminderForm.arv"),
    notes: t("medicine.medicationReminderForm.reminderWithWarning"),
    slots: [
      {
        slot: "evening" as MedicationSlot,
        hour: 19,
        minute: 30,
        note: t("medicine.medicationReminderForm.afterDinner"),
        quantity: "1",
      },
    ],
  },
});

function applySlotPreset(baseDate: Date, preset: any[], t: any) {
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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const today = useMemo(() => new Date(), []);

  const [planName, setPlanName] = useState(
    t("medicine.medicationReminderForm.planName")
  );
  const [medicineName, setMedicineName] = useState(
    t("medicine.medicationReminderForm.medicineName")
  );
  const [planNotes, setPlanNotes] = useState("");
  const [totalDays, setTotalDays] = useState("7");
  const [regimenType, setRegimenType] = useState<"custom" | "prep" | "arv">(
    "custom"
  );

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [slots, setSlots] = useState<SlotState[]>(() => [
    createSlotState("morning", today, t),
  ]);

  const formatDate = (date: Date) => date.toLocaleDateString("vi-VN");
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const updateSlot = useCallback((id: string, partial: Partial<SlotState>) => {
    setSlots((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
  }, []);

  const removeSlot = useCallback((id: string) => {
    setSlots((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addSlot = useCallback(
    (slot: MedicationSlot) => {
      setSlots((prev) => [...prev, createSlotState(slot, startDate, t)]);
    },
    [startDate, t]
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
      })
    );
  };

  const handlePreset = (type: "prep" | "arv") => {
    const presetConfigs = getPresetConfigs(t);
    const preset = presetConfigs[type];
    const baseDate = new Date(startDate);
    setPlanName(preset.planName);
    setMedicineName(preset.medicineName);
    setPlanNotes(preset.notes);
    setRegimenType(type);
    setSlots(applySlotPreset(baseDate, preset.slots, t));
  };

  const validateInputs = () => {
    if (!medicineName.trim()) {
      return t("medicine.medicationReminderForm.enterMedicineName");
    }
    const days = Number.parseInt(totalDays, 10);
    if (Number.isNaN(days) || days < 1 || days > 365) {
      return t("medicine.medicationReminderForm.validDays");
    }
    if (!slots.length) {
      return t("medicine.medicationReminderForm.addAtLeastOne");
    }
    return null;
  };

  const handleSave = async () => {
    const error = validateInputs();
    if (error) {
      Alert.alert(t("medicine.medicationReminderForm.missingInfo"), error);
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

      Alert.alert(
        t("medicine.medicationReminderForm.planCreated"),
        t("medicine.medicationReminderForm.scheduleSaved", {
          medicineName,
          startDate: formatDate(startDate),
          days,
        })
      );
    } catch (err) {
      console.error("createMedicationPlan failed", err);
      Alert.alert(
        t("medicine.medicationReminderForm.error"),
        t("medicine.medicationReminderForm.cannotSavePlan")
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8FAFC", paddingTop: insets.top }}
    >
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 12 }}>
          {t("medicine.medicationReminderForm.title")}
        </Text>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 4 }}>
            {t("medicine.medicationReminderForm.planName")}
          </Text>
          <TextInput
            value={planName}
            onChangeText={setPlanName}
            placeholder={t(
              "medicine.medicationReminderForm.planNamePlaceholder"
            )}
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
            }}
          />

          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            {t("medicine.medicationReminderForm.medicineName")}
          </Text>
          <TextInput
            value={medicineName}
            onChangeText={setMedicineName}
            placeholder={t(
              "medicine.medicationReminderForm.medicineNamePlaceholder"
            )}
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
            }}
          />

          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            {t("medicine.medicationReminderForm.generalNotes")}
          </Text>
          <TextInput
            value={planNotes}
            onChangeText={setPlanNotes}
            placeholder={t(
              "medicine.medicationReminderForm.generalNotesPlaceholder"
            )}
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

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 16 }}>
            {t("medicine.medicationReminderForm.startDate")}
          </Text>
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

          <Text style={{ fontWeight: "600", fontSize: 16, marginTop: 16 }}>
            {t("medicine.medicationReminderForm.numberOfDays")}
          </Text>
          <TextInput
            value={totalDays}
            onChangeText={setTotalDays}
            keyboardType="numeric"
            placeholder={t("medicine.medicationReminderForm.daysPlaceholder")}
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
              marginTop: 8,
            }}
          />

          <Text style={{ fontWeight: "600", fontSize: 16, marginTop: 16 }}>
            {t("medicine.medicationReminderForm.planType")}
          </Text>
          <View
            style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              marginTop: 8,
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={regimenType}
              onValueChange={(value) => setRegimenType(value)}
            >
              <Picker.Item
                label={t("medicine.medicationReminderForm.custom")}
                value="custom"
              />
              <Picker.Item
                label={t("medicine.medicationReminderForm.quickPrep")}
                value="prep"
              />
              <Picker.Item
                label={t("medicine.medicationReminderForm.quickArv")}
                value="arv"
              />
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
              <Text style={{ color: "white", fontWeight: "600" }}>
                {t("medicine.medicationReminderForm.applyPrepPreset")}
              </Text>
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
              <Text style={{ color: "white", fontWeight: "600" }}>
                {t("medicine.medicationReminderForm.applyArvPreset")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
            {t("medicine.medicationReminderForm.timeSlots")}
          </Text>

          {slots.map((slot) => {
            const meta = getSlotMetadata(t)[slot.slot];
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
                    <Text style={{ color: "#DC2626", fontWeight: "600" }}>
                      {t("medicine.medicationReminderForm.delete")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <InlineTimePicker
                  value={slot.time}
                  onChange={(date) => updateSlot(slot.id, { time: date })}
                  formatTime={formatTime}
                />

                <Text style={{ marginTop: 12, fontWeight: "500" }}>
                  {t("medicine.medicationReminderForm.numberOfPills")}
                </Text>
                <TextInput
                  value={slot.quantity}
                  onChangeText={(value) =>
                    updateSlot(slot.id, { quantity: value })
                  }
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

                <Text style={{ marginTop: 12, fontWeight: "500" }}>
                  {t("medicine.medicationReminderForm.notes")}
                </Text>
                <TextInput
                  value={slot.note}
                  onChangeText={(value) => updateSlot(slot.id, { note: value })}
                  placeholder={t(
                    "medicine.medicationReminderForm.notesPlaceholder"
                  )}
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
                    <Text style={{ marginTop: 12, fontWeight: "500" }}>
                      {t("medicine.medicationReminderForm.displayName")}
                    </Text>
                    <TextInput
                      value={slot.labelOverride}
                      onChangeText={(value) =>
                        updateSlot(slot.id, { labelOverride: value })
                      }
                      placeholder={t(
                        "medicine.medicationReminderForm.displayNamePlaceholder"
                      )}
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

          <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
            {t("medicine.medicationReminderForm.addTimeSlot")}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {(Object.keys(getSlotMetadata(t)) as MedicationSlot[]).map(
              (slotKey) => (
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
                    {getSlotMetadata(t)[slotKey].emoji}{" "}
                    {getSlotMetadata(t)[slotKey].label}
                  </Text>
                </TouchableOpacity>
              )
            )}
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
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
              {t("medicine.medicationReminderForm.savePlan")}
            </Text>
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

function InlineTimePicker({
  value,
  onChange,
  formatTime,
}: InlineTimePickerProps) {
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
        <DateTimePicker
          value={value}
          mode="time"
          display="default"
          onChange={handleChange}
        />
      )}
    </>
  );
}
