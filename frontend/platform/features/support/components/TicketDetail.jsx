import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { ArrowLeft, Send } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import useTicketMessages from '../hooks/useTicketMessages';
import useUsers from '../hooks/useUsers';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { getUserInfoFromCookie } from '../lib/utils/cookies';

const TicketDetail = ({ ticket, onBack, onEdit }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef(null);
  const { messages, loading, error, isSending, sendMessage, refetch } =
    useTicketMessages(ticket?.id);
  const { userMap, loading: loadingUsers, getUserNameById } = useUsers();

  // Depuración: mostrar los usuarios disponibles
  useEffect(() => {
    if (userMap && Object.keys(userMap).length > 0) {
      console.log('Usuarios disponibles en userMap:', userMap);
    }
  }, [userMap]);

  // Desplazarse automáticamente al final de la conversación cuando llegan nuevos mensajes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Obtener información del usuario actual
  const currentUser = getUserInfoFromCookie();

  // Transformar mensajes del API al formato que espera el componente
  const transformMessages = () => {
    if (!messages || !Array.isArray(messages)) {
      console.log('No hay mensajes o formato incorrecto:', messages);
      return [];
    }

    console.log('Transformando mensajes:', messages);

    return messages.map(message => {
      // Adaptado para manejar el formato que muestra la API
      // Usar user_id o _id según lo que venga del servidor
      const messageUserId =
        message.user_id ||
        (message.user && (message.user.id || message.user._id));

      // Depuración: mostrar el ID del usuario del mensaje
      console.log('Mensaje con user_id:', messageUserId, message);

      // Determinar si el mensaje es del usuario actual
      const isUser =
        currentUser &&
        (messageUserId === currentUser.id ||
          String(messageUserId) === String(currentUser.id));

      // Obtener el nombre del usuario desde el mapa o usar alternativas
      let authorName = 'Soporte';

      // Si tenemos el userMap, usarlo para obtener el nombre
      if (userMap && messageUserId && userMap[messageUserId]) {
        authorName = userMap[messageUserId].name;
        console.log(
          `Usuario encontrado en userMap para ID ${messageUserId}:`,
          userMap[messageUserId]
        );
      } else {
        // Intentar obtener el nombre directamente usando getUserNameById
        authorName = getUserNameById(messageUserId);
        console.log(
          `Buscando nombre para usuario ${messageUserId} manualmente:`,
          authorName
        );
      }

      // Si es el usuario actual, mostrar "Tú" como nombre
      if (isUser) {
        authorName = 'Tú';
      }

      // Convertir las fechas o usar valores predeterminados
      let messageDate;
      try {
        messageDate = new Date(
          message.createdAt || message.created_at || message.date || Date.now()
        ).toLocaleString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        messageDate = 'Fecha desconocida';
      }

      // Extraer el contenido del mensaje - ahora puede estar en text o content
      const content = message.text || message.content || message.message || '';

      return {
        id: message._id || message.id,
        author: authorName,
        date: messageDate,
        content: content,
        isUser,
        userId: messageUserId
      };
    });
  };

  if (!ticket) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <p className='text-gray-500'>
          Selecciona un ticket para ver los detalles
        </p>
        <Button
          variant='outline'
          onClick={e => {
            e.preventDefault();
            onBack();
          }}
          className='mt-4'
        >
          Volver a la lista
        </Button>
      </div>
    );
  }

  const handleSendMessage = e => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(
      { content: newMessage.trim() },
      {
        onSuccess: () => {
          setNewMessage('');
          // Pequeña pausa antes de refrescar para dar tiempo a que el servidor procese
          setTimeout(() => {
            refetch(); // Forzar la actualización de mensajes
          }, 300);
        },
        onError: error => {
          console.error('Error al enviar mensaje:', error);
          alert('Error al enviar mensaje. Intenta nuevamente.');
        }
      }
    );
  };

  // Convertir la conversación al formato esperado por el componente
  const conversation = transformMessages();

  // Formatear datos del ticket para mostar
  const formattedTicket = {
    id: ticket.id || '',
    subject: ticket.title || ticket.subject || 'Sin título',
    createdAt: new Date(
      ticket.created_at || ticket.date || Date.now()
    ).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    category: ticket.category || '',
    status: ticket.status || 'Abierto'
  };

  return (
    <div className='h-full flex flex-col bg-white rounded-lg border overflow-hidden'>
      {/* Header - Versión móvil */}
      <div className='md:hidden py-2 px-3 border-b'>
        <div className='flex items-center mb-2'>
          <Button
            variant='ghost'
            onClick={e => {
              e.preventDefault();
              onBack();
            }}
            className='mr-1 p-1 h-8 w-8'
            size='sm'
          >
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Volver</span>
          </Button>
          <h1 className='text-sm font-semibold flex-1 line-clamp-1'>
            {formattedTicket.subject}
          </h1>
          <Badge
            className='ml-1'
            variant={
              formattedTicket.status.toLowerCase() === 'abierto' ||
              formattedTicket.status.toLowerCase() === 'open'
                ? 'secondary'
                : formattedTicket.status.toLowerCase() === 'en proceso' ||
                  formattedTicket.status.toLowerCase() === 'in_progress'
                ? 'warning'
                : 'success'
            }
          >
            {formattedTicket.status}
          </Badge>
        </div>
        <div className='flex flex-wrap text-xs text-gray-500 px-2'>
          <span className='mr-2'>{formattedTicket.id}</span>
          <span className='mr-2'>•</span>
          <span>{formattedTicket.createdAt}</span>
          {formattedTicket.category && (
            <>
              <span className='mr-2 ml-2'>•</span>
              <span className='px-1.5 py-0.5 bg-gray-100 rounded text-xs'>
                {formattedTicket.category}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Header - Versión desktop */}
      <div className='hidden md:flex py-2 px-4 border-b items-center'>
        <Button
          variant='ghost'
          onClick={e => {
            e.preventDefault();
            onBack();
          }}
          className='mr-2'
          size='sm'
        >
          <ArrowLeft className='h-4 w-4 mr-1' />
          <span>Volver</span>
        </Button>

        <div className='flex-1'>
          <h1 className='text-md font-semibold'>{formattedTicket.subject}</h1>
          <div className='flex items-center text-xs text-gray-500 space-x-2'>
            <span>{formattedTicket.id}</span>
            <span>•</span>
            <span>Creado: {formattedTicket.createdAt}</span>
            {formattedTicket.category && (
              <>
                <span>•</span>
                <span className='px-1.5 py-0.5 bg-gray-100 rounded text-xs'>
                  {formattedTicket.category}
                </span>
              </>
            )}
          </div>
        </div>

        <Badge
          className='ml-4'
          variant={
            formattedTicket.status.toLowerCase() === 'abierto' ||
            formattedTicket.status.toLowerCase() === 'open'
              ? 'secondary'
              : formattedTicket.status.toLowerCase() === 'en proceso' ||
                formattedTicket.status.toLowerCase() === 'in_progress'
              ? 'warning'
              : 'success'
          }
        >
          {formattedTicket.status}
        </Badge>
      </div>

      {/* Conversación */}
      <div
        ref={messagesContainerRef}
        className='flex-1 p-2 md:p-4 overflow-y-auto bg-gray-50 max-h-[calc(100vh-250px)]'
      >
        {loading || loadingUsers ? (
          <div className='flex justify-center items-center h-full'>
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className='text-center py-10 text-red-500'>
            <p>Error al cargar los mensajes: {error}</p>
            <Button
              variant='outline'
              onClick={() => refetch()}
              className='mt-4'
            >
              Reintentar
            </Button>
          </div>
        ) : conversation.length === 0 ? (
          <div className='text-center py-10 text-gray-500'>
            <p>Aún no hay mensajes en este ticket.</p>
            <p className='text-sm mt-1'>
              Escribe abajo para iniciar la conversación.
            </p>
          </div>
        ) : (
          // Renderizar los mensajes cuando existen
          <div className='space-y-3'>
            {conversation.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!message.isUser && (
                  <div className='h-8 w-8 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0'>
                    <div className='bg-purple-600 text-white w-full h-full flex items-center justify-center font-semibold text-sm'>
                      {message.author.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-lg py-2 px-3 md:py-3 md:px-4 ${
                    message.isUser
                      ? 'bg-purple-900 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className='flex justify-between items-center'>
                    <p
                      className={`font-medium text-xs md:text-sm ${
                        message.isUser ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {message.author}
                    </p>
                    <p
                      className={`text-xs ml-2 ${
                        message.isUser ? 'text-purple-200' : 'text-gray-500'
                      }`}
                    >
                      {message.date}
                    </p>
                  </div>
                  <p
                    className={`text-xs md:text-sm mt-1 break-words ${
                      message.isUser ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
                {message.isUser && (
                  <div className='h-8 w-8 rounded-full overflow-hidden ml-2 mt-1 flex-shrink-0'>
                    <div className='bg-purple-600 text-white w-full h-full flex items-center justify-center font-semibold text-sm'>
                      {currentUser?.name?.charAt(0).toUpperCase() || 'T'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input de mensaje */}
      <div className='border-t px-2 md:px-4 py-2'>
        <form onSubmit={handleSendMessage} className='flex'>
          <input
            type='text'
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder='Escribe tu mensaje...'
            className='flex-1 py-1.5 px-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
            disabled={isSending}
          />
          <Button
            type='submit'
            className='ml-2 bg-purple-700 hover:bg-purple-800'
            size='icon'
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? (
              <LoadingSpinner size='sm' />
            ) : (
              <Send className='h-4 w-4' />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;
