import React from 'react';
import type { UseFormRegister, FieldError, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { InvoiceFormData } from './InvoiceForm';
import { InvoiceStatusToggle } from './InvoiceStatusToggle';

interface InvoiceStatusFieldProps {
  register: UseFormRegister<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  error?: FieldError;
}

export const InvoiceStatusField: React.FC<InvoiceStatusFieldProps> = ({
  register,
  watch,
  setValue,
  error,
}) => {
  const status = watch('status');
  return (
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
      {error && <p className="text-red-400 text-xs">{error.message}</p>}
    </div>
  );
}; 