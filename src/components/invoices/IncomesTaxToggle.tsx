import React from 'react';

interface IncomesTaxToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const IncomesTaxToggle: React.FC<IncomesTaxToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        className={`flex-1 py-2 px-4 border border-neutral-700 transition-colors rounded-l-md ${
          !value
            ? 'bg-red-600 text-white'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        } ${!value ? 'border-red-500' : 'border-neutral-700'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Sin II.BB
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        className={`flex-1 py-2 px-4 border border-neutral-700 transition-colors rounded-r-md ${
          value
            ? 'bg-green-600 text-white'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        } ${value ? 'border-green-500' : 'border-neutral-700'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Con II.BB
      </button>
    </div>
  );
};
