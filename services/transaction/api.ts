import axios from "@/config/axios";
import { CancelTransactionResponse, Transaction } from "./types";

export const transferToAppointment = async (
  appointmentId: string,
  accountId: string
): Promise<void> => {
  await axios.put(
    `/transaction/transferToAppointment/${appointmentId}/${accountId}`
  );
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const res = await axios.get("/transaction");
  return res.data;
};

export const getTransactionsByAccountId = async (
  accountId: string
): Promise<Transaction[]> => {
  const res = await axios.get(`/transaction/view/${accountId}`);
  return res.data;
};

export const cancelTransaction = async (
  orderCode: number
): Promise<CancelTransactionResponse> => {
  const res = await axios.put(`/transaction/${orderCode}/cancel`);
  return res.data;
};
