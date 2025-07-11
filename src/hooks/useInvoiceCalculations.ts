import { useEffect } from 'react';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { InvoiceFormData } from '../components/invoices/InvoiceForm';

export const useInvoiceCalculations = (
  watch: UseFormWatch<InvoiceFormData>,
  setValue: UseFormSetValue<InvoiceFormData>
) => {
  const invoiceType = watch('type');
  const amount = Number(watch('amount')) || 0;
  const amount_105 = Number(watch('amount_105')) || 0;
  const has_ii_bb = watch('has_ii_bb');

  // Calculate derived values
  const vat_amount_21 = invoiceType === 'A' ? amount * 0.21 : 0;
  const vat_amount_105 = invoiceType === 'A' ? amount_105 * 0.105 : 0;
  const total_neto = amount + amount_105;
  const ii_bb_amount = (invoiceType === 'A' && has_ii_bb) ? total_neto * 0.04 : 0; // 4% de ingresos brutos
  const total_amount = total_neto + vat_amount_21 + vat_amount_105 + ii_bb_amount; // Incluir II.BB en total

  // Update calculated fields when dependencies change
  useEffect(() => {
    setValue('vat_amount_21', vat_amount_21);
    setValue('vat_amount_105', vat_amount_105);
    setValue('total_neto', total_neto);
    setValue('total_amount', total_amount);
    setValue('ii_bb_amount', ii_bb_amount);
  }, [amount, amount_105, invoiceType, has_ii_bb, setValue, vat_amount_21, vat_amount_105, total_neto, total_amount, ii_bb_amount]);

  // Reset amount_105 and II.BB when switching to type X
  useEffect(() => {
    if (invoiceType === 'X') {
      setValue('amount_105', 0);
      setValue('has_ii_bb', false);
    }
  }, [invoiceType, setValue]);

  return {
    invoiceType,
    calculatedValues: {
      total_neto,
      vat_amount_21,
      vat_amount_105,
      total_amount,
      ii_bb_amount,
    },
  };
}; 