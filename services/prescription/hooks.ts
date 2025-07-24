import { useQuery } from "@tanstack/react-query";
import { getArvPrescription, getPreARVPrescription } from "./api";
import { PrescriptionARVResponse } from "./types";

export function useGetArvPrescription(patientId: string) {
  return useQuery<PrescriptionARVResponse | null>({
    queryKey: ["arv-prescription", patientId],
    queryFn: () => getArvPrescription(patientId),
    enabled: !!patientId,
  });
}

export const usePreARVPrescription = (appointmentID: string) => {
  return useQuery<PrescriptionARVResponse>({
    queryKey: ["pre-arv-prescription", appointmentID],
    queryFn: () => getPreARVPrescription(appointmentID),
    enabled: !!appointmentID,
  });
};

// export const useCreateArvPrescription = () =>
//   useMutation(
//     ({
//       patientId,
//       payload,
//     }: {
//       patientId: string;
//       payload: CreateArvPrescriptionPayload;
//     }) => createArvPrescription(patientId, payload)
//   );
