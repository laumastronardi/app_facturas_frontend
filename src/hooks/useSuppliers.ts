// src/hooks/useSuppliers.ts
import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Supplier } from '../types/supplier';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get('/suppliers');
        setSuppliers(response.data.data || []);
      } catch (err) {
        setError('Error al cargar los proveedores');
        console.error('Error fetching suppliers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return { suppliers, loading, error };
};

export async function fetchSuppliers() {
  const response = await api.get('/suppliers');
  return response.data;
}