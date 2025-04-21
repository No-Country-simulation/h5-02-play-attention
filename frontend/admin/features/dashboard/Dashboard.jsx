'use client';

import {
  Users,
  FileText,
  TicketCheck,
  Bell,
  Clock,
  UserPlus,
  BarChart3,
  Zap,
  PercentCircle,
  Grid,
  List,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import MetricCard from './components/MetricCard';
import ActionCard from './components/ActionCard';
import AlertCard from './components/AlertCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import PageHeader from '@/shared/ui/page-header';
import { getPageMetadata } from '@/shared/lib/utils/page-metadata';
import {
  getTextColorClass,
  getBackgroundColorClass
} from '@/shared/lib/utils/color-utils';
import { useDashboardStore } from './lib/store/dashboard-store';
import { useDashboardRefresh } from './lib/hooks/useDashboardRefresh';
import { useState } from 'react';

// Datos de ejemplo para simular varias alertas
const mockAlerts = [
  {
    id: 1,
    title: 'Leads sin seguimiento',
    description: '8 leads nuevos no han sido contactados en 48 horas',
    type: 'lead',
    icon: UserPlus,
    color: 'danger',
    actionText: 'Atender ahora',
    actionUrl: '/leads'
  },
  {
    id: 2,
    title: 'Tickets sin responder',
    description: '5 tickets llevan más de 24 horas sin respuesta',
    type: 'ticket',
    icon: TicketCheck,
    color: 'warning',
    actionText: 'Atender ahora',
    actionUrl: '/tickets'
  },
  {
    id: 3,
    title: 'Contenido pendiente de revisión',
    description: '3 artículos están en borrador y necesitan ser publicados',
    type: 'content',
    icon: FileText,
    color: 'primary',
    actionText: 'Atender ahora',
    actionUrl: '/content'
  },
  {
    id: 4,
    title: 'Webinar próximo',
    description: 'El webinar "Técnicas de concentración" comienza en 2 días',
    type: 'event',
    icon: Clock,
    color: 'info',
    actionText: 'Ver detalles',
    actionUrl: '/events'
  },
  {
    id: 5,
    title: 'Usuarios inactivos',
    description: '12 usuarios no han iniciado sesión en el último mes',
    type: 'user',
    icon: Users,
    color: 'info',
    actionText: 'Revisar usuarios',
    actionUrl: '/users'
  },
  {
    id: 6,
    title: 'Actualización de plataforma',
    description: 'Nueva versión disponible para implementar',
    type: 'system',
    icon: Bell,
    color: 'primary',
    actionText: 'Ver detalles',
    actionUrl: '/settings'
  },
  {
    id: 7,
    title: 'Pagos pendientes',
    description: '3 facturas requieren verificación',
    type: 'finance',
    icon: Bell,
    color: 'warning',
    actionText: 'Revisar pagos',
    actionUrl: '/finances'
  },
  {
    id: 8,
    title: 'Comentarios nuevos',
    description: '6 comentarios recientes requieren moderación',
    type: 'content',
    icon: FileText,
    color: 'primary',
    actionText: 'Moderar',
    actionUrl: '/comments'
  }
];

export default function Dashboard() {
  // Utilizamos el custom hook para la actualización automática (sin indicador visual)
  useDashboardRefresh();

  // Utilizamos el store para preferencias de visualización, pero no para los datos
  const viewPreferences = useDashboardStore(state => state.viewPreferences);

  // Estados locales para mantener la compatibilidad con la versión original
  const [activeTab, setActiveTab] = useState('overview');
  const [alertViewMode, setAlertViewMode] = useState('list');
  const [visibleAlerts, setVisibleAlerts] = useState(4);

  // Mantemos las funciones originales para establecer estado
  const handleActiveTabChange = value => {
    setActiveTab(value);
    // También actualizamos el store para mantener sincronía
    useDashboardStore.getState().setActiveTab(value);
  };

  const handleAlertViewModeChange = mode => {
    setAlertViewMode(mode);
    // También actualizamos el store para mantener sincronía
    useDashboardStore.getState().setAlertViewMode(mode);
  };

  const { title, description } = getPageMetadata('dashboard');

  const showMoreAlerts = () => {
    setVisibleAlerts(prev => Math.min(prev + 4, mockAlerts.length));
  };

  const showLessAlerts = () => {
    setVisibleAlerts(4); // Valor inicial
  };

  const initialAlertsCount = 4;
  const visibleInitialAlerts = alertViewMode === 'grid' ? 2 : 3;
  const displayedAlerts = mockAlerts.slice(
    0,
    visibleAlerts > initialAlertsCount ? visibleAlerts : visibleInitialAlerts
  );
  const hasMoreAlerts = visibleAlerts < mockAlerts.length;
  const hasExpandedAlerts = visibleAlerts > initialAlertsCount;

  // Función para mostrar iconos basados en el tipo de métrica
  const getIconForMetric = metricName => {
    const iconMap = {
      'Leads Nuevos': UserPlus,
      'Usuarios Activos': Users,
      'Contenido Total': FileText,
      'Tickets Abiertos': TicketCheck,
      Notificaciones: Bell,
      'Tasa de Conversión': PercentCircle
    };

    return iconMap[metricName] || BarChart3;
  };

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <PageHeader title={title} description={description} />

      <Tabs
        value={activeTab}
        className='w-full mb-8'
        onValueChange={handleActiveTabChange}
      >
        <div className='flex justify-between items-center mb-6'>
          <TabsList>
            <TabsTrigger value='overview' className='flex items-center gap-1'>
              <BarChart3 className='h-4 w-4' />
              <span>Vista General</span>
            </TabsTrigger>
            <TabsTrigger value='actions' className='flex items-center gap-1'>
              <Zap className='h-4 w-4' />
              <span>Acciones Rápidas</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Vista General */}
        <TabsContent value='overview' className='mt-0'>
          {/* Métricas principales */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-6'>
            <MetricCard
              title='Leads Nuevos'
              value='32'
              change='+8% esta semana'
              trend='up'
              icon={UserPlus}
              color='leads'
            />
            <MetricCard
              title='Usuarios Activos'
              value='1,254'
              change='+12% este mes'
              trend='up'
              icon={Users}
              color='users'
            />
            <MetricCard
              title='Contenido Total'
              value='87'
              change='+5% este mes'
              trend='up'
              icon={FileText}
              color='content'
            />
            <MetricCard
              title='Tickets Abiertos'
              value='14'
              change='-3% esta semana'
              trend='down'
              icon={TicketCheck}
              color='tickets'
            />
            <MetricCard
              title='Notificaciones'
              value='8'
              change='+2 nuevas hoy'
              trend='up'
              icon={Bell}
              color='notifications'
            />
            <MetricCard
              title='Tasa de Conversión'
              value='18.5%'
              change='+2.3% este mes'
              trend='up'
              icon={PercentCircle}
              color='conversions'
            />
          </div>

          {/* Alertas y Notificaciones */}
          <div className='mb-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>
                Alertas y Notificaciones
              </h2>
              <div className='flex items-center gap-2'>
                <div className='bg-gray-100 rounded-md p-1 flex'>
                  <Button
                    variant={alertViewMode === 'grid' ? 'default' : 'ghost'}
                    size='sm'
                    className='px-2 h-8'
                    onClick={() => handleAlertViewModeChange('grid')}
                  >
                    <Grid className='h-4 w-4' />
                  </Button>
                  <Button
                    variant={alertViewMode === 'list' ? 'default' : 'ghost'}
                    size='sm'
                    className='px-2 h-8'
                    onClick={() => handleAlertViewModeChange('list')}
                  >
                    <List className='h-4 w-4' />
                  </Button>
                </div>
                <a
                  href='/notifications'
                  className='text-blue-600 text-sm flex items-center hover:underline'
                >
                  Ver todas <span className='ml-1'>→</span>
                </a>
              </div>
            </div>

            {alertViewMode === 'grid' ? (
              <div className='mb-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-2'>
                  {displayedAlerts.map(alert => (
                    <AlertCard
                      key={alert.id}
                      title={alert.title}
                      description={alert.description}
                      type={alert.type}
                      actionText={alert.actionText}
                      actionUrl={alert.actionUrl}
                    />
                  ))}
                </div>
                <div className='mt-2 text-center flex justify-center gap-2'>
                  {hasMoreAlerts && (
                    <Button
                      variant='outline'
                      onClick={showMoreAlerts}
                      className='flex items-center gap-1'
                    >
                      Ver más <ChevronDown className='h-4 w-4' />
                    </Button>
                  )}
                  {hasExpandedAlerts && (
                    <Button
                      variant='outline'
                      onClick={showLessAlerts}
                      className='flex items-center gap-1'
                    >
                      Ver menos <ChevronUp className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className='mb-4'>
                <div className='space-y-0 bg-white rounded-lg border overflow-hidden'>
                  {displayedAlerts.map(alert => {
                    // Aseguramos que IconComponent sea un componente Lucide válido
                    const IconComponent = alert.icon || Bell;
                    const colorClass = getBackgroundColorClass(alert.color);
                    const textColorClass = getTextColorClass(alert.color);

                    return (
                      <div
                        key={alert.id}
                        className='flex items-center gap-4 p-3 border-b last:border-b-0 hover:bg-gray-50'
                      >
                        <div className={`p-2 rounded-full ${colorClass}`}>
                          <IconComponent
                            className={`h-5 w-5 ${textColorClass}`}
                          />
                        </div>
                        <div className='flex-1'>
                          <h3 className='font-medium'>{alert.title}</h3>
                          <p className='text-sm text-gray-500 line-clamp-1'>
                            {alert.description}
                          </p>
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          className='whitespace-nowrap'
                          asChild
                        >
                          <a href={alert.actionUrl}>{alert.actionText}</a>
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <div className='mt-2 text-center flex justify-center gap-2'>
                  {hasMoreAlerts && (
                    <Button
                      variant='outline'
                      onClick={showMoreAlerts}
                      className='flex items-center gap-1'
                    >
                      Ver más <ChevronDown className='h-4 w-4' />
                    </Button>
                  )}
                  {hasExpandedAlerts && (
                    <Button
                      variant='outline'
                      onClick={showLessAlerts}
                      className='flex items-center gap-1'
                    >
                      Ver menos <ChevronUp className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab: Acciones Rápidas */}
        <TabsContent value='actions' className='mt-0'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Acciones Rápidas</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-6'>
            <ActionCard
              title='Crear Lead'
              description='Registra un nuevo lead de ventas'
              icon={UserPlus}
              color='leads'
              link='/leads/new'
            />
            <ActionCard
              title='Responder Tickets'
              description='Gestionar tickets de soporte pendientes'
              icon={TicketCheck}
              color='tickets'
              link='/tickets'
            />
            <ActionCard
              title='Publicar Contenido'
              description='Crear o editar contenido del sitio'
              icon={FileText}
              color='content'
              link='/content/new'
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Panel de resumen: siempre visible si no estamos en Vista General */}
      {activeTab !== 'overview' && (
        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
          <h3 className='text-sm font-medium mb-3'>Resumen rápido</h3>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            <div className='bg-white p-3 rounded border text-center'>
              <p className='text-xs text-gray-500'>Leads</p>
              <p className='text-xl font-bold text-green-600'>32</p>
            </div>
            <div className='bg-white p-3 rounded border text-center'>
              <p className='text-xs text-gray-500'>Tickets</p>
              <p className='text-xl font-bold text-amber-600'>14</p>
            </div>
            <div className='bg-white p-3 rounded border text-center'>
              <p className='text-xs text-gray-500'>Usuarios</p>
              <p className='text-xl font-bold text-blue-600'>1,254</p>
            </div>
            <div className='bg-white p-3 rounded border text-center'>
              <p className='text-xs text-gray-500'>Alertas</p>
              <p className='text-xl font-bold text-red-600'>4</p>
            </div>
            <div className='bg-white p-3 rounded border text-center'>
              <p className='text-xs text-gray-500'>Contenido</p>
              <p className='text-xl font-bold text-purple-600'>87</p>
            </div>
            <div className='bg-white p-3 rounded border text-center'>
              <p className='text-xs text-gray-500'>Conversión</p>
              <p className='text-xl font-bold text-indigo-600'>18.5%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
