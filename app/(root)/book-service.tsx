import {
  BookButton,
  BookingSummary,
  ChooseDoctor,
  HeaderBack,
  PaymenFailureModal,
  PaymentOption,
  PaymentSuccessModal,
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
import { useTransferToAppointment } from "@/services/transaction/hooks";
import { useWalletByAccountId } from "@/services/wallet/hooks";
import { Service } from "@/types/type";
import { toLocalISODate, toLocalISODatee } from "@/utils/format";
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
  const accountId = profile?.account?.id;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [successType, setSuccessType] = useState<"booking" | "payment">(
    "booking"
  );

  const [paymentOption, setPaymentOption] = useState<"PAY_NOW" | "PAY_LATER">(
    "PAY_LATER"
  );

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
  const transferToAppointmentMutation = useTransferToAppointment(); // Initialize the new mutation hook

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

  const { data: wallet } = useWalletByAccountId(accountId || "");
  const balance = wallet?.balance ?? 0;

  // Các slot cho ngày đang chọn
  const selectedISO = toLocalISODatee(selectedDate);

  const timeSlotsList = useMemo(
    () =>
      shifts
        .filter((s) => {
          const dateStr = s.date
            ? s.date
            : s.startTime
            ? s.startTime.slice(0, 10)
            : null;
          return dateStr === selectedISO;
        })
        .map((s) => s.slot),
    [shifts, selectedISO]
  );

  // Bản đồ availability status
  const availability = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    weekDates.forEach((date) => {
      const iso = date.toISOString().slice(0, 10);
      map[iso] = {};
    });
    shifts.forEach((s) => {
      const iso = s.date
        ? s.date
        : s.startTime
        ? s.startTime.slice(0, 10)
        : null;
      if (iso) {
        map[iso] = map[iso] || {};
        map[iso][s.slot] = s.status;
      }
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

  const handleSelectDay = (date: Date, idx: number) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  useEffect(() => {
    // Nếu selectedTime không còn trong slot hợp lệ, reset nó
    if (selectedTime && !timeSlotsList.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [selectedTime, timeSlotsList]);

  // Đặt lịch
  const handleBooking = () => {
    // Check patientId
    if (!patientId) {
      Alert.alert("You must be logged in to book an appointment.");
      return;
    }
    // Check Service
    if (!selectedService || !selectedService.isActive) {
      Alert.alert(
        "Selected service is no longer available. Please choose another service."
      );
      return;
    }
    // Check Doctor
    if (!selectedDoctor) {
      Alert.alert("Please select a doctor.");
      return;
    }
    // Check Date & Time
    if (!selectedDay || !selectedTime) {
      Alert.alert("Please select a date and time slot.");
      return;
    }
    // Validate appointment time not in the past
    const [startTime] = selectedTime.split(" - "); // "09:00"
    const [hours, minutes] = startTime.split(":");
    const localDate = new Date(selectedDate);
    localDate.setHours(Number(hours), Number(minutes), 0, 0);
    if (localDate < new Date()) {
      Alert.alert("You cannot book an appointment in the past.");
      return;
    }
    // Note length validation
    if (note.length > 255) {
      Alert.alert("Note is too long (max 255 characters).");
      return;
    }
    // ---- CHECK SỐ DƯ TRƯỚC ----
    if (paymentOption === "PAY_NOW") {
      if ((selectedService?.price ?? 0) > balance) {
        Alert.alert(
          "Số dư không đủ",
          "Vui lòng nạp thêm tiền để thanh toán dịch vụ này!"
        );
        return;
      }
    }
    // ---- CHỈ KHI ĐỦ TIỀN MỚI TẠO BOOKING ----
    const payload = {
      serviceID: selectedService.serviceID,
      doctorID: selectedDoctor.doctorID,
      appointmentDate: toLocalISODate(selectedDate),
      isAnonymous: isAnonymous,
      note: note,
      slot: selectedTime,
    };
    console.log("PayLoad:", payload);

    // Everything valid, proceed with booking
    bookAppointmentMutation.mutate(payload, {
      onSuccess: (response: any) => {
        const appointmentId =
          response?.appointmentId ||
          response?.appointmentID ||
          response?.id ||
          response?.appointment?.appointmentId;

        if (!appointmentId && paymentOption === "PAY_NOW") {
          setShowFailureModal(true);
          return;
        }

        // Trước khi gọi mutate cho transferToAppointment:
        if (paymentOption === "PAY_NOW" && accountId) {
          if ((selectedService?.price ?? 0) > balance) {
            // Báo lỗi số dư không đủ
            Alert.alert(
              "Số dư không đủ",
              "Vui lòng nạp thêm tiền để thanh toán dịch vụ này!"
            );
            return;
          }
          // Nếu đủ tiền mới chuyển tiếp thanh toán
          transferToAppointmentMutation.mutate(
            { appointmentId, accountId: accountId },
            {
              onSuccess: () => {
                setSuccessType("payment"); // thành công thanh toán
                setShowSuccessModal(true);
              },
              onError: () => {
                setShowFailureModal(true);
              },
            }
          );
        } else {
          setSuccessType("booking");
          setShowSuccessModal(true);
        }
      },

      onError: (error: any) => {
        // Ưu tiên lấy message gốc trả về từ backend
        const backendMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "An error occurred while scheduling.";

        Alert.alert("Schedule failed", backendMessage);
      },
    });
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
          selectedDate={selectedDate}
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
          selectedDay={selectedISO}
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

        <PaymentOption
          selectedOption={paymentOption}
          onSelectOption={setPaymentOption}
        />

        {selectedService && selectedDay && selectedTime ? (
          <>
            <BookingSummary
              service={selectedService}
              selectedDate={selectedDate} // <-- Truyền luôn Date object
              selectedTime={selectedTime}
              weekDates={weekDates}
            />

            <BookButton onBook={handleBooking} disabled={false} />
          </>
        ) : (
          <BookButton
            onBook={handleBooking}
            disabled={
              !selectedService ||
              !selectedDay ||
              !selectedTime ||
              bookAppointmentMutation.isLoading ||
              transferToAppointmentMutation.isLoading
            }
          />
        )}
      </ScrollView>

      <PaymenFailureModal
        visible={showFailureModal}
        onClose={() => setShowFailureModal(false)}
      />
      <PaymentSuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.replace({
            pathname: "/(personal-info)/history",
            params: { fromBooking: "1" },
          });
        }}
        title={
          successType === "payment"
            ? "Thanh toán thành công!"
            : "Đặt lịch thành công!"
        }
        subtitle={
          successType === "payment"
            ? "Bạn đã đặt lịch và thanh toán thành công."
            : "Lịch hẹn của bạn đã được ghi nhận. Vui lòng thanh toán trước khi đến khám."
        }
      />
    </SafeAreaView>
  );
}
