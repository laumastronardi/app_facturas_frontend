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

  // Calculate derived values
  const vat_amount_21 = invoiceType === 'A' ? amount * 0.21 : 0;
  const vat_amount_105 = invoiceType === 'A' ? amount_105 * 0.105 : 0;
  const total_neto = amount + amount_105;
  const total_amount = total_neto + vat_amount_21 + vat_amount_105;

  // Update calculated fields when dependencies change
  useEffect(() => {
    setValue('vat_amount_21', vat_amount_21);
    setValue('vat_amount_105', vat_amount_105);
    setValue('total_neto', total_neto);
    setValue('total_amount', total_amount);
  }, [amount, amount_105, invoiceType, setValue, vat_amount_21, vat_amount_105, total_neto, total_amount]);

  // Reset amount_105 when switching to type X
  useEffect(() => {
    if (invoiceType === 'X') {
      setValue('amount_105', 0);
    }
  }, [invoiceType, setValue]);

  return {
    invoiceType,
    calculatedValues: {
      total_neto,
      vat_amount_21,
      vat_amount_105,
      total_amount,
    },
  };
}; 