import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket
} from '../lib/api/tickets';

/**
 * Hook para gestionar tickets de soporte
 * @param {Object} options - Opciones de configuración
 * @param {Object} options.filters - Filtros para la consulta
 * @returns {Object} - Operaciones y datos de tickets
 */
export const useTickets = (options = {}) => {
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Obtener lista de tickets con filtros
  const ticketsQuery = useQuery({
    queryKey: ['tickets', options.filters],
    queryFn: () => getTickets(options.filters),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Obtener ticket por ID
  const fetchTicketById = async ticketId => {
    try {
      const ticket = await getTicketById(ticketId);
      setSelectedTicket(ticket);
      return ticket;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  };

  // Mutación para crear un nuevo ticket
  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: newTicket => {
      // Invalidar consulta de tickets para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      return { success: true, ticket: newTicket };
    },
    onError: error => {
      console.error('Error creating ticket:', error);
      return {
        success: false,
        error: error.message || 'Error al crear el ticket'
      };
    }
  });

  // Mutación para actualizar un ticket existente
  const updateTicketMutation = useMutation({
    mutationFn: ({ ticketId, data }) => updateTicket(ticketId, data),
    onSuccess: updatedTicket => {
      // Actualizar ticket en caché y la lista
      queryClient.setQueryData(['ticket', updatedTicket.id], updatedTicket);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });

      // Actualizar ticket seleccionado si es el mismo
      if (selectedTicket && selectedTicket.id === updatedTicket.id) {
        setSelectedTicket(updatedTicket);
      }

      return { success: true, ticket: updatedTicket };
    },
    onError: error => {
      console.error('Error updating ticket:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar el ticket'
      };
    }
  });

  return {
    // Datos
    tickets: ticketsQuery.data?.data || [],
    meta: ticketsQuery.data?.meta,
    selectedTicket,

    // Estado de las consultas
    loading: ticketsQuery.isLoading,
    error: ticketsQuery.error?.message,
    isCreating: createTicketMutation.isPending,
    isUpdating: updateTicketMutation.isPending,

    // Operaciones
    createTicket: createTicketMutation.mutate,
    updateTicket: updateTicketMutation.mutate,
    getTicketById: fetchTicketById,
    selectTicket: fetchTicketById,
    setSelectedTicket
  };
};

export default useTickets;
