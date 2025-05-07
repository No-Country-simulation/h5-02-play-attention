import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import React from 'react';

const TicketList = ({
  tickets = [],
  meta = {},
  onCreateTicket,
  onViewTicket,
  onFilterChange,
  currentFilters = {}
}) => {
  // Formatear fecha ISO a formato local
  const formatDate = dateString => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Formatear titulo/asunto del ticket
  const formatTitle = ticket => {
    return ticket.title || ticket.subject || 'Sin título';
  };

  // Formatear ID del ticket para visualización
  const formatTicketId = ticketId => {
    if (!ticketId) return 'N/A';
    if (typeof ticketId === 'string' && ticketId.startsWith('TK-')) {
      return ticketId;
    }
    return `TK-${ticketId}`;
  };

  // Determinar el estado con valores por defecto
  const getTicketStatus = ticket => {
    if (!ticket) return 'Desconocido';

    // Normalizar valores de estado
    const status = (ticket.status || '').toLowerCase();

    if (status === 'open' || status === 'abierto') {
      return 'Abierto';
    } else if (status === 'in_progress' || status === 'en proceso') {
      return 'En proceso';
    } else if (status === 'resolved' || status === 'resuelto') {
      return 'Resuelto';
    } else if (status === 'closed' || status === 'cerrado') {
      return 'Cerrado';
    }

    return ticket.status || 'Desconocido';
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Mis Tickets</h2>
        <Button
          variant='primary'
          size='sm'
          className='flex text-white items-center gap-2 bg-purple-600 hover:bg-purple-700'
          onClick={onCreateTicket}
        >
          <span>+</span> Crear Ticket
        </Button>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Asunto
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Estado
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Fecha
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {tickets.length > 0 ? (
              tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatTicketId(ticket.id)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {formatTitle(ticket)}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {ticket.category && (
                        <span className='px-1.5 py-0.5 bg-gray-100 rounded text-xs mr-2'>
                          {ticket.category}
                        </span>
                      )}
                      Actualizado:{' '}
                      {formatDate(ticket.updated_at || ticket.lastUpdate)}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge
                      variant={
                        getTicketStatus(ticket) === 'Abierto'
                          ? 'secondary'
                          : getTicketStatus(ticket) === 'En proceso'
                          ? 'warning'
                          : getTicketStatus(ticket) === 'Resuelto'
                          ? 'success'
                          : 'default'
                      }
                    >
                      {getTicketStatus(ticket)}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatDate(ticket.created_at || ticket.date)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <Button
                      variant='primary'
                      size='sm'
                      className='px-8 bg-purple-600 hover:bg-purple-700'
                      onClick={() => onViewTicket(ticket.id)}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className='px-6 py-4 text-center text-sm text-gray-500'
                >
                  No hay tickets disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Información sobre la cantidad de tickets (sin paginación) */}
      {meta && meta.total > 0 && (
        <div className='mt-4 flex justify-between items-center'>
          <div className='text-sm text-gray-500'>
            Mostrando {tickets.length} tickets en total
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
