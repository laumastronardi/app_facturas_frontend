type Supplier = {
  id: number;
  name: string;
  cbu?: string;
  paymentTerm?: number;
};

export default function SupplierTableRow({ supplier }: { supplier: Supplier }) {
  return (
    <tr className="hover:bg-neutral-800/60 transition">
      <td className="p-3 border-t border-neutral-700">{supplier.name}</td>
      <td className="p-3 border-t border-neutral-700">{supplier.cbu ?? '-'}</td>
      <td className="p-3 border-t border-neutral-700">
        {supplier.paymentTerm !== undefined ? `${supplier.paymentTerm} days` : '-'}
      </td>
    </tr>
  );
}
