import { useState } from 'react';
import { createInvoiceFromOCR, type ProcessedInvoiceData } from '../api/aiProcessing';
import { useNotification } from '../context/NotificationContext';

interface InvoiceCreationStatus {
  status: 'idle' | 'creating' | 'success' | 'error';
  message?: string;
}

export const useInvoiceFromOCR = () => {
  const [creationStatus, setCreationStatus] = useState<InvoiceCreationStatus>({ status: 'idle' });
  const [createdInvoice, setCreatedInvoice] = useState<any>(null);
  const { showNotification } = useNotification();

  const createInvoice = async (ocrData: ProcessedInvoiceData): Promise<any | null> => {
    try {
      setCreationStatus({ status: 'creating', message: 'Creando factura...' });

      const response = await createInvoiceFromOCR(ocrData);

      if (response.success && response.invoice) {
        setCreationStatus({ status: 'success', message: 'Factura creada exitosamente' });
        setCreatedInvoice(response.invoice);
        
        showNotification({
          type: 'success',
          title: 'Factura creada',
          message: 'La factura se ha creado exitosamente desde los datos extraídos',
        });

        return response.invoice;
      }

      throw new Error(response.message || 'Error al crear la factura');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la factura';
      setCreationStatus({ status: 'error', message: errorMessage });
      
      showNotification({
        type: 'error',
        title: 'Error al crear factura',
        message: errorMessage,
      });

      console.error('Error creating invoice from OCR:', error);
      return null;
    }
  };

  const clearCreation = () => {
    setCreationStatus({ status: 'idle' });
    setCreatedInvoice(null);
  };

  const retryCreation = async (ocrData: ProcessedInvoiceData) => {
    clearCreation();
    return createInvoice(ocrData);
  };

  return {
    creationStatus,
    createdInvoice,
    createInvoice,
    clearCreation,
    retryCreation,
    isCreating: creationStatus.status === 'creating',
    isSuccess: creationStatus.status === 'success',
    isError: creationStatus.status === 'error',
  };
};
