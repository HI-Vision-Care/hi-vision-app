import { useMutation, useQuery } from "@tanstack/react-query";
import { createArvPrescription, getArvPrescriptionsByPatientId } from "./api";
import { ARVPrescription, CreateArvPrescriptionPayload } from "./types";

export const useGetArvPrescriptions = (patientId: string, enabled = true) =>
  useQuery<ARVPrescription[], Error>(
    ["arv-prescriptions", patientId],
    () => getArvPrescriptionsByPatientId(patientId),
    {
      enabled: !!patientId && enabled,
      select: (data) =>
        (data || [])
          .slice()
          .sort(
            (a, b) =>
              new Date(b.prescription?.date || "").getTime() -
              new Date(a.prescription?.date || "").getTime()
          ),
    }
  );

export const useCreateArvPrescription = () =>
  useMutation(
    ({
      patientId,
      payload,
    }: {
      patientId: string;
      payload: CreateArvPrescriptionPayload;
    }) => createArvPrescription(patientId, payload)
  );
