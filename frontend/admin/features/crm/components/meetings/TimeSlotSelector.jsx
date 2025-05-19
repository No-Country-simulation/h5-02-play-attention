'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { generateTimeSlots, BUSINESS_HOURS } from '../../lib/utils/timeSlots';
import { useSchedules } from '../../lib/hooks/useSchedules';
import { apiToClientSchedule } from '../../lib/adapters/schedule-adapter';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente para seleccionar slots de horario estilo Calendly
 * @param {Object} props - Propiedades del componente
 * @param {Date} props.selectedDate - Fecha seleccionada
 * @param {number} props.duration - Duración de la reunión en minutos
 * @param {function} props.onSelectTime - Función a llamar cuando se selecciona un horario
 * @param {string} props.selectedTime - Tiempo actualmente seleccionado (formato HH:MM)
 */
export default function TimeSlotSelector({
  selectedDate,
  duration = 30,
  onSelectTime,
  selectedTime
}) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener las reuniones existentes para verificar disponibilidad
  const {
    data: schedulesData = [],
    isLoading: schedulesLoading,
    error: schedulesError
  } = useSchedules();

  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);

    try {
      // Convertir datos de la API al formato del cliente
      const meetings = Array.isArray(schedulesData)
        ? schedulesData.map(apiToClientSchedule).filter(Boolean)
        : [];

      // Generar los slots de tiempo para la fecha seleccionada
      const slots = generateTimeSlots(selectedDate, duration, meetings);
      setTimeSlots(slots);
      setError(null);
    } catch (err) {
      console.error('Error al generar slots de tiempo:', err);
      setError('No se pudieron cargar los horarios disponibles');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, duration, schedulesData]);

  // Si no hay fecha seleccionada, mostrar mensaje
  if (!selectedDate) {
    return (
      <div className='flex flex-col items-center justify-center py-6 text-center text-muted-foreground'>
        <Calendar className='h-10 w-10 mb-2 opacity-50' />
        <p>Selecciona una fecha para ver los horarios disponibles</p>
      </div>
    );
  }

  // Si está cargando, mostrar spinner
  if (loading || schedulesLoading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <LoadingSpinner />
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (error || schedulesError) {
    return (
      <div className='flex flex-col items-center justify-center py-6 text-center text-red-500'>
        <AlertCircle className='h-10 w-10 mb-2' />
        <p>{error || 'Error al cargar horarios'}</p>
      </div>
    );
  }

  // Si no hay slots disponibles, mostrar mensaje
  if (timeSlots.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-6 text-center text-muted-foreground'>
        <Clock className='h-10 w-10 mb-2 opacity-50' />
        <p>No hay horarios disponibles para esta fecha</p>
        <p className='text-xs mt-1'>
          Horario comercial: {BUSINESS_HOURS.start}:00 - {BUSINESS_HOURS.end}:00
        </p>
        <p className='text-xs'>Lunes a viernes (excepto feriados)</p>
      </div>
    );
  }

  // Agrupar slots por hora para una mejor visualización
  const groupedSlots = timeSlots.reduce((acc, slot) => {
    const hour = slot.time.split(':')[0];
    if (!acc[hour]) {
      acc[hour] = [];
    }
    acc[hour].push(slot);
    return acc;
  }, {});

  return (
    <div className='mb-4'>
      <div className='text-center mb-4'>
        <div className='inline-block px-3 py-1 bg-muted rounded-full text-sm font-medium'>
          {selectedDate
            ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: es })
            : 'Selecciona una fecha'}
        </div>
      </div>

      <div className='space-y-6'>
        {Object.entries(groupedSlots).map(([hour, slots]) => (
          <div key={hour} className='space-y-2'>
            <h4 className='text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1 border-b'>
              {hour}:00
            </h4>
            <div className='grid grid-cols-2 gap-2'>
              {slots.map(slot => (
                <Button
                  key={slot.time}
                  variant={
                    slot.available
                      ? selectedTime === slot.time
                        ? 'default'
                        : 'outline'
                      : 'ghost'
                  }
                  size='sm'
                  disabled={!slot.available}
                  className={`text-sm h-12 ${
                    !slot.available ? 'line-through text-muted-foreground' : ''
                  } ${selectedTime === slot.time ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => slot.available && onSelectTime(slot.time)}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='flex items-center justify-center mt-4 space-x-4 text-xs text-center'>
        <div className='flex items-center'>
          <div className='w-3 h-3 bg-primary rounded-full mr-1'></div>
          <span>Disponible</span>
        </div>
        <div className='flex items-center'>
          <div className='w-3 h-3 bg-muted-foreground/20 rounded-full mr-1'></div>
          <span>No disponible</span>
        </div>
      </div>
    </div>
  );
}
