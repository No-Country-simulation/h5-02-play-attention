'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import {
  CalendarIcon,
  TrendingUpIcon,
  UserIcon,
  AlertTriangleIcon,
  FileText
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import { generateLeadsPDF } from '../../lib/adapters/pdf-adapter';
import MeetingCalendar from '../meetings/MeetingCalendar';
import ScheduleMeetingModal from '../meetings/ScheduleMeetingModal';
import { useLeadMetrics } from './hooks/useLeadMetrics';
import { useLeadCharts } from './hooks/useLeadCharts';
import { DashboardSkeleton } from './skeletons/DashboardSkeleton';
import { MetricCard } from './cards/MetricCard';
import { TimeRangeSelector } from './filters/TimeRangeSelector';
import { ActionButtons } from './buttons/ActionButtons';
import { ChartCard } from './charts/ChartCard';
import { FollowUpLeadsList } from './lists/FollowUpLeadsList';
import { useSchedules } from '../../lib/hooks/useSchedules';
import {
  apiToClientSchedule,
  clientToApiSchedule
} from '../../lib/adapters/schedule-adapter';
import { useCreateSchedule } from '../../lib/hooks/useSchedules';

/**
 * Componente para visualizar métricas y gráficos de leads
 * Muestra estadísticas clave y permite exportar datos
 */
export default function LeadDashboard({
  leads = [],
  isLoading = false,
  filters = {},
  totalLeads = 0
}) {
  const [timeRange, setTimeRange] = useState('30days');
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // Referencias para los canvas
  const chartRefs = {
    typeChart: useRef(null),
    statusChart: useRef(null),
    typeMobileChart: useRef(null),
    statusMobileChart: useRef(null),
    conversionChart: useRef(null)
  };

  // Obtenemos las reuniones usando React Query
  const { data: schedulesData = [], isLoading: meetingsLoading } =
    useSchedules();

  // Mutación para crear reuniones
  const createScheduleMutation = useCreateSchedule();

  // Transformar datos de la API al formato del cliente
  const meetings = useMemo(() => {
    return Array.isArray(schedulesData)
      ? schedulesData.map(apiToClientSchedule).filter(Boolean)
      : [];
  }, [schedulesData]);

  // Custom hook para métricas
  const metrics = useLeadMetrics(leads, timeRange, isLoading);

  // Custom hook para gráficos
  useLeadCharts(chartRefs, metrics, isLoading);

  // Manejar exportación
  const handleExport = async () => {
    try {
      await generateLeadsPDF({
        leads,
        metrics,
        filters,
        timeRange,
        totalLeads
      });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF');
    }
  };

  // Manejar modal de reuniones
  const handleAddMeeting = () => {
    setShowMeetingModal(true);
  };

  const handleSaveMeeting = async meeting => {
    try {
      // Buscar el lead para obtener el nombre del cliente
      const lead = leads.find(lead => lead.id === meeting.leadId);
      if (lead) {
        meeting.client = lead.name;
      }

      // Convertir al formato de la API
      const apiData = clientToApiSchedule(meeting);

      // Crear nueva reunión usando React Query
      await createScheduleMutation.mutateAsync(apiData);

      setShowMeetingModal(false);
    } catch (error) {
      console.error('Error al guardar la reunión:', error);
    }
  };

  // Renders
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0'>
        <TimeRangeSelector
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        <ActionButtons
          onAddMeeting={handleAddMeeting}
          onExport={handleExport}
        />
      </div>

      {/* Layout con métricas, gráficos y calendario */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {/* Sección de tarjetas métricas - Visibles juntas en móvil primero */}
        <div className='grid grid-cols-2 gap-4 lg:hidden'>
          <MetricCard
            title='Total Leads'
            value={metrics.totalLeads}
            icon={<UserIcon className='h-5 w-5' />}
            description='Total de leads registrados'
          />
          <MetricCard
            title='Leads Nuevos'
            value={metrics.newLeads}
            icon={<TrendingUpIcon className='h-5 w-5' />}
            description={
              timeRange === 'all'
                ? 'Con estado "nuevo"'
                : `Creados en los últimos ${
                    timeRange === '12h'
                      ? '12 horas'
                      : timeRange === '7days'
                      ? '7'
                      : timeRange === '90days'
                      ? '90'
                      : timeRange === 'year'
                      ? '365'
                      : '30'
                  } ${timeRange === '12h' ? '' : 'días'}`
            }
          />
        </div>

        {/* Columna 1: Total Leads y Tipos de Usuario */}
        <div className='flex flex-col h-full hidden lg:flex'>
          <MetricCard
            title='Total Leads'
            value={metrics.totalLeads}
            icon={<UserIcon className='h-5 w-5' />}
            description='Total de leads registrados'
          />
          <div className='mt-4 flex-grow'>
            <ChartCard
              title='Tipos de Usuario'
              description='Segmentación por tipo'
              chartRef={chartRefs.typeChart}
              data={metrics.byType}
              hasData={metrics.byType.length > 0}
              hasSampleData={leads.length === 0 && metrics.byType.length > 0}
              height='200px'
              className='h-full'
            />
          </div>
        </div>

        {/* Columna 2: Leads Nuevos y Por Estado */}
        <div className='flex flex-col h-full hidden lg:flex'>
          <MetricCard
            title='Leads Nuevos'
            value={metrics.newLeads}
            icon={<TrendingUpIcon className='h-5 w-5' />}
            description={
              timeRange === 'all'
                ? 'Con estado "nuevo"'
                : `Creados en los últimos ${
                    timeRange === '12h'
                      ? '12 horas'
                      : timeRange === '7days'
                      ? '7'
                      : timeRange === '90days'
                      ? '90'
                      : timeRange === 'year'
                      ? '365'
                      : '30'
                  } ${timeRange === '12h' ? '' : 'días'}`
            }
          />
          <div className='mt-4 flex-grow'>
            <ChartCard
              title='Por Estado'
              description='Distribución de leads'
              chartRef={chartRefs.statusChart}
              data={metrics.byStatus}
              hasData={metrics.byStatus.length > 0}
              className='h-full'
              height='200px'
            />
          </div>
        </div>

        {/* Sección de gráficos - Visibles juntos en móvil después de las métricas */}
        <div className='space-y-4 lg:hidden'>
          <ChartCard
            title='Tipos de Usuario'
            description='Segmentación por tipo'
            chartRef={chartRefs.typeMobileChart}
            data={metrics.byType}
            hasData={metrics.byType.length > 0}
            hasSampleData={leads.length === 0 && metrics.byType.length > 0}
            height='200px'
          />
          <ChartCard
            title='Por Estado'
            description='Distribución de leads'
            chartRef={chartRefs.statusMobileChart}
            data={metrics.byStatus}
            hasData={metrics.byStatus.length > 0}
            height='200px'
          />
        </div>

        {/* Columna 3: Calendario ocupando toda la altura */}
        <div className='h-auto lg:h-full mt-4 lg:mt-0'>
          <Card className='h-full min-h-[300px]'>
            <CardHeader className='pb-1 pt-3'>
              <CardTitle className='text-sm font-medium flex items-center'>
                <CalendarIcon className='h-4 w-4 mr-1 text-primary' />
                Calendario de Reuniones
              </CardTitle>
            </CardHeader>
            <CardContent className='p-2 pt-0 h-[calc(100%-48px)]'>
              <div className='h-full overflow-hidden'>
                <MeetingCalendar
                  meetings={meetings}
                  isLoading={meetingsLoading}
                  onAddMeeting={handleAddMeeting}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leads Sin Seguimiento */}
      <FollowUpLeadsList
        leads={leads.filter(lead => lead.status === 'nuevo')}
      />

      {/* Modal para crear/editar reunión */}
      <ScheduleMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSave={handleSaveMeeting}
        leads={leads}
        preselectedDate={null}
        preselectedLead={null}
      />
    </div>
  );
}
