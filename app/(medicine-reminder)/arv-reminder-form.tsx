"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { WidgetManager } from "@/native/WidgetManager";
import { createMedicationPlan } from "@/services/medication/scheduler";
import { requestNotificationPermissions } from "@/services/notification/prep-notification";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function ARVReminderForm() {
  const { t } = useTranslation();
  const [doseDate, setDoseDate] = useState<Date>(new Date());
  const [doseTime, setDoseTime] = useState<Date>(new Date());
  const [numberOfDays, setNumberOfDays] = useState<string>("7"); // Số ngày uống thuốc
  const [showDoseDate, setShowDoseDate] = useState(false);
  const [showDoseTime, setShowDoseTime] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Date/Time picker handlers
  const onChangeDoseDate = (e: DateTimePickerEvent, sel?: Date) => {
    setShowDoseDate(Platform.OS === "ios");
    if (sel) setDoseDate(sel);
  };
  const onChangeDoseTime = (e: DateTimePickerEvent, sel?: Date) => {
    setShowDoseTime(Platform.OS === "ios");
    if (sel) setDoseTime(sel);
  };

  // Add schedule
  const handleAdd = async () => {
    setIsLoading(true);

    const days = parseInt(numberOfDays);
    if (isNaN(days) || days <= 0) {
      Alert.alert(
        t("medicine.arvReminderForm.error"),
        t("medicine.arvReminderForm.validDays")
      );
      setIsLoading(false);
      return;
    }

    const startDate = new Date(doseDate);
    startDate.setHours(0, 0, 0, 0); // Reset to start of day

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate.getTime() < today.getTime()) {
      Alert.alert(
        t("medicine.arvReminderForm.error"),
        t("medicine.arvReminderForm.selectFromToday")
      );
      setIsLoading(false);
      return;
    }

    try {
      if (!(await requestNotificationPermissions())) {
        setIsLoading(false);
        return;
      }

      await createMedicationPlan({
        name: t("medicine.arvReminderForm.arvSchedule", {
          date: startDate.toLocaleDateString("vi-VN"),
        }),
        medicineName: t("medicine.arvReminderForm.arv"),
        regimenType: "arv",
        notes: t("medicine.arvReminderForm.quickArvReminder"),
        startDate,
        totalDays: days,
        slots: [
          {
            slot: "evening",
            time: doseTime,
            note: t("medicine.arvReminderForm.remindArv"),
            quantity: 1,
          },
        ],
      });

      if (Platform.OS === "android") {
        WidgetManager.requestPinWidget();
      }

      Alert.alert(
        t("medicine.arvReminderForm.saved"),
        t("medicine.arvReminderForm.arvScheduleCreated", {
          days,
          startDate: startDate.toLocaleDateString("vi-VN"),
          time: doseTime.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })
      );
    } catch (error) {
      Alert.alert(
        t("medicine.arvReminderForm.error"),
        t("medicine.arvReminderForm.cannotCreateSchedule")
      );
      console.error("Error creating schedule:", error);
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("medicine.arvReminderForm.title")}</Text>
      </View>

      <ScrollView>
        {/* Start Date */}
        <Text style={styles.label}>
          {t("medicine.arvReminderForm.startDate")}
        </Text>
        <TouchableOpacity
          onPress={() => setShowDoseDate(true)}
          style={styles.input}
        >
          <Text>📅 {doseDate.toLocaleDateString("vi-VN")}</Text>
        </TouchableOpacity>
        {showDoseDate && (
          <DateTimePicker
            value={doseDate}
            mode="date"
            display="default"
            onChange={onChangeDoseDate}
            minimumDate={new Date()}
          />
        )}

        {/* Time */}
        <Text style={styles.label}>
          {t("medicine.arvReminderForm.timeToTake")}
        </Text>
        <TouchableOpacity
          onPress={() => setShowDoseTime(true)}
          style={styles.input}
        >
          <Text>
            ⏰{" "}
            {doseTime.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {showDoseTime && (
          <DateTimePicker
            value={doseTime}
            mode="time"
            display="default"
            onChange={onChangeDoseTime}
          />
        )}

        {/* Number of Days */}
        <Text style={styles.label}>
          {t("medicine.arvReminderForm.numberOfDays")}
        </Text>
        <TextInput
          style={styles.input}
          value={numberOfDays}
          onChangeText={setNumberOfDays}
          keyboardType="numeric"
          placeholder={t("medicine.arvReminderForm.enterDays")}
        />

        <TouchableOpacity
          onPress={handleAdd}
          disabled={isLoading}
          style={[styles.addBtn, isLoading && styles.disabledBtn]}
        >
          <Text style={styles.addText}>
            {isLoading
              ? t("medicine.arvReminderForm.creatingSchedule")
              : t("medicine.arvReminderForm.createSchedule", {
                  days: numberOfDays,
                })}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  label: { marginTop: 12, marginBottom: 4, fontSize: 16, fontWeight: "500" },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    color: "#333",
  },
  addBtn: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#ccc" },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
