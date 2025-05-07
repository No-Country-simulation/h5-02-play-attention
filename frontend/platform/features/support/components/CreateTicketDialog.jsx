import React from 'react';

import CreateTicketForm from './CreateTicketForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';

const CreateTicketDialog = ({ open, onOpenChange, onSubmit, isSubmitting }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Ticket de Soporte</DialogTitle>
        </DialogHeader>
        <CreateTicketForm
          onClose={() => onOpenChange(false)}
          onSubmit={data => {
            return onSubmit?.(data);
          }}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
