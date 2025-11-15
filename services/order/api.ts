import api from "@/config/axios";
import { CreateOrderPayload, Order } from "./types";

export const createOrder = async (
  patientId: string,
  payload: CreateOrderPayload
): Promise<Order> => {
  const res = await api.post(`/order/${patientId}`, payload);
  return res.data;
};
