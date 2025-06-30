// services/booking-services/hooks.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { bookAppointment, getWorkShiftsWeek } from "./api";
import { AppointmentForm, WorkShiftWeek } from "./types";

export function useBookAppointment(patientId: string) {
  return useMutation((appointmentForm: AppointmentForm) =>
    bookAppointment(patientId, appointmentForm)
  );
}

// services/workShift/hooks.ts
export const useGetWorkShiftsWeek = (date: string, doctorId?: string) =>
  useQuery<WorkShiftWeek[], Error>(
    ["workShiftsWeek", date, doctorId],
    () => getWorkShiftsWeek(date, doctorId),
    {
      staleTime: 5 * 60 * 1000,
      enabled: !!doctorId, // chỉ chạy khi đã có doctorId
    }
  );
