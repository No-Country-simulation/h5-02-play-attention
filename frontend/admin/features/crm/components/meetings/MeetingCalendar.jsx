'use client';

import { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isBefore,
  isToday
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Clock,
  UserIcon,
  MapPin,
  Plus,
  ChevronRight
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/popover';

/**
 * Componente que muestra un calendario para visualizar y gestionar reuniones
 */
export default function MeetingCalendar({
  meetings = [],
  isLoading = false,
  onAddMeeting
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Calcular días del mes actual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Filtrar reuniones de la fecha seleccionada
  const selectedDateMeetings = meetings.filter(meeting => {
    try {
      const meetingDate = parseISO(meeting.date);
      return isSameDay(meetingDate, selectedDate);
    } catch (e) {
      return false;
    }
  });

  // Filtrar próximas reuniones (desde hoy)
  const upcomingMeetings = meetings
    .filter(meeting => {
      try {
        const meetingDate = parseISO(meeting.date);
        return isBefore(new Date(), meetingDate) || isToday(meetingDate);
      } catch (e) {
        return false;
      }
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Limitar a 2 reuniones para mostrar
  const displayMeetings = upcomingMeetings.slice(0, 2);
  // Comprobar si hay más reuniones que las mostradas
  const hasMoreMeetings = upcomingMeetings.length > 2;

  // Cambiar al mes anterior
  const prevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Cambiar al mes siguiente
  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Obtener fecha actual
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Contar reuniones por día
  const getMeetingsForDay = day => {
    return meetings.filter(meeting => {
      try {
        return isSameDay(parseISO(meeting.date), day);
      } catch (e) {
        return false;
      }
    });
  };

  // Formatear hora
  const formatTime = dateString => {
    try {
      return format(parseISO(dateString), 'HH:mm');
    } catch (e) {
      return '';
    }
  };

  // Manejar click en día
  const handleDayClick = day => {
    setSelectedDate(day);
    const dayMeetings = getMeetingsForDay(day);
    setPopoverOpen(dayMeetings.length > 0);
  };

  // Manejar "Ver más reuniones"
  const handleViewAllMeetings = () => {
    // Aquí se podría navegar a una vista de calendario completa
    console.log('Ver todas las reuniones');
    // Por ejemplo: router.push('/meetings');
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-none'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <CalendarIcon className='h-4 w-4 mr-1 text-primary' />
            <span className='text-sm font-medium'>
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </span>
          </div>
          <div className='flex space-x-1'>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 p-0'
              onClick={prevMonth}
            >
              &lt;
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 text-xs px-2'
              onClick={goToToday}
            >
              Hoy
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-7 w-7 p-0'
              onClick={nextMonth}
            >
              &gt;
            </Button>
          </div>
        </div>

        {/* Grid del calendario */}
        <div className='grid grid-cols-7 gap-1 text-center mt-3'>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
            <div key={day} className='text-xs font-medium py-1'>
              {day}
            </div>
          ))}

          {/* Celdas vacías para ajustar el inicio del mes */}
          {Array.from({
            length:
              new Date(monthStart).getDay() === 0
                ? 6
                : new Date(monthStart).getDay() - 1
          }).map((_, i) => (
            <div key={`empty-${i}`} className='h-7 rounded-md' />
          ))}

          {/* Días del mes */}
          {days.map(day => {
            // Obtener reuniones para este día
            const dayMeetings = getMeetingsForDay(day);
            const hasMeetings = dayMeetings.length > 0;
            const meetingCount = dayMeetings.length;
            const isSelected = isSameDay(day, selectedDate);

            return (
              <Popover
                key={day.toString()}
                open={isSelected && popoverOpen && hasMeetings}
                onOpenChange={setPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant={isSelected ? 'default' : 'ghost'}
                    size='sm'
                    className={`h-7 w-full relative text-xs font-medium ${
                      !isSameMonth(day, currentDate)
                        ? 'text-muted-foreground opacity-50'
                        : ''
                    } ${
                      isToday(day) && !isSelected
                        ? 'border-2 border-primary'
                        : ''
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    <span>{format(day, 'd')}</span>
                    {hasMeetings && (
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2'>
                        {meetingCount > 1 ? (
                          <Badge
                            variant='outline'
                            className='text-[9px] h-3 min-w-3 flex items-center justify-center bg-secondary/20 hover:bg-secondary/20 p-0'
                          >
                            {meetingCount}
                          </Badge>
                        ) : (
                          <span className='w-2 h-2 bg-secondary/70 rounded-full inline-block'></span>
                        )}
                      </div>
                    )}
                  </Button>
                </PopoverTrigger>
                {hasMeetings && (
                  <PopoverContent className='w-64 p-2' align='center'>
                    <div className='text-xs'>
                      <div className='flex items-center font-medium mb-2'>
                        <CalendarIcon className='h-3 w-3 mr-1' />
                        Reuniones de{' '}
                        {format(day, "d 'de' MMMM", { locale: es })}:
                      </div>
                      <div className='space-y-1 max-h-[150px] overflow-y-auto'>
                        {dayMeetings.map(meeting => (
                          <div
                            key={meeting.id}
                            className='px-2 py-1 border border-primary/20 bg-primary/5 rounded-md flex justify-between items-start'
                          >
                            <span className='font-medium'>{meeting.title}</span>
                            <div className='flex items-center text-muted-foreground'>
                              <Clock className='h-2.5 w-2.5 mr-1' />
                              <span>{formatTime(meeting.date)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                )}
              </Popover>
            );
          })}
        </div>
      </div>

      {/* Espacio flexible (limitado) entre calendario y próximas reuniones */}
      <div className='h-4'></div>

      {/* Próximas reuniones - limitado a altura fija */}
      <div className='flex-none'>
        <div className='flex items-center justify-between mb-2'>
          <div className='text-xs font-medium'>Próximas reuniones</div>
          <Button
            variant='outline'
            size='sm'
            className='h-7 px-2 text-xs flex items-center gap-1'
            onClick={onAddMeeting}
          >
            <Plus className='h-3 w-3' />
            Agregar
          </Button>
        </div>
        <div className='space-y-1.5'>
          {displayMeetings.length > 0 ? (
            <>
              {displayMeetings.map(meeting => (
                <div
                  key={meeting.id}
                  className='p-2 border rounded-md text-xs border-muted bg-card'
                >
                  <div className='font-medium mb-1'>
                    {meeting.title || 'Reunión sin título'}
                  </div>
                  <div className='flex justify-between text-muted-foreground'>
                    <div className='flex items-center'>
                      <Clock className='h-3 w-3 mr-1' />
                      <span>{formatTime(meeting.date)}</span>
                    </div>
                    <div className='flex items-center'>
                      <UserIcon className='h-3 w-3 mr-1' />
                      <span>{meeting.client || 'Cliente'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {hasMoreMeetings && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='w-full h-7 text-xs text-muted-foreground flex items-center justify-center'
                  onClick={handleViewAllMeetings}
                >
                  Ver todas ({upcomingMeetings.length})
                  <ChevronRight className='h-3 w-3 ml-1' />
                </Button>
              )}
            </>
          ) : (
            <div className='text-xs text-center text-muted-foreground py-2'>
              No hay reuniones programadas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Esqueleto para estado de carga
function CalendarSkeleton() {
  return (
    <div className='space-y-4 flex flex-col h-full'>
      <div className='flex-none'>
        <div className='flex justify-between items-center'>
          <Skeleton className='h-5 w-32' />
          <div className='flex space-x-1'>
            <Skeleton className='h-7 w-7' />
            <Skeleton className='h-7 w-14' />
            <Skeleton className='h-7 w-7' />
          </div>
        </div>

        <div className='grid grid-cols-7 gap-1 text-center mt-3'>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
            <div key={day} className='text-xs font-medium py-1'>
              {day}
            </div>
          ))}

          {Array.from({ length: 31 }).map((_, i) => (
            <Skeleton key={`day-${i}`} className='h-8 w-full rounded-md' />
          ))}
        </div>
      </div>

      <div className='flex-grow'></div>

      <div className='flex-none mt-2'>
        <div className='flex items-center justify-between mb-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-5 w-16' />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={`meeting-${i}`} className='h-14 w-full mb-1.5' />
        ))}
      </div>
    </div>
  );
}
