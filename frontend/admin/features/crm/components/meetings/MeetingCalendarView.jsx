'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Calendar, Clock, Plus } from 'lucide-react';
import { useMeetingsStore } from '../../lib/store/meetings-store';
import ScheduleMeetingModal from './ScheduleMeetingModal';

/**
 * Vista completa de calendario para reuniones
 * Esta es una versión inicial que luego podrá integrar con @fullcalendar/react para
 * una experiencia tipo Google Calendar
 */
export default function MeetingCalendarView({ leads = [], isLoading = false }) {
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Obtener reuniones del store
  const {
    meetings,
    isLoading: meetingsLoading,
    fetchMeetings,
    addMeeting
  } = useMeetingsStore();

  // Cargar reuniones
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Agendar reunión
  const handleAddMeeting = () => {
    setShowMeetingModal(true);
  };

  // Guardar reunión
  const handleSaveMeeting = async meeting => {
    try {
      // Buscar el lead para obtener el nombre del cliente
      const lead = leads.find(lead => lead.id === meeting.leadId);
      if (lead) {
        meeting.client = lead.name;
      }

      await addMeeting(meeting);
      setShowMeetingModal(false);
    } catch (error) {
      console.error('Error al guardar la reunión:', error);
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

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Calendario de Reuniones</h2>
        <Button onClick={handleAddMeeting} className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          Agendar Reunión
        </Button>
      </div>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='flex items-center text-lg'>
            <Calendar className='h-5 w-5 mr-2 text-primary' />
            Próximas Reuniones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || meetingsLoading ? (
            <div className='text-center py-8'>Cargando reuniones...</div>
          ) : meetings.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              No hay reuniones agendadas
            </div>
          ) : (
            <div className='divide-y'>
              {meetings.map(meeting => (
                <div
                  key={meeting.id}
                  className='py-3 flex justify-between items-start'
                >
                  <div>
                    <h3 className='font-medium'>{meeting.title}</h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Cliente: {meeting.client || 'Sin cliente asignado'}
                    </p>
                  </div>
                  <div className='flex items-center text-sm text-muted-foreground'>
                    <Clock className='h-4 w-4 mr-1' />
                    <span>{formatDate(meeting.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className='text-center py-8 bg-muted/30 rounded-lg p-8'>
        <h3 className='text-xl font-medium mb-2'>
          Próximamente: Vista de Calendario Completa
        </h3>
        <p className='text-muted-foreground mb-4'>
          Estamos trabajando en implementar una vista de calendario al estilo
          Google Calendar para una mejor gestión de sus reuniones.
        </p>
      </div>

      {/* Modal para agendar reuniones */}
      <ScheduleMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSave={handleSaveMeeting}
        leads={leads}
      />
    </div>
  );
}
