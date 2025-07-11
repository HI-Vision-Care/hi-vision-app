import axios from "@/config/axios";
import { Transaction } from "./types";

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
