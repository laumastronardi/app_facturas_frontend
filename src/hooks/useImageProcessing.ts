import { useState } from 'react';
import { processInvoiceImage, type ProcessedInvoiceData, type OCRSettings } from '../api/aiProcessing';

export type { ProcessedInvoiceData, OCRSettings } from '../api/aiProcessing';

interface ProcessingStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
}

export const useImageProcessing = () => {
  const [processing, setProcessing] = useState<ProcessingStatus>({ status: 'idle' });
  const [processedData, setProcessedData] = useState<ProcessedInvoiceData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const processImage = async (
    file: File, 
    settings?: OCRSettings
  ): Promise<ProcessedInvoiceData | null> => {
    try {
      // Validar archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('El archivo es demasiado grande (máximo 10MB)');
      }

      // Crear preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      setProcessing({ status: 'uploading', message: 'Subiendo imagen...' });

      // Configuración por defecto con 95% de confianza
      const defaultSettings: OCRSettings = {
        confidence_threshold: 0.95,
        language: 'spa',
        ocr_engine: 'openai',
        temperature: 0.1,
        ...settings
      };

      // Procesar imagen con OCR
      const response = await processInvoiceImage(file, defaultSettings);

      if (response.success && response.data) {
        setProcessing({ status: 'success', message: 'Procesamiento completado' });
        setProcessedData(response.data);
        return response.data;
      }

      throw new Error(response.message || 'Error al procesar la imagen');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar la imagen';
      setProcessing({ status: 'error', message: errorMessage });
      console.error('Error processing image:', error);
      
      // Re-lanzar el error con más detalles para debugging
      throw error;
    }
  };

  const clearProcessing = () => {
    setProcessing({ status: 'idle' });
    setProcessedData(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const retryProcessing = async (file: File, settings?: OCRSettings) => {
    clearProcessing();
    return processImage(file, settings);
  };

  return {
    processing,
    processedData,
    previewUrl,
    processImage,
    clearProcessing,
    retryProcessing,
    isProcessing: processing.status === 'uploading' || processing.status === 'processing',
    isSuccess: processing.status === 'success',
    isError: processing.status === 'error',
  };
};
