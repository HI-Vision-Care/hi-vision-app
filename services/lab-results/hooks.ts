// hooks.ts
import { LabResult } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { getLabResultsByAppointmentId } from "./api";

export const useGetLabResultsByAppointmentId = (
  appointmentId: string,
  enabled = true
) =>
  useQuery<LabResult[], Error>(
    ["lab-results", appointmentId],
    () => getLabResultsByAppointmentId(appointmentId),
    {
      enabled: !!appointmentId && enabled,
      select: (data) =>
        (data || [])
          .slice()
          .sort(
            (a, b) =>
              new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
          ),
    }
  );
