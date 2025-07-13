import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getTransactions,
  getTransactionsByAccountId,
  transferToAppointment,
} from "./api";
import { Transaction } from "./types";

// Có thể nhận thêm options nếu muốn truyền callback
export const useTransferToAppointment = () =>
  useMutation<void, Error, { appointmentId: string; accountId: string }>(
    ({ appointmentId, accountId }) =>
      transferToAppointment(appointmentId, accountId)
  );

export const useTransactions = (enabled = true) =>
  useQuery<Transaction[], Error>(["transactions"], getTransactions, {
    enabled,
  });

export const useTransactionsByAccountId = (accountId: string, enabled = true) =>
  useQuery<Transaction[], Error>(
    ["transactions", accountId],
    () => getTransactionsByAccountId(accountId),
    { enabled: !!accountId && enabled }
  );
