// services/patient/api.ts
import axios from "@/config/axios";
import {
  DeleteAccountResponse,
  LabResult,
  PatientProfile,
  UpdatePatientProfilePayload,
} from "./types";

export const getPatientProfile = async (
  accountId: string
): Promise<PatientProfile> => {
  const res = await axios.get<PatientProfile>(`/patient/profile/${accountId}`);
  return res.data;
};

export const updatePatientProfile = async (
  patientId: string,
  payload: UpdatePatientProfilePayload
): Promise<any> => {
  const res = await axios.put(`/patient/update-profile/${patientId}`, payload);
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

// Get lab results for a patient by patientId
export const getLabResults = async (
  patientId: string
): Promise<LabResult[]> => {
  const res = await axios.get(`/patient/lab-results/${patientId}`);
  return res.data;
};
