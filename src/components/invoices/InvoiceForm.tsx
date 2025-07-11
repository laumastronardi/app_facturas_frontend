// src/components/invoice/InvoiceForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, FileText } from 'lucide-react';
import api from '../../api/axios';
import { InvoiceTypeToggle } from './InvoiceTypeToggle';
import { IncomesTaxToggle } from './IncomesTaxToggle';
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
  const [suggestedSupplierData, setSuggestedSupplierData] = useState<{name: string; cuit?: string} | null>(null);
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
      has_ii_bb: false,
      ii_bb_amount: 0,
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
    if (data.has_ii_bb !== undefined) {
      console.log('Setting has_ii_bb:', data.has_ii_bb);
      setValue('has_ii_bb', data.has_ii_bb);
    }
    if (data.ii_bb_amount !== undefined) {
      console.log('Setting ii_bb_amount:', data.ii_bb_amount);
      setValue('ii_bb_amount', data.ii_bb_amount);
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
        setSuggestedSupplierData({
          name: data.supplier.name,
          cuit: data.supplier.cuit
        });
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
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
        <button
          type="button"
          onClick={() => setInputMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-md transition-colors text-sm ${
            inputMode === 'manual'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Manual</span>
        </button>
        <button
          type="button"
          onClick={() => setInputMode('ai')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-md transition-colors text-sm ${
            inputMode === 'ai'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Escáner IA</span>
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
          <div className="flex flex-col sm:flex-row gap-2">
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
                className="px-3 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                title={`Crear proveedor: ${suggestedSupplierName}`}
              >
                + Crear
              </button>
            )}
          </div>
          {errors.supplierId && <p className="text-red-400 text-xs mt-1">{errors.supplierId.message}</p>}
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
        <div className="space-y-4">
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
        </div>

        {/* Ingresos Brutos - Solo para Facturas A */}
        {invoiceType === 'A' && (
          <>
            <div>
              <label className="block text-sm text-white mb-2">Ingresos Brutos</label>
              <IncomesTaxToggle
                value={watch('has_ii_bb')}
                onChange={(value) => setValue('has_ii_bb', value)}
              />
              <input
                type="hidden"
                {...register('has_ii_bb')}
              />
            </div>
            
            <ReadOnlyAmountInput 
              label="Impuesto II.BB (4%)" 
              value={calculatedValues.ii_bb_amount} 
            />
          </>
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
            {...register('ii_bb_amount')}
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
          className="w-full bg-brand-orange hover:bg-orange-500 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg transition-colors font-medium text-base"
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
            setSuggestedSupplierData(null);
          }}
          onSupplierCreated={handleSupplierCreated}
          initialName={suggestedSupplierData?.name || suggestedSupplierName}
          initialCuit={suggestedSupplierData?.cuit || ''}
        />
      )}
    </div>
  );
};
