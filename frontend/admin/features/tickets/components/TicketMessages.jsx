'use client';

import { useState } from 'react';
import { useTicketMessages, useCreateSupportMessage } from '../lib/hooks';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ServiceErrorDisplay } from '@/shared/errors';
import { MessageSquare } from 'lucide-react';

/**
 * Componente para mostrar y gestionar los mensajes de un ticket de soporte
 * @param {Object} props - Propiedades del componente
 * @param {string} props.ticketId - ID del ticket del que mostrar los mensajes
 * @param {Function} props.onTicketUpdate - Función para actualizar el ticket después de responder
 */
export default function TicketMessages({ ticketId, onTicketUpdate }) {
  const [newMessage, setNewMessage] = useState('');
  const { data: session } = useSession();

  // Consultar mensajes del ticket
  const {
    data = { messages: [] },
    isLoading,
    error,
    refetch
  } = useTicketMessages(ticketId);

  // Mutación para crear nuevo mensaje
  const createMessageMutation = useCreateSupportMessage();

  // Manejar envío de nuevo mensaje
  const handleSubmitMessage = async e => {
    e.preventDefault();

    if (!newMessage.trim()) {
      toast.error('El mensaje no puede estar vacío');
      return;
    }

    try {
      await createMessageMutation.mutateAsync({
        ticketId,
        content: newMessage.trim(),
        userId: session?.user?.id,
        userType: 'admin'
      });

      // Limpiar el campo de mensaje
      setNewMessage('');

      // Refrescar la lista de mensajes
      refetch();

      // Si existe una función para actualizar el ticket, llamarla
      if (onTicketUpdate) {
        onTicketUpdate({ id: ticketId, status: 'en proceso' });
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  // Formatear fecha para mostrar
  const formatMessageDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className='flex justify-center py-6'>
        <LoadingSpinner size={30} text='Cargando mensajes...' />
      </div>
    );
  }

  if (error) {
    return (
      <ServiceErrorDisplay
        title='No se pudieron cargar los mensajes'
        message='Estamos experimentando dificultades técnicas para cargar los mensajes de este ticket.'
        onRetry={() => refetch()}
        error={error}
        variant='warning'
        icon={MessageSquare}
        retryText='Cargar mensajes nuevamente'
      />
    );
  }

  const { messages } = data;

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium'>Conversación</h3>

      {messages.length === 0 ? (
        <div className='text-gray-500 py-4'>
          No hay mensajes en este ticket.
        </div>
      ) : (
        <div className='space-y-4'>
          {messages.map(message => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.isAdmin ? 'bg-blue-50 ml-6' : 'bg-gray-50 mr-6'
              }`}
            >
              <div className='flex justify-between items-start'>
                <span className='font-medium'>
                  {message.isAdmin ? 'Soporte' : message.user}
                </span>
                <span className='text-xs text-gray-500'>
                  {formatMessageDate(message.date)}
                </span>
              </div>
              <p className='mt-2 whitespace-pre-wrap'>{message.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmitMessage} className='space-y-3'>
        <Textarea
          placeholder='Escribe tu respuesta...'
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className='min-h-[120px]'
        />
        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={!newMessage.trim() || createMessageMutation.isPending}
          >
            {createMessageMutation.isPending ? (
              <>
                <LoadingSpinner size={16} className='mr-2' />
                Enviando...
              </>
            ) : (
              'Enviar respuesta'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
