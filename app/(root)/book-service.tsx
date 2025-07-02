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
import { usePatientProfile } from "@/hooks/usePatientId";
import {
  useBookAppointment,
  useGetWorkShiftsWeek,
} from "@/services/booking-services/hooks";
import { Doctor } from "@/services/doctor/types";
import { useDoctorsBySpecialty } from "@/services/medical-services/hooks";
import { Service } from "@/types/type";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type AvailabilityMap = Record<string, Record<string, string>>;

export default function BookingScreen() {
  const { data: profile } = usePatientProfile();
  const patientId = profile?.patientID;

  const { data } = useLocalSearchParams<{ data: string }>();
  const [isAnonymous, setIsAnonymous] = useState(false);
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

  const [note, setNote] = useState("");

  // Bác sĩ
  const {
    data: doctors,
    isLoading: doctorsLoading,
    error: doctorsError,
  } = useDoctorsBySpecialty(selectedService?.specialty || "");

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const bookAppointmentMutation = useBookAppointment(patientId ?? ""); // fallback to empty string if undefined

  // const bookAppointmentMutation = useBookAppointment(patientId);

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
  const pad = (n: number) => n.toString().padStart(2, "0");
  const selectedDateParam =
    selectedDate.getFullYear() +
    "-" +
    pad(selectedDate.getMonth() + 1) +
    "-" +
    pad(selectedDate.getDate());

  const {
    data: shifts = [],
    isLoading: shiftsLoading,
    error: shiftsError,
  } = useGetWorkShiftsWeek(selectedDateParam, selectedDoctor?.doctorID);

  // Các slot cho ngày đang chọn
  const selectedISO = selectedDate.toISOString().slice(0, 10);

  const timeSlotsList = useMemo(
    () =>
      shifts
        .filter(
          (s) => new Date(s.date).toISOString().slice(0, 10) === selectedISO
        )
        .map((s) => s.slot),
    [shifts, selectedISO]
  );
  // Bản đồ availability status
  const availability = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    weekDates.forEach((date) => {
      const iso = date.toISOString().slice(0, 10); // yyyy-mm-dd
      map[iso] = {};
    });
    shifts.forEach((s) => {
      const iso = new Date(s.date).toISOString().slice(0, 10);
      map[iso] = map[iso] || {};
      map[iso][s.slot] = s.status;
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
      const [startTime] = selectedTime.split(" - "); // "09:00"
      const [hours, minutes] = startTime.split(":");
      const localDate = new Date(selectedDate); // Clone để không ảnh hưởng state
      localDate.setHours(Number(hours), Number(minutes), 0, 0);

      // Cộng thêm phần offset chênh lệch múi giờ (UTC+7 thành 0)
      const offsetMs = localDate.getTimezoneOffset() * 60 * 1000;
      const utcDate = new Date(localDate.getTime() - offsetMs);
      const appointmentDate = utcDate.toISOString(); // Chuẩn Z

      // Hoặc chỉ cần:

      bookAppointmentMutation.mutate(
        {
          serviceID: selectedService.serviceID,
          doctorID: selectedDoctor.doctorID,
          appointmentDate: appointmentDate,
          isAnonymous: isAnonymous,
          note: note,
        },
        {
          onSuccess: () => {
            Alert.alert("Scheduled successfully!");
            router.replace("/(personal-info)/history");
          },
          onError: (error: any) => {
            Alert.alert(
              "Schedule failed",
              error.message || "Error occurred while scheduling."
            );
          },
        }
      );
    } else {
      Alert.alert("Vui lòng chọn đầy đủ service, bác sĩ, ngày và khung giờ.");
    }
  };

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

        <View className="flex-row items-center mt-4 mb-2 ml-4">
          <Text className="text-base mr-2">Schedule anonymously</Text>
          <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
        </View>

        <WeekNavigation
          weekDates={weekDates}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          onPrevWeek={() => navigateWeek(-1)}
          onNextWeek={() => navigateWeek(1)}
        />

        {!selectedDoctor ? (
          <View className="items-center py-4">
            <Text className="text-gray-500 text-center">
              Please select a doctor to view available time slots.
            </Text>
          </View>
        ) : shiftsLoading ? (
          <View className="items-center py-4">
            <ActivityIndicator />
            <Text>Loading availability...</Text>
          </View>
        ) : shiftsError ? (
          <Text className="text-red-500 text-center py-4">
            Error loading schedule: {shiftsError.message}
          </Text>
        ) : null}

        <TimeSlots
          timeSlots={timeSlotsList}
          availability={availability}
          selectedDay={selectedDate.toISOString().slice(0, 10)} // dùng ISO
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />

        <View className="mx-4 mt-4 mb-2">
          <Text className="text-base mb-2">Notes (optional):</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Enter notes for the appointment (if any)"
            multiline
            numberOfLines={3}
            className="p-3 border rounded-xl bg-white text-base"
            style={{ minHeight: 60 }}
          />
        </View>

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
