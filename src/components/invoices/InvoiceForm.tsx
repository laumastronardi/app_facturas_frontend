// src/components/invoice/InvoiceForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api/axios';
import { InvoiceTypeToggle } from './InvoiceTypeToggle';
import { InvoiceDateField } from './InvoiceDateField';
import { InvoiceAmountFields } from './InvoiceAmountFields';
import { InvoiceStatusSupplierFields } from './InvoiceStatusSupplierFields';
import { useInvoiceCalculations } from '../../hooks/useInvoiceCalculations';

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
}).superRefine(() => {});

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

  const { invoiceType, calculatedValues } = useInvoiceCalculations(watch, setValue);

  useEffect(() => {
    api
      .get<Supplier[]>('/suppliers')
      .then((res) => setSuppliers(res.data));
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Date */}
      <InvoiceDateField register={register} error={errors.date} />

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

      {/* Amount Fields */}
      <InvoiceAmountFields
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
        invoiceType={invoiceType}
        calculatedValues={calculatedValues}
      />

      {/* Status and Supplier Fields */}
      <InvoiceStatusSupplierFields
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
        suppliers={suppliers}
      />

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
