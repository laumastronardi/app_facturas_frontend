// src/pages/InvoicePageWrapper.tsx
import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import type { Invoice } from '../types/invoice';
import { markInvoiceAsPaid, useInvoices } from '../hooks/useInvoices';
import { fetchSuppliers } from '../hooks/useSuppliers';
import InvoiceFilterForm from '../components/invoices/InvoiceFilterForm';
import InvoiceTableRow from '../components/invoices/InvoiceTableRow';
import PaginationControls from '../components/PaginationControl';
import MarkAsPaidModal from '../components/invoices/MarkAsPaidModal';
import { normalizeFilters } from '../utils/normalizeFilters';

export default function InvoicePageWrapper() {
  const [filters, setFilters] = useState<{
    page: string;
    perPage: string;
    sortBy: 'date' | 'supplier.name';
    sortOrder: 'asc' | 'desc';
    status?: string[];
    type?: string;
    fromDate?: string;
    toDate?: string;
    supplierId?: number | null;
  }>({
    page: '1',
    perPage: '100',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [animatedRowId, setAnimatedRowId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const { invoices, pagination: invoicesPagination, refetch } = useInvoices(filters);
  const { data: suppliers = [] } = useSWRImmutable('/suppliers', fetchSuppliers);

  const handleConfirmPaid = async (paymentDate: string) => {
    if (!selectedInvoice) return;
    await markInvoiceAsPaid(selectedInvoice.id, paymentDate);
    setAnimatedRowId(selectedInvoice.id);
    refetch();
    setTimeout(() => setAnimatedRowId(null), 1000);
  };

  // Handler para ordenar columnas
  const handleSort = (column: 'date' | 'supplier.name') => {
    setFilters((prev) => {
      if (prev.sortBy === column) {
        return { ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc', page: '1' };
      } else {
        return { ...prev, sortBy: column, sortOrder: 'asc', page: '1' };
      }
    });
  };

  return (
    <div className="px-4 md:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold text-white text-center my-6 md:my-8">Listado de Facturas</h1>

      <InvoiceFilterForm
        onFilter={(newFilters) => {
          setFilters((prev) => ({
            ...prev,
            ...normalizeFilters(newFilters),
            page: '1',
          }));
        }}
        suppliers={suppliers}
      />

      {/* Mobile view - Cards */}
      <div className="block md:hidden space-y-4 mt-6">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white font-medium">{invoice.supplier.name}</p>
                <p className="text-gray-400 text-sm">{invoice.date}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                invoice.status === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {invoice.status === 'paid' ? 'Pagado' : invoice.status === 'prepared' ? 'Preparado' : 'Por Pagar'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Tipo:</span>
                <span className="text-white ml-2">{invoice.type}</span>
              </div>
              <div>
                <span className="text-gray-400">Total:</span>
                <span className="text-white ml-2">${invoice.total_amount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedInvoice(invoice);
                  setModalOpen(true);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                disabled={invoice.status === 'paid'}
              >
                {invoice.status === 'paid' ? 'Pagado' : 'Marcar como Pagado'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th
                className="text-left cursor-pointer select-none"
                onClick={() => handleSort('date')}
              >
                Fecha
                {filters.sortBy === 'date' && (filters.sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th
                className="text-left cursor-pointer select-none"
                onClick={() => handleSort('supplier.name')}
              >
                Proveedor
                {filters.sortBy === 'supplier.name' && (filters.sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
              <th className="text-left">Tipo</th>
              <th className="text-left">Total Neto</th>
              <th className="text-left">IVA</th>
              <th className="text-left">Monto Total</th>
              <th className="text-left">Estado</th>
              <th className="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <InvoiceTableRow
                key={invoice.id}
                invoice={invoice}
                animatedRowId={animatedRowId}
                setAnimatedRowId={setAnimatedRowId}
                refetch={refetch}
                onMarkAsPaid={() => {
                  setSelectedInvoice(invoice);
                  setModalOpen(true);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationControls
        page={Number(filters.page) || 1}
        perPage={Number(filters.perPage) || 10}
        total={invoicesPagination?.meta?.total ?? 0}
        onPageChange={(newPage) =>
          setFilters((prev) => ({ ...prev, page: String(newPage) }))
        }
      />

      <MarkAsPaidModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmPaid}
      />
    </div>
  );
}
