'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { cn } from '@/shared/lib/utils';

/**
 * Modal para programar una nueva reunión o cita
 */
export default function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSave,
  leads = [],
  preselectedDate,
  preselectedLead
}) {
  const [formData, setFormData] = useState({
    title: '',
    date: preselectedDate || new Date(),
    time: '09:00',
    leadId: preselectedLead || '',
    location: '',
    description: '',
    duration: '30'
  });

  const [errors, setErrors] = useState({});

  // Actualizar formulario
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error si el campo fue completado
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!formData.leadId) {
      newErrors.leadId = 'Selecciona un cliente';
    }

    return newErrors;
  };

  // Enviar formulario
  const handleSubmit = () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Construir fecha y hora combinadas
    const [hours, minutes] = formData.time.split(':');
    const meetingDate = new Date(formData.date);
    meetingDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    // Crear objeto de reunión
    const meeting = {
      ...formData,
      date: meetingDate.toISOString(),
      id: Date.now().toString() // ID temporal
    };

    onSave(meeting);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Agendar nueva reunión</DialogTitle>
          <DialogDescription>
            Complete los detalles para programar una reunión con el cliente.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='title'>
              Título <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              placeholder='Ej: Reunión inicial con cliente'
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              className={cn(errors.title && 'border-red-500')}
            />
            {errors.title && (
              <span className='text-sm text-red-500'>{errors.title}</span>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label>
                Fecha <span className='text-red-500'>*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'justify-start text-left font-normal',
                      !formData.date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formData.date ? (
                      format(formData.date, 'PPP', { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={formData.date}
                    onSelect={date => handleChange('date', date)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='time'>
                Hora <span className='text-red-500'>*</span>
              </Label>
              <div className='flex items-center'>
                <Clock className='h-4 w-4 mr-2 text-muted-foreground' />
                <Input
                  id='time'
                  type='time'
                  value={formData.time}
                  onChange={e => handleChange('time', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='leadId'>
                Cliente <span className='text-red-500'>*</span>
              </Label>
              <Select
                value={formData.leadId}
                onValueChange={value => handleChange('leadId', value)}
              >
                <SelectTrigger
                  className={cn(errors.leadId && 'border-red-500')}
                >
                  <SelectValue placeholder='Seleccionar cliente' />
                </SelectTrigger>
                <SelectContent>
                  {leads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.leadId && (
                <span className='text-sm text-red-500'>{errors.leadId}</span>
              )}
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='duration'>Duración</Label>
              <Select
                value={formData.duration}
                onValueChange={value => handleChange('duration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Duración' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='15'>15 minutos</SelectItem>
                  <SelectItem value='30'>30 minutos</SelectItem>
                  <SelectItem value='45'>45 minutos</SelectItem>
                  <SelectItem value='60'>1 hora</SelectItem>
                  <SelectItem value='90'>1.5 horas</SelectItem>
                  <SelectItem value='120'>2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='location'>Ubicación</Label>
            <Input
              id='location'
              placeholder='Ej: Oficina principal, Videollamada, etc.'
              value={formData.location}
              onChange={e => handleChange('location', e.target.value)}
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='description'>Descripción</Label>
            <Textarea
              id='description'
              placeholder='Detalles adicionales sobre la reunión...'
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar reunión</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
