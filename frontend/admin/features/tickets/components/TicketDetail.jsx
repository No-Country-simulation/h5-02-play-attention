'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Calendar, Clock, User, MessageSquare } from 'lucide-react';

import TicketConversation from './TicketConversation';
import TicketReplyModal from './TicketReplyModal';

// Mock de mensajes de ejemplo para el ticket
const mockMessages = [
  {
    id: '1',
    content:
      'Hola, estoy teniendo problemas para acceder a mi cuenta. Me sale un error de autenticación.',
    date: '2023-06-10T09:30:00',
    author: 'Juan Pérez',
    isAdminReply: false
  },
  {
    id: '2',
    content:
      'Buenos días Juan. ¿Podrías indicarme qué mensaje de error exacto estás viendo? También, ¿has intentado restablecer tu contraseña?',
    date: '2023-06-10T10:15:00',
    author: 'Soporte Técnico',
    isAdminReply: true
  },
  {
    id: '3',
    content:
      'Dice "Credenciales inválidas". Sí, intenté restablecer la contraseña pero no recibo el correo de restablecimiento.',
    date: '2023-06-10T10:30:00',
    author: 'Juan Pérez',
    isAdminReply: false
  }
];

// Funciones de utilidad para status y prioridad
const getStatusBadge = status => {
  const statusMap = {
    abierto: 'destructive',
    'en proceso': 'warning',
    resuelto: 'success',
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

export default function TicketDetail({ ticket, onBack }) {
  const [messages, setMessages] = useState(mockMessages);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(ticket?.status || 'abierto');

  const handleReplySubmit = replyData => {
    // En producción, esto se enviaría a la API
    const newMessage = {
      id: `temp-${Date.now()}`,
      content: replyData.message,
      date: new Date().toISOString(),
      author: 'Soporte Técnico',
      isAdminReply: true
    };

    // Actualizar localmente los mensajes
    setMessages(prev => [...prev, newMessage]);

    // Actualizar el estado del ticket si ha cambiado
    if (replyData.status !== ticketStatus) {
      setTicketStatus(replyData.status);
    }

    setIsReplyModalOpen(false);
  };

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
                {ticket?.date
                  ? format(new Date(ticket.date), 'dd/MM/yyyy', { locale: es })
                  : 'N/A'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm'>
                <span className='font-medium'>Última actualización:</span>{' '}
                {ticket?.updated
                  ? format(new Date(ticket.updated), 'dd/MM/yyyy', {
                      locale: es
                    })
                  : 'N/A'}
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
            <Button onClick={() => setIsReplyModalOpen(true)}>Responder</Button>
          </div>
        </CardContent>
      </Card>

      <TicketReplyModal
        open={isReplyModalOpen}
        onOpenChange={setIsReplyModalOpen}
        ticketId={ticket?.id}
        currentStatus={ticketStatus}
        onSubmit={handleReplySubmit}
      />
    </div>
  );
}
