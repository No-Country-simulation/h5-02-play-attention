'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  MapPin,
  AlertCircle
} from 'lucide-react';
import ScheduleMeetingModal from './ScheduleMeetingModal';
import { toast } from 'sonner';
import { Badge } from '@/shared/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/shared/ui/tooltip';
import { useLeads } from '../../lib/hooks/useLeads';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import {
  useSchedules,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule
} from '../../lib/hooks/useSchedules';
import {
  apiToClientSchedule,
  clientToApiSchedule
} from '../../lib/adapters/schedule-adapter';
import MeetingCalendar from './MeetingCalendar';

/**
 * Vista de calendario para reuniones utilizando React Query
 */
export default function MeetingCalendarView() {
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Obtener horarios con React Query
  const {
    data: schedulesData = [],
    isLoading: schedulesLoading,
    error: schedulesError
  } = useSchedules();

  console.log('Datos recibidos del backend:', schedulesData);

  // Transformar datos de la API al formato del cliente
  const meetings = Array.isArray(schedulesData)
    ? schedulesData.map(apiToClientSchedule).filter(Boolean)
    : [];

  console.log('Reuniones transformadas:', meetings);

  // Mutaciones para crear, actualizar y eliminar horarios
  const createScheduleMutation = useCreateSchedule();
  const updateScheduleMutation = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();

  // Obtener leads para asociarlos a las reuniones
  const { data: leads = [], isLoading: leadsLoading } = useLeads();

  // Mostrar modal para crear reunión
  const handleAddMeeting = (date = null) => {
    setSelectedDate(date);
    setSelectedMeeting(null);
    setShowMeetingModal(true);
  };

  // Editar reunión existente
  const handleEditMeeting = meeting => {
    setSelectedMeeting(meeting);
    setSelectedDate(null);
    setShowMeetingModal(true);
  };

  // Eliminar reunión
  const handleDeleteMeeting = async id => {
    if (window.confirm('¿Está seguro de eliminar esta reunión?')) {
      try {
        await deleteScheduleMutation.mutateAsync(id);
        toast.success('Reunión eliminada correctamente');
      } catch (error) {
        toast.error('Error al eliminar la reunión: ' + error.message);
      }
    }
  };

  // Guardar nueva reunión o actualizar existente
  const handleSaveMeeting = async meetingData => {
    try {
      // Convertir al formato de la API
      const apiData = clientToApiSchedule(meetingData);

      if (selectedMeeting) {
        // Actualizar reunión existente
        await updateScheduleMutation.mutateAsync({
          id: selectedMeeting.id,
          data: apiData
        });
      } else {
        // Crear nueva reunión
        await createScheduleMutation.mutateAsync(apiData);
      }

      setShowMeetingModal(false);
    } catch (error) {
      toast.error('Error al guardar la reunión: ' + error.message);
    }
  };

  // Formatear fecha
  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Determinar el color del badge según el estado
  const getStatusBadgeVariant = status => {
    const statusMap = {
      Pending: 'warning',
      Completed: 'success',
      Cancelled: 'destructive',
      default: 'secondary'
    };
    return statusMap[status] || statusMap.default;
  };

  // Estado de carga combinado
  const isLoading =
    schedulesLoading ||
    leadsLoading ||
    createScheduleMutation.isPending ||
    updateScheduleMutation.isPending ||
    deleteScheduleMutation.isPending;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Calendario de Reuniones</h2>
        <Button
          onClick={() => handleAddMeeting()}
          className='flex items-center gap-2'
        >
          <Plus className='h-4 w-4' />
          Agendar Reunión
        </Button>
      </div>

      <div className='grid md:grid-cols-3 gap-6'>
        {/* Calendario visual en la izquierda */}
        <div className='md:col-span-2'>
          <Card className='h-full'>
            <CardContent className='p-4'>
              <MeetingCalendar
                meetings={meetings}
                isLoading={schedulesLoading}
                onAddMeeting={handleAddMeeting}
              />
            </CardContent>
          </Card>
        </div>

        {/* Lista de próximas reuniones a la derecha */}
        <div>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center text-lg'>
                <Calendar className='h-5 w-5 mr-2 text-primary' />
                Próximas Reuniones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='flex justify-center py-8'>
                  <LoadingSpinner />
                </div>
              ) : schedulesError ? (
                <div className='text-center py-8 text-destructive'>
                  Error al cargar las reuniones: {schedulesError.message}
                </div>
              ) : meetings.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  No hay reuniones agendadas
                </div>
              ) : (
                <div className='divide-y'>
                  {meetings.map(meeting => (
                    <div
                      key={meeting.id}
                      className='py-4 flex justify-between items-start'
                    >
                      <div className='flex-1'>
                        <div className='flex items-center flex-wrap'>
                          <h3 className='font-medium'>{meeting.title}</h3>
                          <Badge
                            variant={getStatusBadgeVariant(meeting.status)}
                            className='ml-2'
                          >
                            {meeting.status}
                          </Badge>
                        </div>

                        <p className='text-sm text-muted-foreground mt-1'>
                          Cliente: {meeting.leadName || 'Sin cliente asignado'}
                        </p>

                        {meeting.location && (
                          <p className='text-xs text-muted-foreground mt-1 flex items-center'>
                            <MapPin className='h-3 w-3 mr-1' />
                            {meeting.location}
                          </p>
                        )}
                      </div>

                      <div className='flex flex-col items-end gap-2'>
                        <div className='flex items-center text-sm text-muted-foreground'>
                          <Clock className='h-4 w-4 mr-1' />
                          <span>{formatDate(meeting.date)}</span>
                        </div>

                        <div className='flex space-x-1'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-7 w-7'
                                  onClick={() => handleEditMeeting(meeting)}
                                >
                                  <Edit className='h-4 w-4' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar reunión</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-7 w-7 text-destructive'
                                  onClick={() =>
                                    handleDeleteMeeting(meeting.id)
                                  }
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Eliminar reunión</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para crear/editar reunión */}
      <ScheduleMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSave={handleSaveMeeting}
        leads={leads}
        preselectedDate={selectedDate}
        preselectedLead={selectedMeeting?.leadId}
        meeting={selectedMeeting}
      />
    </div>
  );
}
