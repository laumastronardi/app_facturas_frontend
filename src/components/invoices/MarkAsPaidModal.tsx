// src/components/MarkAsPaidModal.tsx
import { Dialog } from '@headlessui/react';
import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentDate: string) => void;
};

export default function MarkAsPaidModal({ isOpen, onClose, onConfirm }: Props) {
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    onConfirm(paymentDate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="bg-neutral-900 text-white p-6 rounded-lg z-50 w-full max-w-sm">
        <Dialog.Title className="text-lg font-bold mb-4">Marcar como pagada</Dialog.Title>
        <label className="block mb-2 text-sm">Fecha de pago</label>
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm bg-neutral-700 rounded">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded">
            Confirmar
          </button>
        </div>
      </div>
    </Dialog>
  );
}
