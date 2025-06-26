// src/components/invoice/InvoiceForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api/axios';
import { InvoiceTypeToggle } from './InvoiceTypeToggle';

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

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  amount_105: z.coerce.number().min(0, 'Amount 10.5% must be non-negative'),
  total_neto: z.coerce.number().positive('Total neto must be positive'),
  vat_amount_21: z.coerce.number().min(0),
  vat_amount_105: z.coerce.number().min(0),
  total_amount: z.coerce.number().positive('Total amount must be positive'),
  status: z.enum(['to_pay', 'prepared', 'paid']),
  supplierId: z.coerce.number().int().positive(),
  type: z.enum(['A', 'X']),
}).superRefine(() => {
  // Removed VAT validation since we now have automatic calculation
});

export type InvoiceFormData = z.infer<typeof schema>;

type Supplier = {
  id: number;
  name: string;
};

export interface InvoiceFormProps {
  /** Valores iniciales opcionales */
  defaultValues?: Partial<InvoiceFormData>;
  /** Callback que recibe los datos validados */
  onSubmit: (data: InvoiceFormData) => Promise<void> | void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  defaultValues,
  onSubmit,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'X',
      date: new Date().toISOString().split('T')[0],
      amount_105: 0,
      ...defaultValues,
    },
  });

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

  useEffect(() => {
    api
      .get<Supplier[]>('/suppliers')
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error('Error loading suppliers', err));
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Date */}
      <div>
        <label className="block text-sm text-white mb-1">Date</label>
        <input
          type="date"
          {...register('date')}
          className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
        />
        {errors.date && <p className="text-red-400 text-xs">{errors.date.message}</p>}
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm text-white mb-1">Type</label>
        <InvoiceTypeToggle
          value={invoiceType}
          onChange={(type: 'A' | 'X') => {
            setValue('type', type);
          }}
        />
        <input
          type="hidden"
          {...register('type')}
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm text-white mb-1">Amount</label>
        <input
          type="text"
          value={formatCurrency(watch('amount'))}
          onChange={(e) => {
            const numericValue = parseCurrency(e.target.value);
            setValue('amount', numericValue);
          }}
          onBlur={(e) => {
            const numericValue = parseCurrency(e.target.value);
            setValue('amount', numericValue);
          }}
          className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
          placeholder="$ 0,00"
        />
        {errors.amount && <p className="text-red-400 text-xs">{errors.amount.message}</p>}
      </div>

      {/* Amount 10.5% - Only visible for type A */}
      {invoiceType === 'A' && (
        <div>
          <label className="block text-sm text-white mb-1">Amount 10.5%</label>
          <input
            type="text"
            value={formatCurrency(watch('amount_105'))}
            onChange={(e) => {
              const numericValue = parseCurrency(e.target.value);
              setValue('amount_105', numericValue);
            }}
            onBlur={(e) => {
              const numericValue = parseCurrency(e.target.value);
              setValue('amount_105', numericValue);
            }}
            className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
            placeholder="$ 0,00"
          />
          {errors.amount_105 && <p className="text-red-400 text-xs">{errors.amount_105.message}</p>}
        </div>
      )}

      {/* Total Neto - Read only */}
      <div>
        <label className="block text-sm text-white mb-1">Total Neto</label>
        <input
          type="text"
          value={formatCurrency(total_neto)}
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
            value={formatCurrency(vat_amount_21)}
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
            value={formatCurrency(vat_amount_105)}
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
          value={formatCurrency(total_amount)}
          readOnly
          className="w-full bg-neutral-800 text-white border border-neutral-700 px-3 py-2 rounded-md cursor-not-allowed"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm text-white mb-1">Status</label>
        <select
          {...register('status')}
          className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
        >
          <option value="to_pay">To Pay</option>
          <option value="prepared">Prepared</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Supplier */}
      <div>
        <label className="block text-sm text-white mb-1">Supplier</label>
        <select
          {...register('supplierId')}
          className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
        >
          <option value="">-- Select Supplier --</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.supplierId && <p className="text-red-400 text-xs">{errors.supplierId.message}</p>}
      </div>

      {/* Hidden inputs for calculated fields */}
      <div>
        <input
          type="hidden"
          {...register('total_neto')}
        />
        <input
          type="hidden"
          {...register('vat_amount_21')}
        />
        <input
          type="hidden"
          {...register('vat_amount_105')}
        />
        <input
          type="hidden"
          {...register('total_amount')}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-orange hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Invoice'}
      </button>
    </form>
  );
};
