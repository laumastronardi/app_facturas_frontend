import { ChevronDown, Check } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

type Option<T> = {
  value: T;
  label: string;
};

type Props<T> = {
  options: Option<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  searchable?: boolean;
};

export default function MultiSelectDropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchable = false,
}: Props<T>) {
  
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (val: string | number) => {
    const typedVal = val as T;
    if (value.includes(typedVal)) {
        onChange(value.filter((v) => v !== typedVal));
    } else {
        onChange([...value, typedVal]);
    }
  };

  const displayLabel = () => {
    if (value.length === 0) return placeholder;
    return options.filter((opt) => value.includes(opt.value)).map(opt => opt.label).join(', ');
  };

  const filteredOptions = query === ''
    ? options
    : options.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-neutral-800 text-white rounded px-3 py-2 text-left flex justify-between items-center"
      >
        <span className="truncate">{displayLabel()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-10 w-full bg-neutral-900 border border-neutral-700 mt-1 rounded shadow-lg">
          {searchable && (
            <input
              type="text"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 text-white border-b border-neutral-700 outline-none"
            />
          )}
          <ul>
            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className="px-4 py-2 hover:bg-neutral-700 flex justify-between items-center text-white cursor-pointer"
              >
                <span>{opt.label}</span>
                {value.includes(opt.value) && <Check className="w-4 h-4" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
