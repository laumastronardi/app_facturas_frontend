// src/components/invoice/InvoiceForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, FileText } from 'lucide-react';
import api from '../../api/axios';
import { InvoiceTypeToggle } from './InvoiceTypeToggle';
import { InvoiceDateField } from './InvoiceDateField';
import { EditableAmountInput } from './EditableAmountInput';
import { ReadOnlyAmountInput } from './ReadOnlyAmountInput';
import { InvoiceStatusField } from './InvoiceStatusField';
import { InvoiceImageUpload } from './InvoiceImageUpload';
import { OCRResultsDisplay } from './OCRResultsDisplay';
import { EditExtractedDataModal } from './EditExtractedDataModal';
import SupplierFilter from '../suppliers/SuppliersFilter';
import { QuickSupplierCreate } from '../suppliers/QuickSupplierCreate';
import { useInvoiceCalculations } from '../../hooks/useInvoiceCalculations';
import { invoiceFormSchema } from '../../validations/invoiceSchema';
import { useNotifications } from '../../context/NotificationContext';
import type { ProcessedInvoiceData } from '../../hooks/useImageProcessing';

const schema = invoiceFormSchema;

export type InvoiceFormData = Omit<z.infer<typeof schema>, 'supplierId'> & { supplierId: number | null };

type Supplier = {
  id: number;
  name: string;
};

export interface InvoiceFormProps {
  /** Valores iniciales opcionales */
  defaultValues?: Partial<InvoiceFormData>;
  /** Callback que recibe los datos validados */
  onSubmit: (data: InvoiceFormData) => Promise<void> | void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  defaultValues,
  onSubmit,
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inputMode, setInputMode] = useState<'manual' | 'ai'>('manual');
  const [extractedData, setExtractedData] = useState<ProcessedInvoiceData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSupplierCreate, setShowSupplierCreate] = useState(false);
  const [suggestedSupplierName, setSuggestedSupplierName] = useState('');
  const notifications = useNotifications();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'X',
      date: new Date().toISOString().split('T')[0],
      amount_105: 0,
      supplierId: null,
      ...defaultValues,
    },
  });

  const { invoiceType, calculatedValues } = useInvoiceCalculations(watch, setValue);

  useEffect(() => {
    api
      .get<Supplier[]>('/suppliers')
      .then((res) => setSuppliers(res.data));
  }, []);

  // Apply extracted data to form
  const applyExtractedData = (data: ProcessedInvoiceData) => {
    console.log('Applying extracted data to form:', data);
    
    if (data.date) {
      console.log('Setting date:', data.date);
      setValue('date', data.date);
    }
    if (data.type) {
      console.log('Setting type:', data.type);
      setValue('type', data.type);
    }
    if (data.amount !== undefined) {
      console.log('Setting amount:', data.amount);
      setValue('amount', data.amount);
    }
    if (data.amount_105 !== undefined) {
      console.log('Setting amount_105:', data.amount_105);
      setValue('amount_105', data.amount_105);
    }
    if (data.total_neto !== undefined) {
      console.log('Setting total_neto:', data.total_neto);
      setValue('total_neto', data.total_neto);
    }
    if (data.vat_amount_21 !== undefined) {
      console.log('Setting vat_amount_21:', data.vat_amount_21);
      setValue('vat_amount_21', data.vat_amount_21);
    }
    if (data.vat_amount_105 !== undefined) {
      console.log('Setting vat_amount_105:', data.vat_amount_105);
      setValue('vat_amount_105', data.vat_amount_105);
    }
    if (data.total_amount !== undefined) {
      console.log('Setting total_amount:', data.total_amount);
      setValue('total_amount', data.total_amount);
    }
    
    // Try to find existing supplier or suggest creating new one
    if (data.supplier?.name) {
      console.log('Looking for supplier:', data.supplier.name);
      const existingSupplier = suppliers.find(s => 
        s.name.toLowerCase().includes(data.supplier!.name!.toLowerCase()) ||
        data.supplier!.name!.toLowerCase().includes(s.name.toLowerCase())
      );
      
      if (existingSupplier) {
        console.log('Found existing supplier:', existingSupplier);
        setValue('supplierId', existingSupplier.id);
      } else {
        console.log('Supplier not found, suggesting to create new one');
        // Suggest creating new supplier
        setSuggestedSupplierName(data.supplier.name);
        notifications.info(
          'Proveedor no encontrado',
          `El proveedor "${data.supplier.name}" no está en tu lista. ¿Deseas crearlo?`
        );
      }
    }
    
    console.log('Form values after applying data:', getValues());
  };

  const handleDataExtracted = (data: ProcessedInvoiceData) => {
    console.log('handleDataExtracted called with:', data);
    setExtractedData(data);
    notifications.info(
      'Datos extraídos de la imagen',
      'Revisa los datos y haz clic en "Aplicar" para utilizarlos en el formulario.'
    );
  };

  const handleApplyData = (data: ProcessedInvoiceData) => {
    console.log('handleApplyData called with:', data);
    applyExtractedData(data);
    setExtractedData(null);
    notifications.success(
      'Datos aplicados',
      'Los datos extraídos se han aplicado al formulario correctamente.'
    );
    console.log('Data applied successfully');
  };

  const handleEditData = (data: ProcessedInvoiceData) => {
    setExtractedData(data);
    setShowEditModal(true);
  };

  const handleSaveEditedData = (data: ProcessedInvoiceData) => {
    applyExtractedData(data);
    setExtractedData(null);
    setShowEditModal(false);
  };

  const handleSupplierCreated = (supplier: { id: number; name: string }) => {
    // Refresh suppliers list
    setSuppliers(prev => [...prev, supplier]);
    // Auto-select the new supplier
    setValue('supplierId', supplier.id);
    notifications.success('Proveedor seleccionado', `Se ha seleccionado "${supplier.name}" automáticamente.`);
  };

  return (
    <div className="space-y-6">
      {/* Input Mode Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          type="button"
          onClick={() => setInputMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
            inputMode === 'manual'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Manual
        </button>
        <button
          type="button"
          onClick={() => setInputMode('ai')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
            inputMode === 'ai'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          Escáner IA
        </button>
      </div>

      {/* AI Upload Section */}
      {inputMode === 'ai' && (
        <div className="space-y-4">
          <InvoiceImageUpload
            onDataExtracted={handleDataExtracted}
            onError={(error) => console.error('Upload error:', error)}
          />
          
          {extractedData && (
            <OCRResultsDisplay
              data={extractedData}
              onApplyData={handleApplyData}
              onEditData={handleEditData}
            />
          )}
        </div>
      )}

      {/* Manual Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Date */}
        <InvoiceDateField register={register} error={errors.date} />

        <div>
          <label className="block text-sm text-white mb-1">Proveedor</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <SupplierFilter
                suppliers={suppliers}
                selectedSupplierId={typeof watch('supplierId') === 'number' ? watch('supplierId') : null}
                onChange={(id) => setValue('supplierId', id)}
              />
            </div>
            {suggestedSupplierName && (
              <button
                type="button"
                onClick={() => setShowSupplierCreate(true)}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
                title={`Crear proveedor: ${suggestedSupplierName}`}
              >
                + Crear
              </button>
            )}
          </div>
          {errors.supplierId && <p className="text-red-400 text-xs">{errors.supplierId.message}</p>}
        </div>

        {/* Type */}
        <div>
          <InvoiceTypeToggle
            value={invoiceType}
            onChange={(type: 'A' | 'X') => {
              setValue('type', type);
            }}
          />
          <input
            type="hidden"
            {...register('type')}
          />
        </div>

        {/* Amount Fields */}
        <EditableAmountInput
          label={invoiceType === 'A' ? 'Monto IVA 21%' : 'Monto'}
          value={watch('amount')}
          onChange={val => setValue('amount', val)}
          error={errors.amount?.message}
        />
        {invoiceType === 'A' && (
          <EditableAmountInput
            label="Monto IVA 10.5%"
            value={watch('amount_105')}
            onChange={val => setValue('amount_105', val)}
            error={errors.amount_105?.message}
          />
        )}
        <ReadOnlyAmountInput label="Total Neto" value={calculatedValues.total_neto} />
        {invoiceType === 'A' && (
          <ReadOnlyAmountInput label="IVA 21%" value={calculatedValues.vat_amount_21} />
        )}
        {invoiceType === 'A' && (
          <ReadOnlyAmountInput label="IVA 10.5%" value={calculatedValues.vat_amount_105} />
        )}
        <ReadOnlyAmountInput label="Monto Total" value={calculatedValues.total_amount} />

        {/* Status and Supplier Fields */}
        <InvoiceStatusField
          register={register}
          watch={watch}
          setValue={setValue}
          error={errors.status}
        />

        {/* Hidden inputs for calculated fields */}
        <div>
          <input
            type="hidden"
            {...register('total_neto')}
          />
          <input
            type="hidden"
            {...register('vat_amount_21')}
          />
          <input
            type="hidden"
            {...register('vat_amount_105')}
          />
          <input
            type="hidden"
            {...register('total_amount')}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-orange hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Factura'}
        </button>
      </form>

      {/* Edit Modal */}
      {showEditModal && extractedData && (
        <EditExtractedDataModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEditedData}
          initialData={extractedData}
        />
      )}

      {/* Quick Supplier Create Modal */}
      {showSupplierCreate && (
        <QuickSupplierCreate
          isOpen={showSupplierCreate}
          onClose={() => {
            setShowSupplierCreate(false);
            setSuggestedSupplierName('');
          }}
          onSupplierCreated={handleSupplierCreated}
          initialName={suggestedSupplierName}
        />
      )}
    </div>
  );
};
