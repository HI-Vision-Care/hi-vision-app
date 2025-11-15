import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createWallet,
  depositToWallet,
  getWalletByAccountId,
  requestWithdraw,
  topupByPayOS,
  vnpayCallback,
} from "./api";
import {
  DepositPayload,
  PayOSTopupPayload,
  PayOSTopupResponse,
  RequestWithdrawPayload,
  RequestWithdrawResponse,
  VNPayCallbackParams,
  VNPayCallbackResponse,
  Wallet,
} from "./types";

export const useDepositToWallet = () =>
  useMutation<Wallet, Error, { accountId: string; payload: DepositPayload }>(
    ({ accountId, payload }) => depositToWallet(accountId, payload)
  );

export const useCreateWallet = () =>
  useMutation<string, Error, { accountId: string; payload: DepositPayload }>(
    ({ accountId, payload }) => createWallet(accountId, payload)
  );

export const useVNPayCallback = (params: VNPayCallbackParams, enabled = true) =>
  useQuery<VNPayCallbackResponse, Error>(
    [
      "vnpay-callback",
      params.vnp_TxnRef,
      params.vnp_ResponseCode,
      params.vnp_Amount,
    ],
    () => vnpayCallback(params),
    {
      enabled:
        !!params.vnp_TxnRef &&
        !!params.vnp_ResponseCode &&
        !!params.vnp_Amount &&
        enabled,
    }
  );

export const useWalletByAccountId = (accountId: string, enabled = true) =>
  useQuery<Wallet, Error>(
    ["wallet", accountId],
    () => getWalletByAccountId(accountId),
    { enabled: !!accountId && enabled }
  );

export function useRequestWithdraw() {
  return useMutation<
    RequestWithdrawResponse,
    Error,
    { accountId: string; payload: RequestWithdrawPayload }
  >({
    mutationFn: ({ accountId, payload }) => requestWithdraw(accountId, payload),
  });
}

export function useTopupByPayOS() {
  return useMutation<
    PayOSTopupResponse,
    Error,
    { accountId: string; payload: PayOSTopupPayload }
  >({
    mutationFn: ({ accountId, payload }) => topupByPayOS(accountId, payload),
  });
}
