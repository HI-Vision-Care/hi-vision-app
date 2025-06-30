// api.ts
import axios from "@/config/axios";
import { AppointmentDetail } from "./types";

export const getAppointmentByPatientId = async (
  patientId: string
): Promise<AppointmentDetail> => {
  const res = await axios.get(`/appointment/get-appointment/${patientId}`);
  return res.data;
};
