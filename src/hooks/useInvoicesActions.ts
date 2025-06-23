import { useState } from 'react';
import { markInvoiceAsPaid, markInvoiceAsPrepared } from './useInvoices';

export function useInvoiceActions({ setAnimatedRowId, refetch }: {
  setAnimatedRowId: (id: number | null) => void;
  refetch: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleMarkAsPaid = async (id: number, paymentDate: string) => {
    try {
      setLoading(true);
      await markInvoiceAsPaid(id, paymentDate);
      setAnimatedRowId(id);
      refetch();
      setTimeout(() => setAnimatedRowId(null), 1000);
    } catch (err) {
      console.error('Error al marcar como pagada', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPrepared = async (id: number) => {
    try {
      setLoading(true);
      await markInvoiceAsPrepared(id);
      setAnimatedRowId(id);
      refetch();
      setTimeout(() => setAnimatedRowId(null), 1000);
    } catch (err) {
      console.error('Error al marcar como preparada', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleMarkAsPaid,
    handleMarkAsPrepared,
  };
}
