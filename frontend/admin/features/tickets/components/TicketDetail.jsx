'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  ArrowLeft,
  UserCheck,
  Info,
  MessageCircle,
  Briefcase,
  Tag,
  Globe,
  Edit
} from 'lucide-react';

import TicketConversation from './TicketConversation';
import TicketReplyModal from './TicketReplyModal';
import TicketEditModal from './TicketEditModal';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import TicketMessages from './TicketMessages';
import { ServiceErrorDisplay } from '@/shared/errors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(ticket?.status || 'abierto');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('informacion');

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

      // Cambiar a la pestaña de conversación después de enviar una respuesta
      setActiveTab('conversacion');
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async updatedData => {
    try {
      setIsSubmitting(true);

      // Llamar al método de actualización
      if (onUpdate) {
        await onUpdate(updatedData);
      }

      // Actualizar el estado local
      setTicketStatus(updatedData.status);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ticket) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardContent className='pt-6'>
            <ServiceErrorDisplay
              title='No se ha podido cargar el ticket'
              message='Ha ocurrido un problema al intentar cargar la información del ticket. Por favor, vuelva a la lista e intente de nuevo.'
              onBack={onBack}
              backText='Volver a la lista'
              variant='warning'
              icon={MessageSquare}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Card className='shadow-sm'>
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-start'>
            <div>
              <div className='flex items-center gap-2'>
     
                <CardTitle className='text-xl font-bold'>
                  {ticket?.subject || 'Detalle del ticket'}
                </CardTitle>
              </div>
              <div className='text-sm text-muted-foreground mt-1 ml-10'>
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

        <CardContent className='pt-4'>
          <Tabs
            defaultValue='informacion'
            className='w-full'
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className='mb-6 w-full justify-start border-b'>
              <TabsTrigger
                value='informacion'
                className='flex items-center gap-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary'
              >
                <Info className='h-4 w-4' />
                Información
              </TabsTrigger>
              <TabsTrigger
                value='conversacion'
                className='flex items-center gap-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary'
              >
                <MessageCircle className='h-4 w-4' />
                Conversación
              </TabsTrigger>
            </TabsList>

            <TabsContent value='informacion' className='mt-0'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-gray-50 rounded-lg p-4 space-y-4'>
                  <h3 className='font-medium text-lg mb-3'>
                    Información del ticket
                  </h3>

                  <div className='grid gap-3'>
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4 text-muted-foreground' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-muted-foreground'>
                          Creado por
                        </span>
                        <span className='text-sm font-medium'>
                          {ticket?.user || 'Anónimo'}
                        </span>
                        {ticket?.userEmail && (
                          <span className='text-xs text-muted-foreground'>
                            {ticket.userEmail}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <UserCheck className='h-4 w-4 text-muted-foreground' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-muted-foreground'>
                          Asignado a
                        </span>
                        <span className='text-sm font-medium'>
                          {ticket?.assignedTo || 'Sin asignar'}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Tag className='h-4 w-4 text-muted-foreground' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-muted-foreground'>
                          Categoría
                        </span>
                        <span className='text-sm font-medium'>
                          {ticket?.category || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Globe className='h-4 w-4 text-muted-foreground' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-muted-foreground'>
                          Origen
                        </span>
                        <span className='text-sm font-medium'>
                          {ticket?.ticketOrigin || 'Web'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 rounded-lg p-4 space-y-4'>
                  <h3 className='font-medium text-lg mb-3'>
                    Detalles y fechas
                  </h3>

                  <div className='grid gap-3'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-muted-foreground' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-muted-foreground'>
                          Fecha de creación
                        </span>
                        <span className='text-sm font-medium'>
                          {ticket?.date ? formatDateTime(ticket.date) : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-muted-foreground'>
                          Última actualización
                        </span>
                        <span className='text-sm font-medium'>
                          {ticket?.updated
                            ? formatDateTime(ticket.updated)
                            : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-start gap-2 mt-4'>
                      <MessageSquare className='h-4 w-4 text-muted-foreground mt-0.5' />
                      <div className='flex flex-col'>
                        <span className='text-xs text-muted-foreground'>
                          Descripción original
                        </span>
                        <p className='text-sm mt-1 whitespace-pre-wrap'>
                          {ticket?.content || 'Sin descripción'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='conversacion' className='mt-0'>
              <div className='bg-gray-50 rounded-lg p-4'>
                <TicketMessages
                  ticketId={ticket.id}
                  onTicketUpdate={onUpdate}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Acciones de respuesta - Reemplazar por Editar */}
          <div className='flex justify-end space-x-3 mt-6'>
            <Button variant='outline' onClick={onBack}>
              Volver a la lista
            </Button>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              disabled={ticketStatus === 'cerrado'}
              variant='default'
            >
              <Edit className='mr-2 h-4 w-4' />
              Editar
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

      <TicketEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        ticket={ticket}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
