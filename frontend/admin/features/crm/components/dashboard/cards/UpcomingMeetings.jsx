'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { useSchedules } from '../../../lib/hooks/useSchedules';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { apiToClientSchedule } from '../../../lib/adapters/schedule-adapter';
import { useRouter } from 'next/navigation';
import ScheduleMeetingModal from '../../meetings/ScheduleMeetingModal';
import { useLeads } from '../../../lib/hooks/useLeads';
import { useCreateSchedule } from '../../../lib/hooks/useSchedules';
import { clientToApiSchedule } from '../../../lib/adapters/schedule-adapter';

/**
 * Componente para mostrar las próximas reuniones en el dashboard
 */
export default function UpcomingMeetings() {
  const router = useRouter();
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Obtener horarios con React Query
  const {
    data: schedulesData = [],
    isLoading: schedulesLoading,
    error: schedulesError
  } = useSchedules();

  // Transformar datos de la API al formato del cliente
  const meetings = Array.isArray(schedulesData)
    ? schedulesData.map(apiToClientSchedule)
    : [];

  // Ordenar por fecha (próximas primero) y limitar a 3
  const upcomingMeetings = [...meetings]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter(meeting => new Date(meeting.date) >= new Date())
    .slice(0, 3);

  // Obtener leads y mutación para crear reuniones
  const { data: leads = [] } = useLeads();
  const createScheduleMutation = useCreateSchedule();

  // Formatear fecha
  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Mostrar modal para crear reunión
  const handleAddMeeting = () => {
    setShowMeetingModal(true);
  };

  // Guardar nueva reunión
  const handleSaveMeeting = async meetingData => {
    try {
      // Buscar el lead para obtener el nombre del cliente
      const lead = leads.find(
        lead => lead.id === (meetingData.lead || meetingData.leadId)
      );
      if (lead) {
        meetingData.client = lead.name;
      }

      // Convertir al formato de la API
      const apiData = clientToApiSchedule(meetingData);

      // Crear nueva reunión
      await createScheduleMutation.mutateAsync(apiData);

      setShowMeetingModal(false);
    } catch (error) {
      // El error ya se maneja en la mutación
    }
  };

  // Ir a la vista completa del calendario
  const handleViewAll = () => {
    router.push('/crm?tab=calendar');
  };

  return (
    <Card className='col-span-12 md:col-span-6 lg:col-span-4 h-full flex flex-col'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
        <CardTitle className='text-base font-semibold flex items-center'>
          <Calendar className='h-4 w-4 mr-2 text-primary' />
          Próximas Reuniones
        </CardTitle>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 px-2'
          onClick={handleAddMeeting}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent className='flex-1 flex flex-col justify-between'>
        {schedulesLoading ? (
          <div className='flex justify-center py-8'>
            <LoadingSpinner size='md' />
          </div>
        ) : schedulesError ? (
          <div className='text-center text-sm text-muted-foreground py-4'>
            Error al cargar las reuniones
          </div>
        ) : upcomingMeetings.length === 0 ? (
          <div className='text-center text-sm text-muted-foreground py-4'>
            No hay reuniones programadas próximamente
          </div>
        ) : (
          <div className='space-y-3 flex-1'>
            {upcomingMeetings.map(meeting => (
              <div
                key={meeting.id}
                className='p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors'
              >
                <h3 className='font-medium text-sm'>{meeting.title}</h3>
                <div className='mt-1 space-y-1'>
                  <p className='text-xs text-muted-foreground flex items-center'>
                    <Clock className='h-3 w-3 mr-1 inline' />
                    {formatDate(meeting.date)}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Cliente: {meeting.client || 'Sin cliente asignado'}
                  </p>
                  {meeting.location && (
                    <p className='text-xs text-muted-foreground flex items-center'>
                      <MapPin className='h-3 w-3 mr-1' />
                      {meeting.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant='link'
          size='sm'
          onClick={handleViewAll}
          className='mt-4 self-end'
        >
          Ver todas las reuniones
        </Button>
      </CardContent>

      {/* Modal para agendar reuniones */}
      <ScheduleMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSave={handleSaveMeeting}
        leads={leads}
      />
    </Card>
  );
}
