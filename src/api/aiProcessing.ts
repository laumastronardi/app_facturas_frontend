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
  has_ii_bb?: boolean;
  ii_bb_amount?: number;
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
    
    // Debug: verificar qué campos de II.BB está enviando el backend
    console.log('🔍 Backend response structure:', {
      hasInvoiceData: !!backendData.invoiceData,
      invoiceDataKeys: backendData.invoiceData ? Object.keys(backendData.invoiceData) : [],
      has_ii_bb: backendData.invoiceData?.has_ii_bb,
      ii_bb_amount: backendData.invoiceData?.ii_bb_amount,
      type: backendData.invoiceData?.type
    });
    
    // Si tiene la estructura del backend actual (con invoiceData)
    if (backendData.invoiceData) {
      // Calcular II.BB automáticamente si el backend detectó que tiene pero no calculó el monto
      let calculatedIIBB = backendData.invoiceData.ii_bb_amount || 0;
      let adjustedTotalAmount = backendData.invoiceData.total_amount;
      
      // Si detectó que tiene II.BB pero el monto es 0, calcularlo automáticamente
      if (backendData.invoiceData.has_ii_bb && calculatedIIBB === 0 && backendData.invoiceData.total_neto) {
        calculatedIIBB = backendData.invoiceData.total_neto * 0.04; // 4%
        
        // Recalcular total_amount incluyendo II.BB
        const vat_21 = backendData.invoiceData.vat_amount_21 || 0;
        const vat_105 = backendData.invoiceData.vat_amount_105 || 0;
        adjustedTotalAmount = backendData.invoiceData.total_neto + vat_21 + vat_105 + calculatedIIBB;
        
        console.log('🧮 Frontend calculated II.BB and adjusted total:', {
          total_neto: backendData.invoiceData.total_neto,
          calculated_ii_bb: calculatedIIBB,
          original_total: backendData.invoiceData.total_amount,
          adjusted_total: adjustedTotalAmount,
          reason: 'Backend detected II.BB but amount was 0'
        });
      }
      
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
          total_amount: adjustedTotalAmount,
          
          // Ingresos brutos
          has_ii_bb: backendData.invoiceData.has_ii_bb || false,
          ii_bb_amount: calculatedIIBB,
          
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
