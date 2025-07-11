import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Plus } from 'lucide-react';
import { useSupplier } from '../../hooks/useSupplier';
import { useNotifications } from '../../context/NotificationContext';

interface QuickSupplierCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSupplierCreated: (supplier: { id: number; name: string }) => void;
  initialName?: string;
  initialCuit?: string;
}

export const QuickSupplierCreate: React.FC<QuickSupplierCreateProps> = ({
  isOpen,
  onClose,
  onSupplierCreated,
  initialName = '',
  initialCuit = '',
}) => {
  const [formData, setFormData] = useState({
    name: initialName,
    cuit: initialCuit,
    cbu: '',
    paymentTerm: '',
  });
  const { createSupplier, loading } = useSupplier();
  const notifications = useNotifications();

  // Update form data when initial values change
  useEffect(() => {
    setFormData({
      name: initialName,
      cuit: initialCuit,
      cbu: '',
      paymentTerm: '',
    });
  }, [initialName, initialCuit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      notifications.error('Error', 'El nombre del proveedor es requerido');
      return;
    }

    try {
      const supplierData = {
        name: formData.name.trim(),
        cuit: formData.cuit.trim() || undefined,
        cbu: formData.cbu.trim() || undefined,
        paymentTerm: formData.paymentTerm ? parseInt(formData.paymentTerm) : undefined,
      };

      const newSupplier = await createSupplier(supplierData);
      
      notifications.success(
        'Proveedor creado', 
        `El proveedor "${newSupplier.name}" se ha creado exitosamente`
      );
      
      onSupplierCreated(newSupplier);
      onClose();
      
      // Reset form
      setFormData({ name: '', cuit: '', cbu: '', paymentTerm: '' });
      
    } catch (error) {
      notifications.error(
        'Error al crear proveedor',
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };

  const handleClose = () => {
    setFormData({ name: '', cuit: '', cbu: '', paymentTerm: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-green-600" />
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                Crear Proveedor
              </Dialog.Title>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del proveedor"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CUIT (opcional)
              </label>
              <input
                type="text"
                value={formData.cuit}
                onChange={(e) => setFormData(prev => ({ ...prev, cuit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="XX-XXXXXXXX-X"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CBU (opcional)
              </label>
              <input
                type="text"
                value={formData.cbu}
                onChange={(e) => setFormData(prev => ({ ...prev, cbu: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="XX-XXXXXXXX-X"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Plazo de pago (días)
              </label>
              <input
                type="number"
                value={formData.paymentTerm}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentTerm: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="30"
                min="1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Crear</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};
