// services/booking-services/api.ts

import axios from "@/config/axios";
import { AppointmentRequest, AppointmentResponse } from "./types";

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
