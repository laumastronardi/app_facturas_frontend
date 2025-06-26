import React from 'react';
import type { UseFormRegister, FieldError, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { InvoiceFormData } from './InvoiceForm';
import { InvoiceStatusToggle } from './InvoiceStatusToggle';

type Supplier = {
  id: number;
  name: string;
};

interface InvoiceStatusSupplierFieldsProps {
  register: UseFormRegister<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  errors: {
    status?: FieldError;
    supplierId?: FieldError;
  };
  suppliers: Supplier[];
}

export const InvoiceStatusSupplierFields: React.FC<InvoiceStatusSupplierFieldsProps> = ({
  register,
  watch,
  setValue,
  errors,
  suppliers,
}) => {
  const status = watch('status');

  return (
    <>
      {/* Status */}
      <div>
        <label className="block text-sm text-white mb-1">Status</label>
        <InvoiceStatusToggle
          value={status}
          onChange={(newStatus) => {
            setValue('status', newStatus);
          }}
        />
        <input
          type="hidden"
          {...register('status')}
        />
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
    </>
  );
}; 