import { useState } from 'react';
import type { Invoice } from '../../types/invoice';
import { markInvoiceAsPaid } from '../../hooks/useInvoices';
import { statusColor, statusText } from '../../helpers/StatusFormatter';
import { CheckCircle } from 'lucide-react';

type Props = {
  invoice: Invoice;
  animatedRowId: number | null;
  setAnimatedRowId: (id: number | null) => void;
  refetch: () => void;
  onMarkAsPaid: (invoice: Invoice) => void;
};

export default function InvoiceTableRow({ invoice, animatedRowId, setAnimatedRowId, refetch, onMarkAsPaid }: Props) {
  const [showDateInput, setShowDateInput] = useState(false);
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleMarkAsPaid = async () => {
    try {
      setLoading(true);
      await markInvoiceAsPaid(invoice.id, paymentDate);
      setAnimatedRowId(invoice.id);
      refetch(); // Refetch invoices to update the list
      setTimeout(() => setAnimatedRowId(null), 1000);
    } catch (err) {
      console.error('Error al marcar como pagada', err);
    } finally {
      setLoading(false);
    }
  };

  const isAnimated = animatedRowId === invoice.id;

  return (
    <tr className={`border-t border-neutral-800 transition-all duration-500 ${isAnimated ? 'bg-green-900' : ''}`}>
      <td className="p-3">{invoice.date}</td>
      <td className="p-3">{invoice.supplier?.name || '-'}</td>
      <td className="p-3">{invoice.vat ?? '-'}</td>
      <td className="p-3">${invoice.amount}</td>
      <td className="p-3">
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${statusColor(invoice.status)} w-24 text-center`}>
          {statusText(invoice.status)}
        </span>
      </td>
      <td className="p-3">
        {invoice.status !== 'paid' && (
          <div className="flex items-center gap-2">
            {showDateInput ? (
              <>
                <input
                  type="date"
                  className="bg-neutral-800 border border-neutral-700 text-sm px-2 py-1 rounded text-white"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
                <button
                  onClick={handleMarkAsPaid}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white text-sm"
                >
                  {loading ? 'Guardando...' : 'Confirmar'}
                </button>
              </>
            ) : (
                <button
                  onClick={() => onMarkAsPaid(invoice)}
                  className="bg-blue-600 hover:bg-blue-700 p-1 rounded text-white"
                  title="Marcar como pagada"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
