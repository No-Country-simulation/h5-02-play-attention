'use client';

import { useState, useEffect, useMemo } from 'react';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import TicketFilters from './components/TicketFilters';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/shared/ui/page-header';
import { getPageMetadata } from '@/shared/lib/utils/page-metadata';
import { useTickets, useUpdateTicket, useDeleteTicket } from './lib/hooks';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { toast } from 'sonner';
import { ServiceUnavailable, CorsError } from '@/shared/errors';

/**
 * Componente principal para la gestión de tickets de soporte
 * Sigue el principio de Responsabilidad Única (SRP) y Abierto/Cerrado (OCP)
 * permitiendo extensiones sin modificar el componente existente
 */
export default function TicketManager() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const pageSize = 10; // Número de tickets por página

  const router = useRouter();
  const { title, description } = getPageMetadata('tickets');

  // Restablecer la página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [
    statusFilter,
    searchQuery,
    dateFilter,
    priorityFilter,
    assigneeFilter,
    departmentFilter,
    typeFilter
  ]);

  // Obtener todos los tickets sin filtros desde el backend
  const {
    data: allTicketsData = {
      tickets: [],
      total: 0,
      totalPages: 0
    },
    isLoading,
    error,
    refetch
  } = useTickets();

  // Aplicar filtrado en el lado del cliente
  const filteredTickets = useMemo(() => {
    if (!allTicketsData.tickets || allTicketsData.tickets.length === 0) {
      return [];
    }

    let filtered = [...allTicketsData.tickets];

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ticket =>
          ticket.id?.toString().includes(query) ||
          ticket.subject?.toLowerCase().includes(query) ||
          ticket.userName?.toLowerCase().includes(query) ||
          ticket.description?.toLowerCase().includes(query)
      );
    }

    // Filtrar por fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const quarterStart = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3,
        1
      );

      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);

        switch (dateFilter) {
          case 'today':
            return ticketDate >= today;
          case 'yesterday':
            return ticketDate >= yesterday && ticketDate < today;
          case 'week':
            return ticketDate >= thisWeekStart;
          case 'last_week':
            return ticketDate >= lastWeekStart && ticketDate < thisWeekStart;
          case 'month':
            return ticketDate >= thisMonthStart;
          case 'last_month':
            return ticketDate >= lastMonthStart && ticketDate < thisMonthStart;
          case 'quarter':
            return ticketDate >= quarterStart;
          default:
            return true;
        }
      });
    }

    // Filtrar por prioridad
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    // Filtrar por asignado
    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'unassigned') {
        filtered = filtered.filter(ticket => !ticket.assignee);
      } else if (assigneeFilter === 'current_user') {
        // Asumir que el ID del usuario actual está disponible o implementarlo según la lógica de la app
        const currentUserId = 'current-user-id'; // Reemplazar con la lógica para obtener el ID del usuario actual
        filtered = filtered.filter(
          ticket => ticket.assigneeId === currentUserId
        );
      } else if (assigneeFilter === 'other') {
        const currentUserId = 'current-user-id'; // Reemplazar con la lógica para obtener el ID del usuario actual
        filtered = filtered.filter(
          ticket => ticket.assigneeId && ticket.assigneeId !== currentUserId
        );
      }
    }

    // Filtrar por departamento
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(
        ticket => ticket.department === departmentFilter
      );
    }

    // Filtrar por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.type === typeFilter);
    }

    return filtered;
  }, [
    allTicketsData.tickets,
    statusFilter,
    searchQuery,
    dateFilter,
    priorityFilter,
    assigneeFilter,
    departmentFilter,
    typeFilter
  ]);

  // Calcular paginación en el cliente
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);
    const totalFilteredTickets = filteredTickets.length;
    const totalFilteredPages = Math.ceil(totalFilteredTickets / pageSize);

    return {
      tickets: paginatedTickets,
      total: totalFilteredTickets,
      totalPages: totalFilteredPages
    };
  }, [filteredTickets, currentPage, pageSize]);

  // Hooks para operaciones de actualización y eliminación
  const updateTicketMutation = useUpdateTicket();
  const deleteTicketMutation = useDeleteTicket();

  // Función para seleccionar un ticket
  const handleSelectTicket = ticket => {
    setSelectedTicket(ticket);
  };

  // Función para volver a la lista de tickets
  const handleBackToList = () => {
    setSelectedTicket(null);
    // Refrescar la lista de tickets cuando se vuelve
    refetch();
  };

  // Función para crear un nuevo ticket
  const handleCreateTicket = () => {
    router.push('/tickets/new');
  };

  // Actualizar un ticket después de responder
  const handleTicketUpdate = async updatedTicket => {
    try {
      await updateTicketMutation.mutateAsync({
        id: updatedTicket.id,
        ...updatedTicket
      });
      // Si la actualización fue exitosa, refrescar también el ticket seleccionado
      if (selectedTicket && selectedTicket.id === updatedTicket.id) {
        setSelectedTicket({
          ...selectedTicket,
          ...updatedTicket
        });
      }
      toast.success('Ticket actualizado correctamente');
      refetch();
    } catch (error) {
      console.error('Error al actualizar ticket:', error);
      toast.error(`Error al actualizar ticket: ${error.message}`);
    }
  };

  // Eliminar un ticket
  const handleDeleteTicket = async id => {
    try {
      await deleteTicketMutation.mutateAsync(id);
      // Si el ticket eliminado es el seleccionado, volver a la lista
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket(null);
      }
      // Refrescar la lista después de eliminar
      refetch();
      toast.success('Ticket eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar ticket:', error);
      toast.error(`Error al eliminar ticket: ${error.message}`);
    }
  };

  // Manejar cambio de página
  const handlePageChange = newPage => {
    setCurrentPage(newPage);
    // Hacer scroll hacia arriba cuando se cambia de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navegación de paginación - métodos específicos
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < paginatedData.totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Manejar cambios en la búsqueda
  const handleSearchChange = query => {
    setSearchQuery(query);
    setCurrentPage(1); // Resetear a la primera página al cambiar la búsqueda
  };

  // Manejar cambio de filtro de fecha
  const handleDateFilterChange = filter => {
    setDateFilter(filter);
    setCurrentPage(1);
  };

  // Manejar cambio de filtro de prioridad
  const handlePriorityChange = filter => {
    setPriorityFilter(filter);
    setCurrentPage(1);
  };

  // Manejar cambio de filtro de asignación
  const handleAssigneeChange = filter => {
    setAssigneeFilter(filter);
    setCurrentPage(1);
  };

  // Manejar cambio de filtro de departamento
  const handleDepartmentChange = filter => {
    setDepartmentFilter(filter);
    setCurrentPage(1);
  };

  // Manejar cambio de filtro de tipo
  const handleTypeChange = filter => {
    setTypeFilter(filter);
    setCurrentPage(1);
  };

  // Función para detectar si un error es de tipo CORS
  const isCorsError = error => {
    if (!error) return false;
    const errorMsg = error.message || String(error);
    return (
      errorMsg.includes('CORS') ||
      errorMsg.includes('Access-Control-Allow-Origin') ||
      errorMsg.includes('Access to fetch')
    );
  };

  // Mostrar loading spinner mientras se cargan los datos
  if (isLoading && allTicketsData.tickets.length === 0) {
    return (
      <div className='flex justify-center items-center h-full py-20'>
        <LoadingSpinner text='Cargando tickets de soporte' size={40} />
      </div>
    );
  }

  // Mostrar mensaje de error si ocurre un problema
  if (error) {
    return (
      <div className='p-6 max-w-7xl mx-auto'>
        <PageHeader title={title} description={description} />
        {isCorsError(error) ? (
          <CorsError
            onRetry={() => refetch()}
            homePath='/dashboard'
            homeText='Volver al panel'
            error={error}
          />
        ) : (
          <ServiceUnavailable
            featureName='sistema de tickets'
            onRetry={() => refetch()}
            homePath='/dashboard'
            homeText='Volver al panel'
            error={error}
          />
        )}
      </div>
    );
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {!selectedTicket && (
        <PageHeader title={title} description={description} />
      )}

      {selectedTicket ? (
        <>
          <div className='mb-6'>
            <Button onClick={handleBackToList} variant='ghost' className='px-0'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver a la lista
            </Button>
          </div>

          <TicketDetail
            ticket={selectedTicket}
            onBack={handleBackToList}
            onUpdate={handleTicketUpdate}
          />
        </>
      ) : (
        <>
          <TicketFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            dateFilter={dateFilter}
            onDateFilterChange={handleDateFilterChange}
            priorityFilter={priorityFilter}
            onPriorityChange={handlePriorityChange}
            assigneeFilter={assigneeFilter}
            onAssigneeChange={handleAssigneeChange}
            departmentFilter={departmentFilter}
            onDepartmentChange={handleDepartmentChange}
            typeFilter={typeFilter}
            onTypeChange={handleTypeChange}
          />

          <div className='w-full flex justify-end mb-4'>
            <Button onClick={handleCreateTicket} className='w-full sm:w-auto'>
              <Plus className='mr-2 h-4 w-4' />
              Nuevo Ticket
            </Button>
          </div>

          <TicketList
            tickets={paginatedData.tickets}
            onSelectTicket={handleSelectTicket}
            onDeleteTicket={handleDeleteTicket}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={paginatedData.totalPages}
            totalTickets={paginatedData.total}
            onPageChange={handlePageChange}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
