// services/patient/api.ts
import axios from "@/config/axios";
import { DeleteAccountResponse, PatientProfile } from "./types";

export const getPatientProfile = async (
  accountId: string
): Promise<PatientProfile> => {
  const res = await axios.get<PatientProfile>(`/patient/profile/${accountId}`);
  return res.data;
};

export const deleteAccount = async (
  accountId: string
): Promise<DeleteAccountResponse> => {
  const res = await axios.delete<DeleteAccountResponse>(
    `/account/${accountId}`
  );
  return res.data;
};
