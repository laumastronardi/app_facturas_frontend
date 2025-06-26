import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupplier } from '../../hooks/useSupplier';

type SupplierFormData = {
  name: string;
  cbu?: string;
  paymentTerm?: number;
};

export default function NewSupplierForm() {
  const [formData, setFormData] = useState<SupplierFormData>({ name: '' });
  const { createSupplier, loading } = useSupplier();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'paymentTerm' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = await createSupplier(formData);
    if (supplier) {
      navigate('/suppliers'); // redirige al listado
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 p-6 rounded-lg space-y-4">
      <div>
        <label className="block mb-1 text-sm">Nombre</label>
        <input
          type="text"
          name="name"
          className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">CBU (opcional)</label>
        <input
          type="text"
          name="cbu"
          className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
          value={formData.cbu || ''}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Plazo de pago (días)</label>
        <input
          type="number"
          name="paymentTerm"
          className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
          value={formData.paymentTerm || ''}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="bg-brand-orange hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition"
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear proveedor'}
      </button>
    </form>
  );
}
