// src/hooks/useInvoices.ts
import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { PaginationMeta } from '../types/pagination';
import type { Invoice } from '../types/invoice';

export function useInvoices(
  filters: Record<string, string>,
  pagination: { page: number; perPage: number }
) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, perPage: 10, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );

    const query = {
      ...cleanFilters,
      page: pagination.page.toString(),
      limit: pagination.perPage.toString(),
    };

    const params = new URLSearchParams(query).toString();

    setLoading(true);
    api
      .get('/invoices?' + params, { headers: { 'Cache-Control': 'no-cache' } })
      .then((res) => {
        setInvoices(res.data.data ?? []);
        setMeta(res.data.meta ?? { page: pagination.page, perPage: pagination.perPage, total: 0 });
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, [filters, pagination]);

  return { invoices, meta, loading, refetch: fetchData };
}

export async function markInvoiceAsPaid(id: number, paymentDate: string) {
  try {
    await api.put(`/invoices/${id}`, {
      status: 'paid',
      paymentDate,
    });
  } catch (error) {
    throw error;
  }
}

export async function markInvoiceAsPrepared(id: number) {
  try {
    await api.put(`/invoices/${id}`, {
      status: 'prepared',
    });
  } catch (error) {
    throw error;
  }
}