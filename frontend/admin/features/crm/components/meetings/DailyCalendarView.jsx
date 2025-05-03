'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  format,
  addDays,
  subDays,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  addMinutes,
  isToday,
  startOfDay,
  isSameDay
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  MapPin,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/popover';
import { cn } from '@/shared/lib/utils';

const ALL_HOURS = Array.from({ length: 24 }, (_, i) => i);
const DEFAULT_START_HOUR = 6; // 6 AM
const DEFAULT_END_HOUR = 23; // 11 PM

/**
 * Vista de calendario diario con formato similar a Google Calendar
 */
export default function DailyCalendarView({
  meetings = [],
  isLoading = false,
  onAddMeeting
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [visibleStartHour, setVisibleStartHour] = useState(DEFAULT_START_HOUR);
  const [visibleEndHour, setVisibleEndHour] = useState(DEFAULT_END_HOUR);

  // Calcular horas visibles
  const visibleHours = useMemo(() => {
    return ALL_HOURS.filter(
      hour => hour >= visibleStartHour && hour <= visibleEndHour
    );
  }, [visibleStartHour, visibleEndHour]);

  // Navegar al día siguiente
  const nextDay = () => setCurrentDate(addDays(currentDate, 1));

  // Navegar al día anterior
  const prevDay = () => setCurrentDate(subDays(currentDate, 1));

  // Navegar a hoy
  const goToToday = () => setCurrentDate(new Date());

  // Formatear hora para mostrar en la columna izquierda
  const formatHour = hour => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  // Obtener un color basado en el título de la reunión (para identificación visual)
  const getMeetingColor = title => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-700',
      'bg-emerald-100 border-emerald-300 text-emerald-700',
      'bg-amber-100 border-amber-300 text-amber-700',
      'bg-rose-100 border-rose-300 text-rose-700',
      'bg-indigo-100 border-indigo-300 text-indigo-700'
    ];

    // Usar el string del título para determinar un índice
    const sum = title
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  // Posicionar la reunión en la grilla de horas
  const getMeetingPosition = meeting => {
    try {
      const meetingDate = new Date(meeting.date);
      const meetingDay = startOfDay(meetingDate);
      const hours = getHours(meetingDate);
      const minutes = getMinutes(meetingDate);

      // Verificar si la reunión está en el día seleccionado
      if (!isSameDay(meetingDate, currentDate)) {
        return { valid: false };
      }

      // Verificar si la reunión está dentro de las horas visibles
      if (hours < visibleStartHour || hours > visibleEndHour) {
        return { valid: false };
      }

      // Calcular posición vertical (tiempo)
      // Ajustar para las nuevas alturas: 24px por hora completa, 12px por media hora
      const totalVisibleHours = visibleEndHour - visibleStartHour + 1;
      const totalHeightPx = totalVisibleHours * 36; // 24px + 12px por cada hora

      const startMinutesFromVisibleStart =
        (hours - visibleStartHour) * 60 + minutes;
      const topPx = (startMinutesFromVisibleStart / 60) * 36; // 36px por hora
      const topPercentage = (topPx / totalHeightPx) * 100;

      // Calcular altura basada en duración
      const durationMinutes = meeting.duration
        ? parseInt(meeting.duration, 10)
        : 30;
      const heightPx = (durationMinutes / 60) * 36; // 36px por hora
      const heightPercentage = (heightPx / totalHeightPx) * 100;

      // Formatear horas para mostrar
      const startTime = format(meetingDate, 'HH:mm');
      const endTime = format(addMinutes(meetingDate, durationMinutes), 'HH:mm');

      return {
        valid: true,
        top: `${topPercentage}%`,
        height: `${heightPercentage}%`,
        start: startTime,
        end: endTime
      };
    } catch (e) {
      console.error('Error al calcular posición de reunión:', e);
      return { valid: false };
    }
  };

  // Filtrar reuniones para mostrar solo las del día seleccionado
  const dailyMeetings = meetings.filter(meeting => {
    try {
      const meetingDate = new Date(meeting.date);
      return isSameDay(meetingDate, currentDate);
    } catch (e) {
      return false;
    }
  });

  // Manejar click en una reunión
  const handleMeetingClick = meeting => {
    setSelectedMeeting(meeting);
    setPopoverOpen(true);
  };

  // Manejar click en la grilla para añadir reunión
  const handleTimeSlotClick = (hour, halfHour = false) => {
    const date = setHours(setMinutes(currentDate, halfHour ? 30 : 0), hour);
    if (onAddMeeting) {
      onAddMeeting(date);
    }
  };

  if (isLoading) {
    return <DailyCalendarSkeleton />;
  }

  return (
    <div className='flex flex-col h-full border rounded-lg bg-white dark:bg-gray-950 shadow-sm overflow-hidden'>
      {/* Cabecera del calendario */}
      <div className='flex justify-between items-center py-1 px-2 border-b bg-white dark:bg-gray-950 sticky top-0 z-10'>
        <div className='flex items-center gap-1'>
          <CalendarIcon className='h-3 w-3 text-primary' />
          <h3 className='text-xs font-medium'>
            {format(currentDate, 'EEEE, d MMMM yyyy', { locale: es })}
          </h3>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='icon'
            className='h-5 w-5 p-0'
            onClick={prevDay}
          >
            <ChevronLeft className='h-2.5 w-2.5' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='h-5 px-1.5 text-[10px]'
            onClick={goToToday}
          >
            Hoy
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='h-5 w-5 p-0'
            onClick={nextDay}
          >
            <ChevronRight className='h-2.5 w-2.5' />
          </Button>
        </div>
      </div>

      {/* Grilla de horas y eventos */}
      <ScrollArea className='flex-1'>
        <div className='relative' style={{ minHeight: '400px' }}>
          <div className='grid grid-cols-[auto_1fr]'>
            {/* Columna de horas */}
            <div className='w-10 pr-1 border-r border-gray-200 dark:border-gray-800'>
              {visibleHours.map(hour => (
                <div key={hour} className='relative'>
                  {/* Bloque de hora completa */}
                  <div className='h-[24px] relative'>
                    <div className='absolute top-0 right-1 -translate-y-1/2 text-[8px] text-muted-foreground z-10 bg-white dark:bg-gray-950 px-0.5'>
                      {formatHour(hour)}
                    </div>
                  </div>

                  {/* Media hora */}
                  <div className='h-[12px] relative'>
                    <div className='absolute top-1/2 right-1 w-0.5 h-0.5 rounded-full bg-gray-300 dark:bg-gray-700'></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grilla principal del día */}
            <div className='relative'>
              {/* Fondo de la grilla con líneas horizontales para cada hora y media hora */}
              <div className='absolute inset-0'>
                {visibleHours.map(hour => (
                  <div key={hour} className='relative'>
                    {/* Línea de hora completa */}
                    <div className='h-[24px] border-t border-gray-200 dark:border-gray-800'></div>

                    {/* Línea de media hora */}
                    <div className='h-[12px] border-t border-gray-100 dark:border-gray-900 border-dashed'></div>
                  </div>
                ))}
              </div>

              {/* Celdas clickeables para cada hora */}
              <div className='relative h-full'>
                {visibleHours.map(hour => (
                  <React.Fragment key={`slots-${hour}`}>
                    <div
                      className='h-[24px] hover:bg-accent/20 transition-colors cursor-pointer'
                      onClick={() => handleTimeSlotClick(hour, false)}
                    />
                    <div
                      className='h-[12px] hover:bg-accent/20 transition-colors cursor-pointer'
                      onClick={() => handleTimeSlotClick(hour, true)}
                    />
                  </React.Fragment>
                ))}
              </div>

              {/* Reuniones */}
              {dailyMeetings.map(meeting => {
                const position = getMeetingPosition(meeting);
                if (!position.valid) return null;

                const colorClasses = getMeetingColor(meeting.title);

                return (
                  <Popover
                    key={meeting.id}
                    open={selectedMeeting?.id === meeting.id && popoverOpen}
                    onOpenChange={setPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <div
                        className={cn(
                          'absolute border rounded-sm p-1 overflow-hidden cursor-pointer transition-opacity hover:opacity-90 shadow-sm z-20 left-0 right-0 mx-1',
                          colorClasses
                        )}
                        style={{
                          top: position.top,
                          height: position.height
                        }}
                        onClick={() => handleMeetingClick(meeting)}
                      >
                        <div className='text-[10px] font-medium truncate'>
                          {meeting.title}
                        </div>
                        <div className='text-[9px] truncate flex items-center'>
                          <Clock className='h-2 w-2 inline mr-0.5 flex-shrink-0' />
                          <span>
                            {position.start} - {position.end}
                          </span>
                        </div>
                        {meeting.leadName && (
                          <div className='text-[9px] truncate flex items-center'>
                            <User className='h-2 w-2 inline mr-0.5 flex-shrink-0' />
                            <span>{meeting.leadName}</span>
                          </div>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className='w-64 p-0' align='start'>
                      <div className={cn('p-2', colorClasses)}>
                        <h3 className='font-medium'>{meeting.title}</h3>
                        <p className='text-xs'>
                          {format(
                            new Date(meeting.date),
                            'EEEE, d MMMM - HH:mm',
                            { locale: es }
                          )}
                        </p>
                      </div>
                      <div className='p-2 space-y-1.5'>
                        {meeting.leadName && (
                          <div className='flex items-center text-xs text-muted-foreground'>
                            <User className='h-3 w-3 mr-1.5' />
                            <span>{meeting.leadName}</span>
                          </div>
                        )}
                        {meeting.location && (
                          <div className='flex items-center text-xs text-muted-foreground'>
                            <MapPin className='h-3 w-3 mr-1.5' />
                            <span>{meeting.location}</span>
                          </div>
                        )}
                        {meeting.description && (
                          <p className='text-xs mt-2 border-t pt-2'>
                            {meeting.description}
                          </p>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function DailyCalendarSkeleton() {
  return (
    <div className='space-y-2 border rounded-lg p-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-5 w-28' />
        <div className='flex space-x-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-16' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>

      <Skeleton className='h-[400px] w-full mt-4' />
    </div>
  );
}
