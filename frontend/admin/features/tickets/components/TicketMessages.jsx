'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  useTicketMessages,
  useCreateSupportMessage,
  useUser
} from '../lib/hooks';
import { useSession } from '@/features/auth/hooks/useAuth';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { toast } from 'sonner';
import { ServiceErrorDisplay } from '@/shared/errors';
import {
  MessageSquare,
  Send,
  User,
  UserCircle,
  AlertTriangle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

/**
 * Componente para mostrar los mensajes de un usuario con información enriquecida
 */
const MessageItem = ({ message, isLast }) => {
  // Log inicial al renderizar el componente
  console.log(`[DEBUG] MessageItem: Renderizando mensaje:`, {
    id: message.id,
    userId: message.userId,
    user: message.user,
    isAdmin: message.isAdmin
  });

  // Obtener información completa del usuario si hay userId disponible
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError
  } = useUser(message.userId, {
    enabled: !!message.userId && !message.isAdmin,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  // Log para depuración - información del usuario
  useEffect(() => {
    if (message.userId && !message.isAdmin) {
      console.log(`[DEBUG] MessageItem - userId: ${message.userId}`, {
        userData,
        isLoadingUser,
        userError,
        originalUser: message.user,
        messageDetails: {
          id: message.id,
          content: message.content?.substring(0, 30) + '...',
          date: message.date
        }
      });
    }
  }, [
    message.userId,
    userData,
    isLoadingUser,
    userError,
    message.user,
    message.isAdmin,
    message.id,
    message.content,
    message.date
  ]);

  // Información del usuario que se mostrará
  const userName = useMemo(() => {
    // Log para verificar el cálculo del nombre
    const debugName = () => {
      if (message.isAdmin) return 'Tú (Soporte)';

      const names = {
        fromUserData: userData
          ? {
              fullname: userData.fullname,
              name: userData.name,
              email: userData.email
            }
          : null,
        fromMessage: {
          user: message.user,
          userEmail: message.userEmail
        },
        final: 'Usuario desconocido'
      };

      // Determinar el nombre final
      if (userData) {
        if (userData.fullname) names.final = userData.fullname;
        else if (userData.name) names.final = userData.name;
        else if (userData.email) names.final = userData.email;
      } else if (message.user && message.user !== 'Usuario desconocido') {
        names.final = message.user;
      } else if (message.userEmail) {
        names.final = message.userEmail;
      }

      console.log(
        `[DEBUG] MessageItem - Cálculo de nombre para mensaje ${message.id}:`,
        names
      );
      return names.final;
    };

    return debugName();
  }, [message, userData]);

  // Generar iniciales para el avatar
  const getInitials = name => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Obtener color de fondo aleatorio pero consistente para el avatar
  const getAvatarColor = name => {
    if (!name) return 'bg-gray-400';

    const colors = [
      'bg-red-400',
      'bg-blue-400',
      'bg-green-400',
      'bg-yellow-400',
      'bg-purple-400',
      'bg-indigo-400',
      'bg-pink-400',
      'bg-teal-400'
    ];

    // Usamos la suma de los códigos de caracteres para elegir un color
    const charCodeSum = name
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return colors[charCodeSum % colors.length];
  };

  // Formatear fecha para mostrar
  const formatMessageDate = dateString => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha desconocida';

      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error, dateString);
      return 'Fecha inválida';
    }
  };

  return (
    <div
      className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
    >
      {!message.isAdmin && (
        <Avatar className='h-8 w-8 mr-2 mt-0.5'>
          {isLoadingUser ? (
            <AvatarFallback className='bg-gray-300'>
              <LoadingSpinner size={12} />
            </AvatarFallback>
          ) : (
            <AvatarFallback
              className={getAvatarColor(userName)}
              title={
                message.userId ? `ID: ${message.userId}` : 'Sin ID de usuario'
              }
            >
              {getInitials(userName)}
            </AvatarFallback>
          )}
        </Avatar>
      )}
      <div
        className={`max-w-[85%] rounded-lg p-3 ${
          message.isAdmin ? 'bg-primary text-primary-foreground' : 'bg-gray-100'
        }`}
      >
        <div className='flex justify-between items-center gap-4 mb-1'>
          <span
            className={`font-medium text-xs ${
              message.isAdmin ? 'text-primary-foreground' : 'text-gray-700'
            }`}
          >
            {userName}
            {isLoadingUser && (
              <LoadingSpinner size={8} className='ml-1 inline-block' />
            )}
            {!message.isAdmin && message.userId && (
              <span
                className='ml-1 text-xs text-gray-400 cursor-help'
                title={`ID de usuario: ${message.userId}`}
              >
                (ID: {message.userId.substring(0, 4)}...)
              </span>
            )}
            {!message.isAdmin && !message.userId && (
              <span
                className='ml-1 text-xs text-red-400 cursor-help'
                title='Falta ID de usuario'
              >
                (Sin ID)
              </span>
            )}
          </span>
          <span
            className={`text-xs ${
              message.isAdmin ? 'text-primary-foreground/80' : 'text-gray-500'
            }`}
          >
            {formatMessageDate(message.date)}
          </span>
        </div>
        <p
          className={`whitespace-pre-wrap text-sm ${
            message.isAdmin ? 'text-primary-foreground' : 'text-gray-800'
          }`}
        >
          {message.content}
        </p>
      </div>
      {message.isAdmin && (
        <Avatar className='h-8 w-8 ml-2 mt-0.5'>
          <AvatarImage src='/images/support-avatar.png' />
          <AvatarFallback className='bg-primary/90 text-primary-foreground'>
            SP
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

/**
 * Componente principal para mostrar y gestionar los mensajes de un ticket de soporte
 * @param {Object} props - Propiedades del componente
 * @param {string} props.ticketId - ID del ticket del que mostrar los mensajes
 * @param {Function} props.onTicketUpdate - Función para actualizar el ticket después de responder
 * @param {Object} props.ticket - Datos completos del ticket actual
 */
export default function TicketMessages({ ticketId, onTicketUpdate, ticket }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Obtener información del usuario autenticado
  const { data: sessionData } = useSession();
  const currentUser = sessionData?.user;

  // Log para depuración del usuario actual
  useEffect(() => {
    if (currentUser) {
      console.log('[DEBUG] TicketMessages - Usuario actual:', {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        isValidMongoId: /^[0-9a-fA-F]{24}$/.test(currentUser.id)
      });
    } else {
      console.warn(
        '[WARN] TicketMessages - No hay usuario en la sesión actual'
      );
    }
  }, [currentUser]);

  // Consultar mensajes del ticket usando el endpoint directo
  const {
    data = { messages: [] },
    isLoading,
    error,
    refetch
  } = useTicketMessages(ticketId);

  // Log para depuración
  useEffect(() => {
    console.log(`TicketMessages montado para ticket ID: ${ticketId}`);
    return () =>
      console.log(`TicketMessages desmontado para ticket ID: ${ticketId}`);
  }, [ticketId]);

  // Log de los datos recibidos
  useEffect(() => {
    console.log('Datos de mensajes recibidos en el componente:', data);
  }, [data]);

  // Mutación para crear nuevo mensaje
  const createMessageMutation = useCreateSupportMessage();

  // Efecto para hacer scroll al último mensaje cuando cambian los mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data.messages]);

  // Manejar envío de nuevo mensaje
  const handleSubmitMessage = async e => {
    e.preventDefault();

    if (!newMessage.trim()) {
      toast.error('El mensaje no puede estar vacío');
      return;
    }

    try {
      // Obtener ID de MongoDB del usuario, ya sea desde la sesión o desde la cookie
      let userId = null;

      // 1. Intenta obtener de sessionData/currentUser
      if (currentUser?.id && /^[0-9a-fA-F]{24}$/.test(currentUser.id)) {
        userId = currentUser.id;
        console.log(
          `[DEBUG] Usando ID de usuario desde sessionData: ${userId}`
        );
      }
      // 2. Si no, intenta obtener de la cookie user_info manualmente
      else {
        try {
          // Visualizar las cookies disponibles para depuración
          console.log('[DEBUG] Intentando obtener user_info desde cookie');
          const cookies = document.cookie
            .split(';')
            .map(cookie => cookie.trim());

          const userInfoCookie = cookies.find(cookie =>
            cookie.startsWith('user_info=')
          );
          if (userInfoCookie) {
            const userInfoStr = decodeURIComponent(
              userInfoCookie.split('=')[1]
            );
            const userInfo = JSON.parse(userInfoStr);

            if (userInfo?.id && /^[0-9a-fA-F]{24}$/.test(userInfo.id)) {
              userId = userInfo.id;
              console.log(
                `[DEBUG] Usando ID de usuario desde cookie: ${userId}`
              );
            }
          }
        } catch (cookieError) {
          console.error(
            '[ERROR] Error al obtener ID desde cookie:',
            cookieError
          );
        }
      }

      // Si no se pudo obtener un ID válido, mostrar error
      if (!userId) {
        console.error('[ERROR] No se encontró un ID válido de MongoDB');
        toast.error(
          'Error: No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.'
        );
        return;
      }

      // Preparar datos del mensaje con el ID del usuario
      const messageData = {
        ticketId,
        content: newMessage.trim(),
        userType: 'admin',
        userId: userId
      };

      console.log(`[DEBUG] Enviando mensaje como usuario ID: ${userId}`);
      console.log('[DEBUG] Datos de mensaje a enviar:', messageData);

      await createMessageMutation.mutateAsync(messageData);

      // Mostrar confirmación al usuario
      toast.success('Mensaje enviado correctamente');

      // Limpiar el campo de mensaje
      setNewMessage('');

      // Refrescar la lista de mensajes
      refetch();

      // Intentar actualizar el estado del ticket si se proporciona la función
      if (onTicketUpdate && ticket) {
        try {
          // Solo actualizar el estado si está "abierto" (open)
          const currentStatus = ticket.status?.toLowerCase();
          console.log(`[DEBUG] Estado actual del ticket: "${currentStatus}"`);

          if (currentStatus === 'abierto' || currentStatus === 'open') {
            console.log(
              '[DEBUG] Actualizando estado del ticket de "abierto" a "progress"'
            );
            await onTicketUpdate({
              id: ticketId,
              status: 'progress'
            });
            console.log(
              '[DEBUG] Estado del ticket actualizado correctamente a "progress"'
            );
          } else {
            console.log(
              `[DEBUG] No se actualiza el estado del ticket porque ya está en "${currentStatus}"`
            );
          }
        } catch (updateError) {
          console.warn(
            '[WARN] No se pudo actualizar el estado del ticket:',
            updateError.message
          );
          // No mostramos error al usuario porque el mensaje sí se envió correctamente
        }
      }
    } catch (error) {
      console.error('[ERROR] Error al enviar mensaje:', error);
      toast.error(
        `Error al enviar mensaje: ${error.message || 'Error desconocido'}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center py-6'>
        <LoadingSpinner size={30} text='Cargando mensajes...' />
      </div>
    );
  }

  // Si el error es 404 con mensaje "Aún no hay mensajes", no lo tratamos como error
  const isNoMessagesYet =
    error?.message?.includes('404') &&
    (error?.message?.includes('Aún no hay mensajes') ||
      error?.message?.includes('Not Found'));

  if (error && !isNoMessagesYet) {
    console.error('Error al cargar mensajes:', error);
    return (
      <ServiceErrorDisplay
        title='No se pudieron cargar los mensajes'
        message={`Error: ${
          error.message || 'Ocurrió un problema al obtener los mensajes.'
        }`}
        onRetry={() => refetch()}
        error={error}
        variant='warning'
        icon={MessageSquare}
        retryText='Cargar mensajes nuevamente'
      />
    );
  }

  // Verificar que data.messages sea un array
  const messages = Array.isArray(data.messages) ? data.messages : [];

  if ((messages.length === 0 && !isLoading) || isNoMessagesYet) {
    console.log('No se encontraron mensajes para el ticket', ticketId);
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 space-y-2 overflow-y-auto max-h-[500px] pr-2'>
        {messages.length === 0 || isNoMessagesYet ? (
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <div className='bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4'>
              <MessageSquare className='h-10 w-10 text-blue-300 mx-auto mb-2' />
              <h3 className='text-gray-700 font-medium'>
                No hay mensajes todavía
              </h3>
              <p className='text-sm text-gray-500 mt-1 max-w-sm'>
                Aún no hay mensajes en este ticket. Escribe tu primer mensaje
                para comenzar la conversación con el usuario.
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-4 pb-2'>
            {messages.map((message, index) => (
              <MessageItem
                key={message.id || `msg-${index}`}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className='mt-4 sticky bottom-0 bg-white pt-2'>
        <form onSubmit={handleSubmitMessage} className='flex items-end gap-2'>
          <div className='flex-1 relative'>
            <Textarea
              placeholder='Escribe tu respuesta...'
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className='min-h-[60px] max-h-[180px] resize-none pr-10 overflow-y-auto'
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (newMessage.trim()) {
                    handleSubmitMessage(e);
                  }
                }
              }}
            />
            <div className='text-xs text-gray-400 absolute right-3 bottom-2'>
              Shift + Enter para nueva línea
            </div>
          </div>
          <Button
            type='submit'
            size='icon'
            className='h-10 w-10 rounded-full'
            disabled={!newMessage.trim() || createMessageMutation.isPending}
          >
            {createMessageMutation.isPending ? (
              <LoadingSpinner size={16} />
            ) : (
              <Send className='h-4 w-4' />
            )}
          </Button>
        </form>
        <div className='text-xs text-gray-400 mt-1'>
          Pulsa Ctrl + Enter para enviar tu mensaje. Los mensajes no se pueden
          editar.
        </div>
      </div>
    </div>
  );
}
