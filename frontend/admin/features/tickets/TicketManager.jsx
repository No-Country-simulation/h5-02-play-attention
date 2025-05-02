'use client';

import { useState, useEffect, useMemo } from 'react';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import TicketFilters from './components/TicketFilters';
import CreateTicketModal from './components/CreateTicket';
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
  const [sortOrder, setSortOrder] = useState('newest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const pageSize = 6; // Tamaño de paginación visual
  const apiPageSize = 500; // Tamaño de paginación para la API

  const router = useRouter();
  const { title, description } = getPageMetadata('tickets');

  // Restablecer la página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, dateFilter, priorityFilter, sortOrder]);

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
  } = useTickets({
    limit: apiPageSize // Usamos el tamaño de página grande para la API
  });

  // Para fines de demo, creamos algunos tickets de ejemplo si no hay datos
  const demoTickets = useMemo(() => {
    // Solo crear tickets de demo si no hay tickets reales
    if (allTicketsData.tickets && allTicketsData.tickets.length > 0) {
      return allTicketsData.tickets;
    }

    // Crear tickets de demo
    const today = new Date();

    return [
      {
        id: 'demo-1',
        subject: 'Problema con la aplicación móvil',
        description:
          'La aplicación se cierra inesperadamente al intentar cargar imágenes',
        status: 'abierto',
        priority: 'alta',
        createdAt: today.toISOString(),
        userName: 'Juan Pérez',
        userEmail: 'juan@ejemplo.com'
      },
      {
        id: 'demo-2',
        subject: 'Solicitud de característica nueva',
        description: 'Me gustaría que se añadiera la opción de exportar a PDF',
        status: 'en proceso',
        priority: 'media',
        createdAt: today.toISOString(),
        userName: 'María García',
        userEmail: 'maria@ejemplo.com'
      },
      {
        id: 'demo-3',
        subject: 'Error en el proceso de pago',
        description:
          'Al intentar pagar recibo un error de "transacción fallida"',
        status: 'abierto',
        priority: 'alta',
        createdAt: today.toISOString(),
        userName: 'Carlos López',
        userEmail: 'carlos@ejemplo.com'
      },
      {
        id: 'demo-4',
        subject: 'Pregunta sobre facturación',
        description: '¿Cuándo se realizan los cargos mensuales?',
        status: 'en proceso',
        priority: 'baja',
        createdAt: today.toISOString(),
        userName: 'Ana Martínez',
        userEmail: 'ana@ejemplo.com'
      }
    ];
  }, [allTicketsData.tickets]);

  // Aplicar filtrado en el lado del cliente
  const filteredTickets = useMemo(() => {
    // Usamos los tickets de demo en lugar de los tickets de la API si no hay datos
    const ticketsToFilter =
      demoTickets.length > 0 ? demoTickets : allTicketsData.tickets;

    if (!ticketsToFilter || ticketsToFilter.length === 0) {
      return [];
    }

    let filtered = [...ticketsToFilter];

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

    // Para fines de demo, no aplicamos filtros de fecha reales

    // Filtrar por prioridad
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    // Ordenar tickets
    filtered.sort((a, b) => {
      // Obtener fechas de creación
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);

      switch (sortOrder) {
        case 'newest':
          return dateB - dateA; // Más recientes primero
        case 'oldest':
          return dateA - dateB; // Más antiguos primero
        case 'alphabetical':
          // Ordenar alfabéticamente por asunto
          return (a.subject || '').localeCompare(b.subject || '');
        default:
          return dateB - dateA; // Por defecto, más recientes primero
      }
    });

    return filtered;
  }, [
    demoTickets,
    allTicketsData.tickets,
    statusFilter,
    searchQuery,
    dateFilter,
    priorityFilter,
    sortOrder
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
      totalPages: totalFilteredPages,
      currentTickets: paginatedTickets.length
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

  // Función para crear un nuevo ticket - ahora abre el modal
  const handleCreateTicket = () => {
    setIsCreateModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    // Refrescar la lista después de crear un ticket
    refetch();
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

  // Manejar cambio de orden
  const handleSortOrderChange = order => {
    setSortOrder(order);
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
            sortOrder={sortOrder}
            onSortOrderChange={handleSortOrderChange}
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
            currentTickets={paginatedData.currentTickets}
            onPageChange={handlePageChange}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
            isLoading={isLoading && demoTickets.length === 0}
          />

          {/* Modal para crear nuevo ticket */}
          <CreateTicketModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
          />

          {/* Mensaje para indicar el modo demo */}
          {demoTickets.length > 0 && allTicketsData.tickets.length === 0 && (
            <div className='mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-700'>
              <p className='font-medium'>Modo demostración</p>
              <p>
                Se están mostrando tickets de ejemplo para visualizar la
                funcionalidad.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
