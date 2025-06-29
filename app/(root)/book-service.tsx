import {
  BookButton,
  BookingSummary,
  ChooseDoctor,
  HeaderBack,
  ServiceSelection,
  WeekNavigation,
} from "@/components";
import TimeSlots from "@/components/booking/TimeSlot";
import { mockAvailability, timeSlots, weekDays } from "@/constants";
import { useGetDoctors } from "@/services/doctor/hooks";
import { Doctor } from "@/services/doctor/types";
import { Service } from "@/types/type";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type AvailabilityMap = Record<string, Record<string, boolean>>;

export default function BookingScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();

  // Find the service passed from ServiceDetail or fallback
  const initialService: Service | null = data
    ? JSON.parse(decodeURIComponent(data))
    : null;

  const [selectedService, setSelectedService] = useState<Service | null>(
    initialService
  );
  const [selectedDay, setSelectedDay] = useState<string>("Mon");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { data: doctors, isLoading, error } = useGetDoctors();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Reset selected time/day when service changes
  useEffect(() => {
    setSelectedDay("Mon");
    setSelectedTime(null);
  }, [selectedService]);

  const getDatesForWeek = (start: Date) => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getDatesForWeek(currentWeekStart);

  const handleBooking = () => {
    if (selectedService && selectedDay && selectedTime && selectedDoctor) {
      Alert.alert(
        "Booking confirmed!",
        `Service: ${selectedService.name}
Doctor ID: ${selectedDoctor.doctorID}
Doctor: ${selectedDoctor.name}
Day: ${selectedDay}
Time: ${selectedTime}`
      );
      // TODO: ở đây bạn gọi API bookService({... , doctorID: selectedDoctor.doctorID, ...})
    } else {
      Alert.alert("Vui lòng chọn đầy đủ service, bác sĩ, ngày và khung giờ.");
    }
  };

  const navigateWeek = (direction: number) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newStart);
    setSelectedDay(weekDays[0]);
    setSelectedTime(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <HeaderBack title="Book Appointment" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ChooseDoctor
          doctors={doctors}
          isLoading={isLoading}
          error={error as Error | null}
          selectedDoctor={selectedDoctor}
          onSelectDoctor={setSelectedDoctor}
        />

        <ServiceSelection
          services={selectedService ? [selectedService] : []}
          selectedServiceId={selectedService?.serviceID ?? null}
          onSelect={(service) => setSelectedService(service)}
        />
        <WeekNavigation
          weekDates={weekDates}
          selectedDay={selectedDay}
          onSelectDay={(d) => {
            setSelectedDay(d);
            setSelectedTime(null);
          }}
          onPrevWeek={() => navigateWeek(-1)}
          onNextWeek={() => navigateWeek(1)}
        />
        <TimeSlots
          timeSlots={timeSlots}
          availability={mockAvailability}
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
          <BookButton onBook={handleBooking} disabled={true} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
