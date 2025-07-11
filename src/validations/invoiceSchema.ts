import { z } from 'zod';

export const invoiceFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  amount_105: z.coerce.number().min(0, 'Amount 10.5% must be non-negative'),
  total_neto: z.coerce.number().positive('Total neto must be positive'),
  vat_amount_21: z.coerce.number().min(0),
  vat_amount_105: z.coerce.number().min(0),
  total_amount: z.coerce.number().positive('Total amount must be positive'),
  status: z.enum(['to_pay', 'prepared', 'paid']),
  supplierId: z.number().int().positive().nullable().refine(val => val !== null, { message: 'El proveedor es obligatorio' }),
  type: z.enum(['A', 'X']),
  has_ii_bb: z.boolean(),
  ii_bb_amount: z.coerce.number().min(0),
}).superRefine(() => {});
