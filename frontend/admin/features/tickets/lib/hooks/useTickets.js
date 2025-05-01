/**
 * Hooks centralizados para operaciones de tickets de soporte usando React Query
 * Simplifica la gestión del estado y caché en un solo lugar
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '../api';
import { ticketsAdapter, ticketAdapter } from '../adapters/tickets.adapter';
import { toast } from 'sonner';

/**
 * Hook para obtener todos los tickets de soporte
 * @param {Object} filters - Filtros para la consulta
 * @param {Object} options - Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useTickets(filters = {}, options = {}) {
  console.log('useTickets hook called with filters:', filters);

  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: async () => {
      console.log('Executing fetch for tickets with filters:', filters);
      const tickets = await ticketsApi.getTickets(filters);
      console.log('Raw tickets data received:', tickets);

      // Adaptamos los datos
      const adaptedData = ticketsAdapter(tickets);
      console.log('Adapted tickets data:', adaptedData);

      // Nos aseguramos que la estructura sea exactamente la que espera TicketManager
      // Esto garantiza que aunque el adaptador cambie, siempre mantengamos esta estructura
      return {
        tickets: adaptedData.tickets || [],
        total: adaptedData.total || 0,
        totalPages: adaptedData.totalPages || 1
      };
    },
    refetchOnWindowFocus: false, // Evitar refetch automático al cambiar de ventana
    staleTime: 5 * 60 * 1000, // Datos frescos por 5 minutos
    ...options
  });
}

/**
 * Hook para obtener un ticket de soporte específico por ID
 * @param {string} id - ID del ticket
 * @param {Object} options - Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useTicket(id, options = {}) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const ticket = await ticketsApi.getTicketById(id);
      return ticketAdapter(ticket);
    },
    enabled: !!id,
    ...options
  });
}

/**
 * Hook para crear un ticket de soporte
 * @returns {Object} Resultado de useMutation
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketsApi.createTicket,
    onSuccess: data => {
      // Invalidar la caché de tickets para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket creado correctamente');
      return data;
    },
    onError: error => {
      toast.error(`Error al crear ticket: ${error.message}`);
    }
  });
}

/**
 * Hook para actualizar un ticket de soporte
 * @returns {Object} Resultado de useMutation
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => ticketsApi.updateTicket(id, data),
    onSuccess: (data, variables) => {
      // Invalidar la caché del ticket actualizado y la lista
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket actualizado correctamente');
      return data;
    },
    onError: error => {
      toast.error(`Error al actualizar ticket: ${error.message}`);
    }
  });
}

/**
 * Hook para eliminar un ticket de soporte
 * @returns {Object} Resultado de useMutation
 */
export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketsApi.deleteTicket,
    onSuccess: (_, id) => {
      // Invalidar la caché de tickets para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket eliminado correctamente');
    },
    onError: error => {
      toast.error(`Error al eliminar ticket: ${error.message}`);
    }
  });
}
