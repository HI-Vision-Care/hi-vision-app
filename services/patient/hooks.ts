// services/patient/hooks.ts
import { useQuery } from "@tanstack/react-query";
import { getPatientProfile } from "./api";
import { PatientProfile } from "./types";

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
