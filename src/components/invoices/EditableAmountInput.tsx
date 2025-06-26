import React, { useState, useEffect } from 'react';

interface EditableAmountInputProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const EditableAmountInput: React.FC<EditableAmountInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder = '0',
  error,
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    setDisplayValue(value !== undefined && value !== null ? value.toString() : '');
  }, [value]);

  return (
    <div>
      <label className="block text-sm text-white mb-1">{label}</label>
      <input
        type="text"
        value={displayValue}
        onChange={e => {
          setDisplayValue(e.target.value);
          const numericValue = Number(e.target.value) || 0;
          onChange(numericValue);
        }}
        onBlur={e => {
          const numericValue = Number(e.target.value) || 0;
          onChange(numericValue);
          setDisplayValue(numericValue.toString());
          if (onBlur) onBlur();
        }}
        className={`w-full bg-neutral-900 text-white border ${error ? 'border-red-400' : 'border-neutral-700'} px-3 py-2 rounded-md`}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}; 