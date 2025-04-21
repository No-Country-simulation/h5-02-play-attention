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
import { useLeadsStore } from './lib/store/leads-store';

/**
 * Componente principal para la gestión de leads
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse de la coordinación
 * de los componentes de la feature de leads
 */
export default function LeadManager() {
  const router = useRouter();
  const { title, description } = getPageMetadata('leads');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Obtener estado y acciones del store de Zustand
  const {
    leads,
    isLoading,
    hasError,
    errorMessage,
    filters,
    pagination,
    totalLeads,
    fetchInitialLeads,
    setFilters,
    setPagination,
    applyFiltersAndPagination
  } = useLeadsStore();

  // Cargar leads iniciales al montar el componente
  useEffect(() => {
    fetchInitialLeads();
  }, [fetchInitialLeads]);

  // Función para cambiar de página (ahora solo actualiza el número de página en el store)
  const handlePageChange = newPage => {
    setPagination({ page: newPage });
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
            leads={leads}
            isLoading={isLoading}
            filters={filters}
            totalLeads={totalLeads}
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
            leads={leads}
            loading={isLoading}
            onViewLead={handleViewLead}
            currentPage={pagination.page}
            pageSize={pagination.pageSize}
            totalPages={pagination.totalPages}
            totalLeads={totalLeads}
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
