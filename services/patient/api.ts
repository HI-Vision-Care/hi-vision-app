// services/patient/api.ts
import axios from "@/config/axios";
import { PatientProfile } from "./types";

export const getPatientProfile = async (
  accountId: string
): Promise<PatientProfile> => {
  const res = await axios.get<PatientProfile>(`/patient/profile/${accountId}`);
  return res.data;
};
