'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

const statusOptions = [
  { id: 'abierto', label: 'Abierto' },
  { id: 'en proceso', label: 'En proceso' },
  { id: 'resuelto', label: 'Resuelto' }
];

export default function TicketReplyModal({
  open,
  onOpenChange,
  ticketId,
  currentStatus,
  onSubmit
}) {
  const [formData, setFormData] = useState({
    message: '',
    status: currentStatus || 'abierto'
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const replyData = {
      ...formData,
      ticketId,
      id: Date.now().toString(), // Temporal ID para mocks
      date: new Date().toISOString(),
      isAdminReply: true
    };

    onSubmit(replyData);

    // Reset form
    setFormData({
      message: '',
      status: currentStatus || 'abierto'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Responder ticket</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='message'>Mensaje</Label>
            <Textarea
              id='message'
              name='message'
              placeholder='Escribe tu respuesta al ticket...'
              required
              className='min-h-[150px]'
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='status'>Actualizar estado</Label>
            <Select
              value={formData.status}
              onValueChange={value => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecciona el estado' />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit'>Enviar respuesta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
