// services/patient/hooks.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteAccount, getLabResults, getPatientProfile } from "./api";
import { DeleteAccountResponse, LabResult, PatientProfile } from "./types";

/**
 * Hook fetch profile của patient dựa trên accountId
 */
export const useGetPatientProfile = (accountId: string) => {
  return useQuery<PatientProfile, Error>(
    ["patientProfile", accountId],
    () => getPatientProfile(accountId),
    {
      enabled: Boolean(accountId), // chỉ chạy khi có accountId
    }
  );
};

export const useDeleteAccount = () => {
  return useMutation<DeleteAccountResponse, Error, string>(
    (accountId: string) => deleteAccount(accountId)
  );
};

export function useGetLabResults(patientId: string, enabled = true) {
  return useQuery<LabResult[]>({
    queryKey: ["labResults", patientId],
    queryFn: () => getLabResults(patientId),
    enabled: !!patientId && enabled, // chỉ query khi đã có id
  });
}
