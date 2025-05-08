import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTicketMessages,
  createMessage,
  updateMessage,
  deleteMessage
} from '../lib/api/messages';
import { useNotifications } from '@/shared/providers/NotificationProvider';
import { useEffect, useRef, useState } from 'react';
import { getUserInfoFromCookie } from '../lib/utils/cookies';
import { getTicketById } from '../lib/api/tickets';

/**
 * Hook para gestionar mensajes de un ticket específico
 * @param {string} ticketId - ID del ticket
 * @returns {Object} - Operaciones y datos de mensajes
 */
export const useTicketMessages = ticketId => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const previousMessagesRef = useRef([]);
  const [hasMessages, setHasMessages] = useState(false);

  // Obtener mensajes del ticket
  const messagesQuery = useQuery({
    queryKey: ['ticketMessages', ticketId],
    queryFn: () => getTicketMessages(ticketId),
    enabled: !!ticketId, // Solo ejecutar si hay ticketId
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: hasMessages ? 10000 : 30000, // Polling más frecuente solo si hay mensajes
    onSuccess: data => {
      const messagesData = getMessagesData(data);
      setHasMessages(messagesData.length > 0);
    }
  });

  // Detectar nuevos mensajes y notificar
  useEffect(() => {
    const currentMessages = getMessagesData();

    // Si no hay mensajes previos o actuales, salimos
    if (!previousMessagesRef.current.length || !currentMessages.length) {
      previousMessagesRef.current = currentMessages;
      return;
    }

    // Buscar nuevos mensajes (que no estaban en el array anterior)
    const newMessages = currentMessages.filter(currentMsg => {
      // Considerar un mensaje como nuevo si no existe su ID en los mensajes anteriores
      return !previousMessagesRef.current.some(
        prevMsg =>
          (prevMsg.id && prevMsg.id === currentMsg.id) ||
          (prevMsg._id && prevMsg._id === currentMsg._id)
      );
    });

    // Actualizar referencia de mensajes previos
    previousMessagesRef.current = currentMessages;

    // Si no hay mensajes nuevos, salimos
    if (newMessages.length === 0) return;

    // Notificar por cada mensaje nuevo que no sea del usuario actual
    const userInfo = getUserInfoFromCookie() || {};

    // Obtener el título del ticket de la caché o consultar si no está presente
    const getTicketTitle = async () => {
      // Intentar obtener el ticket de la caché de React Query
      let ticket = queryClient.getQueryData(['ticket', ticketId]);

      // Si no está en caché, intentar obtenerlo de tickets (lista)
      if (!ticket) {
        const ticketsList = queryClient.getQueryData(['tickets']);
        const ticketsArray = ticketsList?.data || [];
        ticket = ticketsArray.find(
          t => t.id === ticketId || t._id === ticketId
        );
      }

      // Si aún no lo encontramos, consultar a la API
      if (!ticket) {
        try {
          ticket = await getTicketById(ticketId);
          // Guardar en caché para futuros usos
          queryClient.setQueryData(['ticket', ticketId], ticket);
        } catch (error) {
          console.error('Error al obtener ticket para notificación:', error);
        }
      }

      return ticket?.title || ticket?.subject || `Ticket #${ticketId}`;
    };

    // Procesar cada mensaje nuevo
    const processNewMessages = async () => {
      const ticketTitle = await getTicketTitle();

      newMessages.forEach(message => {
        // Solo notificar mensajes que no sean del usuario actual
        const isFromCurrentUser =
          userInfo.id &&
          (message.user_id === userInfo.id ||
            (message.user && message.user.id === userInfo.id));

        if (!isFromCurrentUser) {
          // Crear la notificación con datos persistentes
          addNotification({
            title: `Nuevo mensaje en ${ticketTitle}`,
            message:
              message.text || message.content || 'Nuevo mensaje recibido',
            type: 'message',
            ticketId: ticketId, // Guardar el ID del ticket para navegación después de recargar
            url: `/support?view=chat&ticketId=${ticketId}`, // URL directa para la vista de chat
            messageId: message.id || message._id, // ID del mensaje para referencia
            timestamp: new Date()
          });
        }
      });
    };

    // Iniciar el proceso
    processNewMessages();
  }, [messagesQuery.data, ticketId, addNotification, queryClient]);

  // Mutación para crear un nuevo mensaje
  const createMessageMutation = useMutation({
    mutationFn: messageData =>
      createMessage({
        ...messageData,
        ticketId
      }),
    onSuccess: () => {
      // Indicar que ahora tenemos mensajes para activar el polling más frecuente
      setHasMessages(true);

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
  const getMessagesData = (responseData = messagesQuery.data) => {
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
    hasMessages,

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
