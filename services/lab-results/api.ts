import axios from "@/config/axios";
import { LabResult } from "@/types/type";

export const getLabResultsByAppointmentId = async (
  appointmentId: string
): Promise<LabResult[]> => {
  const res = await axios.get(`/lab-result/appointment/${appointmentId}`);
  return res.data;
};

export const getLabResultsByPatientId = async (
  patientId: string
): Promise<LabResult[]> => {
  const res = await axios.get(`/patient/lab-results/${patientId}`);
  return res.data;
};
