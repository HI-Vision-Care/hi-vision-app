// api.ts
import axios from "@/config/axios";
import { ConsultationRequest, ConsultationRequire } from "./types";

// Đặt các hàm gọi API ở đây

export async function bookConsultationGuest(
  body: ConsultationRequest
): Promise<ConsultationRequest> {
  const { data } = await axios.post<ConsultationRequest>(
    "/appointment/book-consultation-guest",
    body
  );
  return data;
}

export async function bookConsultationWithAccount(
  patientId: string,
  body: ConsultationRequest
): Promise<ConsultationRequest> {
  const { data } = await axios.post<ConsultationRequest>(
    `/appointment/book-consultation-with-account/${encodeURIComponent(patientId)}`,
    body
  );
  return data;
}

export async function getConsultationRequire(
  patientID: string
): Promise<ConsultationRequire> {
  const response = await axios.get<ConsultationRequire>(`/consultation/require/${patientID}`);
  console.log("axios response:", response.data);
  return response.data;
}
