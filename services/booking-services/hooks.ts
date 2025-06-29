// services/booking-services/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookAppointment, getWorkShiftsWeek } from "./api";
import {
  AppointmentRequest,
  AppointmentResponse,
  WorkShiftWeek,
} from "./types";

export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentResponse, Error, AppointmentRequest>(
    (data) => bookAppointment(data),
    {
      onSuccess: () => {
        // tuỳ bạn: có thể invalidate list appointments hoặc hiển thị toast…
        queryClient.invalidateQueries(["appointments"]);
      },
    }
  );
};

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
