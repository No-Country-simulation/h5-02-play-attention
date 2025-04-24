'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { BarChart3, List, Calendar } from 'lucide-react';
import PageHeader from '@/shared/ui/page-header';
import { getPageMetadata } from '@/shared/lib/utils/page-metadata';
import LeadList from './components/leads/LeadList';
import LeadFilters from './components/leads/LeadFilters';
import LeadDashboard from './components/dashboard/LeadDashboard';
import MeetingCalendarView from './components/meetings/MeetingCalendarView';
import { useLeads } from './lib/hooks/useLeads';

/**
 * Componente principal para la gestión de leads
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse de la coordinación
 * de los componentes de la feature de leads
 */
export default function LeadManager() {
  const router = useRouter();
  const { title, description } = getPageMetadata('leads');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estado local en lugar de Zustand store
  const [filters, setFiltersState] = useState({
    status: 'all',
    userType: 'all',
    search: ''
  });
  const [pagination, setPaginationState] = useState({
    page: 1,
    pageSize: 6,
    totalPages: 1
  });

  // Obtener leads con React Query desde la nueva ubicación
  const { data: leadsFromApi = [], isLoading, error } = useLeads();

  // Adaptar datos del API al formato esperado por los componentes
  const adaptLeadsForComponents = leadsData => {
    return leadsData.map(lead => ({
      id: lead._id,
      name: lead.fullname,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      userType:
        lead.service === 'Individuo'
          ? 'persona'
          : lead.service === 'Profesional'
          ? 'profesional'
          : lead.service === 'Empresa'
          ? 'empresa'
          : 'desconocido',
      position: lead.relation,
      status: lead.status ? lead.status.toLowerCase() : 'nuevo',
      createdAt: lead.createdAt,
      source: lead.origen,
      notes: lead.notes,
      // Mantener las propiedades originales también por si acaso
      ...lead
    }));
  };

  const leads = adaptLeadsForComponents(leadsFromApi);

  // Aplicar filtros de forma local
  const filteredLeads = leads.filter(lead => {
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
  });

  // Aplicar paginación localmente
  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedLeads = filteredLeads.slice(
    startIndex,
    startIndex + pagination.pageSize
  );

  // Diagnóstico para la paginación
  /*   console.log({
    totalLeads: filteredLeads.length,
    currentPage: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: pagination.totalPages,
    startIndex,
    endIndex: startIndex + pagination.pageSize,
    leadsEnEstaPagina: paginatedLeads.length
  }); */

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

  return (
    <div className='p-4 md:p-6 max-w-7xl mx-auto'>
      <PageHeader title={title} description={description} />

      <Tabs
        defaultValue='dashboard'
        value={activeTab}
        onValueChange={setActiveTab}
        className='mb-6'
      >
        <div className='w-full overflow-x-auto pb-2 no-scrollbar'>
          <TabsList className='w-full md:w-auto justify-start md:justify-center'>
            <TabsTrigger
              value='dashboard'
              className='flex items-center whitespace-nowrap'
            >
              <BarChart3 className='h-4 w-4 mr-2' />
              <span className='hidden sm:inline'>Panel de Leads</span>
              <span className='sm:hidden'>Panel</span>
            </TabsTrigger>
            <TabsTrigger
              value='list'
              className='flex items-center whitespace-nowrap'
            >
              <List className='h-4 w-4 mr-2' />
              <span className='hidden sm:inline'>Lista de Leads</span>
              <span className='sm:hidden'>Lista</span>
            </TabsTrigger>
            <TabsTrigger
              value='calendar'
              className='flex items-center whitespace-nowrap'
            >
              <Calendar className='h-4 w-4 mr-2' />
              <span className='hidden sm:inline'>Calendario</span>
              <span className='sm:hidden'>Agenda</span>
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
          />
        </TabsContent>

        <TabsContent value='calendar' className='mt-4'>
          <MeetingCalendarView leads={leads} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
