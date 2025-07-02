import { useQuery } from "@tanstack/react-query";
import { getAppointmentByPatientId } from "./api";
import { AppointmentDetail } from "./types";

// API trả về mảng: AppointmentDetail[]
export const useGetAppointmentByPatientId = (
  patientId: string,
  enabled = true
) =>
  useQuery<AppointmentDetail[], Error>(
    ["appointments", patientId], // query key
    async () => {
      const result = await getAppointmentByPatientId(patientId);
      return Array.isArray(result) ? result : [result];
    }, // fetcher
    {
      enabled: !!patientId && enabled,
      select: (data) => {
        return (data || [])
          .slice()
          .sort(
            (a, b) =>
              new Date(a.appointmentDate).getTime() -
              new Date(b.appointmentDate).getTime()
          );
      },
    }
  );
