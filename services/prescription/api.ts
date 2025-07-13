import axios from "@/config/axios";
import { ARVPrescription, CreateArvPrescriptionPayload } from "./types";

export const getArvPrescriptionsByPatientId = async (
  patientId: string
): Promise<ARVPrescription[]> => {
  const res = await axios.get(`/prescription/arv/${patientId}`);
  return res.data;
};

export const createArvPrescription = async (
  patientId: string,
  payload: CreateArvPrescriptionPayload
) => {
  const res = await axios.post(
    `/prescription/create?patientId=${patientId}`,
    payload
  );
  return res.data;
};
