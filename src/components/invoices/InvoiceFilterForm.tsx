import { useForm } from 'react-hook-form';
import SupplierFilter from '../suppliers/SuppliersFilter';
import type { Supplier } from '../../types/supplier';
import { statusOptions, type FilterValues } from '../../types/filter_values';
import MultiSelectDropdown from '../MultipleSelectDropdown';

export default function InvoiceFilterForm({ onFilter, suppliers }: { onFilter: (filters: FilterValues) => void; suppliers: Supplier[]; }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<FilterValues>();
  const status = watch('status') ?? [];

  const onSubmit = (data: FilterValues) => {
    const query: Record<string, string> = Object.fromEntries(
      Object.entries(data)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
    );

    onFilter(query); // esto lo maneja el padre
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 mb-6">
      <MultiSelectDropdown<string>
        options={statusOptions}
        value={status}
        onChange={(val) => setValue('status', val)}
        placeholder="Filtrar estado"
      />

      <SupplierFilter
        suppliers={suppliers}
        selectedSupplierId={watch('supplierId') ?? null}
        onChange={(id) => setValue('supplierId', id)}
      />

      <select {...register('type')} className="bg-neutral-800 p-2 rounded text-white">
        <option value="">Tipo</option>
        <option value="A">Factura A</option>
        <option value="X">Factura X</option>
      </select>

      <input
        type="date"
        {...register('fromDate')}
        className="bg-neutral-800 p-2 rounded text-white"
      />

      <input
        type="date"
        {...register('toDate')}
        className="bg-neutral-800 p-2 rounded text-white"
      />

      <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded">
        Filtrar
      </button>
      <button
        type="button"
        onClick={() => {
          reset();
          onFilter({});
        }}
        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
      >
        Limpiar
      </button>
    </form>
  );
}
