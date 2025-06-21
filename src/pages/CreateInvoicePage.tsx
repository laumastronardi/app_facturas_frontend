
import { useNavigate } from 'react-router-dom';
import InvoiceForm from '../components/invoices/InvoiceForm';
import api from '../api/axios';

export default function CreateInvoicePage() {
  const navigate = useNavigate();

  const handleCreateInvoice = async (data: any) => {
    try {
      await api.post(data);
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-orange-500">Create Invoice</h1>
      <InvoiceForm onSubmit={handleCreateInvoice} />
    </div>
  );
}
