'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Clock,
  Info,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/shared/ui/sheet';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';
import TimeSlotSelector from './TimeSlotSelector';
import { calculateEndTime } from '../../lib/utils/timeSlots';

// Opciones de duración
const DURATION_OPTIONS = [
  { value: '15', label: '15 minutos' },
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1.5 horas' },
  { value: '120', label: '2 horas' }
];

/**
 * Modal para programar una nueva reunión o editar una existente
 * Implementa un selector de horarios estilo Calendly
 */
export default function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSave,
  leads = [],
  preselectedDate,
  preselectedLead,
  meeting = null
}) {
  const [formData, setFormData] = useState({
    title: '',
    date: preselectedDate || new Date(),
    time: '09:00',
    leadId: preselectedLead || '',
    location: '',
    description: '',
    duration: '30',
    status: 'Pending'
  });

  const [errors, setErrors] = useState({});
  const [timeSelectorOpen, setTimeSelectorOpen] = useState(false);

  // Cuando se abre el modal con una reunión existente, cargar sus datos
  useEffect(() => {
    if (meeting) {
      try {
        // Convertir la fecha en un objeto Date
        const meetingDate = new Date(meeting.date);

        // Extraer solo la parte de la hora
        const hours = meetingDate.getHours().toString().padStart(2, '0');
        const minutes = meetingDate.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        // Actualizar formulario con los datos de la reunión
        setFormData({
          title: meeting.title || '',
          date: meetingDate,
          time: timeString,
          leadId: meeting.leadId || '',
          location: meeting.location || '',
          description: meeting.description || '',
          duration: meeting.duration || '30',
          status: meeting.status || 'Pending'
        });
      } catch (error) {
        console.error('Error al cargar los datos de la reunión:', error);
      }
    } else {
      // Resetear el formulario cuando se abre para una nueva reunión
      setFormData({
        title: '',
        date: preselectedDate || new Date(),
        time: '09:00',
        leadId: preselectedLead || '',
        location: '',
        description: '',
        duration: '30',
        status: 'Pending'
      });
    }

    // Limpiar errores y resetear el estado
    setErrors({});
    setTimeSelectorOpen(false);
  }, [isOpen, meeting, preselectedDate, preselectedLead]);

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

  // Manejar cambio de duración
  const handleDurationChange = duration => {
    handleChange('duration', duration);

    // Calcular nueva hora de fin si hay tiempo seleccionado
    if (formData.time) {
      const endTime = calculateEndTime(formData.time, parseInt(duration, 10));
      console.log(
        `Duración cambiada a ${duration} minutos. Hora de fin: ${endTime}`
      );
    }
  };

  // Manejar selección de horario
  const handleTimeSelect = time => {
    handleChange('time', time);

    // Calcular hora de fin
    const endTime = calculateEndTime(time, parseInt(formData.duration, 10));
    console.log(`Horario seleccionado: ${time}. Hora de fin: ${endTime}`);
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

    if (!formData.time) {
      newErrors.time = 'Selecciona un horario';
    }

    return newErrors;
  };

  // Mostrar el selector de horarios
  const handleShowTimeSelector = () => {
    const formErrors = validateForm();

    // Solo validamos título y cliente antes de mostrar el selector de horarios
    if (formErrors.title || formErrors.leadId) {
      setErrors(formErrors);
      return;
    }

    setTimeSelectorOpen(true);
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

    // Calcular hora de fin
    const endTimeString = calculateEndTime(
      formData.time,
      parseInt(formData.duration, 10)
    );
    const [endHours, endMinutes] = endTimeString.split(':');
    const endDate = new Date(formData.date);
    endDate.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10), 0);

    // Crear o actualizar objeto de reunión
    const meetingData = {
      ...formData,
      date: meetingDate.toISOString(),
      endTime: endDate.toISOString(),
      // Si es edición, mantener el mismo ID
      ...(meeting && { id: meeting.id })
    };

    onSave(meetingData);
    onClose();
  };

  // Renderizar formulario principal
  const renderMainForm = () => (
    <>
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

        <div className='grid gap-2'>
          <Label htmlFor='leadId'>
            Cliente <span className='text-red-500'>*</span>
          </Label>
          <Select
            value={formData.leadId}
            onValueChange={value => handleChange('leadId', value)}
          >
            <SelectTrigger className={cn(errors.leadId && 'border-red-500')}>
              <SelectValue placeholder='Seleccionar cliente' />
            </SelectTrigger>
            <SelectContent>
              {leads.length === 0 ? (
                <div className='p-2 text-center text-sm text-muted-foreground'>
                  No hay clientes disponibles
                </div>
              ) : (
                leads.map(lead => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.leadId && (
            <span className='text-sm text-red-500'>{errors.leadId}</span>
          )}
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='location'>Ubicación</Label>
          <Input
            id='location'
            placeholder='Ej: Oficina central, Google Meet, etc.'
            value={formData.location}
            onChange={e => handleChange('location', e.target.value)}
          />
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='description'>Descripción</Label>
          <Textarea
            id='description'
            placeholder='Detalles adicionales sobre la reunión'
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            rows={3}
          />
        </div>

        <div className='grid gap-2'>
          <div className='flex items-center'>
            <Label htmlFor='duration' className='mr-2'>
              Duración
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className='h-4 w-4 text-muted-foreground' />
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p className='text-xs'>Tiempo estimado para la reunión</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={formData.duration}
            onValueChange={handleDurationChange}
          >
            <SelectTrigger>
              <SelectValue placeholder='Seleccionar duración' />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='grid gap-2'>
          <Label>
            Fecha y hora <span className='text-red-500'>*</span>
          </Label>
          <div className='flex'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'justify-start text-left font-normal flex-grow mr-2',
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
                  disabled={date =>
                    // Deshabilitar fechas pasadas y fines de semana
                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                    date.getDay() === 0 ||
                    date.getDay() === 6
                  }
                />
              </PopoverContent>
            </Popover>
            <Button
              variant='outline'
              className='flex items-center'
              onClick={handleShowTimeSelector}
              type='button'
            >
              <Clock className='mr-2 h-4 w-4' />
              {formData.time ? formData.time : 'Seleccionar horario'}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </div>
          {errors.time && (
            <span className='text-sm text-red-500'>{errors.time}</span>
          )}
        </div>

        {formData.time && (
          <div className='bg-muted p-3 rounded-md'>
            <h4 className='text-sm font-medium mb-2'>Resumen de la reunión</h4>
            <ul className='space-y-1 text-sm'>
              <li>
                <strong>Fecha:</strong>{' '}
                {format(formData.date, 'PPP', { locale: es })}
              </li>
              <li>
                <strong>Hora:</strong> {formData.time}
              </li>
              <li>
                <strong>Duración:</strong>{' '}
                {
                  DURATION_OPTIONS.find(
                    option => option.value === formData.duration
                  )?.label
                }
              </li>
            </ul>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant='outline' onClick={onClose} className='mr-2'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {meeting ? 'Actualizar' : 'Agendar'}
        </Button>
      </DialogFooter>
    </>
  );

  // Panel lateral para selección de horarios
  const renderTimeSelector = () => (
    <Sheet open={timeSelectorOpen} onOpenChange={setTimeSelectorOpen}>
      <SheetContent className='sm:max-w-md overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Seleccionar horario</SheetTitle>
          <SheetDescription>
            Elige un horario disponible para tu reunión
          </SheetDescription>
        </SheetHeader>

        <div className='py-6'>
          <TimeSlotSelector
            selectedDate={formData.date}
            duration={parseInt(formData.duration, 10)}
            onSelectTime={time => {
              handleTimeSelect(time);
              setTimeSelectorOpen(false);
            }}
            selectedTime={formData.time}
          />
        </div>

        <SheetFooter className='flex justify-end w-full'>
          <Button type='button' onClick={() => setTimeSelectorOpen(false)}>
            Confirmar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {meeting ? 'Editar reunión' : 'Agendar nueva reunión'}
            </DialogTitle>
            <DialogDescription>
              Complete los detalles de la reunión
            </DialogDescription>
          </DialogHeader>

          {renderMainForm()}
        </DialogContent>
      </Dialog>

      {renderTimeSelector()}
    </>
  );
}
