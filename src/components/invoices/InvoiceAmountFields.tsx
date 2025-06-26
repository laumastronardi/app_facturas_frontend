import React, { useState, useEffect } from 'react';
import type { UseFormRegister, FieldError, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { InvoiceFormData } from './InvoiceForm';

// Currency formatting function
const formatCurrency = (value: number | string | undefined): string => {
  const numValue = Number(value) || 0;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

// Function to parse currency string back to number
const parseCurrency = (value: string): number => {
  return Number(value.replace(/[^\d.-]/g, '')) || 0;
};

interface InvoiceAmountFieldsProps {
  register: UseFormRegister<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  errors: {
    amount?: FieldError;
    amount_105?: FieldError;
  };
  invoiceType: 'A' | 'X';
  calculatedValues: {
    total_neto: number;
    vat_amount_21: number;
    vat_amount_105: number;
    total_amount: number;
  };
}

export const InvoiceAmountFields: React.FC<InvoiceAmountFieldsProps> = ({
  watch,
  setValue,
  errors,
  invoiceType,
  calculatedValues,
}) => {
  const [amountDisplay, setAmountDisplay] = useState('');
  const [amount105Display, setAmount105Display] = useState('');

  const amount = watch('amount');
  const amount_105 = watch('amount_105');

  // Update display values when form values change
  useEffect(() => {
    setAmountDisplay(amount ? amount.toString() : '');
  }, [amount]);

  useEffect(() => {
    setAmount105Display(amount_105 ? amount_105.toString() : '');
  }, [amount_105]);

  return (
    <>
      {/* Amount */}
      <div>
        <label className="block text-sm text-white mb-1">Amount</label>
        <input
          type="text"
          value={amountDisplay}
          onChange={(e) => {
            const value = e.target.value;
            setAmountDisplay(value);
            const numericValue = Number(value) || 0;
            setValue('amount', numericValue);
          }}
          onBlur={(e) => {
            const numericValue = Number(e.target.value) || 0;
            setValue('amount', numericValue);
            setAmountDisplay(numericValue.toString());
          }}
          className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
          placeholder="0"
        />
        {errors.amount && <p className="text-red-400 text-xs">{errors.amount.message}</p>}
      </div>

      {/* Amount 10.5% - Only visible for type A */}
      {invoiceType === 'A' && (
        <div>
          <label className="block text-sm text-white mb-1">Amount 10.5%</label>
          <input
            type="text"
            value={amount105Display}
            onChange={(e) => {
              const value = e.target.value;
              setAmount105Display(value);
              const numericValue = Number(value) || 0;
              setValue('amount_105', numericValue);
            }}
            onBlur={(e) => {
              const numericValue = Number(e.target.value) || 0;
              setValue('amount_105', numericValue);
              setAmount105Display(numericValue.toString());
            }}
            className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
            placeholder="0"
          />
          {errors.amount_105 && <p className="text-red-400 text-xs">{errors.amount_105.message}</p>}
        </div>
      )}

      {/* Total Neto - Read only */}
      <div>
        <label className="block text-sm text-white mb-1">Total Neto</label>
        <input
          type="text"
          value={formatCurrency(calculatedValues.total_neto)}
          readOnly
          className="w-full bg-neutral-800 text-white border border-neutral-700 px-3 py-2 rounded-md cursor-not-allowed"
        />
      </div>

      {/* VAT Amount 21% - Only visible for type A, read only */}
      {invoiceType === 'A' && (
        <div>
          <label className="block text-sm text-white mb-1">IVA 21% Amount</label>
          <input
            type="text"
            value={formatCurrency(calculatedValues.vat_amount_21)}
            readOnly
            className="w-full bg-neutral-800 text-white border border-neutral-700 px-3 py-2 rounded-md cursor-not-allowed"
          />
        </div>
      )}

      {/* VAT Amount 10.5% - Only visible for type A, read only */}
      {invoiceType === 'A' && (
        <div>
          <label className="block text-sm text-white mb-1">IVA 10.5% Amount</label>
          <input
            type="text"
            value={formatCurrency(calculatedValues.vat_amount_105)}
            readOnly
            className="w-full bg-neutral-800 text-white border border-neutral-700 px-3 py-2 rounded-md cursor-not-allowed"
          />
        </div>
      )}

      {/* Total Amount - Read only */}
      <div>
        <label className="block text-sm text-white mb-1">Total Amount</label>
        <input
          type="text"
          value={formatCurrency(calculatedValues.total_amount)}
          readOnly
          className="w-full bg-neutral-800 text-white border border-neutral-700 px-3 py-2 rounded-md cursor-not-allowed"
        />
      </div>
    </>
  );
}; 