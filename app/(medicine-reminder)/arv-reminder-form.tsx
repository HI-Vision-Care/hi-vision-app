"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native"
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from 'expo-notifications'

import {
  scheduleArvNotifications,
  listenArvConfirm,
} from "../../services/notification/arv-notification"

// Storage key for ARV schedules
const STORAGE_KEY_ARV_SCHEDULES = "ARV_SCHEDULES"

// ARV Schedule type
export type ARVSchedule = {
  id: string
  doseTime: string
  confirmed?: boolean
  createdAt: string
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export default function ARVReminderForm() {
  const [doseDate, setDoseDate] = useState<Date>(new Date())
  const [doseTime, setDoseTime] = useState<Date>(new Date())
  const [showDoseDate, setShowDoseDate] = useState(false)
  const [showDoseTime, setShowDoseTime] = useState(false)
  const [schedules, setSchedules] = useState<ARVSchedule[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Initialize: permissions, category, listener, load schedules
  useEffect(() => {
    ;(async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Cần quyền thông báo",
          "Vui lòng bật quyền thông báo để app hoạt động tốt."
        )
        return
      }
      await loadSchedulesFromStorage()
    })()

    const subscription = listenArvConfirm(async (doseTime) => {
      await markAsConfirmed(doseTime)
      Alert.alert("✅ Cảm ơn!", "Đã ghi nhận bạn đã uống thuốc ARV.")
    })
    return () => subscription.remove()
  }, [])

  // Load schedules from storage
  const loadSchedulesFromStorage = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_ARV_SCHEDULES)
      const data: ARVSchedule[] = raw ? JSON.parse(raw) : []
      setSchedules(data)
    } catch (err) {
      console.error(err)
    }
  }

  // Save schedules to storage
  const saveSchedules = async (list: ARVSchedule[]) => {
    await AsyncStorage.setItem(STORAGE_KEY_ARV_SCHEDULES, JSON.stringify(list))
    setSchedules(list)
  }

  // Mark confirmed
  const markAsConfirmed = async (doseTime: string) => {
    const updated = schedules.map((s) =>
      s.doseTime === doseTime ? { ...s, confirmed: true } : s
    )
    await saveSchedules(updated)
  }

  // Date/Time picker handlers
  const onChangeDoseDate = (e: DateTimePickerEvent, sel?: Date) => {
    setShowDoseDate(Platform.OS === "ios")
    if (sel) setDoseDate(sel)
  }
  const onChangeDoseTime = (e: DateTimePickerEvent, sel?: Date) => {
    setShowDoseTime(Platform.OS === "ios")
    if (sel) setDoseTime(sel)
  }

  // Add schedule
  const handleAdd = async () => {
    setIsLoading(true)
    const dt = new Date(doseDate)
    dt.setHours(doseTime.getHours(), doseTime.getMinutes(), 0, 0)
    if (dt <= new Date()) {
      Alert.alert("Lỗi", "Chọn thời gian trong tương lai.")
      setIsLoading(false)
      return
    }

    const newItem: ARVSchedule = {
      id: Date.now().toString(),
      doseTime: dt.toISOString(),
      confirmed: false,
      createdAt: new Date().toISOString(),
    }
    const updated = [...schedules, newItem]
    await saveSchedules(updated)

    // Schedule notifications
    await scheduleArvNotifications(dt, false)

    Alert.alert(
      "✅ Đã lưu",
      `Nhắc ARV ${dt.toLocaleString("vi-VN")}`
    )
    setIsLoading(false)
  }

  // Delete schedule
  const handleDelete = (id: string) => {
    Alert.alert("Xóa lịch?", "Bạn có chắc muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await saveSchedules(schedules.filter((s) => s.id !== id))
        },
      },
    ])
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Đặt lịch nhắc ARV</Text>
        <TouchableOpacity  style={styles.testBtn}>
          <Text>🧪</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* Date */}
        <Text style={styles.label}>Ngày uống:</Text>
        <TouchableOpacity onPress={() => setShowDoseDate(true)} style={styles.input}>
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
        <Text style={styles.label}>Giờ uống:</Text>
        <TouchableOpacity onPress={() => setShowDoseTime(true)} style={styles.input}>
          <Text>⏰ {doseTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</Text>
        </TouchableOpacity>
        {showDoseTime && (
          <DateTimePicker value={doseTime} mode="time" display="default" onChange={onChangeDoseTime} />
        )}

        <TouchableOpacity
          onPress={handleAdd}
          disabled={isLoading}
          style={[styles.addBtn, isLoading && styles.disabledBtn]}
        >
          <Text style={styles.addText}>{isLoading ? "Đang..." : "➕ Thêm ARV"}</Text>
        </TouchableOpacity>

        <Text style={styles.subTitle}>📋 Lịch đã đặt ({schedules.length})</Text>
        {schedules.map((s) => {
          const d = new Date(s.doseTime)
          return (
            <View key={s.id} style={styles.scheduleItem}>
              <Text>{d.toLocaleString("vi-VN")} {s.confirmed ? "✅" : "⏳"}</Text>
              <TouchableOpacity onPress={() => handleDelete(s.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "bold" },
  testBtn: { padding: 8 },
  label: { marginTop: 12, marginBottom: 4, fontSize: 16, fontWeight: "500" },
  input: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 6 },
  addBtn: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 8, marginTop: 20, alignItems: "center" },
  disabledBtn: { backgroundColor: "#ccc" },
  addText: { color: "#fff", fontWeight: "bold" },
  subTitle: { fontSize: 18, marginTop: 24, marginBottom: 12 },
  scheduleItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomColor: "#eee", borderBottomWidth: 1 },
  delete: { color: "#f44336" },
})
