import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import type { Supplier } from '../../types/supplier';

type Props = {
  suppliers: Supplier[];
  selectedSupplierId: number | null;
  onChange: (supplierId: number | null) => void;
  className?: string;
};

export default function SupplierFilter({ suppliers, selectedSupplierId, onChange, className = 'w-full' }: Props) {
  const [query, setQuery] = useState('');

  const filteredSuppliers =
    query === ''
      ? suppliers
      : suppliers.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId) ?? null;

  const handleChange = (supplier: Supplier | null) => {
    onChange(supplier?.id ?? null);
    setQuery('');
  };

  return (
    <Combobox value={selectedSupplier} onChange={handleChange}>
      <div className={`relative ${className}`}>
        <Combobox.Input
          className="w-full rounded border border-neutral-700 bg-neutral-900 text-white px-3 py-2"
          displayValue={(supplier: Supplier | null) => supplier?.name ?? ''}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar proveedor..."
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4 text-white" />
        </Combobox.Button>
        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-neutral-900 border border-neutral-700 shadow-lg z-10">
          <Combobox.Option
            key="none"
            value={null}
            className={({ active }) =>
              `cursor-pointer px-4 py-2 text-white ${active ? 'bg-neutral-700' : ''}`
            }
          >
            Todos
          </Combobox.Option>
          {filteredSuppliers.map((supplier) => (
            <Combobox.Option
              key={supplier.id}
              value={supplier}
              className={({ active }) =>
                `cursor-pointer px-4 py-2 text-white flex items-center justify-between ${
                  active ? 'bg-neutral-700' : ''
                }`
              }
            >
              {supplier.name}
              {supplier.id === selectedSupplierId && <Check className="w-4 h-4" />}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
