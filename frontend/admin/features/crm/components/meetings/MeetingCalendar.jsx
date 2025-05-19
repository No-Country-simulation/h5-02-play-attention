'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isBefore,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  Clock,
  UserIcon,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/popover';
import { ScrollArea } from '@/shared/ui/scroll-area';

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
      const meetingDate = new Date(meeting.date);
      return isSameDay(meetingDate, selectedDate);
    } catch (e) {
      console.error('Error al procesar fecha de reunión:', e);
      return false;
    }
  });

  // Filtrar próximas reuniones (desde hoy)
  const upcomingMeetings = meetings
    .filter(meeting => {
      try {
        // Intentar obtener la fecha de la reunión (usando date o startTime)
        const dateField = meeting.date || meeting.startTime;
        if (!dateField) {
          return false;
        }

        const meetingDate = new Date(dateField);
        return isBefore(new Date(), meetingDate) || isToday(meetingDate);
      } catch (e) {
        console.error(
          'Error al procesar fecha para próximas reuniones:',
          e,
          meeting
        );
        return false;
      }
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || a.startTime);
      const dateB = new Date(b.date || b.startTime);
      return dateA - dateB;
    })
    .slice(0, 3); // Limitar a 3 reuniones para mostrar

  // Cambiar al mes anterior
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Cambiar al mes siguiente
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Obtener fecha actual
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Contar reuniones por día
  const getMeetingsForDay = day => {
    if (!meetings || !Array.isArray(meetings) || meetings.length === 0) {
      return [];
    }

    return meetings.filter(meeting => {
      try {
        // Intentar obtener la fecha de la reunión (usando date o startTime)
        const dateField = meeting.date || meeting.startTime;
        if (!dateField) {
          console.warn('Reunión sin fecha:', meeting);
          return false;
        }

        const meetingDate = new Date(dateField);
        const isSame = isSameDay(meetingDate, day);

        // Mostrar para depuración solo si la reunión es del día actual
        if (isToday(day) && isSame) {
          console.log('Reunión encontrada para hoy:', meeting);
        }

        return isSame;
      } catch (e) {
        console.error('Error al procesar fecha de reunión:', e, meeting);
        return false;
      }
    });
  };

  // Formatear hora
  const formatTime = dateString => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm');
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

  // Mostrar formulario para agendar reunión
  const handleAddMeetingOnDate = date => {
    if (onAddMeeting) {
      onAddMeeting(date);
    }
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  // Mostrar mensaje si no hay reuniones
  const showNoMeetingsMessage = !meetings || meetings.length === 0;

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-none'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center'>
            <CalendarIcon className='h-5 w-5 mr-2 text-primary' />
            <span className='text-lg font-medium'>
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </span>
          </div>
          <div className='flex space-x-2'>
            <Button variant='outline' size='sm' onClick={prevMonth}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='sm' onClick={goToToday}>
              Hoy
            </Button>
            <Button variant='outline' size='sm' onClick={nextMonth}>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {showNoMeetingsMessage ? (
          <div className='flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/10 rounded-md'>
            <p className='text-muted-foreground text-sm'>
              No hay reuniones agendadas
            </p>
            <Button
              size='sm'
              onClick={() => onAddMeeting(new Date())}
              className='flex items-center gap-1'
            >
              <Plus className='h-4 w-4' />
              Agendar Reunión
            </Button>
          </div>
        ) : (
          <>
            {/* Grid del calendario */}
            <div className='grid grid-cols-7 gap-1 text-center'>
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                <div
                  key={day}
                  className='text-xs font-medium py-1 text-muted-foreground'
                >
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
                <div key={`empty-${i}`} className='h-9 rounded-md' />
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
                        className={`h-9 w-full relative text-xs font-medium ${
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
                                className='text-[9px] h-3 min-w-3 flex items-center justify-center bg-primary/20 hover:bg-primary/20 p-0'
                              >
                                {meetingCount}
                              </Badge>
                            ) : (
                              <span className='w-2 h-2 bg-primary rounded-full inline-block'></span>
                            )}
                          </div>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-64 p-2' align='center'>
                      <div className='text-xs'>
                        <div className='flex items-center justify-between mb-2'>
                          <div className='flex items-center font-medium text-sm'>
                            <CalendarIcon className='h-3 w-3 mr-1' />
                            {format(day, 'PPP', { locale: es })}
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-6 px-2 text-xs'
                            onClick={() => handleAddMeetingOnDate(day)}
                          >
                            <Plus className='h-3 w-3 mr-1' />
                            Añadir
                          </Button>
                        </div>

                        <ScrollArea className='h-[180px]'>
                          {dayMeetings.map(meeting => (
                            <div
                              key={meeting.id}
                              className='mb-2 p-2 rounded-md bg-muted/50 last:mb-0'
                            >
                              <div className='font-medium'>{meeting.title}</div>
                              <div className='flex items-center text-muted-foreground'>
                                <Clock className='h-3 w-3 mr-1' />
                                {formatTime(meeting.date)}
                                {meeting.duration && (
                                  <span className='ml-1'>
                                    ({meeting.duration} min)
                                  </span>
                                )}
                              </div>
                              {meeting.leadName && (
                                <div className='flex items-center text-muted-foreground'>
                                  <UserIcon className='h-3 w-3 mr-1' />
                                  {meeting.leadName}
                                </div>
                              )}
                              {meeting.location && (
                                <div className='flex items-center text-muted-foreground'>
                                  <MapPin className='h-3 w-3 mr-1' />
                                  {meeting.location}
                                </div>
                              )}
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Skeleton para el estado de carga
function CalendarSkeleton() {
  return (
    <div className='h-full'>
      <div className='flex justify-between items-center mb-4'>
        <Skeleton className='h-6 w-32' />
        <div className='flex space-x-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-16' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>

      <div className='grid grid-cols-7 gap-1 text-center'>
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
          <div key={day} className='text-xs font-medium py-1'>
            {day}
          </div>
        ))}

        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className='h-9 w-full' />
        ))}
      </div>

      <div className='mt-6'>
        <Skeleton className='h-5 w-40 mb-3' />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-16 w-full mb-2' />
        ))}
      </div>
    </div>
  );
}
