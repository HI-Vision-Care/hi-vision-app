// services/booking-services/api.ts

import axios from "@/config/axios";
import {
  AppointmentRequest,
  AppointmentResponse,
  WorkShiftWeek,
} from "./types";

// existing API
// export const getBookingServices = …

// Thêm hàm bookAppointment:
export const bookAppointment = async (
  payload: AppointmentRequest
): Promise<AppointmentResponse> => {
  const res = await axios.post<AppointmentResponse>(
    "/appointment/book-appointment",
    payload
  );
  return res.data;
};

/**
 * Lấy lịch làm việc theo tuần của bác sĩ
 * @param date ngày bất kỳ trong tuần (YYYY-MM-DD)
 * @param doctorId tuỳ chọn: id bác sĩ
 */
export const getWorkShiftsWeek = async (
  date: string,
  doctorId?: string
): Promise<WorkShiftWeek[]> => {
  const params: Record<string, string> = { date };
  if (doctorId) params.doctorId = doctorId;
  const res = await axios.get<WorkShiftWeek[]>("/work-shift/week", { params });
  return res.data;
};
