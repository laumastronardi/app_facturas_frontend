import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupplier } from '../../hooks/useSupplier';

type SupplierFormData = {
  name: string;
  cuit?: string;
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
    <form onSubmit={handleSubmit} className="bg-neutral-900 p-4 md:p-6 rounded-lg space-y-4">
      <div>
        <label className="block mb-2 text-sm text-white">Nombre</label>
        <input
          type="text"
          name="name"
          className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:border-brand-orange focus:outline-none"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm text-white">CUIT (opcional)</label>
        <input
          type="text"
          name="cuit"
          className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:border-brand-orange focus:outline-none"
          value={formData.cuit || ''}
          onChange={handleChange}
          placeholder="20-12345678-9"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm text-white">CBU (opcional)</label>
        <input
          type="text"
          name="cbu"
          className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:border-brand-orange focus:outline-none"
          value={formData.cbu || ''}
          onChange={handleChange}
          placeholder="1234567890123456789012"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm text-white">Plazo de pago (días)</label>
        <input
          type="number"
          name="paymentTerm"
          className="w-full p-3 rounded bg-neutral-800 border border-neutral-700 text-white focus:border-brand-orange focus:outline-none"
          value={formData.paymentTerm || ''}
          onChange={handleChange}
          placeholder="30"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-brand-orange hover:bg-orange-500 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg transition-colors font-medium text-base"
        disabled={loading}
      >
        {loading ? 'Creando...' : 'Crear proveedor'}
      </button>
    </form>
  );
}
