import { useForm } from 'react-hook-form';

type FilterValues = {
  status?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
};

export default function InvoiceFilterForm({ onFilter }: { onFilter: (filters: FilterValues) => void }) {
  const { register, handleSubmit, reset } = useForm<FilterValues>();

  const onSubmit = (data: any) => {
    const query = {
      ...data,
      page: '1', // resetear página cuando aplicás filtros
      limit: '10',
    };
    onFilter(query); // esto ejecuta setFilters en el padre
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 mb-6">
      <select {...register('status')} className="bg-neutral-800 p-2 rounded text-white">
        <option value="">Estado</option>
        <option value="to_pay">A pagar</option>
        <option value="prepared">Preparada</option>
        <option value="paid">Pagada</option>
      </select>

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
