import React from 'react';
import { CheckCircle, AlertTriangle, Eye, EyeOff, Zap } from 'lucide-react';
import type { ProcessedInvoiceData } from '../../hooks/useImageProcessing';
import { useInvoiceFromOCR } from '../../hooks/useInvoiceFromOCR';

interface OCRResultsDisplayProps {
  data: ProcessedInvoiceData;
  onApplyData: (data: ProcessedInvoiceData) => void;
  onEditData: (data: ProcessedInvoiceData) => void;
  onQuickCreate?: () => void;
  className?: string;
}

export const OCRResultsDisplay: React.FC<OCRResultsDisplayProps> = ({
  data,
  onApplyData,
  onEditData,
  onQuickCreate,
  className = '',
}) => {
  const [showRawText, setShowRawText] = React.useState(false);
  const { createInvoice, isCreating } = useInvoiceFromOCR();

  const handleQuickCreate = async () => {
    const invoice = await createInvoice(data);
    if (invoice && onQuickCreate) {
      onQuickCreate();
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('es-AR');
    } catch {
      return date;
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500';
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceIcon = (confidence?: number) => {
    if (!confidence) return null;
    if (confidence >= 0.8) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Datos Extraídos
          </h3>
          {getConfidenceIcon(data.confidence)}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">Confianza:</span>
          <span className={`font-medium ${getConfidenceColor(data.confidence)}`}>
            {data.confidence ? `${Math.round(data.confidence * 100)}%` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Extracted Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Información Básica</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fecha:</span>
              <span className="text-sm font-medium">{formatDate(data.date)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                data.type === 'A' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                data.type === 'X' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
              }`}>
                {data.type ? `Factura ${data.type}` : 'N/A'}
              </span>
            </div>

            {data.supplier && (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Proveedor:</span>
                  <span className="text-sm font-medium">{data.supplier.name || 'N/A'}</span>
                </div>
                {data.supplier.cuit && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">CUIT:</span>
                    <span className="text-sm font-medium">{data.supplier.cuit}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Amounts */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Montos</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monto:</span>
              <span className="text-sm font-medium">{formatCurrency(data.amount)}</span>
            </div>
            
            {data.amount_105 !== undefined && data.amount_105 > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Monto 10.5%:</span>
                <span className="text-sm font-medium">{formatCurrency(data.amount_105)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Neto:</span>
              <span className="text-sm font-medium">{formatCurrency(data.total_neto)}</span>
            </div>
            
            {data.vat_amount_21 !== undefined && data.vat_amount_21 > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">IVA 21%:</span>
                <span className="text-sm font-medium">{formatCurrency(data.vat_amount_21)}</span>
              </div>
            )}
            
            {data.vat_amount_105 !== undefined && data.vat_amount_105 > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">IVA 10.5%:</span>
                <span className="text-sm font-medium">{formatCurrency(data.vat_amount_105)}</span>
              </div>
            )}
            
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total:</span>
              <span className="text-sm font-bold">{formatCurrency(data.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Text Toggle */}
      {data.raw_text && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showRawText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showRawText ? 'Ocultar' : 'Ver'} texto extraído</span>
          </button>
          
          {showRawText && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded border text-xs font-mono text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
              {data.raw_text}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onApplyData(data)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Aplicar Datos
        </button>
        <button
          onClick={() => onEditData(data)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Editar y Aplicar
        </button>
        {onQuickCreate && (
          <button
            onClick={handleQuickCreate}
            disabled={isCreating}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Zap className="w-4 h-4" />
            {isCreating ? 'Creando...' : 'Crear Directamente'}
          </button>
        )}
      </div>

      {/* Warning for low confidence */}
      {data.confidence && data.confidence < 0.7 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              Confianza baja en los datos extraídos
            </p>
            <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
              Te recomendamos revisar y corregir los datos antes de aplicarlos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
