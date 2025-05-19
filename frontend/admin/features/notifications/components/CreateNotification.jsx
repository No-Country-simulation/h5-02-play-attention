'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { useToast } from '@/shared/hooks/useToast';

/**
 * Componente para crear nuevas notificaciones
 * Sigue el principio de responsabilidad única (SRP) al encargarse solo de la creación de notificaciones
 */
export default function CreateNotification({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'ticket',
    relatedId: '',
    priority: 'normal',
    sendEmail: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Manejar cambios en inputs
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en selects
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validar el formulario antes de enviarlo
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Error de validación',
        description: 'El título es obligatorio',
        variant: 'destructive'
      });
      return false;
    }

    if (!formData.message.trim()) {
      toast({
        title: 'Error de validación',
        description: 'El mensaje es obligatorio',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  // Enviar el formulario
  const handleSubmit = e => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simular envío (en producción sería una llamada a la API)
    setTimeout(() => {
      onCreate(formData);
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nueva notificación</DialogTitle>
            <DialogDescription>
              Crea una notificación para usuarios, tickets o leads del sistema.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title' className='text-right'>
                Título
              </Label>
              <Input
                id='title'
                name='title'
                placeholder='Título de la notificación'
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='message' className='text-right'>
                Mensaje
              </Label>
              <Textarea
                id='message'
                name='message'
                placeholder='Contenido detallado de la notificación'
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='type' className='text-right'>
                  Tipo
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={value => handleSelectChange('type', value)}
                >
                  <SelectTrigger id='type'>
                    <SelectValue placeholder='Seleccione el tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='ticket'>Ticket</SelectItem>
                    <SelectItem value='user'>Usuario</SelectItem>
                    <SelectItem value='lead'>Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='relatedId' className='text-right'>
                  ID Relacionado (opcional)
                </Label>
                <Input
                  id='relatedId'
                  name='relatedId'
                  placeholder='ID del ticket, usuario o lead'
                  value={formData.relatedId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-right'>Prioridad</Label>
              <RadioGroup
                defaultValue={formData.priority}
                onValueChange={value => handleSelectChange('priority', value)}
                className='flex space-x-4'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='low' id='low' />
                  <Label htmlFor='low' className='font-normal'>
                    Baja
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='normal' id='normal' />
                  <Label htmlFor='normal' className='font-normal'>
                    Normal
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='high' id='high' />
                  <Label htmlFor='high' className='font-normal'>
                    Alta
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='sendEmail'
                name='sendEmail'
                checked={formData.sendEmail}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    sendEmail: e.target.checked
                  }))
                }
                className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
              />
              <Label htmlFor='sendEmail' className='font-normal'>
                Enviar copia por email
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear notificación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
