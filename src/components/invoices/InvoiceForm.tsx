// src/components/invoice/InvoiceForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../api/axios';
import { InvoiceTypeToggle } from './InvoiceTypeToggle';
import { InvoiceDateField } from './InvoiceDateField';
import { EditableAmountInput } from './EditableAmountInput';
import { ReadOnlyAmountInput } from './ReadOnlyAmountInput';
import { InvoiceStatusField } from './InvoiceStatusField';
import SupplierFilter from '../suppliers/SuppliersFilter';
import { useInvoiceCalculations } from '../../hooks/useInvoiceCalculations';
import { invoiceFormSchema } from '../../validations/invoiceSchema';

const schema = invoiceFormSchema;

export type InvoiceFormData = Omit<z.infer<typeof schema>, 'supplierId'> & { supplierId: number | null };

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
      supplierId: null,
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
      <EditableAmountInput
        label={invoiceType === 'A' ? 'Monto IVA 21%' : 'Monto'}
        value={watch('amount')}
        onChange={val => setValue('amount', val)}
        error={errors.amount?.message}
      />
      {invoiceType === 'A' && (
        <EditableAmountInput
          label="Amount 10.5%"
          value={watch('amount_105')}
          onChange={val => setValue('amount_105', val)}
          error={errors.amount_105?.message}
        />
      )}
      <ReadOnlyAmountInput label="Total Neto" value={calculatedValues.total_neto} />
      {invoiceType === 'A' && (
        <ReadOnlyAmountInput label="IVA 21%" value={calculatedValues.vat_amount_21} />
      )}
      {invoiceType === 'A' && (
        <ReadOnlyAmountInput label="IVA 10.5%" value={calculatedValues.vat_amount_105} />
      )}
      <ReadOnlyAmountInput label="Monto Total" value={calculatedValues.total_amount} />

      {/* Status and Supplier Fields */}
      <InvoiceStatusField
        register={register}
        watch={watch}
        setValue={setValue}
        error={errors.status}
      />
      <div>
        <SupplierFilter
          suppliers={suppliers}
          selectedSupplierId={typeof watch('supplierId') === 'number' ? watch('supplierId') : null}
          onChange={(id) => setValue('supplierId', id)}
        />
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
