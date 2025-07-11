// api.ts
import axios from "@/config/axios";
import { AppointmentDetail } from "./types";

export const getAppointmentByPatientId = async (
  patientId: string
): Promise<AppointmentDetail> => {
  const res = await axios.get(`/appointment/get-appointment/${patientId}`);
  return res.data;
};

export const cancelAppointment = async (
  appointmentId: string,
  patientId: string
): Promise<any> => {
  const res = await axios.put(
    `/patient/cancel-appointment/${appointmentId}?patientId=${patientId}`
  );
  return res.data;
};
