'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Calendar, Clock, User, MessageSquare } from 'lucide-react';

import TicketConversation from './TicketConversation';
import TicketReplyModal from './TicketReplyModal';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';

// Funciones de utilidad para status y prioridad
const getStatusBadge = status => {
  const statusMap = {
    abierto: 'destructive',
    'en proceso': 'warning',
    resuelto: 'success',
    cerrado: 'secondary',
    default: 'secondary'
  };
  return statusMap[status] || statusMap.default;
};

const getPriorityBadge = priority => {
  const priorityMap = {
    alta: 'destructive',
    media: 'warning',
    baja: 'secondary',
    default: 'secondary'
  };
  return priorityMap[priority] || priorityMap.default;
};

export default function TicketDetail({ ticket, onBack, onUpdate }) {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(ticket?.status || 'abierto');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formatear la fecha para mostrarla en formato legible
  const formatDateTime = dateString => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha desconocida';
      }
      return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  };

  // Preparar los mensajes a partir del ticket
  const getTicketMessages = () => {
    const messages = [];

    // Mensaje inicial (el contenido del ticket)
    if (ticket) {
      messages.push({
        id: `initial-${ticket.id}`,
        content: ticket.content,
        date: ticket.date,
        author: ticket.user,
        isAdminReply: false
      });

      // Respuestas si existen
      if (Array.isArray(ticket.responses)) {
        ticket.responses.forEach(response => {
          messages.push({
            id:
              response.id ||
              `resp-${Math.random().toString(36).substring(2, 9)}`,
            content: response.content,
            date: response.date,
            author: response.user,
            isAdminReply: response.isAdmin
          });
        });
      }
    }

    return messages.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const messages = getTicketMessages();

  const handleReplySubmit = async replyData => {
    try {
      setIsSubmitting(true);

      // Preparar los datos para actualizar
      const updateData = {
        ...ticket,
        status: replyData.status,
        response: replyData.message
      };

      // Llamar al método de actualización
      if (onUpdate) {
        await onUpdate(updateData);
      }

      // Actualizar el estado local
      setTicketStatus(replyData.status);
      setIsReplyModalOpen(false);
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ticket) {
    return (
      <div className='flex justify-center items-center py-20'>
        <LoadingSpinner text='Cargando detalles del ticket' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardTitle className='text-xl font-bold'>
                {ticket?.subject || 'Detalle del ticket'}
              </CardTitle>
              <div className='text-sm text-muted-foreground mt-1'>
                Ticket #{ticket?.id}
              </div>
            </div>
            <div className='space-x-2'>
              <Badge variant={getStatusBadge(ticketStatus)}>
                {ticketStatus}
              </Badge>
              {ticket?.priority && (
                <Badge variant={getPriorityBadge(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='flex items-center gap-2'>
              <User className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>
                <span className='font-medium'>Usuario:</span>{' '}
                {ticket?.user || 'Anónimo'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>
                <span className='font-medium'>Fecha:</span>{' '}
                {ticket?.date ? formatDateTime(ticket.date) : 'N/A'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>
                <span className='font-medium'>Última actualización:</span>{' '}
                {ticket?.updated ? formatDateTime(ticket.updated) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Conversación del ticket */}
          <div className='mb-6'>
            <h3 className='text-lg font-medium mb-4 flex items-center gap-2'>
              <MessageSquare className='h-5 w-5' />
              Conversación
            </h3>
            <TicketConversation messages={messages} />
          </div>

          {/* Acciones de respuesta */}
          <div className='flex justify-end space-x-3 mt-6'>
            <Button variant='outline' onClick={onBack}>
              Volver a la lista
            </Button>
            <Button
              onClick={() => setIsReplyModalOpen(true)}
              disabled={ticketStatus === 'cerrado'}
            >
              Responder
            </Button>
          </div>
        </CardContent>
      </Card>

      <TicketReplyModal
        open={isReplyModalOpen}
        onOpenChange={setIsReplyModalOpen}
        ticketId={ticket?.id}
        currentStatus={ticketStatus}
        onSubmit={handleReplySubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
