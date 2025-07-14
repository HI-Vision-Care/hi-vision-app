import { useQuery } from "@tanstack/react-query";
import { getArvPrescription } from "./api";
import { PrescriptionARVResponse } from "./types";

export function useGetArvPrescription(patientId: string) {
  return useQuery<PrescriptionARVResponse | null>({
    queryKey: ["arv-prescription", patientId],
    queryFn: () => getArvPrescription(patientId),
    enabled: !!patientId,
  })
}

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
