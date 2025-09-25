import { useMutation } from "@tanstack/react-query";
import { createOrder } from "./api";
import { CreateOrderPayload } from "./types";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: ({
      patientId,
      payload,
    }: {
      patientId: string;
      payload: CreateOrderPayload;
    }) => createOrder(patientId, payload),
  });
};
