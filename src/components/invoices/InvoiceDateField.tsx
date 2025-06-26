import React from 'react';
import type { UseFormRegister, FieldError } from 'react-hook-form';
import type { InvoiceFormData } from './InvoiceForm';

interface InvoiceDateFieldProps {
  register: UseFormRegister<InvoiceFormData>;
  error?: FieldError;
}

export const InvoiceDateField: React.FC<InvoiceDateFieldProps> = ({ register, error }) => {
  return (
    <div>
      <label className="block text-sm text-white mb-1">Date</label>
      <input
        type="date"
        {...register('date')}
        className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
      />
      {error && <p className="text-red-400 text-xs">{error.message}</p>}
    </div>
  );
}; 