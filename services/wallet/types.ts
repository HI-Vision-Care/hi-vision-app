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

// --- Common account types (thu gọn theo schema bạn gửi)
export type UserRole = "GUEST" | "USER" | "STAFF" | "ADMIN"; // mở rộng sau nếu cần

export interface AccountSummary {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  isDeleted: boolean;
}

export interface StaffSummary {
  staffId: string;
  firstName: string;
  lastName: string;
  gender: string;
  account: AccountSummary;
}

// --- Withdraw
export interface RequestWithdrawPayload {
  amount: number;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

// Nếu backend chuẩn hoá status thành enum, ta sẽ thay `string` thành union.
export interface RequestWithdrawResponse {
  withdrawId: number;
  amount: number;
  accountNumber: string;
  withdrawDate: string; // ISO string từ backend
  description: string;
  status: string;
  account: AccountSummary;
  staff: StaffSummary | null; // để đề phòng có yêu cầu chưa được gán staff
}

// --- PayOS Top-up
export interface PayOSTopupPayload {
  amount: number;
}

export type PayOSTopupResponse = string; // URL string
