'use client';

import { useState, useEffect } from 'react';
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
  const pageSize = 10; // Número de tickets por página

  const router = useRouter();
  const { title, description } = getPageMetadata('tickets');

  // Restablecer la página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, dateFilter]);

  // Filtros para la consulta de tickets
  const filters = {
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(searchQuery && { query: searchQuery }),
    ...(dateFilter !== 'all' && { dateFilter }),
    page: currentPage,
    limit: pageSize
  };

  // Obtener tickets desde la API
  const {
    data: ticketsData = {
      tickets: [],
      total: 0,
      totalPages: 0
    },
    isLoading,
    error,
    refetch
  } = useTickets(filters);

  const { tickets = [], total: totalTickets = 0, totalPages = 0 } = ticketsData;

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
    if (currentPage < totalPages) {
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

  // Mostrar loading spinner mientras se cargan los datos
  if (isLoading && tickets.length === 0) {
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
        <div className='text-center text-red-500 py-10'>
          Error al cargar tickets: {error.message}
        </div>
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
          />

          <div className='w-full flex justify-end mb-4'>
            <Button onClick={handleCreateTicket} className='w-full sm:w-auto'>
              <Plus className='mr-2 h-4 w-4' />
              Nuevo Ticket
            </Button>
          </div>

          <TicketList
            tickets={tickets}
            onSelectTicket={handleSelectTicket}
            onDeleteTicket={handleDeleteTicket}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalTickets={totalTickets}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
          />
        </>
      )}
    </div>
  );
}
