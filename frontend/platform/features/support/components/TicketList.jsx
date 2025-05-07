import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import React from 'react';

const TicketList = ({ tickets = [], onCreateTicket, onViewTicket }) => {
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

      <div className='border rounded-md overflow-hidden text-white'>
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
                    {ticket.id.startsWith('TK-')
                      ? ticket.id
                      : `TK-${ticket.id}`}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {ticket.subject}
                    </div>
                    <div className='text-sm text-gray-500'>
                      Última actualización: {ticket.lastUpdate}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge
                      variant={
                        ticket.status === 'Abierto'
                          ? 'secondary'
                          : ticket.status === 'En proceso'
                          ? 'warning'
                          : ticket.status === 'Resuelto'
                          ? 'success'
                          : 'default'
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {ticket.date}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <Button
                      variant='primary'
                      size='sm'
                      className=' px-8 bg-purple-600 hover:bg-purple-700'
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
    </div>
  );
};

export default TicketList;
