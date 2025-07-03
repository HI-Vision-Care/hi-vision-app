import { ConsultationRequest } from "@/types/type";
import axios from "@/config/axios";
// Nếu backend trả về chính xác { phone, name, note }
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
): Promise< ConsultationRequest> {
  const { data } = await axios.post< ConsultationRequest>(
    `/appointment/book-consultation-with-account/${encodeURIComponent(patientId)}`,
    body
  );
  return data;
}