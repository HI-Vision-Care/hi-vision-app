// hooks.ts
import { useQuery } from "@tanstack/react-query";
import { getAppointmentByPatientId } from "./api";
import { AppointmentDetail } from "./types";

export const useGetAppointmentByPatientId = (
  patientId: string,
  enabled = true
) =>
  useQuery<AppointmentDetail>({
    queryKey: ["appointment", patientId],
    queryFn: () => getAppointmentByPatientId(patientId),
    enabled: !!patientId && enabled,
  });
