'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay,
  addDays,
  addWeeks,
  subWeeks,
  parseISO,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  addMinutes,
  differenceInMinutes,
  isBefore,
  isAfter,
  startOfDay
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

// Definimos horas desde las 0 (12 AM) hasta las 23 (11 PM), pero mostraremos desde 6 AM a 11 PM por defecto
const ALL_HOURS = Array.from({ length: 24 }, (_, i) => i);
const DEFAULT_START_HOUR = 6; // 6 AM
const DEFAULT_END_HOUR = 23; // 11 PM
const DAYS_OF_WEEK = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const CELL_HEIGHT = 40; // Altura reducida de celda para hora completa
const HALF_CELL_HEIGHT = 20; // Altura reducida de celda para media hora (30min)

/**
 * Vista de calendario semanal con formato similar a Google Calendar
 */
export default function WeeklyCalendarView({
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

  // Calcular días de la semana actual
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Domingo como inicio
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Navegar al siguiente periodo
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  // Navegar al periodo anterior
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));

  // Navegar a hoy
  const goToToday = () => setCurrentDate(new Date());

  // Formatear fecha para mostrar en cabecera
  const formatHeaderDate = date => {
    return format(date, 'd', { locale: es });
  };

  // Formatear hora para mostrar en la columna izquierda
  const formatHour = hour => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  // Obtener color para las reuniones (siempre violeta/primary como color de la aplicación)
  const getMeetingColor = () => {
    // Usar siempre el color principal (violeta)
    return 'bg-primary/20 border-primary/30 text-primary';
  };

  // Posicionar la reunión en la grilla de horas
  const getMeetingPosition = meeting => {
    try {
      const meetingDate = new Date(meeting.date);
      const meetingDay = startOfDay(meetingDate);
      const hours = getHours(meetingDate);
      const minutes = getMinutes(meetingDate);

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

      // Encontrar el día de la semana que coincide con la reunión
      const dayIndex = weekDays.findIndex(day => isSameDay(day, meetingDay));

      // Formatear horas para mostrar
      const startTime = format(meetingDate, 'HH:mm');
      const endTime = format(addMinutes(meetingDate, durationMinutes), 'HH:mm');

      return {
        valid: dayIndex >= 0,
        dayIndex,
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

  // Filtrar reuniones para mostrar solo las de la semana actual
  const weeklyMeetings = meetings.filter(meeting => {
    try {
      const meetingDate = new Date(meeting.date);
      const start = weekDays[0];
      const end = addDays(weekDays[6], 1); // Incluir todo el último día
      return !isBefore(meetingDate, start) && isBefore(meetingDate, end);
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
  const handleTimeSlotClick = (day, hour, halfHour = false) => {
    const date = setHours(setMinutes(day, halfHour ? 30 : 0), hour);
    if (onAddMeeting) {
      onAddMeeting(date);
    }
  };

  if (isLoading) {
    return <WeeklyCalendarSkeleton />;
  }

  return (
    <div className='flex flex-col h-full border rounded-lg bg-white dark:bg-gray-950 shadow-sm overflow-hidden'>
      {/* Cabecera del calendario */}
      <div className='flex justify-between items-center py-1 px-2 border-b bg-white dark:bg-gray-950 sticky top-0 z-10'>
        <div className='flex items-center gap-1'>
          <CalendarIcon className='h-3 w-3 text-primary' />
          <h3 className='text-xs font-medium'>
            {format(weekDays[0], 'MMMM yyyy', { locale: es })}
          </h3>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='icon'
            className='h-5 w-5 p-0'
            onClick={prevWeek}
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
            onClick={nextWeek}
          >
            <ChevronRight className='h-2.5 w-2.5' />
          </Button>
        </div>
      </div>

      {/* Cabecera de días */}
      <div className='grid grid-cols-8 border-b bg-white dark:bg-gray-950 sticky top-[30px] z-10'>
        {/* Celda vacía para la columna de horas */}
        <div className='border-r border-gray-200 dark:border-gray-800 w-10'></div>

        {/* Días de la semana */}
        {weekDays.map((day, index) => (
          <div
            key={day.toString()}
            className={cn(
              'flex flex-col items-center py-0.5',
              isToday(day) ? 'bg-primary/5' : ''
            )}
          >
            <div className='text-[9px] font-medium text-muted-foreground'>
              {DAYS_OF_WEEK[index]}
            </div>
            <div
              className={cn(
                'text-[10px] w-5 h-5 flex items-center justify-center rounded-full',
                isToday(day)
                  ? 'bg-primary text-primary-foreground font-medium'
                  : ''
              )}
            >
              {formatHeaderDate(day)}
            </div>
          </div>
        ))}
      </div>

      {/* Grilla de horas y eventos */}
      <ScrollArea className='flex-1'>
        <div className='relative' style={{ minHeight: '400px' }}>
          <div className='grid grid-cols-8'>
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

            {/* Grilla principal de días/horas */}
            <div className='col-span-7 grid grid-cols-7 relative'>
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

              {/* Líneas verticales para separar los días */}
              {weekDays.map((day, i) => (
                <div
                  key={`divider-${i}`}
                  className={cn(
                    'border-r border-gray-200 dark:border-gray-800 h-full',
                    isToday(day) ? 'bg-primary/5' : '',
                    i === 6 ? 'border-r-0' : ''
                  )}
                >
                  {/* Celdas clickeables para cada hora */}
                  {visibleHours.map(hour => (
                    <React.Fragment key={`slots-${day}-${hour}`}>
                      <div
                        className='h-[24px] hover:bg-accent/20 transition-colors cursor-pointer'
                        onClick={() => handleTimeSlotClick(day, hour, false)}
                      />
                      <div
                        className='h-[12px] hover:bg-accent/20 transition-colors cursor-pointer'
                        onClick={() => handleTimeSlotClick(day, hour, true)}
                      />
                    </React.Fragment>
                  ))}
                </div>
              ))}

              {/* Reuniones */}
              {weeklyMeetings.map(meeting => {
                const position = getMeetingPosition(meeting);
                if (!position.valid) return null;

                const colorClasses = getMeetingColor();

                return (
                  <Popover
                    key={meeting.id}
                    open={selectedMeeting?.id === meeting.id && popoverOpen}
                    onOpenChange={setPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <div
                        className={cn(
                          'absolute border rounded-sm p-1 overflow-hidden cursor-pointer transition-opacity hover:opacity-90 shadow-sm z-20',
                          colorClasses
                        )}
                        style={{
                          top: position.top,
                          height: position.height,
                          left: `calc(${(position.dayIndex / 7) * 100}% + 1px)`,
                          width: 'calc(14.28% - 2px)'
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

function WeeklyCalendarSkeleton() {
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

      <div className='grid grid-cols-8 mt-4'>
        <div className='h-10' />
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className='h-10 mx-1' />
        ))}
      </div>

      <Skeleton className='h-[400px] w-full mt-4' />
    </div>
  );
}
