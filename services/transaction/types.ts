export interface Transaction {
  amount: number;
  description: string;
  type: string;
  status: string;
  date: string; // ISO string
}

// Response cho cancel transaction
export type CancelTransactionResponse = string;
