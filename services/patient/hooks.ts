// services/patient/hooks.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteAccount, getPatientProfile } from "./api";
import { DeleteAccountResponse, PatientProfile } from "./types";

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
