'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { BarChart3, List, Calendar } from 'lucide-react';
import PageHeader from '@/shared/ui/page-header';
import { getPageMetadata } from '@/shared/lib/utils/page-metadata';
import LeadList from './components/leads/LeadList';
import LeadFilters from './components/leads/LeadFilters';
import LeadDashboard from './components/dashboard/LeadDashboard';
import MeetingCalendarView from './components/meetings/MeetingCalendarView';
import { useLeads, useUpdateLeadStatus } from './lib/hooks/useLeads';
import { leadStatusConfig } from './lib/config/ui-config';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';

/**
 * Componente principal para la gestión de leads
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse de la coordinación
 * de los componentes de la feature de leads
 */
export default function LeadManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { title, description } = getPageMetadata('leads');
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard');

  // Actualizar activeTab cuando cambia el parámetro de URL
  useEffect(() => {
    if (tabParam && ['dashboard', 'list', 'calendar'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Estado local en lugar de Zustand store
  const [filters, setFiltersState] = useState({
    status: 'all',
    userType: 'all',
    search: '',
    sortOrder: 'recent' // Ordenar por defecto por fecha de creación (más reciente primero)
  });
  const [pagination, setPaginationState] = useState({
    page: 1,
    pageSize: 6,
    totalPages: 1
  });

  // Obtener leads con React Query desde la nueva ubicación
  const { data: leadsFromApi = [], isLoading, error } = useLeads();

  // Estado local para actualizaciones inmediatas
  const [localLeadUpdates, setLocalLeadUpdates] = useState({});

  const updateLeadStatusMutation = useUpdateLeadStatus();

  // Adapta los leads aplicando cambios locales temporales mientras se actualiza en la API
  const adaptLeadsForComponents = leads => {
    return leads.map(lead => {
      // Si hay una actualización local para este lead, aplicar el cambio de estado
      const updatedStatus = localLeadUpdates[lead.id]?.status;
      return updatedStatus ? { ...lead, status: updatedStatus } : lead;
    });
  };

  const adaptedLeads = adaptLeadsForComponents(leadsFromApi);

  // Aplicar filtros de forma local
  const filteredLeads = adaptedLeads
    .filter(lead => {
      // Filtro por estado
      if (filters.status !== 'all' && lead.status !== filters.status) {
        return false;
      }

      // Filtro por tipo de usuario
      if (filters.userType !== 'all' && lead.userType !== filters.userType) {
        return false;
      }

      // Filtro por búsqueda
      if (
        filters.search &&
        !lead.name?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    // Ordenar los leads según el criterio seleccionado
    .sort((a, b) => {
      if (filters.sortOrder === 'alphabetical') {
        // Ordenar alfabéticamente por nombre
        return a.name.localeCompare(b.name);
      } else if (filters.sortOrder === 'oldest') {
        // Ordenar por fecha de creación (más antiguo primero)
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        // Por defecto, ordenar por fecha de creación (más reciente primero)
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Aplicar paginación localmente
  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedLeads = filteredLeads.slice(
    startIndex,
    startIndex + pagination.pageSize
  );

  // Actualizar total de páginas cuando cambian los filtros o leads
  useEffect(() => {
    const totalPages =
      Math.ceil(filteredLeads.length / pagination.pageSize) || 1;
    setPaginationState(prev => ({
      ...prev,
      totalPages
    }));
  }, [filteredLeads.length, pagination.pageSize]);

  // Función para cambiar filtros
  const setFilters = newFilters => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters
    }));
    // Reset a la primera página al cambiar filtros
    setPaginationState(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Función para cambiar de página
  const handlePageChange = newPage => {
    console.log(`Cambiando a página: ${newPage}`);
    setPaginationState(prev => {
      const newState = {
        ...prev,
        page: newPage
      };
      console.log('Nuevo estado de paginación:', newState);
      return newState;
    });
  };

  // Función para visualizar detalle de un lead
  const handleViewLead = leadId => {
    router.push(`/crm/${leadId}`);
  };

  // Función para crear un nuevo lead
  const handleCreateLead = () => {
    router.push('/crm/new');
  };

  // Función para cambiar filtro de estado
  const handleStatusChange = status => {
    setFilters({ status });
  };

  // Función para cambiar filtro de tipo de usuario
  const handleUserTypeChange = userType => {
    setFilters({ userType });
  };

  // Función para cambiar término de búsqueda
  const handleSearchChange = search => {
    setFilters({ search });
  };

  // Función para cambiar el orden de los leads
  const handleSortChange = sortOrder => {
    setFilters({ sortOrder });
  };

  // Función para actualizar la URL cuando cambia la pestaña
  const handleTabChange = value => {
    setActiveTab(value);
    router.push(`/crm?tab=${value}`, { scroll: false });
  };

  // Función para cambiar el estado de un lead
  const handleLeadStatusChange = async (leadId, backendStatus) => {
    try {
      // Verificar que el ID no sea undefined o vacío
      if (!leadId) {
        console.error('❌ Error: leadId es undefined o vacío en LeadManager');
        toast.error('Error: No se pudo identificar el lead');
        return;
      }

      console.log(
        `📝 LeadManager: Enviando estado a backend: ${backendStatus}`
      );

      // Actualizar localmente para feedback inmediato
      // Nota: Para la UI local usamos el mismo formato que viene del componente
      const uiStatusMap = {
        Nuevo: 'nuevo',
        Activo: 'proceso',
        Cliente: 'cliente'
      };
      const uiStatus =
        uiStatusMap[backendStatus] || backendStatus.toLowerCase();

      setLocalLeadUpdates(prev => ({
        ...prev,
        [leadId]: { status: uiStatus }
      }));

      // Enviar directamente el valor recibido (ya está en formato backend)
      await updateLeadStatusMutation.mutateAsync({
        leadId,
        status: backendStatus
      });

      console.log(`✅ Estado enviado correctamente: ${backendStatus}`);

      // Limpiar el estado local después de una actualización exitosa
      setTimeout(() => {
        setLocalLeadUpdates(prev => {
          const updated = { ...prev };
          delete updated[leadId];
          return updated;
        });
      }, 500);
    } catch (error) {
      console.error(
        `❌ Error al actualizar el estado del lead ${leadId}:`,
        error
      );
      toast.error(`Error al actualizar el estado: ${error.message}`);

      // Revertir cambio local si falla la API
      setLocalLeadUpdates(prev => {
        const updated = { ...prev };
        delete updated[leadId];
        return updated;
      });
    }
  };

  if (isLoading)
    return (
      <div className='flex justify-center items-center p-12 min-h-[400px] bg-white/30 rounded-xl'>
        <LoadingSpinner
          text='Cargando módulo de gestión de leads...'
          size={48}
          spinnerColor='border-primary'
        />
      </div>
    );
  if (error)
    return (
      <div className='text-red-500 p-6 text-center border border-red-200 rounded-lg bg-red-50 my-4'>
        <p className='font-medium mb-2'>Error al cargar leads</p>
        <p>{error.message || 'Ha ocurrido un error inesperado'}</p>
      </div>
    );

  return (
    <div className='max-w-7xl mx-auto'>
      <PageHeader title={title} description={description} />

      <Tabs
        defaultValue='dashboard'
        value={activeTab}
        onValueChange={handleTabChange}
        className='mb-6'
      >
        <div className='w-full overflow-x-auto pb-2 no-scrollbar'>
          <TabsList className='w-full sm:w-auto justify-start sm:justify-center'>
            <TabsTrigger
              value='dashboard'
              className='flex items-center whitespace-nowrap'
            >
              <BarChart3 className='h-4 w-4 mr-2' />
              <span className='hidden sm:inline'>Panel de Leads</span>
              <span className='sm:hidden'>Panel</span>
            </TabsTrigger>
            <TabsTrigger
              value='calendar'
              className='flex items-center whitespace-nowrap'
            >
              <Calendar className='h-4 w-4 mr-2' />
              <span className=' sm:inline'>Calendario</span>
            </TabsTrigger>
            <TabsTrigger
              value='list'
              className='flex items-center whitespace-nowrap'
            >
              <List className='h-4 w-4 mr-2' />
              <span className='hidden sm:inline'>Lista de Leads</span>
              <span className='sm:hidden'>Lista</span>
            </TabsTrigger>
   
          </TabsList>
        </div>

        <TabsContent value='dashboard' className='mt-4'>
          <LeadDashboard
            leads={filteredLeads}
            isLoading={isLoading}
            filters={filters}
            totalLeads={filteredLeads.length}
          />
        </TabsContent>

        <TabsContent value='list' className='mt-4'>
          <LeadFilters
            statusFilter={filters.status}
            userTypeFilter={filters.userType}
            onStatusChange={handleStatusChange}
            onUserTypeChange={handleUserTypeChange}
            searchTerm={filters.search}
            onSearchChange={handleSearchChange}
            onCreateLead={handleCreateLead}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
          />

          <LeadList
            leads={paginatedLeads}
            loading={isLoading}
            onViewLead={handleViewLead}
            currentPage={pagination.page}
            pageSize={pagination.pageSize}
            totalPages={pagination.totalPages}
            totalLeads={filteredLeads.length}
            onPageChange={handlePageChange}
            onStatusChange={handleLeadStatusChange}
            sortOrder={filters.sortOrder}
          />
        </TabsContent>

        <TabsContent value='calendar' className='mt-4'>
          <MeetingCalendarView leads={adaptedLeads} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
