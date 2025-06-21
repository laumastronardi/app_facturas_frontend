// src/hooks/useSuppliers.ts
import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Supplier } from '../types/supplier'; // asegurate de tener este tipo

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/suppliers')
      .then((res) => setSuppliers(res.data ?? []))
      .catch((err) => console.error('Error loading suppliers', err))
      .finally(() => setLoading(false));
  }, []);

  return { suppliers, loading }; // 👈 devolvemos un objeto
}
