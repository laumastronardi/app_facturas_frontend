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
  const [filters, setFilters] = useState<{ [key: string]: string }>({ page: '1', perPage: '10' });
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

  return (
    <div className="px-4 md:px-10 max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold text-white text-center my-8">Listado de Facturas</h1>

      <InvoiceFilterForm
        onFilter={(newFilters) => {
          // 👉 Al aplicar filtro, reseteo siempre a página 1
          setFilters(normalizeFilters(newFilters));
        }}
        suppliers={suppliers}
      />

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Fecha</th>
            <th className="text-left">Proveedor</th>
            <th className="text-left">IVA</th>
            <th className="text-left">Monto</th>
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
