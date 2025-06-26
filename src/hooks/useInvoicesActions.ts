import { useState } from 'react';
import api from '../api/axios';
import type { Invoice } from '../types/invoice';
import { markInvoiceAsPrepared } from './useInvoices';

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

export async function markInvoiceAsPaid(id: number, paymentDate: string) {
  const response = await api.patch(`/invoices/${id}/mark-as-paid`, {
    paymentDate,
  });
  return response.data;
}

export async function createInvoice(invoiceData: Omit<Invoice, 'id' | 'supplier'> & { supplierId: number }) {
  const response = await api.post('/invoices', invoiceData);
  return response.data;
}

export async function updateInvoice(id: number, invoiceData: Partial<Invoice>) {
  const response = await api.patch(`/invoices/${id}`, invoiceData);
  return response.data;
}

export async function deleteInvoice(id: number) {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
}
