import React from 'react';

import CreateTicketForm from './CreateTicketForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';

const CreateTicketDialog = ({ open, onOpenChange, onSubmit, isSubmitting }) => {
  const handleSubmit = async (data) => {
    try {
      const result = await onSubmit(data);
      // The modal will be closed by the parent component on success
      return result;
    } catch (error) {
      // Return the error to be handled by the form
      return { success: false, error: error.message };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Ticket de Soporte</DialogTitle>
        </DialogHeader>
        <CreateTicketForm
          onClose={() => onOpenChange(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
