import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelAppointment, getAppointmentByPatientId } from "./api";
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

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      patientId,
    }: {
      appointmentId: string;
      patientId: string;
    }) => cancelAppointment(appointmentId, patientId),
    onSuccess: () => {
      // Có thể refetch lại danh sách lịch hẹn nếu cần
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
