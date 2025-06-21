// src/hooks/useCreateSupplier.ts
import { useState } from 'react';
import api from '../api/axios';
import type { Supplier } from '../types/supplier';

interface CreateSupplierInput {
  name: string;
  cbu?: string;
  paymentTerm?: number;
}

export function useCreateSupplier() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSupplier = async (data: CreateSupplierInput): Promise<Supplier | null> => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await api.post<Supplier>('/suppliers', data);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error creating supplier');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createSupplier, loading, success, error };
}
