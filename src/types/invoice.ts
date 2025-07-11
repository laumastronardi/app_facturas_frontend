import type { Supplier } from "./supplier";

export type Invoice = {
  id: number;
  date: string;
  amount: number;
  amount_105: number;
  total_neto: number;
  vat_amount_21: number;
  vat_amount_105: number;
  total_amount: number;
  status: 'to_pay' | 'prepared' | 'paid';
  type: 'A' | 'X';
  supplier: Supplier;
  paymentDate?: string;
  has_ii_bb: boolean;
  ii_bb_amount: number;
};