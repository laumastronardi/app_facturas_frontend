import type { Supplier } from "./supplier";

export type Invoice = {
  id: number;
  date: string;
  amount: number;
  vat?: number;
  status: 'to_pay' | 'prepared' | 'paid';
  type: 'A' | 'X';
  supplier: Supplier;
  paymentDate?: string;
};