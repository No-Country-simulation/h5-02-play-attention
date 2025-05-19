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
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const router = useRouter();
  const { title, description } = getPageMetadata('tickets');

  // Configurar las opciones para la API basadas en los filtros actuales
  const apiOptions = useMemo(() => {
    // Determinar el campo de ordenación basado en el tipo de orden
    let sortField;
    if (sortOrder === 'newest' || sortOrder === 'oldest') {
      // Para ordenación por fecha, usar exactamente el valor aceptado por la API
      sortField = 'created_at'; // Valor exacto requerido por la API
    } else if (sortOrder === 'alphabetical') {
      // Para ordenación alfabética
      sortField = 'title'; // Valor exacto requerido por la API
    }

    const options = {
      // Sin paginación - pedir todos los tickets
      page: 1,
      limit: 100, // Un valor grande para obtener todos los tickets de una vez
      // Mapear filtros a parámetros de la API
      status: statusFilter !== 'all' ? statusFilter : undefined,
      priority: priorityFilter !== 'all' ? priorityFilter : undefined,
      search: searchQuery || undefined,
      // Mapear orden - usar exactamente los valores aceptados por la API
      sort_by: sortField,
      order:
        sortOrder === 'newest'
          ? 'desc'
          : sortOrder === 'oldest'
          ? 'asc'
          : undefined
    };

    // Eliminar propiedades undefined para no enviarlas como parámetros
    Object.keys(options).forEach(
      key => options[key] === undefined && delete options[key]
    );

    console.log('API Options:', options); // Agregamos log para depuración

    return options;
  }, [statusFilter, priorityFilter, searchQuery, sortOrder]);

  // Obtener los tickets filtrados desde el backend
  const {
    data: ticketsData = {
      tickets: [],
      total: 0,
      totalPages: 0
    },
    isLoading,
    error,
    refetch
  } = useTickets(apiOptions);

  // Para fines de demo, creamos algunos tickets de ejemplo si no hay datos
  const demoTickets = useMemo(() => {
    // Solo crear tickets de demo si no hay tickets reales
    if (ticketsData.tickets && ticketsData.tickets.length > 0) {
      return ticketsData.tickets;
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
  }, [ticketsData.tickets]);

  // Procesamiento de los tickets para mostrar
  const ticketListData = useMemo(() => {
    // Obtener los tickets (ya sea demo o reales)
    let tickets = demoTickets.length > 0 ? demoTickets : ticketsData.tickets;

    // Ordenación secundaria en el cliente como respaldo
    if (tickets && tickets.length > 0) {
      tickets = [...tickets].sort((a, b) => {
        // Obtener fechas de creación
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);

        if (sortOrder === 'newest') {
          return dateB - dateA; // Más recientes primero
        } else if (sortOrder === 'oldest') {
          return dateA - dateB; // Más antiguos primero
        } else if (sortOrder === 'alphabetical') {
          // Ordenar alfabéticamente por asunto
          return (a.subject || '').localeCompare(b.subject || '');
        }

        // Por defecto, ordenar por fecha más reciente
        return dateB - dateA;
      });
    }

    return {
      tickets: tickets,
      total: tickets.length
    };
  }, [demoTickets, ticketsData, sortOrder]);

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

  // Manejar cambios en la búsqueda
  const handleSearchChange = query => {
    setSearchQuery(query);
  };

  // Manejar cambio de filtro de fecha
  const handleDateFilterChange = filter => {
    setDateFilter(filter);
  };

  // Manejar cambio de filtro de prioridad
  const handlePriorityChange = filter => {
    setPriorityFilter(filter);
  };

  // Manejar cambio de orden
  const handleSortOrderChange = order => {
    setSortOrder(order);
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
  if (isLoading && ticketsData.tickets.length === 0) {
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
    <div className=' max-w-7xl mx-auto'>
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
            tickets={ticketListData.tickets}
            onSelectTicket={handleSelectTicket}
            isLoading={isLoading && demoTickets.length === 0}
            // Ya no necesitamos paginación
            totalTickets={ticketListData.total}
            noPagination={true}
          />

          {/* Modal para crear nuevo ticket */}
          <CreateTicketModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
          />

          {/* Mensaje para indicar el modo demo */}
          {demoTickets.length > 0 && ticketsData.tickets.length === 0 && (
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
