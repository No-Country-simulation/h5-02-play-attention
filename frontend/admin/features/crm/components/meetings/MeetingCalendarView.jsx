'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  MapPin,
  AlertCircle,
  ChevronDown,
  Grid,
  List,
  Search,
  Filter,
  CalendarDays,
  CalendarIcon,
  CalendarRange
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
import { Input } from '@/shared/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ScrollArea } from '@/shared/ui/scroll-area';
import WeeklyCalendarView from './WeeklyCalendarView';
import DailyCalendarView from './DailyCalendarView';

/**
 * Vista de calendario para reuniones con diseño mejorado y opciones de visualización
 */
export default function MeetingCalendarView() {
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Obtener horarios con React Query
  const {
    data: schedulesData = [],
    isLoading: schedulesLoading,
    error: schedulesError
  } = useSchedules();

  // Transformar datos de la API al formato del cliente
  const meetings = Array.isArray(schedulesData)
    ? schedulesData.map(apiToClientSchedule).filter(Boolean)
    : [];

  // Filtrar reuniones según búsqueda y filtro de estado
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch =
      searchTerm === '' ||
      meeting.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.leadName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || meeting.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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
    <div className='space-y-4'>
      {/* Cabecera y controles */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3'>
        <h2 className='text-xl font-semibold'>Calendario de Reuniones</h2>
        <Button
          onClick={() => handleAddMeeting()}
          size='sm'
          className='h-8 text-xs px-3 gap-1'
        >
          <Plus className='h-3.5 w-3.5' />
          Agendar Reunión
        </Button>
      </div>

      {/* Contenido principal con tabs */}
      <Tabs defaultValue='week' className='w-full'>
        <TabsList className='mb-3 h-8'>
          <TabsTrigger value='month' className='text-xs h-6 px-3'>
            <CalendarIcon className='h-3.5 w-3.5 mr-1.5' />
            Mes
          </TabsTrigger>
          <TabsTrigger value='week' className='text-xs h-6 px-3'>
            <CalendarRange className='h-3.5 w-3.5 mr-1.5' />
            Semana
          </TabsTrigger>
          <TabsTrigger value='day' className='text-xs h-6 px-3'>
            <CalendarDays className='h-3.5 w-3.5 mr-1.5' />
            Día
          </TabsTrigger>
          <TabsTrigger value='list' className='text-xs h-6 px-3'>
            <List className='h-3.5 w-3.5 mr-1.5' />
            Lista
          </TabsTrigger>
        </TabsList>

        {/* Vista mensual */}
        <TabsContent value='month'>
          <Card className='h-full'>
            <CardContent className='p-3'>
              <MeetingCalendar
                meetings={meetings}
                isLoading={schedulesLoading}
                onAddMeeting={handleAddMeeting}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vista semanal */}
        <TabsContent value='week'>
          <WeeklyCalendarView
            meetings={meetings}
            isLoading={schedulesLoading}
            onAddMeeting={handleAddMeeting}
          />
        </TabsContent>

        {/* Vista diaria */}
        <TabsContent value='day'>
          <DailyCalendarView
            meetings={meetings}
            isLoading={schedulesLoading}
            onAddMeeting={handleAddMeeting}
          />
        </TabsContent>

        {/* Vista de lista */}
        <TabsContent value='list'>
          {/* Filtros y búsqueda - solo en vista de lista */}
          <div className='flex flex-col sm:flex-row items-center gap-2 mb-3'>
            <div className='relative w-full sm:w-auto flex-1 max-w-xs'>
              <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
              <Input
                placeholder='Buscar reuniones...'
                className='pl-7 h-8 text-xs'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='flex items-center gap-1.5 justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 text-xs gap-1 px-2'
                  >
                    <Filter className='h-3.5 w-3.5' />
                    {filterStatus === 'all' ? 'Todos' : filterStatus}
                    <ChevronDown className='h-3.5 w-3.5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='text-xs min-w-32'>
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('Pending')}>
                    Pendientes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus('Completed')}
                  >
                    Completadas
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterStatus('Cancelled')}
                  >
                    Canceladas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className='flex border rounded-md overflow-hidden h-8'>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('grid')}
                  className='rounded-none border-0 px-2 h-8'
                >
                  <Grid className='h-3.5 w-3.5' />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => setViewMode('list')}
                  className='rounded-none border-0 px-2 h-8'
                >
                  <List className='h-3.5 w-3.5' />
                </Button>
              </div>
            </div>
          </div>

          <Card className='border-t-0 rounded-tl-none rounded-tr-none'>
            <CardContent className='p-3'>
              {isLoading ? (
                <div className='flex justify-center py-6'>
                  <LoadingSpinner />
                </div>
              ) : schedulesError ? (
                <div className='text-center py-6 text-destructive text-sm'>
                  <AlertCircle className='h-4 w-4 mx-auto mb-2' />
                  Error al cargar las reuniones: {schedulesError.message}
                </div>
              ) : filteredMeetings.length === 0 ? (
                <div className='text-center py-6 text-muted-foreground text-sm'>
                  No hay reuniones que coincidan con los criterios de búsqueda
                </div>
              ) : viewMode === 'grid' ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                  {filteredMeetings.map(meeting => (
                    <Card
                      key={meeting.id}
                      className='hover:bg-accent/5 transition-colors border'
                    >
                      <CardContent className='p-3 flex flex-col gap-2'>
                        <div className='flex items-center justify-between'>
                          <h3 className='font-medium text-sm truncate'>
                            {meeting.title}
                          </h3>
                          <Badge
                            variant={getStatusBadgeVariant(meeting.status)}
                            className='text-[10px] h-4 px-1.5'
                          >
                            {meeting.status}
                          </Badge>
                        </div>

                        <div className='text-xs text-muted-foreground space-y-1'>
                          <div className='flex items-center gap-1'>
                            <Clock className='h-3 w-3 flex-shrink-0' />
                            <span>{formatDate(meeting.date)}</span>
                          </div>

                          <div className='flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3 flex-shrink-0' />
                            <span className='truncate'>
                              Cliente:{' '}
                              {meeting.leadName || 'Sin cliente asignado'}
                            </span>
                          </div>

                          {meeting.location && (
                            <div className='flex items-center gap-1'>
                              <MapPin className='h-3 w-3 flex-shrink-0' />
                              <span className='truncate'>
                                {meeting.location}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className='flex justify-end gap-1 mt-1'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7'
                            onClick={() => handleEditMeeting(meeting)}
                          >
                            <Edit className='h-3.5 w-3.5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7 text-destructive'
                            onClick={() => handleDeleteMeeting(meeting.id)}
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <ScrollArea className='h-[500px]'>
                  <div className='space-y-1'>
                    {filteredMeetings.map(meeting => (
                      <div
                        key={meeting.id}
                        className='p-2 rounded-md hover:bg-accent/5 transition-colors flex flex-col sm:flex-row justify-between gap-2 border-b last:border-0'
                      >
                        <div className='flex-1'>
                          <div className='flex items-center flex-wrap gap-1.5 mb-1'>
                            <h3 className='font-medium text-sm'>
                              {meeting.title}
                            </h3>
                            <Badge
                              variant={getStatusBadgeVariant(meeting.status)}
                              className='text-[10px] h-4 px-1.5'
                            >
                              {meeting.status}
                            </Badge>
                          </div>

                          <div className='flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted-foreground'>
                            <div className='flex items-center gap-1'>
                              <Clock className='h-3 w-3 flex-shrink-0' />
                              <span>{formatDate(meeting.date)}</span>
                            </div>

                            <div className='flex items-center gap-1'>
                              <AlertCircle className='h-3 w-3 flex-shrink-0' />
                              <span>
                                Cliente: {meeting.leadName || 'Sin cliente'}
                              </span>
                            </div>

                            {meeting.location && (
                              <div className='flex items-center gap-1'>
                                <MapPin className='h-3 w-3 flex-shrink-0' />
                                <span>{meeting.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='flex space-x-1 items-center self-end sm:self-center'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7'
                            onClick={() => handleEditMeeting(meeting)}
                          >
                            <Edit className='h-3.5 w-3.5' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7 text-destructive'
                            onClick={() => handleDeleteMeeting(meeting.id)}
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
