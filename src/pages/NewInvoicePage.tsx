import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  status: z.enum(['to_pay', 'prepared', 'paid']),
  supplierId: z.coerce.number().int().positive(),
  type: z.enum(['A', 'X']),
  vat: z.coerce.number().min(0).max(100).optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'A' && data.vat === undefined) {
    ctx.addIssue({
      path: ['vat'],
      code: z.ZodIssueCode.custom,
      message: 'VAT is required for invoice type A',
    });
  }
  if (data.type === 'X' && data.vat !== undefined) {
    ctx.addIssue({
      path: ['vat'],
      code: z.ZodIssueCode.custom,
      message: 'VAT must be empty for invoice type X',
    });
  }
});

type InvoiceFormData = z.infer<typeof schema>;

type Supplier = {
  id: number;
  name: string;
};

export default function NewInvoicePage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'A',
    },
  });

  const invoiceType = watch('type');

  useEffect(() => {
    api.get('/suppliers')
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error('Error loading suppliers', err));
  }, []);

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      await api.post('/invoices', data);
      navigate('/');
    } catch (err) {
      console.error('Error creating invoice', err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-gray p-6 md:p-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">New Invoice</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-white mb-1">Date</label>
            <input
              type="date"
              {...register('date')}
              className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
            />
            {errors.date && <p className="text-red-400 text-xs">{errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Type</label>
            <select
              {...register('type')}
              className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
            >
              <option value="A">Factura A</option>
              <option value="X">Factura X</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-white mb-1">IVA(%)</label>
            <select
              {...register('vat')}
              disabled={invoiceType === 'X'}
              className={`w-full bg-neutral-900 text-white border px-3 py-2 rounded-md ${invoiceType === 'X'
                  ? 'border-neutral-700 opacity-50 cursor-not-allowed'
                  : 'border-neutral-700'
                }`}
            >
              <option value="">-- Select VAT --</option>
              <option value="21">21%</option>
              <option value="10.5">10.5%</option>
            </select>
            {errors.vat && <p className="text-red-400 text-xs">{errors.vat.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Amount</label>
            <input
              type="number"
              {...register('amount')}
              className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
            />
            {errors.amount && <p className="text-red-400 text-xs">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
            >
              <option value="to_pay">To Pay</option>
              <option value="prepared">Prepared</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Supplier</label>
            <select
              {...register('supplierId')}
              className="w-full bg-neutral-900 text-white border border-neutral-700 px-3 py-2 rounded-md"
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.supplierId && <p className="text-red-400 text-xs">{errors.supplierId.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-orange hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Invoice'}
          </button>
        </form>
      </div>
    </div>
  );
}
