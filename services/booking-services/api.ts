// services/booking-services/api.ts

import axios from "@/config/axios";
import { Appointment, AppointmentForm, WorkShiftWeek } from "./types";

// Thêm hàm bookAppointment:
export async function bookAppointment(
  patientId: string,
  appointmentForm: AppointmentForm
): Promise<Appointment> {
  const response = await axios.post(
    `/appointment/book-appointment/${patientId}`,
    appointmentForm
  );
  return response.data;
}

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
