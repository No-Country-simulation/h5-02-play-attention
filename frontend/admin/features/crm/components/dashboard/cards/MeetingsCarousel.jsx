'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CalendarIcon, Clock, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';

/**
 * Componente que muestra un carrusel automático de próximas reuniones
 * con efectos de fade-in/fade-out
 */
export const MeetingsCarousel = ({ meetings = [], isLoading = false }) => {
  const [currentMeetingIndex, setCurrentMeetingIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const slideDuration = 5000; // 5 segundos por reunión
  const fadeTransition = 500; // 0.5 segundos para el efecto fade

  const timerRef = useRef(null);

  // Encontrar la próxima reunión cuando cambia currentMeetingIndex
  const currentMeeting =
    meetings.length > 0 ? meetings[currentMeetingIndex] : null;

  // Efecto para manejar el carrusel automático
  useEffect(() => {
    if (meetings.length <= 1) return;

    const handleNextSlide = () => {
      // Iniciar transición fade-out
      setIsVisible(false);

      // Después de la transición, cambiar al siguiente slide
      setTimeout(() => {
        setCurrentMeetingIndex(prevIndex =>
          prevIndex === meetings.length - 1 ? 0 : prevIndex + 1
        );
        // Iniciar transición fade-in
        setIsVisible(true);
      }, fadeTransition);
    };

    // Iniciar temporizador
    timerRef.current = setInterval(handleNextSlide, slideDuration);

    // Limpiar temporizador cuando el componente se desmonta
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [meetings.length, fadeTransition, slideDuration]);

  // Reiniciar carrusel cuando cambian las reuniones
  useEffect(() => {
    setCurrentMeetingIndex(0);
    setIsVisible(true);
  }, [meetings]);

  // Si no hay reuniones, mostrar mensaje
  if (meetings.length === 0) {
    return (
      <div className='text-center p-2 text-muted-foreground text-xs italic'>
        No hay próximas reuniones programadas
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden'>
      {/* Indicadores de posición */}
      {meetings.length > 1 && (
        <div className='absolute bottom-0 right-1 flex space-x-1 z-10'>
          {meetings.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                index === currentMeetingIndex
                  ? 'bg-primary'
                  : 'bg-muted-foreground/20'
              )}
            />
          ))}
        </div>
      )}

      {/* Reunión actual con transición */}
      <div
        className={cn(
          'transition-opacity duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        {currentMeeting && (
          <div className='px-2 pb-3'>
            <div className='flex flex-col'>
              <div className='flex justify-between items-center'>
                <h3 className='font-medium text-xs'>{currentMeeting.title}</h3>
                <span className='text-xs text-primary ml-1 font-medium'>
                  {format(new Date(currentMeeting.date), 'HH:mm', {
                    locale: es
                  })}
                </span>
              </div>

              <div className='text-xs text-muted-foreground mt-1 flex flex-col gap-1'>
                <div className='flex items-center'>
                  <CalendarIcon className='h-3 w-3 mr-1 opacity-70' />
                  <span>
                    {format(new Date(currentMeeting.date), 'd MMMM yyyy', {
                      locale: es
                    })}
                  </span>
                </div>

                <div className='flex items-center'>
                  <User className='h-3 w-3 mr-1 opacity-70' />
                  <span>
                    {currentMeeting.client ||
                      currentMeeting.leadName ||
                      'Sin cliente'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
