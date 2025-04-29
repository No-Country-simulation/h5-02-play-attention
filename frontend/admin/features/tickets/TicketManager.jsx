'use client';

import { useState } from 'react';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import TicketFilters from './components/TicketFilters';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/shared/ui/page-header';
import { getPageMetadata } from '@/shared/lib/utils/page-metadata';

// Mock de datos para tickets
const mockTickets = [
  {
    id: '1001',
    subject: 'Problema de inicio de sesión',
    user: 'Juan Pérez',
    status: 'abierto',
    priority: 'alta',
    date: '2023-06-10T09:30:00',
    updated: '2023-06-10T10:30:00'
  },
  {
    id: '1002',
    subject: 'Error en la compra de curso',
    user: 'María López',
    status: 'en proceso',
    priority: 'media',
    date: '2023-06-08T14:20:00',
    updated: '2023-06-09T09:15:00'
  },
  {
    id: '1003',
    subject: 'Solicitud de devolución',
    user: 'Carlos Rodríguez',
    status: 'resuelto',
    priority: 'baja',
    date: '2023-06-05T11:45:00',
    updated: '2023-06-07T13:30:00'
  },
  {
    id: '1004',
    subject: 'Problemas técnicos en la plataforma',
    user: 'Ana Martínez',
    status: 'abierto',
    priority: 'alta',
    date: '2023-06-09T16:10:00',
    updated: '2023-06-09T16:10:00'
  }
];

/**
 * Componente principal para la gestión de tickets de soporte
 * Sigue el principio de Responsabilidad Única (SRP) y Abierto/Cerrado (OCP)
 * permitiendo extensiones sin modificar el componente existente
 */
export default function TicketManager() {
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();
  const { title, description } = getPageMetadata('tickets');

  // Función para seleccionar un ticket
  const handleSelectTicket = ticket => {
    setSelectedTicket(ticket);
  };

  // Función para volver a la lista de tickets
  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  // Función para crear un nuevo ticket
  const handleCreateTicket = () => {
    router.push('/tickets/new');
  };

  // Actualizar un ticket después de responder
  const handleTicketUpdate = updatedTicket => {
    // En producción, esto se enviaría a la API y luego actualizaríamos el estado con la respuesta
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  };

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      {!selectedTicket && (
        <PageHeader title={title} description={description} />
      )}

      {selectedTicket ? (
        <>
          <div className='mb-6'>
            <Button onClick={handleBackToList} variant='ghost' className='px-0'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver a la lista
            </Button>
          </div>

          <TicketDetail
            ticket={selectedTicket}
            onBack={handleBackToList}
            onUpdate={handleTicketUpdate}
          />
        </>
      ) : (
        <>
          <TicketFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />

          <TicketList
            tickets={tickets}
            statusFilter={statusFilter}
            onSelectTicket={handleSelectTicket}
          />
        </>
      )}
    </div>
  );
}
