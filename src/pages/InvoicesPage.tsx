import { useState } from 'react';
import PaginationControls from '../components/PaginationControl';
import { useInvoices, markInvoiceAsPaid } from '../hooks/useInvoices';
import type { Invoice } from '../types/invoice';
import InvoiceFilterForm from '../components/invoices/InvoiceFilterForm';
import InvoiceTableRow from '../components/invoices/InvoiceTableRow';
import MarkAsPaidModal from '../components/invoices/MarkAsPaidModal';

export default function InvoiceTable() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });
  const { invoices, meta, refetch } = useInvoices(filters, pagination);
  const [animatedRowId, setAnimatedRowId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleOpenModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

    const handleConfirmPaid = async (paymentDate: string) => {
    if (!selectedInvoice) return;
    await markInvoiceAsPaid(selectedInvoice.id, paymentDate);
    setAnimatedRowId(selectedInvoice.id);
    refetch();
    setTimeout(() => setAnimatedRowId(null), 1000);
  };

  return (
    <div className="px-4 md:px-10 max-w-6xl mx-auto">
      <InvoiceFilterForm onFilter={setFilters} />
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
          {Array.isArray(invoices) && invoices.map((invoice: Invoice) => (
            <InvoiceTableRow
              key={invoice.id}
              invoice={invoice}
              animatedRowId={animatedRowId}
              setAnimatedRowId={setAnimatedRowId}
              refetch={refetch}
              onMarkAsPaid={() => handleOpenModal(invoice)}
            />
          ))}
        </tbody>
      </table>
      <PaginationControls
        page={meta.page}
        perPage={meta.perPage}
        total={meta.total}
        onPageChange={(newPage: number) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
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
