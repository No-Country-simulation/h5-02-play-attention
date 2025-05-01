'use client';

import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import ContentForm from './ContentForm';

/**
 * Modal que encapsula el formulario de contenido existente
 * sin modificar su funcionalidad original
 */
export default function ContentFormModal({
  isOpen,
  initialData,
  onClose,
  onSuccess
}) {
  // Función para manejar la cancelación desde el formulario
  const handleCancel = () => {
    if (onClose) onClose();
  };

  // Función para manejar el éxito (llamado por efecto secundario después de guardar)
  const handleSuccess = () => {
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md md:max-w-xl max-h-[95vh] p-0 overflow-hidden'>
        <DialogTitle className='sr-only'>
          {initialData ? 'Editar Contenido' : 'Crear Contenido'}
        </DialogTitle>
        <div className='h-full overflow-y-auto'>
          {/* Usar el formulario original sin modificaciones */}
          <ContentForm
            initialData={initialData}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
