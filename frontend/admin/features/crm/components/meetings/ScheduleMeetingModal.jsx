'use client';

import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { isSameDay } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  Info,
  MapPin,
  User,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle
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
import { Badge } from '@/shared/ui/badge';
import { calculateEndTime } from '../../lib/utils/timeSlots';
import { useSchedules } from '../../lib/hooks/useSchedules';
import { apiToClientSchedule } from '../../lib/adapters/schedule-adapter';

// Opciones de duración
const DURATION_OPTIONS = [
  { value: '15', label: '15 minutos' },
  { value: '30', label: '30 minutos' },
  { value: '45', label: '45 minutos' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1.5 horas' },
  { value: '120', label: '2 horas' }
];

// Horarios disponibles por defecto (en un caso real se obtendrían del backend)
const DEFAULT_TIME_SLOTS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00'
];

/**
 * Modal para programar una nueva reunión o editar una existente
 * Implementa un wizard de 3 pasos estilo Calendly
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
  // Estado actual del wizard (1, 2 o 3)
  const [currentStep, setCurrentStep] = useState(1);

  // Datos del formulario
  const [formData, setFormData] = useState({
    title: '',
    date: preselectedDate || new Date(),
    time: '',
    leadId: preselectedLead || '',
    location: '',
    description: '',
    duration: '30',
    status: 'Pending'
  });

  // Errores de validación
  const [errors, setErrors] = useState({});

  // Slots de tiempo disponibles (filtrados según fecha y duración)
  const [availableSlots, setAvailableSlots] = useState(DEFAULT_TIME_SLOTS);

  // Obtener reuniones existentes para filtrar horarios ocupados
  const { data: schedulesData = [], isLoading: isLoadingSchedules } =
    useSchedules();

  // Convertir datos de la API al formato del cliente
  const existingMeetings = useMemo(() => {
    // Si estamos editando una reunión existente, excluirla para no bloquear su propio horario
    const meetings = Array.isArray(schedulesData)
      ? schedulesData
          .map(apiToClientSchedule)
          .filter(m => Boolean(m) && (!meeting || m.id !== meeting.id))
      : [];

    console.log('Reuniones existentes para filtrar horarios:', meetings);
    return meetings;
  }, [schedulesData, meeting]);

  // Cuando se abre el modal, inicializar datos
  useEffect(() => {
    if (isOpen) {
      if (meeting) {
        // Edición: cargar datos de la reunión existente
        try {
          const meetingDate = new Date(meeting.date);
          const hours = meetingDate.getHours().toString().padStart(2, '0');
          const minutes = meetingDate.getMinutes().toString().padStart(2, '0');
          const timeString = `${hours}:${minutes}`;

          setFormData({
            title: meeting.title || '',
            date: meetingDate,
            time: timeString,
            leadId: meeting.leadId || '',
            location: meeting.location || '',
            description: meeting.description || '',
            duration: meeting.duration?.toString() || '30',
            status: meeting.status || 'Pending'
          });

          // Si es edición, empezar en el paso 2 (detalles)
          setCurrentStep(2);
        } catch (error) {
          console.error('Error al cargar los datos de la reunión:', error);
        }
      } else {
        // Nueva reunión: resetear formulario
        setFormData({
          title: '',
          date: preselectedDate || new Date(),
          time: '',
          leadId: preselectedLead || '',
          location: '',
          description: '',
          duration: '30',
          status: 'Pending'
        });
        setCurrentStep(1);
      }
      setErrors({});
    }
  }, [isOpen, meeting, preselectedDate, preselectedLead]);

  // Filtrar los horarios ocupados para la fecha seleccionada
  useEffect(() => {
    if (currentStep === 1 && formData.date) {
      // Verificar si es fin de semana
      const dayOfWeek = formData.date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // No hay slots disponibles los fines de semana
        setAvailableSlots([]);
        return;
      }

      // Obtener todos los slots disponibles por defecto
      const allSlots = [...DEFAULT_TIME_SLOTS];

      // Identificar slots ocupados para esta fecha
      const busySlots = new Set();

      existingMeetings.forEach(existingMeeting => {
        try {
          const meetingDate = new Date(existingMeeting.date);

          // Solo filtrar reuniones del mismo día
          if (isSameDay(meetingDate, formData.date)) {
            const existingHours = meetingDate
              .getHours()
              .toString()
              .padStart(2, '0');
            const existingMinutes = meetingDate
              .getMinutes()
              .toString()
              .padStart(2, '0');
            const timeSlot = `${existingHours}:${existingMinutes}`;

            busySlots.add(timeSlot);
            console.log(
              `Horario ocupado: ${timeSlot} - ${existingMeeting.title}`
            );
          }
        } catch (error) {
          console.error('Error al procesar horario ocupado:', error);
        }
      });

      // Marcar todos los slots con su estado de disponibilidad
      const slotsWithAvailability = allSlots.map(slot => ({
        time: slot,
        available: !busySlots.has(slot)
      }));

      setAvailableSlots(slotsWithAvailability);

      console.log(`Fecha seleccionada: ${formData.date.toDateString()}`);
      console.log(`Horarios ocupados: ${Array.from(busySlots).join(', ')}`);
      console.log(
        `Total de horarios disponibles: ${
          slotsWithAvailability.filter(s => s.available).length
        }`
      );
    }
  }, [formData.date, formData.duration, currentStep, existingMeetings]);

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

  // Validar formulario por paso
  const validateStep = step => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.date) {
        newErrors.date = 'Selecciona una fecha';
      } else {
        // Verificar si es fin de semana
        const dayOfWeek = formData.date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          newErrors.date = 'No se pueden agendar reuniones en fines de semana';
        }
      }

      if (!formData.time) {
        newErrors.time = 'Selecciona un horario';
      }
      if (!formData.duration) {
        newErrors.duration = 'Selecciona una duración';
      }
    }

    if (step === 2) {
      if (!formData.title || !formData.title.trim()) {
        newErrors.title = 'El título es obligatorio';
      }

      // Validación estricta para el ID del lead (cliente)
      if (!formData.leadId) {
        newErrors.leadId = 'Selecciona un cliente (obligatorio)';
      }
    }

    return newErrors;
  };

  // Avanzar al siguiente paso
  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  // Retroceder al paso anterior
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Enviar formulario
  const handleSubmit = () => {
    // Construir fecha y hora combinadas
    const [hours, minutes] = formData.time.split(':');
    const meetingDate = new Date(formData.date);
    meetingDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    // Calcular hora de fin
    const [endHours, endMinutes] = calculateEndTime(
      formData.time,
      parseInt(formData.duration, 10)
    ).split(':');
    const endDate = new Date(formData.date);
    endDate.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10), 0);

    // Crear objeto de reunión
    const meetingData = {
      ...formData,
      date: meetingDate.toISOString(),
      endTime: endDate.toISOString(),
      ...(meeting && { id: meeting.id })
    };

    onSave(meetingData);
    onClose();
  };

  // Renderizar indicador de pasos
  const renderStepIndicator = () => (
    <div className='flex items-center justify-center mb-6'>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep === 1
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        1
      </div>
      <div className='h-1 w-10 bg-muted mx-1' />
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep === 2
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        2
      </div>
      <div className='h-1 w-10 bg-muted mx-1' />
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep === 3
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        3
      </div>
    </div>
  );

  // Paso 1: Selección de fecha, duración y horario
  const renderStep1 = () => (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Selección de fecha */}
        <div>
          <Label className='block mb-2'>
            Fecha <span className='text-red-500'>*</span>
          </Label>
          <div className='border rounded-md p-3'>
            <Calendar
              mode='single'
              selected={formData.date}
              onSelect={date => handleChange('date', date)}
              locale={es}
              className='mx-auto'
              disabled={{
                before: new Date(),
                // Deshabilitar fines de semana (0 = domingo, 6 = sábado)
                dayOfWeek: [0, 6]
              }}
            />
          </div>
          {errors.date && (
            <p className='text-sm text-destructive mt-1'>{errors.date}</p>
          )}
        </div>

        <div className='space-y-4'>
          {/* Duración */}
          <div>
            <Label htmlFor='duration' className='block mb-2'>
              Duración <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.duration}
              onValueChange={value => handleChange('duration', value)}
            >
              <SelectTrigger
                id='duration'
                className={errors.duration ? 'border-destructive' : ''}
              >
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
            {errors.duration && (
              <p className='text-sm text-destructive mt-1'>{errors.duration}</p>
            )}
          </div>

          {/* Horarios disponibles */}
          <div>
            <Label className='block mb-2'>
              Horario disponible <span className='text-red-500'>*</span>
            </Label>
            <div className='grid grid-cols-3 gap-2 mt-1 max-h-[240px] overflow-y-auto p-1'>
              {availableSlots.length > 0 ? (
                availableSlots.map(slot => (
                  <Button
                    key={slot.time}
                    type='button'
                    size='sm'
                    variant={
                      formData.time === slot.time ? 'default' : 'outline'
                    }
                    className={`
                      text-xs py-1 relative
                      ${formData.time === slot.time ? 'bg-primary' : ''}
                      ${!slot.available ? 'opacity-50' : ''}
                    `}
                    onClick={() =>
                      slot.available && handleChange('time', slot.time)
                    }
                    disabled={!slot.available}
                  >
                    {slot.time}
                    {!slot.available && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle className='h-3 w-3 absolute -top-1 -right-1 text-amber-500' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='text-xs'>Horario no disponible</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Button>
                ))
              ) : (
                <p className='text-sm text-muted-foreground col-span-3 text-center py-4'>
                  {formData.date?.getDay() === 0 ||
                  formData.date?.getDay() === 6
                    ? 'No hay horarios disponibles en fines de semana. Por favor, selecciona un día laborable.'
                    : 'No hay horarios disponibles para esta fecha'}
                </p>
              )}
            </div>
            {errors.time && (
              <p className='text-sm text-destructive mt-1'>{errors.time}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Paso 2: Detalles de la reunión
  const renderStep2 = () => (
    <div className='space-y-4'>
      {/* Título */}
      <div>
        <Label htmlFor='title'>
          Título <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='title'
          placeholder='Ej: Reunión inicial con cliente'
          value={formData.title}
          onChange={e => handleChange('title', e.target.value)}
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className='text-sm text-destructive mt-1'>{errors.title}</p>
        )}
      </div>

      {/* Cliente */}
      <div>
        <Label htmlFor='leadId'>
          Cliente <span className='text-red-500'>*</span>
        </Label>
        <Select
          value={formData.leadId}
          onValueChange={value => handleChange('leadId', value)}
        >
          <SelectTrigger
            id='leadId'
            className={errors.leadId ? 'border-destructive' : ''}
          >
            <SelectValue placeholder='Seleccionar cliente' />
          </SelectTrigger>
          <SelectContent>
            {leads.map(lead => (
              <SelectItem key={lead.id} value={lead.id}>
                {lead.name || lead.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.leadId && (
          <p className='text-sm text-destructive mt-1'>{errors.leadId}</p>
        )}
      </div>

      {/* Ubicación */}
      <div>
        <Label htmlFor='location'>Ubicación</Label>
        <Input
          id='location'
          placeholder='Ej: Oficina central, Google Meet, etc.'
          value={formData.location}
          onChange={e => handleChange('location', e.target.value)}
        />
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor='description'>Descripción</Label>
        <Textarea
          id='description'
          placeholder='Detalles adicionales sobre la reunión'
          value={formData.description}
          onChange={e => handleChange('description', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  // Paso 3: Resumen y confirmación
  const renderStep3 = () => {
    // Encontrar el cliente seleccionado
    const selectedLead = leads.find(lead => lead.id === formData.leadId);
    const leadName = selectedLead
      ? selectedLead.name || selectedLead.email
      : 'Cliente no seleccionado';

    // Encontrar la duración seleccionada
    const durationLabel =
      DURATION_OPTIONS.find(option => option.value === formData.duration)
        ?.label || formData.duration + ' minutos';

    // Calcular hora de fin
    const endTime = calculateEndTime(
      formData.time,
      parseInt(formData.duration, 10)
    );

    return (
      <div className='space-y-6'>
        <div className='bg-muted/30 p-4 rounded-lg'>
          <h3 className='font-medium text-lg mb-4'>Resumen de la reunión</h3>

          <div className='space-y-3'>
            <div className='flex items-start'>
              <FileText className='h-5 w-5 mr-3 text-primary mt-0.5' />
              <div>
                <p className='text-sm text-muted-foreground'>Título</p>
                <p className='font-medium'>{formData.title}</p>
              </div>
            </div>

            <div className='flex items-start'>
              <CalendarIcon className='h-5 w-5 mr-3 text-primary mt-0.5' />
              <div>
                <p className='text-sm text-muted-foreground'>Fecha y hora</p>
                <p className='font-medium'>
                  {formData.date &&
                    format(formData.date, 'PPP', { locale: es })}
                  {formData.time && `, ${formData.time} - ${endTime}`}
                </p>
                <Badge variant='outline' className='mt-1'>
                  {durationLabel}
                </Badge>
              </div>
            </div>

            <div className='flex items-start'>
              <User className='h-5 w-5 mr-3 text-primary mt-0.5' />
              <div>
                <p className='text-sm text-muted-foreground'>Cliente</p>
                <p className='font-medium'>{leadName}</p>
              </div>
            </div>

            {formData.location && (
              <div className='flex items-start'>
                <MapPin className='h-5 w-5 mr-3 text-primary mt-0.5' />
                <div>
                  <p className='text-sm text-muted-foreground'>Ubicación</p>
                  <p>{formData.location}</p>
                </div>
              </div>
            )}

            {formData.description && (
              <div className='flex items-start'>
                <Info className='h-5 w-5 mr-3 text-primary mt-0.5' />
                <div>
                  <p className='text-sm text-muted-foreground'>Descripción</p>
                  <p className='text-sm'>{formData.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar contenido según paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px] overflow-y-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle>
            {meeting
              ? 'Editar Reunión'
              : currentStep === 1
              ? 'Seleccionar Fecha y Hora'
              : currentStep === 2
              ? 'Detalles de la Reunión'
              : 'Confirmar Reunión'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1
              ? 'Escoge una fecha, duración y horario disponible para la reunión'
              : currentStep === 2
              ? 'Complete los detalles de la reunión'
              : 'Revisa la información y confirma la reunión'}
          </DialogDescription>
        </DialogHeader>

        {/* Indicador de pasos */}
        {renderStepIndicator()}

        {/* Contenido del paso actual */}
        {renderStepContent()}

        <DialogFooter className='flex justify-between mt-6'>
          {/* Botones de navegación */}
          <div>
            {currentStep > 1 && (
              <Button
                type='button'
                variant='outline'
                onClick={handlePrevStep}
                className='flex items-center gap-1'
              >
                <ArrowLeft className='h-4 w-4' />
                Atrás
              </Button>
            )}
          </div>

          <div>
            {currentStep < 3 ? (
              <Button
                type='button'
                onClick={handleNextStep}
                className='flex items-center gap-1'
              >
                Siguiente
                <ArrowRight className='h-4 w-4' />
              </Button>
            ) : (
              <Button
                type='button'
                onClick={handleSubmit}
                className='flex items-center gap-1'
              >
                Confirmar
                <Check className='h-4 w-4' />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
