import NewSupplierForm from "../components/suppliers/NewSupplierForm";


export default function NewSupplierPage() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-gray p-4 md:p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Crear nuevo proveedor</h1>
      <NewSupplierForm />
    </div>
  );
}
