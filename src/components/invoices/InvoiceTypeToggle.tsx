import React from 'react';

export type InvoiceType = 'A' | 'X';

interface InvoiceTypeToggleProps {
  value: InvoiceType;
  onChange: (value: InvoiceType) => void;
  disabled?: boolean;
}

export const InvoiceTypeToggle: React.FC<InvoiceTypeToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('A')}
        className={`flex-1 py-2 px-4 border border-neutral-700 transition-colors rounded-l-md ${
          value === 'A'
            ? 'bg-red-600 text-white'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        } ${value === 'A' ? 'border-red-500' : 'border-neutral-700'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Factura A
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('X')}
        className={`flex-1 py-2 px-4 border border-neutral-700 transition-colors rounded-r-md ${
          value === 'X'
            ? 'bg-blue-600 text-white'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        } ${value === 'X' ? 'border-blue-500' : 'border-neutral-700'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Factura X
      </button>
    </div>
  );
}; 