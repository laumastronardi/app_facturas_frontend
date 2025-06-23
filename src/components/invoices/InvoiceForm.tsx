import { useState } from 'react';

interface InvoiceFormProps {
  onSubmit: (data: any) => void;
}

export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'A' | 'X'>('A');
  const [vat, setVat] = useState<'21' | '10.5'>('21');
  const [supplierId, setSupplierId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const data = {
      date,
      amount: parsedAmount,
      type,
      vat: type === 'A' ? parseFloat(vat) : undefined,
      supplierId,
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 p-6 rounded-2xl shadow-lg max-w-xl mx-auto space-y-4 text-white">
      <div>
        <label className="block text-sm mb-1">Fecha</label>
        <input
          type="text"
          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Monto sin IVA</label>
        <input
          type="number"
          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Tipo de factura</label>
        <select
          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded"
          value={type}
          onChange={(e) => setType(e.target.value as 'A' | 'X')}
        >
          <option value="A">A</option>
          <option value="X">X</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">IVA</label>
        <select
          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded"
          value={vat}
          onChange={(e) => setVat(e.target.value as '21' | '10.5')}
          disabled={type === 'X'}
        >
          <option value="21">21%</option>
          <option value="10.5">10.5%</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Proveedor</label>
        <input
          type="text"
          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-xl w-full"
      >
        Guardar factura
      </button>
    </form>
  );
}
