// src/pages/NewInvoicePage.tsx

import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { InvoiceForm, type InvoiceFormData } from '../components/invoices/InvoiceForm';

export default function NewInvoicePage() {
  const navigate = useNavigate();

  const handleCreate = async (data: InvoiceFormData) => {
    try {
      // recolectamos exactamente los campos que espera tu API
      await api.post('/invoices', {
        date:           data.date,
        amount:         data.amount,
        amount_105:     data.amount_105,
        total_neto:     data.total_neto,
        vat_amount_21:  data.vat_amount_21,
        vat_amount_105: data.vat_amount_105,
        total_amount:   data.total_amount,
        status:         data.status,
        supplierId:     data.supplierId,
        type:           data.type,
      });
      navigate('/');
    } catch (err) {
      console.error('Error creating invoice via API', err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-gray p-6 md:p-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">New Invoice</h1>
        <InvoiceForm onSubmit={handleCreate} />
      </div>
    </div>
  );
}
  