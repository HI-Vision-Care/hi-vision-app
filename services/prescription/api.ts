import axios from "@/config/axios";
import { PrescriptionARVResponse } from "./types";

export const getArvPrescription = async (
  patientId: string
): Promise<PrescriptionARVResponse | null> => {
  try {
    const res = await axios.get(`/prescription/arv/${patientId}`);
    return res.data;
  } catch (e) {
    // Nếu BE trả về 404 hoặc arvList rỗng
    return null;
  }
};

// export const createArvPrescription = async (
//   patientId: string,
//   payload: CreateArvPrescriptionPayload
// ) => {
//   const res = await axios.post(
//     `/prescription/create?patientId=${patientId}`,
//     payload
//   );
//   return res.data;
// };
