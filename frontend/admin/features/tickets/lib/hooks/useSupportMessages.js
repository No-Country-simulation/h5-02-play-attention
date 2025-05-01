/**
 * Hooks centralizados para operaciones de mensajes de soporte usando React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../api';
import { messagesAdapter, messageAdapter } from '../adapters/messages.adapter';
import { toast } from 'sonner';

/**
 * Hook para obtener todos los mensajes de soporte
 * @param {Object} filters - Filtros para la consulta
 * @param {Object} options - Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useSupportMessages(filters = {}, options = {}) {
  return useQuery({
    queryKey: ['supportMessages', filters],
    queryFn: async () => {
      const messages = await messagesApi.getSupportMessages(filters);
      return messagesAdapter(messages);
    },
    ...options
  });
}

/**
 * Hook para obtener mensajes de un ticket específico
 * @param {string} ticketId - ID del ticket
 * @param {Object} options - Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useTicketMessages(ticketId, options = {}) {
  return useQuery({
    queryKey: ['ticketMessages', ticketId],
    queryFn: async () => {
      try {
        const messages = await messagesApi.getSupportMessages({ ticketId });
        return messagesAdapter(messages);
      } catch (error) {
        // Si el error es 404 "Aún no hay mensajes", devolvemos un objeto vacío válido
        if (
          error.message?.includes('404') &&
          (error.message?.includes('Aún no hay mensajes') ||
            error.message?.includes('Not Found'))
        ) {
          console.log(
            'No hay mensajes para este ticket todavía. Esto es normal para tickets nuevos.'
          );
          return {
            messages: [],
            total: 0,
            currentPage: 1,
            totalPages: 0
          };
        }
        // Cualquier otro error se propaga
        throw error;
      }
    },
    enabled: !!ticketId,
    ...options
  });
}

/**
 * Hook para obtener un mensaje específico por ID
 * @param {string} messageId - ID del mensaje
 * @param {Object} options - Opciones adicionales para la consulta
 * @returns {Object} Resultado de useQuery con datos y estado
 */
export function useSupportMessage(messageId, options = {}) {
  return useQuery({
    queryKey: ['supportMessage', messageId],
    queryFn: async () => {
      const message = await messagesApi.getSupportMessageById(messageId);
      return messageAdapter(message);
    },
    enabled: !!messageId,
    ...options
  });
}

/**
 * Hook para crear un mensaje de soporte
 * @returns {Object} Resultado de useMutation
 */
export function useCreateSupportMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.createSupportMessage,
    onSuccess: data => {
      // Sólo invalidamos la caché de mensajes, no de tickets
      queryClient.invalidateQueries({
        queryKey: ['ticketMessages', data.ticketId]
      });
      // Evitamos cualquier otra operación que pueda requerir permisos
      return data;
    },
    onError: error => {
      // Dejamos el manejo de errores al componente para más control
      console.error('[ERROR] Error en mutación de creación de mensaje:', error);
    }
  });
}

/**
 * Hook para actualizar un mensaje de soporte
 * @returns {Object} Resultado de useMutation
 */
export function useUpdateSupportMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => messagesApi.updateSupportMessage(id, data),
    onSuccess: (data, variables) => {
      // Invalidar la caché del mensaje actualizado y la lista
      queryClient.invalidateQueries({
        queryKey: ['supportMessage', variables.id]
      });
      queryClient.invalidateQueries({ queryKey: ['supportMessages'] });
      queryClient.invalidateQueries({
        queryKey: ['ticketMessages', data.ticketId]
      });
      toast.success('Mensaje actualizado correctamente');
      return data;
    },
    onError: error => {
      toast.error(`Error al actualizar mensaje: ${error.message}`);
    }
  });
}

/**
 * Hook para eliminar un mensaje de soporte
 * @returns {Object} Resultado de useMutation
 */
export function useDeleteSupportMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.deleteSupportMessage,
    onSuccess: (_, id) => {
      // Invalidar la caché de mensajes para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['supportMessages'] });
      queryClient.invalidateQueries({ queryKey: ['ticketMessages'] });
      toast.success('Mensaje eliminado correctamente');
    },
    onError: error => {
      toast.error(`Error al eliminar mensaje: ${error.message}`);
    }
  });
}
