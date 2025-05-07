import React from 'react';

import CreateTicketForm from './CreateTicketForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

const CreateTicketDialog = ({ open, onOpenChange, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Ticket de Soporte</DialogTitle>
        </DialogHeader>
        <CreateTicketForm
          onClose={() => onOpenChange(false)}
          onSubmit={data => {
            onSubmit?.(data);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
