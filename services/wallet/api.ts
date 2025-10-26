import axios from "@/config/axios";
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

export const depositToWallet = async (
  accountId: string,
  payload: DepositPayload
): Promise<Wallet> => {
  const res = await axios.put(`/wallet/deposit/${accountId}`, payload);
  return res.data;
};

export const createWallet = async (
  accountId: string,
  payload: DepositPayload
): Promise<string> => {
  const res = await axios.post(`/wallet/${accountId}`, payload);
  return res.data;
};

export const vnpayCallback = async (
  params: VNPayCallbackParams
): Promise<VNPayCallbackResponse> => {
  const res = await axios.get("/wallet/vnpay-callback", { params });
  return res.data;
};

export const getWalletByAccountId = async (
  accountId: string
): Promise<Wallet> => {
  const res = await axios.get(`/wallet/view/${accountId}`);
  return res.data;
};

// Yêu cầu rút tiền
export const requestWithdraw = async (
  accountId: string,
  payload: RequestWithdrawPayload
): Promise<RequestWithdrawResponse> => {
  const res = await axios.post(
    `/wallet/request-withdraw/${accountId}`,
    payload
  );
  return res.data;
};

// Nạp tiền qua PayOS
export const topupByPayOS = async (
  accountId: string,
  payload: PayOSTopupPayload
): Promise<PayOSTopupResponse> => {
  const res = await axios.post(`/wallet/${accountId}/topup-by-payos`, payload);
  return res.data;
};
