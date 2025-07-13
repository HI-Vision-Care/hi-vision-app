// types.ts

export interface DepositPayload {
  balance: number;
}

export interface Wallet {
  accountId: string;
  balance: number;
}

export interface CreateWalletPayload {
  balance: number;
}

export interface VNPayCallbackParams {
  vnp_TxnRef: string;
  vnp_ResponseCode: string;
  vnp_Amount: string;
}

// Trả về link VNPay
export interface CreateWalletResponse {
  vnpayUrl: string;
}

export type VNPayCallbackResponse = Record<string, unknown>;
