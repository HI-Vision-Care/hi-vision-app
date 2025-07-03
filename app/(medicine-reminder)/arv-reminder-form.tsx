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
  TextInput,
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
const ARV_SCHEDULES_KEY = "arv_schedules"

// ARV Schedule type
export type ARVSchedule = {
  id: string
  doseTime: string
  confirmed?: boolean
  createdAt: string
  dayNumber?: number // Thêm để track ngày thứ mấy
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
  const [numberOfDays, setNumberOfDays] = useState<string>("7") // Số ngày uống thuốc
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
      await loadSchedules()
    })()

    const subscription = listenArvConfirm(async (doseTime) => {
      await markAsConfirmed(doseTime)
      Alert.alert("✅ Cảm ơn!", "Đã ghi nhận bạn đã uống thuốc ARV.")
    })
    return () => subscription.remove()
  }, [])

  // Load schedules from storage
  const loadSchedules = async () => {
    try {
      const stored = await AsyncStorage.getItem(ARV_SCHEDULES_KEY)
      if (stored) {
        setSchedules(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading schedules:", error)
    }
  }

  // Save schedules to storage
  const saveSchedules = async (newSchedules: ARVSchedule[]) => {
    try {
      await AsyncStorage.setItem(ARV_SCHEDULES_KEY, JSON.stringify(newSchedules))
      setSchedules(newSchedules)
    } catch (error) {
      console.error("Error saving schedules:", error)
    }
  }

  // Generate daily schedule for multiple days
  const generateDailySchedule = (startDate: Date, timeOfDay: Date, days: number): ARVSchedule[] => {
    const scheduleList: ARVSchedule[] = []
    
    for (let i = 0; i < days; i++) {
      const scheduleDate = new Date(startDate)
      scheduleDate.setDate(startDate.getDate() + i)
      scheduleDate.setHours(timeOfDay.getHours(), timeOfDay.getMinutes(), 0, 0)
      
      const schedule: ARVSchedule = {
        id: `${Date.now()}_${i}`,
        doseTime: scheduleDate.toISOString(),
        confirmed: false,
        createdAt: new Date().toISOString(),
        dayNumber: i + 1
      }
      
      scheduleList.push(schedule)
    }
    
    return scheduleList
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
    
    const days = parseInt(numberOfDays)
    if (isNaN(days) || days <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số ngày hợp lệ (lớn hơn 0).")
      setIsLoading(false)
      return
    }

    const startDate = new Date(doseDate)
    startDate.setHours(0, 0, 0, 0) // Reset to start of day
    
    // if (startDate < new Date().setHours(0, 0, 0, 0)) {
    //   Alert.alert("Lỗi", "Chọn ngày bắt đầu từ hôm nay trở đi.")
    //   setIsLoading(false)
    //   return
    // }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (startDate.getTime() < today.getTime()) {
      Alert.alert("Lỗi", "Chọn ngày bắt đầu từ hôm nay trở đi.")
      setIsLoading(false)
      return
    }

    try {
      // Generate daily schedules
      const newSchedules = generateDailySchedule(startDate, doseTime, days)
      const updated = [...schedules, ...newSchedules]
      
      // Schedule notifications for each day
      for (const schedule of newSchedules) {
        const notificationDate = new Date(schedule.doseTime)
        if (notificationDate > new Date()) {
          await scheduleArvNotifications(notificationDate, false)
        }
      }
      
      await saveSchedules(updated)
      
      Alert.alert(
        "✅ Đã lưu",
        `Đã tạo lịch nhắc ARV cho ${days} ngày\nBắt đầu: ${startDate.toLocaleDateString("vi-VN")}\nGiờ uống: ${doseTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
      )
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo lịch nhắc. Vui lòng thử lại.")
      console.error("Error creating schedule:", error)
    }
    
    setIsLoading(false)
  }

  // Delete schedule
  const handleDelete = async (id: string) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa lịch nhắc này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            const updated = schedules.filter(s => s.id !== id)
            await saveSchedules(updated)
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Đặt lịch nhắc ARV</Text>
        <TouchableOpacity style={styles.testBtn}>
          <Text>🧪</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {/* Start Date */}
        <Text style={styles.label}>Ngày bắt đầu:</Text>
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

        {/* Number of Days */}
        <Text style={styles.label}>Số ngày uống thuốc:</Text>
        <TextInput
          style={styles.input}
          value={numberOfDays}
          onChangeText={setNumberOfDays}
          keyboardType="numeric"
          placeholder="Nhập số ngày (ví dụ: 7, 14, 30)"
        />

        <TouchableOpacity
          onPress={handleAdd}
          disabled={isLoading}
          style={[styles.addBtn, isLoading && styles.disabledBtn]}
        >
          <Text style={styles.addText}>
            {isLoading ? "Đang tạo lịch..." : `➕ Tạo lịch ${numberOfDays} ngày`}
          </Text>
        </TouchableOpacity>

        {/* Schedules List */}
        {schedules.length > 0 && (
          <>
            <Text style={styles.subTitle}>📅 Lịch đã tạo ({schedules.length}):</Text>
            {schedules
              .sort((a, b) => new Date(a.doseTime).getTime() - new Date(b.doseTime).getTime())
              .map((schedule) => (
                <View key={schedule.id} style={styles.scheduleItem}>
                  <View style={styles.scheduleInfo}>
                    <Text style={[styles.scheduleText, schedule.confirmed && styles.confirmedText]}>
                      {schedule.dayNumber && `Ngày ${schedule.dayNumber}: `}
                      {new Date(schedule.doseTime).toLocaleString("vi-VN")}
                    </Text>
                    {schedule.confirmed && <Text style={styles.confirmedBadge}>✅ Đã uống</Text>}
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(schedule.id)}>
                    <Text style={styles.delete}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </>
        )}
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
  input: { 
    backgroundColor: "#f5f5f5", 
    padding: 12, 
    borderRadius: 6,
    fontSize: 16,
    color: "#333"
  },
  addBtn: { backgroundColor: "#4CAF50", padding: 14, borderRadius: 8, marginTop: 20, alignItems: "center" },
  disabledBtn: { backgroundColor: "#ccc" },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  subTitle: { fontSize: 18, marginTop: 24, marginBottom: 12, fontWeight: "600" },
  scheduleItem: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingVertical: 12, 
    paddingHorizontal: 8,
    borderBottomColor: "#eee", 
    borderBottomWidth: 1,
    backgroundColor: "#fafafa",
    marginBottom: 4,
    borderRadius: 6
  },
  scheduleInfo: { flex: 1 },
  scheduleText: { fontSize: 14, color: "#333" },
  confirmedText: { textDecorationLine: "line-through", color: "#888" },
  confirmedBadge: { fontSize: 12, color: "#4CAF50", marginTop: 2 },
  delete: { color: "#f44336", fontSize: 18, padding: 8 },
})