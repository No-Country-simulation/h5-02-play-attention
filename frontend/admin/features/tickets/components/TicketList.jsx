'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  PlusCircle,
  Plus,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

/**
 * Componente para listar tickets de soporte
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de la visualización de la lista
 */
export default function TicketList({
  tickets = [],
  statusFilter,
  onSelectTicket
}) {
  const router = useRouter();
  const [hoveredRow, setHoveredRow] = useState(null);

  // Filtrar tickets según el estado seleccionado
  const filteredTickets =
    statusFilter === 'all'
      ? tickets
      : tickets.filter(ticket => ticket.status === statusFilter);

  // Formatear la fecha para mostrarla en formato legible
  const formatDate = dateString => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy, HH:mm', { locale: es });
  };

  // Renderizar icono según el estado del ticket
  const renderStatusIcon = status => {
    switch (status) {
      case 'abierto':
        return <AlertCircle className='h-5 w-5 text-red-500' />;
      case 'en proceso':
        return <Clock className='h-5 w-5 text-amber-500' />;
      case 'resuelto':
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      default:
        return null;
    }
  };

  // Aplicar estilos según la prioridad
  const getPriorityStyle = priority => {
    switch (priority) {
      case 'alta':
        return 'text-red-600 font-medium';
      case 'media':
        return 'text-amber-600';
      case 'baja':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  // Función para navegar a la página de creación de tickets
  const handleCreateTicket = () => {
    router.push('/tickets/new');
  };

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div>
          <CardTitle className='text-xl font-bold'>
            Tickets de Soporte
          </CardTitle>
          <CardDescription>
            Gestiona las solicitudes de soporte de los usuarios
          </CardDescription>
        </div>
        <Button onClick={handleCreateTicket} size='sm' className='h-8'>
          <Plus className='mr-1 h-4 w-4' />
          Nuevo Ticket
        </Button>
      </CardHeader>

      <CardContent className='flex-grow p-0'>
        {filteredTickets.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='py-3 px-2 text-left font-medium text-sm'>
                    ID
                  </th>
                  <th className='py-3 px-2 text-left font-medium text-sm'>
                    Asunto
                  </th>
                  <th className='py-3 px-2 text-left font-medium text-sm'>
                    Usuario
                  </th>
                  <th className='py-3 px-2 text-left font-medium text-sm'>
                    Estado
                  </th>
                  <th className='py-3 px-2 text-left font-medium text-sm'>
                    Prioridad
                  </th>
                  <th className='py-3 px-2 text-left font-medium text-sm'>
                    Fecha
                  </th>
                  <th className='py-3 px-2 text-left font-medium text-sm'></th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    className='border-b hover:bg-gray-50 cursor-pointer'
                    onClick={() => onSelectTicket(ticket)}
                  >
                    <td className='py-3 px-2 text-sm'>{ticket.id}</td>
                    <td className='py-3 px-2 text-sm font-medium'>
                      {ticket.subject}
                    </td>
                    <td className='py-3 px-2 text-sm'>{ticket.user}</td>
                    <td className='py-3 px-2 text-sm'>
                      <Badge
                        variant='outline'
                        className='flex items-center gap-1 capitalize'
                      >
                        {renderStatusIcon(ticket.status)}
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className='py-3 px-2 text-sm'>
                      <Badge
                        variant='outline'
                        className={cn(
                          'capitalize',
                          getPriorityStyle(ticket.priority)
                        )}
                      >
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className='py-3 px-2 text-sm'>
                      {formatDate(ticket.date)}
                    </td>
                    <td className='py-3 px-2 text-sm'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='rounded-full'
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='bg-white h-full border rounded-lg p-8 text-center'>
            <p className='text-gray-500'>
              No se encontraron tickets con los filtros seleccionados
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
