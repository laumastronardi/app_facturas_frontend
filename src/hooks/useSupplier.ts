// src/hooks/useCreateSupplier.ts
import { useState } from 'react';
import api from '../api/axios';
import type { Supplier } from '../types/supplier';

export function useSupplier() {
  const [loading, setLoading] = useState(false);

  const createSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    setLoading(true);
    try {
      const response = await api.post('/suppliers', supplierData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return { createSupplier, loading };
}
