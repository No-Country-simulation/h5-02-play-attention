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
      const messages = await messagesApi.getSupportMessages({ ticketId });
      return messagesAdapter(messages);
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
      // Invalidar la caché de mensajes para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['supportMessages'] });
      queryClient.invalidateQueries({
        queryKey: ['ticketMessages', data.ticketId]
      });
      toast.success('Mensaje enviado correctamente');
      return data;
    },
    onError: error => {
      toast.error(`Error al enviar mensaje: ${error.message}`);
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
