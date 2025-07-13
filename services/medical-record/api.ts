import axios from "@/config/axios";
import { MedicalRecord } from "@/types/type";

export const getMedicalRecordByAppointmentId = async (
  appointmentId: string
): Promise<MedicalRecord> => {
  const res = await axios.get(`/medical-record/appointment/${appointmentId}`);
  return res.data;
};
