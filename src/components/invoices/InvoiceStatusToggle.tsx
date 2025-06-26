import React from 'react';

export type InvoiceStatus = 'to_pay' | 'prepared' | 'paid';

interface InvoiceStatusToggleProps {
  value: InvoiceStatus;
  onChange: (value: InvoiceStatus) => void;
  disabled?: boolean;
}

export const InvoiceStatusToggle: React.FC<InvoiceStatusToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('to_pay')}
        className={`flex-1 py-2 px-4 border border-neutral-700 transition-colors rounded-l-md ${
          value === 'to_pay'
            ? 'bg-red-600 text-white'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        } ${value === 'to_pay' ? 'border-red-500' : 'border-neutral-700'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        To Pay
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('prepared')}
        className={`flex-1 py-2 px-4 border border-neutral-700 transition-colors ${
          value === 'prepared'
            ? 'bg-yellow-600 text-white'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        } ${value === 'prepared' ? 'border-yellow-500' : 'border-neutral-700'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Prepared
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('paid')}
        className={`flex-1 py-2 px-4 border border-neutral-700 transition-colors rounded-r-md ${
          value === 'paid'
            ? 'bg-green-600 text-white'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        } ${value === 'paid' ? 'border-green-500' : 'border-neutral-700'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Paid
      </button>
    </div>
  );
}; 