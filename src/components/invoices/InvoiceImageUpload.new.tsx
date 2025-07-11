import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Loader, Settings } from 'lucide-react';
import { useImageProcessing, type OCRSettings } from '../../hooks/useImageProcessing';
import { useNotifications } from '../../context/NotificationContext';
import { OCRSettingsModal } from './OCRSettingsModal';

interface InvoiceImageUploadProps {
  onDataExtracted?: (data: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const InvoiceImageUpload: React.FC<InvoiceImageUploadProps> = ({
  onDataExtracted,
  onError,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [ocrSettings, setOcrSettings] = useState<OCRSettings>({
    confidence_threshold: 0.95,
    language: 'spa',
    ocr_engine: 'openai',
    temperature: 0.1,
  });
  const notifications = useNotifications();

  const {
    processing,
    processedData,
    previewUrl,
    processImage,
    clearProcessing,
    retryProcessing,
    isProcessing,
    isSuccess,
    isError,
  } = useImageProcessing();

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleFileSelection(file);
    }
  }, []);

  const handleFileSelection = async (file: File) => {
    setSelectedFile(file);
    
    try {
      // Usar configuración de OCR con 95% de confianza
      const result = await processImage(file, ocrSettings);
      
      if (result) {
        notifications.success(
          'Imagen procesada exitosamente',
          `Confianza: ${result.confidence ? Math.round(result.confidence * 100) + '%' : 'N/A'}`
        );
        onDataExtracted?.(result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar la imagen';
      notifications.error('Error al procesar imagen', errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileSelection(e.target.files[0]);
    }
  };

  const handleClear = () => {
    clearProcessing();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRetryProcessing = async () => {
    if (selectedFile) {
      await retryProcessing(selectedFile, ocrSettings);
    }
  };

  const getStatusIcon = () => {
    if (isProcessing) {
      return <Loader className="w-6 h-6 animate-spin text-blue-500" />;
    }
    if (isSuccess) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    if (isError) {
      return <AlertCircle className="w-6 h-6 text-red-500" />;
    }
    return <Upload className="w-6 h-6 text-gray-400" />;
  };

  const getStatusMessage = () => {
    if (processing.message) {
      return processing.message;
    }
    if (!selectedFile) {
      return 'Arrastra una imagen aquí o haz clic para seleccionar';
    }
    return selectedFile.name;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'}
          ${isSuccess ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}
          ${isError ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center space-y-2">
          {getStatusIcon()}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {getStatusMessage()}
          </p>
        </div>

        {(selectedFile || isError) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="absolute top-2 right-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vista previa:
          </h4>
          <div className="relative max-w-sm">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto rounded border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>
      )}

      {/* Error Actions */}
      {isError && selectedFile && (
        <div className="flex gap-2">
          <button
            onClick={handleRetryProcessing}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Success Actions */}
      {isSuccess && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Imagen procesada exitosamente
            </span>
          </div>
          {processedData?.confidence && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Confianza: {Math.round(processedData.confidence * 100)}%
            </p>
          )}
        </div>
      )}

      {/* Configuración OCR */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Configuración OCR (Confianza: {Math.round((ocrSettings.confidence_threshold || 0.95) * 100)}%)
        </button>
      </div>

      {/* Modal de configuración */}
      <OCRSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={ocrSettings}
        onSettingsChange={setOcrSettings}
        onApplySettings={() => {
          notifications.info(
            'Configuración aplicada',
            `OCR configurado con ${Math.round((ocrSettings.confidence_threshold || 0.95) * 100)}% de confianza`
          );
        }}
      />
    </div>
  );
};
