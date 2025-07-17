"use client"

import { cancelAllArvNotifications, clearAllConfirmedDoses } from "@/services/notification/arv-notification"
import { cancelAll } from "@/services/notification/prep-notification"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import * as Notifications from "expo-notifications"
import { navigate } from "expo-router/build/global-state/routing"
import { useCallback, useEffect, useMemo, useState } from "react"


import { router } from "expo-router"
import { Alert, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Types for better organization
type NotificationEvent = {
  id: string
  time: Date
  type: "countdown" | "reminder" | "warning"
  title: string
  body: string
  doseTime?: string
}

type ConfirmedEvent = {
  id: string
  time: Date
  type: "confirmed"
  title: string
  body: string
}

type MedicationEvent = NotificationEvent | ConfirmedEvent

type DayData = {
  date: number
  month: number
  year: number
  dayName: string
  isToday: boolean
  isSelected: boolean
  events: MedicationEvent[]
  confirmedCount: number
  pendingCount: number
  fullDate: Date
}

const MedicineCalendar = () => {
  const today = useMemo(() => new Date(), [])
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // Tính ngày đầu tuần (Thứ 2)
    const date = new Date(today)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Điều chỉnh để Thứ 2 là ngày đầu tuần
    return new Date(date.setDate(diff))
  })

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return today.toDateString()
  })

  const [confirmedDoses, setConfirmedDoses] = useState<string[]>([])
  const [dayData, setDayData] = useState<DayData[]>([])

  const ARV_CATEGORY = "ARV_REMINDER_CATEGORY"

  // Tạo chuỗi hiển thị tuần hiện tại
  const currentWeekDisplay = useMemo(() => {
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(currentWeekStart.getDate() + 6)

    const startStr = currentWeekStart.toLocaleDateString("vi-VN")
    const endStr = weekEnd.toLocaleDateString("vi-VN")

    // Kiểm tra xem tuần hiện tại có chứa hôm nay không
    const todayTime = today.getTime()
    const weekStartTime = currentWeekStart.getTime()
    const weekEndTime = weekEnd.getTime()

    if (todayTime >= weekStartTime && todayTime <= weekEndTime) {
      return `Tuần này, ${startStr} - ${endStr}`
    } else {
      return `${startStr} - ${endStr}`
    }
  }, [currentWeekStart, today])

  // Load confirmed doses from AsyncStorage
  const loadConfirmedDoses = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("confirmedDoses")
      if (stored) {
        const arr: string[] = JSON.parse(stored)
        setConfirmedDoses(arr)
      } else {
        setConfirmedDoses([])
      }
    } catch (error) {
      console.error("Error loading confirmed doses:", error)
    }
  }, [])

  // Tạo dữ liệu tuần
  const generateWeekData = useCallback(async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync()
      const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
      const weekData: DayData[] = []

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(currentWeekStart)
        currentDate.setDate(currentWeekStart.getDate() + i)

        const date = currentDate.getDate()
        const month = currentDate.getMonth()
        const year = currentDate.getFullYear()
        const dayName = weekDays[i]

        // Kiểm tra xem có phải hôm nay không
        const isToday = currentDate.toDateString() === today.toDateString()

        // Kiểm tra xem có được chọn không
        const isSelected = currentDate.toDateString() === selectedDate

        // Get scheduled notifications for this date
        const dayNotifications: NotificationEvent[] = scheduled
          .map((item): NotificationEvent | null => {
            const trig = item.trigger as any
            const raw = trig.date ?? trig.value
            if (!raw) return null

            const time = new Date(raw)
            if (time.toDateString() !== currentDate.toDateString()) return null

            // Determine notification type based on content
            let type: "countdown" | "reminder" | "warning" = "reminder"
            if (item.content.title?.includes("Countdown")) type = "countdown"
            else if (item.content.title?.includes("Warning")) type = "warning"

            return {
              id: item.identifier,
              time,
              type,
              title: item.content.title || "",
              body: item.content.body || "",
              doseTime: item.content.data?.doseTime as string | undefined,
            }
          })
          .filter((item): item is NotificationEvent => item !== null)

        // Get confirmed doses for this date
        const dayConfirmed: ConfirmedEvent[] = confirmedDoses
          .map((doseStr) => new Date(doseStr))
          .filter((doseDate) => doseDate.toDateString() === currentDate.toDateString())
          .map(
            (doseDate): ConfirmedEvent => ({
              id: `confirmed-${doseDate.getTime()}`,
              time: doseDate,
              type: "confirmed",
              title: "✅ Đã uống",
              body: "Đã xác nhận uống thuốc",
            }),
          )

        // Combine and sort all events
        const allEvents: MedicationEvent[] = [...dayNotifications, ...dayConfirmed].sort(
          (a, b) => a.time.getTime() - b.time.getTime(),
        )

        weekData.push({
          date,
          month,
          year,
          dayName,
          isToday,
          isSelected,
          events: allEvents,
          confirmedCount: dayConfirmed.length,
          pendingCount: dayNotifications.length,
          fullDate: new Date(currentDate),
        })
      }

      setDayData(weekData)
    } catch (error) {
      console.error("Error loading medication data:", error)
    }
  }, [confirmedDoses, selectedDate, currentWeekStart, today])

  useEffect(() => {
    loadConfirmedDoses()
  }, [loadConfirmedDoses])

  useEffect(() => {
    generateWeekData()
  }, [generateWeekData])

  useFocusEffect(
    useCallback(() => {
      loadConfirmedDoses()
      generateWeekData()
    }, [loadConfirmedDoses, generateWeekData]),
  )

  // Điều hướng tuần trước
  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newWeekStart)
  }

  // Điều hướng tuần sau
  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newWeekStart)
  }

  const handleDatePress = (dayData: DayData) => {
    setSelectedDate(dayData.fullDate.toDateString())
  }

  const handleCreateReminder = () => {
    navigate("/(medicine-reminder)/add-reminder")
  }

  const handleHomePress = () => {
    router.push("/(root)/(tabs)/home")
  }

  const getSelectedDayData = () => {
    return dayData.find((day) => day.isSelected)
  }

  const getEventIcon = (type: MedicationEvent["type"]) => {
    switch (type) {
      case "countdown":
        return "⏳"
      case "reminder":
        return "💊"
      case "warning":
        return "⚠️"
      case "confirmed":
        return "✅"
      default:
        return "📋"
    }
  }

  const getEventColor = (type: MedicationEvent["type"]) => {
    switch (type) {
      case "countdown":
        return { bg: "#E3F2FD", text: "#1976D2", border: "#2196F3" }
      case "reminder":
        return { bg: "#F3E5F5", text: "#7B1FA2", border: "#9C27B0" }
      case "warning":
        return { bg: "#FFEBEE", text: "#C62828", border: "#F44336" }
      case "confirmed":
        return { bg: "#E8F5E8", text: "#2E7D32", border: "#4CAF50" }
      default:
        return { bg: "#F5F5F5", text: "#424242", border: "#9E9E9E" }
    }
  }

  const selectedDayData = getSelectedDayData()

  const logAllArvSchedules = async (): Promise<void> => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
      const arvNotifications = scheduledNotifications.filter(
        (notification) =>
          notification.content.categoryIdentifier === ARV_CATEGORY ||
          (notification.content.title && notification.content.title.includes("ARV")),
      )

      if (arvNotifications.length === 0) {
        console.log("Không có lịch thông báo ARV nào được đặt!")
        Alert.alert("Log ARV", "Không có lịch thông báo ARV nào được đặt!")
        return
      }

      console.log(`Đang có ${arvNotifications.length} lịch thông báo ARV đã đặt:`)
      arvNotifications.forEach((n, i) => {
        console.log(`[${i + 1}] id=${n.identifier}, title=${n.content.title}, trigger=`, n.trigger)
      })

      Alert.alert("Log ARV", `Có ${arvNotifications.length} lịch ARV. Xem chi tiết ở log console.`)
    } catch (error) {
      console.error("Lỗi khi log lịch ARV:", error)
      Alert.alert("Log ARV", "Lỗi khi log lịch ARV. Xem log console!")
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#3B82F6" }} edges={["top", "left", "right"]}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#3B82F6",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          height: 60,
        }}
      >
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleHomePress}
        >
          <Text style={{ fontSize: 24, color: "white" }}>🏠</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>Lịch uống thuốc</Text>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#3B82F6" }}>!</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Date Navigation */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={goToPreviousWeek}
        >
          <Text style={{ fontSize: 24, color: "#666" }}>‹</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#3B82F6" }}>{currentWeekDisplay}</Text>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={goToNextWeek}
        >
          <Text style={{ fontSize: 24, color: "#666" }}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Week Calendar with Event Indicators */}
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {dayData.map((day, index) => (
            <View key={index} style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>{day.dayName}</Text>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: day.isSelected ? "#3B82F6" : day.isToday ? "#E3F2FD" : "transparent",
                  position: "relative",
                }}
                onPress={() => handleDatePress(day)}
              >
                <Text
                  style={{
                    color: day.isSelected ? "white" : day.isToday ? "#1976D2" : "#333",
                    fontSize: 16,
                    fontWeight: day.isToday ? "bold" : "600",
                  }}
                >
                  {day.date}
                </Text>
                {/* Event indicators */}
                {day.events.length > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: -8,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {day.confirmedCount > 0 && (
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#4CAF50",
                          marginHorizontal: 1,
                        }}
                      />
                    )}
                    {day.pendingCount > 0 && (
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#FF9800",
                          marginHorizontal: 1,
                        }}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Content Area */}
      <View style={{ flex: 1, backgroundColor: "#F5F5F5", paddingHorizontal: 16 }}>
        {!selectedDayData || selectedDayData.events.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 32,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#666",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Ngày này chưa có lịch nhắc uống thuốc
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#999",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              Hãy <Text style={{ color: "#3B82F6", fontWeight: "600" }}>Tạo lịch nhắc uống thuốc</Text> mới
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#3B82F6",
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 24,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={handleCreateReminder}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>Tạo lịch nhắc</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 16 }}>
            {/* Summary Card */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: 12,
                }}
              >
                📊 Tổng quan ngày {selectedDayData.date}/{selectedDayData.month + 1}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#4CAF50",
                    }}
                  >
                    {selectedDayData.confirmedCount}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#666" }}>Đã uống</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#FF9800",
                    }}
                  >
                    {selectedDayData.pendingCount}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#666" }}>Chờ uống</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#2196F3",
                    }}
                  >
                    {selectedDayData.events.length}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#666" }}>Tổng cộng</Text>
                </View>
              </View>
            </View>

            {/* Events Timeline */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: 16,
                }}
              >
                📅 Lịch trình chi tiết
              </Text>
              {selectedDayData.events.map((event, index) => {
                const colors = getEventColor(event.type)
                return (
                  <View
                    key={event.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: index < selectedDayData.events.length - 1 ? 16 : 0,
                    }}
                  >
                    {/* Timeline indicator */}
                    <View style={{ alignItems: "center", marginRight: 12 }}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: colors.bg,
                          borderWidth: 2,
                          borderColor: colors.border,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{getEventIcon(event.type)}</Text>
                      </View>
                      {index < selectedDayData.events.length - 1 && (
                        <View
                          style={{
                            width: 2,
                            height: 24,
                            backgroundColor: "#E0E0E0",
                            marginTop: 4,
                          }}
                        />
                      )}
                    </View>
                    {/* Event content */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: colors.text,
                          }}
                        >
                          {event.time.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                        <View
                          style={{
                            backgroundColor: colors.bg,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 12,
                            marginLeft: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "500",
                              color: colors.text,
                            }}
                          >
                            {event.type.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#333",
                          marginBottom: 2,
                        }}
                      >
                        {event.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#666" }}>{event.body}</Text>
                    </View>
                  </View>
                )
              })}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={{
                backgroundColor: "#4CAF50",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                marginBottom: 16,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={handleCreateReminder}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>➕ Thêm lịch nhắc mới</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{
                backgroundColor: "#FF5722",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                marginBottom: 16,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={cancelAllArvNotifications}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>🗑️ Xóa lịch ARV</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={{
                backgroundColor: "#F44336",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                marginBottom: 16,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={cancelAll}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>🗑️ Xóa hết lịch</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{
                backgroundColor: "#2196F3",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                marginBottom: 32,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={logAllArvSchedules}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>📋 Log ra ARV</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity
              style={{
                backgroundColor: "#f44336",
                borderRadius: 12,
                padding: 16,
                alignItems: "center",
                marginVertical: 8,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
              onPress={clearAllConfirmedDoses}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
                🗑️ Xóa tất cả xác nhận đã uống
              </Text>
            </TouchableOpacity> */}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  )
}

export default MedicineCalendar
