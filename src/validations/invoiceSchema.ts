import { z } from 'zod';

export const invoiceSchema = z.object({
  amount: z.coerce.number().positive(),
  type: z.enum(['A', 'X']),
  vat: z
    .union([z.literal(21), z.literal(10.5)])
    .optional()
    .refine((val) => val === 21 || val === 10.5 || val === undefined, {
      message: 'IVA debe ser 21% o 10.5%',
    }),
  supplierId: z.string(),
});
