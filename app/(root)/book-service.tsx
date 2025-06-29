import {
  BookButton,
  BookingSummary,
  ChooseDoctor,
  HeaderBack,
  ServiceSelection,
  WeekNavigation,
} from "@/components";
import TimeSlots from "@/components/booking/TimeSlot";
import { weekDays } from "@/constants";
import { useGetWorkShiftsWeek } from "@/services/booking-services/hooks";
import { useGetDoctors } from "@/services/doctor/hooks";
import { Doctor } from "@/services/doctor/types";
import { Service } from "@/types/type";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type AvailabilityMap = Record<string, Record<string, string>>;

export default function BookingScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const initialService: Service | null = data
    ? JSON.parse(decodeURIComponent(data))
    : null;

  const [selectedService, setSelectedService] = useState<Service | null>(
    initialService
  );
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const today = new Date();
    const todayName = weekDays[today.getDay()];
    return todayName;
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Bác sĩ
  const {
    data: doctors,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useGetDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Tuần hiện tại (thứ Hai)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const dow = today.getDay();
    const offset = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(today.getDate() + offset);
    return monday;
  });

  // Danh sách các ngày trong tuần
  const getDatesForWeek = (start: Date) =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  const weekDates = getDatesForWeek(currentWeekStart);

  // Ngày được chọn
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // reset selectedDate khi tuần đổi
  useEffect(() => {
    setSelectedDate(currentWeekStart);
  }, [currentWeekStart]);
  // Lấy ISO string của ngày để gọi API
  const selectedDateParam = selectedDate.toISOString().split("T")[0];

  const {
    data: shifts = [],
    isLoading: shiftsLoading,
    error: shiftsError,
  } = useGetWorkShiftsWeek(selectedDateParam, selectedDoctor?.doctorID);

  // Các slot cho ngày đang chọn
  const timeSlotsList = useMemo(
    () =>
      shifts
        .filter((s) => weekDays[new Date(s.date).getDay()] === selectedDay)
        .map((s) => s.slot),
    [shifts, selectedDay]
  );

  // Bản đồ availability status
  const availability = useMemo(() => {
    const map: AvailabilityMap = {};
    weekDates.forEach((date) => {
      const dayName = weekDays[date.getDay()];
      map[dayName] = {};
    });
    shifts.forEach((s) => {
      const dayName = weekDays[new Date(s.date).getDay()];
      map[dayName] = map[dayName] || {};
      map[dayName][s.slot] = s.status;
    });
    return map;
  }, [shifts, weekDates]);

  // Điều hướng tuần
  const navigateWeek = (dir: number) => {
    const next = new Date(currentWeekStart);
    next.setDate(currentWeekStart.getDate() + dir * 7);
    setCurrentWeekStart(next);
    const newDayName = weekDays[next.getDay()];
    setSelectedDay(newDayName);
    setSelectedTime(null);
  };

  const handleSelectDay = (day: string, idx: number) => {
    setSelectedDay(day);
    setSelectedTime(null);
    setSelectedDate(weekDates[idx]);
  };

  // Đặt lịch
  const handleBooking = () => {
    if (selectedService && selectedDay && selectedTime && selectedDoctor) {
      Alert.alert(
        "Booking confirmed!",
        `Service: ${selectedService.name}\nDoctor: ${selectedDoctor.name}\nDay: ${selectedDay}\nTime: ${selectedTime}`
      );
      // TODO: gọi API bookService với doctorID, date, slot...
    } else {
      Alert.alert("Vui lòng chọn đầy đủ service, bác sĩ, ngày và khung giờ.");
    }
  };
  console.log(availability);
  console.log(selectedDateParam);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <HeaderBack title="Book Appointment" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ChooseDoctor
          doctors={doctors}
          isLoading={doctorsLoading}
          error={doctorsError as Error | null}
          selectedDoctor={selectedDoctor}
          onSelectDoctor={setSelectedDoctor}
        />

        <ServiceSelection
          services={selectedService ? [selectedService] : []}
          selectedServiceId={selectedService?.serviceID ?? null}
          onSelect={setSelectedService}
        />

        <WeekNavigation
          weekDates={weekDates}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          onPrevWeek={() => navigateWeek(-1)}
          onNextWeek={() => navigateWeek(1)}
        />

        {shiftsLoading ? (
          <View className="items-center py-4">
            <ActivityIndicator />
            <Text>Loading availability...</Text>
          </View>
        ) : shiftsError ? (
          <Text className="text-red-500 text-center py-4">
            Lỗi tải lịch: {shiftsError.message}
          </Text>
        ) : null}

        <TimeSlots
          timeSlots={timeSlotsList}
          availability={availability}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />

        {selectedService && selectedDay && selectedTime ? (
          <>
            <BookingSummary
              service={selectedService}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              weekDates={weekDates}
            />
            <BookButton onBook={handleBooking} disabled={false} />
          </>
        ) : (
          <BookButton onBook={handleBooking} disabled />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
