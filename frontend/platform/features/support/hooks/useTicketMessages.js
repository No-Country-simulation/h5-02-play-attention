import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTicketMessages,
  createMessage,
  updateMessage,
  deleteMessage
} from '../lib/api/messages';

/**
 * Hook para gestionar mensajes de un ticket específico
 * @param {string} ticketId - ID del ticket
 * @returns {Object} - Operaciones y datos de mensajes
 */
export const useTicketMessages = ticketId => {
  const queryClient = useQueryClient();

  // Obtener mensajes del ticket
  const messagesQuery = useQuery({
    queryKey: ['ticketMessages', ticketId],
    queryFn: () => getTicketMessages(ticketId),
    enabled: !!ticketId, // Solo ejecutar si hay ticketId
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 10000 // Refrescar cada 10 segundos para ver nuevos mensajes
  });

  // Mutación para crear un nuevo mensaje
  const createMessageMutation = useMutation({
    mutationFn: messageData =>
      createMessage({
        ...messageData,
        ticketId
      }),
    onSuccess: () => {
      // Invalidar consulta de mensajes para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['ticketMessages', ticketId] });

      // También refrescar el ticket para actualizar la última respuesta
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
    },
    onError: error => {
      console.error('Error al crear mensaje:', error);
    }
  });

  // Mutación para actualizar un mensaje
  const updateMessageMutation = useMutation({
    mutationFn: ({ messageId, content }) =>
      updateMessage(messageId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticketMessages', ticketId] });
    }
  });

  // Mutación para eliminar un mensaje
  const deleteMessageMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticketMessages', ticketId] });
    }
  });

  // Obtener los mensajes de la respuesta, manejar diferentes estructuras
  const getMessagesData = () => {
    const responseData = messagesQuery.data;

    if (!responseData) return [];

    // Si es un array directo
    if (Array.isArray(responseData)) return responseData;

    // Si tiene una propiedad data que es un array
    if (responseData.data && Array.isArray(responseData.data))
      return responseData.data;

    // Si tiene una propiedad 'message' que es un array (otro formato posible)
    if (responseData.message && Array.isArray(responseData.message))
      return responseData.message;

    console.warn('Formato inesperado de datos de mensajes:', responseData);
    return [];
  };

  return {
    // Datos
    messages: getMessagesData(),

    // Estado de las consultas
    loading: messagesQuery.isLoading,
    error: messagesQuery.error?.message,
    isSending: createMessageMutation.isPending,
    isUpdating: updateMessageMutation.isPending,
    isDeleting: deleteMessageMutation.isPending,

    // Operaciones
    sendMessage: createMessageMutation.mutate,
    updateMessage: updateMessageMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,

    // Helpers
    refetch: messagesQuery.refetch
  };
};

export default useTicketMessages;
