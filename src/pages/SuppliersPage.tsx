import { useNavigate } from 'react-router-dom';
import SupplierTableRow from '../components/suppliers/SupplierTableRow';
import { useSuppliers } from '../hooks/useSuppliers';
import type { Supplier } from '../types/supplier';

export default function SuppliersPage() {
  const { suppliers, loading } = useSuppliers();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-black text-brand-gray p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Suppliers</h1>
        <button
          className="bg-brand-orange hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm transition"
          onClick={() => navigate('/suppliers/new')}
        >
          + New Supplier
        </button>
      </div>

      {loading ? (
        <p className="text-brand-gray">Loading suppliers...</p>
      ) : suppliers.length === 0 ? (
        <p className="italic text-brand-gray">No suppliers available.</p>
      ) : (
        <div className="overflow-x-auto border border-neutral-700 rounded-xl shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-900 text-brand-gray">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">CBU</th>
                <th className="p-3">Payment Term</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier: Supplier) => (
                <SupplierTableRow key={supplier.id} supplier={supplier} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
