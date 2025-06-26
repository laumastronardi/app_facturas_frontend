import React from 'react';

interface ReadOnlyAmountInputProps {
  label: string;
  value: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
};

export const ReadOnlyAmountInput: React.FC<ReadOnlyAmountInputProps> = ({ label, value }) => {
  return (
    <div>
      <label className="block text-sm text-white mb-1">{label}</label>
      <input
        type="text"
        value={formatCurrency(value)}
        readOnly
        className="w-full bg-neutral-800 text-white border border-neutral-700 px-3 py-2 rounded-md cursor-not-allowed"
      />
    </div>
  );
}; 