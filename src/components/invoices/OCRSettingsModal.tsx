import React from 'react';
import { Settings, Zap, Languages, Brain } from 'lucide-react';
import type { OCRSettings } from '../../hooks/useImageProcessing';

interface OCRSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: OCRSettings;
  onSettingsChange: (settings: OCRSettings) => void;
  onApplySettings: () => void;
}

export const OCRSettingsModal: React.FC<OCRSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onApplySettings,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof OCRSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configuración OCR
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Confianza */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Zap className="w-4 h-4" />
              Umbral de Confianza: {Math.round((settings.confidence_threshold || 0.95) * 100)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={settings.confidence_threshold || 0.95}
              onChange={(e) => handleChange('confidence_threshold', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50%</span>
              <span className="font-medium text-blue-600">95% (Recomendado)</span>
              <span>100%</span>
            </div>
          </div>

          {/* Motor OCR */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Brain className="w-4 h-4" />
              Motor de OCR
            </label>
            <select
              value={settings.ocr_engine || 'openai'}
              onChange={(e) => handleChange('ocr_engine', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="openai">OpenAI (Recomendado)</option>
              <option value="google">Google Vision</option>
              <option value="tesseract">Tesseract</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              OpenAI ofrece la mejor precisión para facturas en español
            </p>
          </div>

          {/* Idioma */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Languages className="w-4 h-4" />
              Idioma
            </label>
            <select
              value={settings.language || 'spa'}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="spa">Español</option>
              <option value="eng">Inglés</option>
            </select>
          </div>

          {/* Temperatura (solo para OpenAI) */}
          {settings.ocr_engine === 'openai' && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Temperatura: {settings.temperature || 0.1}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature || 0.1}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 (Preciso)</span>
                <span>0.5 (Balanceado)</span>
                <span>1 (Creativo)</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Valores bajos aumentan la precisión y consistencia
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onApplySettings();
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Aplicar Configuración
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> Para facturas argentinas, se recomienda usar OpenAI con 95% de confianza y temperatura baja (0.1) para máxima precisión.
          </p>
        </div>
      </div>
    </div>
  );
};
