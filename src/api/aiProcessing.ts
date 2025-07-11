import api from './axios';

export interface ProcessedInvoiceData {
  date?: string;
  amount?: number;
  amount_105?: number;
  total_neto?: number;
  vat_amount_21?: number;
  vat_amount_105?: number;
  total_amount?: number;
  type?: 'A' | 'X';
  status?: 'to_pay' | 'prepared' | 'paid';
  supplier?: {
    name?: string;
    cuit?: string;
  };
  confidence?: number;
  raw_text?: string;
}

export interface ImageProcessingResponse {
  success: boolean;
  data: ProcessedInvoiceData;
  message?: string;
  confidence?: number;
  raw_text?: string;
  requiresSupplierSelection?: boolean;
}

export interface OCRSettings {
  confidence_threshold?: number;
  language?: 'spa' | 'eng';
  ocr_engine?: 'openai' | 'tesseract' | 'google';
  temperature?: number;
}

/**
 * Upload and process an invoice image with OCR
 */
export const processInvoiceImage = async (
  file: File, 
  settings?: OCRSettings
): Promise<ImageProcessingResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Incluir configuraciones OCR en la petición
    if (settings) {
      formData.append('settings', JSON.stringify(settings));
    }
    
    const response = await api.post('/invoices/process-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });
    
    // Normalizar respuesta del backend a nuestro formato esperado
    const backendData = response.data;
    
    // Si tiene la estructura del backend actual (con invoiceData)
    if (backendData.invoiceData) {
      const normalizedData = {
        success: true,
        data: {
          // Campos básicos de la factura
          date: backendData.invoiceData.date,
          type: backendData.invoiceData.type,
          status: backendData.invoiceData.status || 'to_pay',
          
          // Montos - usar los valores del invoiceData que son los correctos
          amount: backendData.invoiceData.amount,
          amount_105: backendData.invoiceData.amount_105,
          total_neto: backendData.invoiceData.total_neto,
          vat_amount_21: backendData.invoiceData.vat_amount_21,
          vat_amount_105: backendData.invoiceData.vat_amount_105,
          total_amount: backendData.invoiceData.total_amount,
          
          // Información del proveedor
          supplier: {
            name: backendData.supplierInfo?.name || 'Proveedor no identificado',
            cuit: backendData.supplierInfo?.cuit || null
          },
          
          // Metadatos
          confidence: backendData.confidence / 100, // Convertir porcentaje a decimal
          raw_text: backendData.extractedText
        },
        confidence: backendData.confidence / 100,
        raw_text: backendData.extractedText,
        message: 'Procesamiento completado exitosamente',
        requiresSupplierSelection: backendData.requiresSupplierSelection
      };
      
      return normalizedData;
    }
    
    // Si ya tiene nuestro formato esperado
    if (backendData.success !== undefined) {
      return backendData;
    }
    
    // Fallback: asumir error si no hay estructura reconocida
    throw new Error('Formato de respuesta no reconocido del backend');
    
  } catch (error: any) {
    // Lanzar el error original con más contexto
    throw new Error(`Backend error: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Create invoice directly from OCR data
 */
export const createInvoiceFromOCR = async (ocrData: ProcessedInvoiceData): Promise<{
  success: boolean;
  invoice?: any;
  message?: string;
}> => {
  const response = await api.post('/invoices/create-from-ocr-auto', ocrData);
  return response.data;
};

/**
 * Validate extracted data against business rules
 */
export const validateExtractedData = async (data: ProcessedInvoiceData): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> => {
  const response = await api.post('/invoices/validate-extracted-data', data);
  return response.data;
};
