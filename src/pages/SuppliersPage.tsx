import { useNavigate } from 'react-router-dom';
import SupplierTableRow from '../components/suppliers/SupplierTableRow';
import { useSuppliers } from '../hooks/useSuppliers';
import type { Supplier } from '../types/supplier';

export default function SuppliersPage() {
  const { suppliers, loading } = useSuppliers();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-black text-brand-gray p-4 md:p-10 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Proveedores</h1>
        <button
          className="w-full sm:w-auto bg-brand-orange hover:bg-orange-500 text-white px-6 py-3 rounded-lg text-sm transition font-medium"
          onClick={() => navigate('/suppliers/new')}
        >
          + Nuevo Proveedor
        </button>
      </div>

      {loading ? (
        <p className="text-brand-gray">Cargando proveedores...</p>
      ) : suppliers.length === 0 ? (
        <p className="italic text-brand-gray">No hay proveedores disponibles.</p>
      ) : (
        <>
          {/* Mobile view - Cards */}
          <div className="block md:hidden space-y-4">
            {suppliers.map((supplier: Supplier) => (
              <div key={supplier.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="text-white font-medium text-lg">{supplier.name}</h3>
                  {supplier.cuit && (
                    <p className="text-gray-400 text-sm">CUIT: {supplier.cuit}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {supplier.cbu && (
                    <div>
                      <span className="text-gray-400">CBU:</span>
                      <span className="text-white ml-2">{supplier.cbu}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Plazo de pago:</span>
                    <span className="text-white ml-2">{supplier.paymentTerm} días</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view - Table */}
          <div className="hidden md:block overflow-x-auto border border-neutral-700 rounded-xl shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-900 text-brand-gray">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">CUIT</th>
                  <th className="p-3">CBU</th>
                  <th className="p-3">Plazo de Pago</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier: Supplier) => (
                  <SupplierTableRow key={supplier.id} supplier={supplier} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
