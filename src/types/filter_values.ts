export type FilterValues = {
  status?: string[];
  type?: string;
  fromDate?: string;
  toDate?: string;
  supplierId?: number | null;
  sortBy?: 'date' | 'supplier' | 'supplier.name';
  sortOrder?: 'asc' | 'desc';
};

export const statusOptions = [
  { value: 'to_pay', label: 'A pagar' },
  { value: 'prepared', label: 'Preparada' },
  { value: 'paid', label: 'Pagada' },
];