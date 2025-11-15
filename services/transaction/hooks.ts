import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelTransaction,
  getTransactions,
  getTransactionsByAccountId,
  transferToAppointment,
} from "./api";
import { CancelTransactionResponse, Transaction } from "./types";

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

export const useCancelTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<CancelTransactionResponse, Error, number>({
    mutationFn: (orderCode) => cancelTransaction(orderCode),
    onSuccess: () => {
      // Invalidate transactions query để refetch lại danh sách
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
