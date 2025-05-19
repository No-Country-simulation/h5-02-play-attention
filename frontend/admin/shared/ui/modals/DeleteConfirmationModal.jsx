'use client';

import { X, AlertTriangle } from 'lucide-react';

/**
 * Modal de confirmación para acciones críticas como eliminar
 * Sigue el principio de Responsabilidad Única (SRP) al enfocarse solo en la confirmación de eliminación
 * y el principio de Inversión de Dependencias (DIP) al recibir callbacks externos
 */
export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar eliminación',
  message = '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.'
}) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-md w-full p-6 shadow-lg'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center'>
            <AlertTriangle className='h-6 w-6 text-red-500 mr-2' />
            <h3 className='text-xl font-semibold'>{title}</h3>
          </div>

          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='mb-6'>
          <p className='text-gray-600'>{message}</p>
        </div>

        <div className='flex justify-end gap-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
 