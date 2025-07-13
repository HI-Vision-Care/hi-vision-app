// hooks.ts
import { MedicalRecord } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { getMedicalRecordByAppointmentId } from "./api";

export const useGetMedicalRecordByAppointmentId = (
  appointmentId: string,
  enabled = true
) =>
  useQuery<MedicalRecord, Error>(
    ["medical-record", appointmentId],
    () => getMedicalRecordByAppointmentId(appointmentId),
    {
      enabled: !!appointmentId && enabled,
    }
  );
