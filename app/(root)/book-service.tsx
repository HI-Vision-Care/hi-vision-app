import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for services and availability
const services = [
  { id: 1, name: "General Consultation", duration: 30, price: 80 },
  { id: 2, name: "Specialist Consultation", duration: 45, price: 120 },
  { id: 3, name: "Health Checkup", duration: 60, price: 150 },
  { id: 4, name: "Follow-up Visit", duration: 20, price: 50 },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

// Mock availability data (true = available, false = booked)
const mockAvailability = {
  Mon: {
    "09:00": true,
    "09:30": false,
    "10:00": true,
    "10:30": true,
    "11:00": false,
    "11:30": true,
    "14:00": true,
    "14:30": true,
    "15:00": false,
    "15:30": true,
    "16:00": true,
    "16:30": true,
    "17:00": false,
  },
  Tue: {
    "09:00": true,
    "09:30": true,
    "10:00": false,
    "10:30": true,
    "11:00": true,
    "11:30": false,
    "14:00": true,
    "14:30": false,
    "15:00": true,
    "15:30": true,
    "16:00": false,
    "16:30": true,
    "17:00": true,
  },
  Wed: {
    "09:00": false,
    "09:30": true,
    "10:00": true,
    "10:30": false,
    "11:00": true,
    "11:30": true,
    "14:00": false,
    "14:30": true,
    "15:00": true,
    "15:30": false,
    "16:00": true,
    "16:30": true,
    "17:00": true,
  },
  Thu: {
    "09:00": true,
    "09:30": true,
    "10:00": true,
    "10:30": true,
    "11:00": false,
    "11:30": true,
    "14:00": true,
    "14:30": true,
    "15:00": true,
    "15:30": true,
    "16:00": false,
    "16:30": true,
    "17:00": true,
  },
  Fri: {
    "09:00": true,
    "09:30": false,
    "10:00": true,
    "10:30": true,
    "11:00": true,
    "11:30": false,
    "14:00": true,
    "14:30": true,
    "15:00": true,
    "15:30": false,
    "16:00": true,
    "16:30": true,
    "17:00": true,
  },
  Sat: {
    "09:00": true,
    "09:30": true,
    "10:00": false,
    "10:30": true,
    "11:00": true,
    "11:30": true,
    "14:00": false,
    "14:30": false,
    "15:00": true,
    "15:30": true,
    "16:00": true,
    "16:30": false,
    "17:00": false,
  },
  Sun: {
    "09:00": false,
    "09:30": false,
    "10:00": false,
    "10:30": false,
    "11:00": false,
    "11:30": false,
    "14:00": false,
    "14:30": false,
    "15:00": false,
    "15:30": false,
    "16:00": false,
    "16:30": false,
    "17:00": false,
  },
};

export default function BookingScreen() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  const getDatesForWeek = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getDatesForWeek(currentWeekStart);

  const handleBooking = () => {
    if (selectedService && selectedDay && selectedTime) {
      // Handle booking logic here
      alert(
        `Booking confirmed!\nService: ${selectedService.name}\nDay: ${selectedDay}\nTime: ${selectedTime}`
      );
    } else {
      alert("Please select a service, day, and time slot.");
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newDate);
    setSelectedDay(weekDays[0]);
    setSelectedTime(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">
            Book Appointment
          </Text>
          <TouchableOpacity>
            <Ionicons name="calendar-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Doctor Info */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
              <Ionicons name="person" size={32} color="#3b82f6" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">
                Dr. Sarah Johnson
              </Text>
              <Text className="text-gray-600">Cardiologist</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text className="text-sm text-gray-600 ml-1">
                  4.9 (127 reviews)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Service Selection */}
        <View className="mx-4 mt-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Select Service
          </Text>
          <View className="space-y-3">
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                onPress={() => setSelectedService(service)}
                className={`p-4 rounded-xl border-2 ${
                  selectedService?.id === service.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text
                      className={`font-semibold ${
                        selectedService?.id === service.id
                          ? "text-blue-700"
                          : "text-gray-900"
                      }`}
                    >
                      {service.name}
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1">
                      {service.duration} minutes
                    </Text>
                  </View>
                  <Text
                    className={`font-bold ${
                      selectedService?.id === service.id
                        ? "text-blue-700"
                        : "text-gray-900"
                    }`}
                  >
                    ${service.price}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Week Navigation */}
        <View className="mx-4 mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Select Date & Time
            </Text>
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => navigateWeek(-1)}
                className="p-2 rounded-full bg-gray-100"
              >
                <Ionicons name="chevron-back" size={20} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigateWeek(1)}
                className="p-2 rounded-full bg-gray-100"
              >
                <Ionicons name="chevron-forward" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Week Days */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row space-x-3">
              {weekDays.map((day, index) => {
                const date = weekDates[index];
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isSelected = selectedDay === day;

                return (
                  <TouchableOpacity
                    key={day}
                    onPress={() => {
                      setSelectedDay(day);
                      setSelectedTime(null);
                    }}
                    className={`items-center p-3 rounded-xl min-w-[70px] ${
                      isSelected
                        ? "bg-blue-500"
                        : isToday
                        ? "bg-blue-100 border-2 border-blue-300"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isSelected
                          ? "text-white"
                          : isToday
                          ? "text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      {day}
                    </Text>
                    <Text
                      className={`text-lg font-bold mt-1 ${
                        isSelected
                          ? "text-white"
                          : isToday
                          ? "text-blue-700"
                          : "text-gray-900"
                      }`}
                    >
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Time Slots */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <Text className="font-semibold text-gray-900 mb-3">
              Available Times
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {timeSlots.map((time) => {
                const isAvailable = mockAvailability[selectedDay]?.[time];
                const isSelected = selectedTime === time;

                return (
                  <TouchableOpacity
                    key={time}
                    onPress={() => isAvailable && setSelectedTime(time)}
                    disabled={!isAvailable}
                    className={`px-4 py-3 rounded-lg border ${
                      isSelected
                        ? "bg-blue-500 border-blue-500"
                        : isAvailable
                        ? "bg-white border-gray-300"
                        : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        isSelected
                          ? "text-white"
                          : isAvailable
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Booking Summary */}
        {selectedService && selectedDay && selectedTime && (
          <View className="mx-4 mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <Text className="font-bold text-blue-900 mb-2">
              Booking Summary
            </Text>
            <View className="space-y-1">
              <Text className="text-blue-800">
                Service: {selectedService.name}
              </Text>
              <Text className="text-blue-800">
                Date: {selectedDay},{" "}
                {weekDates[weekDays.indexOf(selectedDay)]?.toLocaleDateString()}
              </Text>
              <Text className="text-blue-800">Time: {selectedTime}</Text>
              <Text className="text-blue-800">
                Duration: {selectedService.duration} minutes
              </Text>
              <Text className="font-bold text-blue-900 mt-2">
                Total: ${selectedService.price}
              </Text>
            </View>
          </View>
        )}

        {/* Book Button */}
        <View className="mx-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={handleBooking}
            className={`py-4 rounded-xl ${
              selectedService && selectedDay && selectedTime
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
            disabled={!selectedService || !selectedDay || !selectedTime}
          >
            <Text
              className={`text-center font-bold text-lg ${
                selectedService && selectedDay && selectedTime
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              Book Appointment
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
