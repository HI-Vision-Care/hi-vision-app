import axios from "@/config/axios";
import { PrescriptionARVResponse } from "./types";

export const getArvPrescription = async (
  patientId: string
): Promise<PrescriptionARVResponse | null> => {
  try {
    const res = await axios.get(`/prescription/arv/${patientId}`);
    return res.data;
  } catch (e) {
    // Nếu BE trả về 404: không có đơn ARV
    const status = (e as any)?.response?.status;
    if (status === 404) {
      return null;
    }
    // Log chi tiết để debug thay vì nuốt lỗi
    console.error("getArvPrescription error", {
      patientId,
      status,
      message: (e as any)?.message,
      data: (e as any)?.response?.data,
    });
    throw e;
  }
};

export const getPreARVPrescription = async (
  appointmentID: string
): Promise<PrescriptionARVResponse> => {
  const response = await axios.get(`/prescription/pre-arv/${appointmentID}`);
  return response.data;
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
