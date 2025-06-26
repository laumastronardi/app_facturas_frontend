// src/hooks/useInvoices.ts
import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Invoice } from '../types/invoice';
import type { FilterValues } from '../types/filter_values';
import type { PaginatedResponse } from '../types/pagination';
import { normalizeFilters } from '../utils/normalizeFilters';

export const useInvoices = (filters: FilterValues) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedResponse<Invoice> | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const normalizedFilters = normalizeFilters(filters);
        const response = await api.get('/invoices', { params: normalizedFilters });
        setInvoices(response.data.data);
        setPagination(response.data);
      } catch (err) {
        setError('Error al cargar las facturas');
        console.error('Error fetching invoices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [filters, reloadFlag]);

  const refetch = () => setReloadFlag(flag => flag + 1);

  return { invoices, loading, error, pagination, refetch };
};

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