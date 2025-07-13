import axios from "@/config/axios";
import {
  DepositPayload,
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
