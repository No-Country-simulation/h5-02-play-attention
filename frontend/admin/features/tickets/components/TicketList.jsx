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
  Plus,
  MoreVertical,
  AlertCircle,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Inbox
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import TicketPagination from './TicketPagination';

/**
 * Componente para listar tickets de soporte
 * Sigue el principio de Responsabilidad Única (SRP) al encargarse solo de la visualización de la lista
 */
export default function TicketList({
  tickets = [],
  onSelectTicket,
  onDeleteTicket,
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  totalTickets = 0,
  onPageChange = () => {},
  onPreviousPage = () => {},
  onNextPage = () => {},
  isLoading = false,
  noPagination = false
}) {
  const router = useRouter();
  const [hoveredRow, setHoveredRow] = useState(null);

  // Formatear la fecha para mostrarla en formato legible
  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      // Verificar si es una fecha válida
      if (isNaN(date.getTime())) {
        return 'Fecha desconocida';
      }
      return format(date, 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
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
      case 'cerrado':
        return <XCircle className='h-5 w-5 text-gray-500' />;
      default:
        return <AlertTriangle className='h-5 w-5 text-gray-400' />;
    }
  };

  // Aplicar estilos según la prioridad
  const getPriorityStyle = priority => {
    switch (priority) {
      case 'alta':
        return 'text-red-600 bg-red-50';
      case 'media':
        return 'text-amber-600 bg-amber-50';
      case 'baja':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Aplicar estilos según el estado del ticket
  const getStatusStyle = status => {
    switch (status) {
      case 'abierto':
        return 'text-red-600 border-red-200';
      case 'en proceso':
        return 'text-amber-600 border-amber-200';
      case 'resuelto':
        return 'text-green-600 border-green-200';
      case 'cerrado':
        return 'text-gray-600 border-gray-200';
      default:
        return 'text-gray-600 border-gray-200';
    }
  };

  // Renderizar el contenido basado en el estado de carga y los datos
  const renderContent = () => {
    // Estado de carga
    if (isLoading) {
      return (
        <div className='bg-white border rounded-lg p-10 flex flex-col items-center justify-center min-h-[300px]'>
          <LoadingSpinner
            text='Cargando tickets de soporte...'
            size={40}
            spinnerColor='border-primary'
          />
        </div>
      );
    }

    // No hay tickets (sin filtros aplicados)
    if (!isLoading && tickets.length === 0 && totalTickets === 0) {
      return (
        <div className='bg-white h-full border rounded-lg p-8 text-center'>
          <div className='flex flex-col items-center justify-center py-6'>
            <Inbox className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-medium mb-2'>
              No hay tickets de soporte
            </h3>
            <p className='text-gray-500 mb-6'>
              No se encontraron tickets en el sistema. Crea un nuevo ticket para
              comenzar.
            </p>
            <Button
              onClick={() => router.push('/tickets/new')}
              className='mt-2'
            >
              <Plus className='mr-2 h-4 w-4' />
              Crear ticket
            </Button>
          </div>
        </div>
      );
    }

    // No hay tickets en la página actual pero hay en otras páginas (con filtros aplicados)
    if (
      !noPagination &&
      !isLoading &&
      tickets.length === 0 &&
      totalTickets > 0
    ) {
      return (
        <div className='bg-white border rounded-lg p-8 text-center'>
          <p className='text-gray-500 mb-4'>No hay tickets en esta página.</p>
          <div className='flex justify-center mt-4 gap-2'>
            <Button
              variant='outline'
              onClick={onPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='mr-1 h-4 w-4' />
              Página anterior
            </Button>
            <Button
              variant='outline'
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              Primera página
            </Button>
          </div>
        </div>
      );
    }

    // Lista de tickets (con datos)
    return (
      <>
        {/* Vista de tabla solo para pantallas grandes */}
        <div className='overflow-x-auto hidden lg:block'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='py-3 px-4 text-left font-medium text-sm'>
                  Asunto
                </th>
                <th className='py-3 px-2 text-left font-medium text-sm'>
                  Creado por
                </th>
                <th className='py-3 px-2 text-left font-medium text-sm'>
                  Asignado a
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
                <th className='py-3 px-2 text-right font-medium text-sm'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {/* IMPORTANTE: Verificamos si tickets es un array antes de mapearlo */}
              {Array.isArray(tickets) && tickets.length > 0 ? (
                tickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    className={cn(
                      'border-b cursor-pointer hover:bg-gray-50 transition duration-150',
                      hoveredRow === ticket.id && 'bg-gray-50'
                    )}
                    onClick={() => onSelectTicket(ticket)}
                    onMouseEnter={() => setHoveredRow(ticket.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className='py-3 px-4 text-sm font-medium'>
                      {ticket.subject}
                    </td>
                    <td className='py-3 px-2 text-sm'>{ticket.user}</td>
                    <td className='py-3 px-2 text-sm'>
                      {ticket.assignedTo || 'Sin asignar'}
                    </td>
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
                    <td className='py-3 px-2 text-sm text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 rounded-full'
                            onClick={e => e.stopPropagation()}
                          >
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              onSelectTicket(ticket);
                            }}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            Ver detalle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='text-center py-8 text-gray-500'>
                    No se encontraron tickets que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Vista de tarjetas para dispositivos móviles y tablets */}
        <div className='lg:hidden space-y-4'>
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className='bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer'
              onClick={() => onSelectTicket(ticket)}
            >
              <h3 className='font-medium text-base mb-2 line-clamp-2'>
                {ticket.subject}
              </h3>

              <div className='grid grid-cols-2 gap-2 mt-3 text-sm'>
                <div>
                  <p className='text-gray-500 text-xs'>Creado por</p>
                  <p className='truncate'>{ticket.user}</p>
                </div>

                <div>
                  <p className='text-gray-500 text-xs'>Asignado a</p>
                  <p className='truncate'>
                    {ticket.assignedTo || 'Sin asignar'}
                  </p>
                </div>

                <div>
                  <p className='text-gray-500 text-xs'>Estado</p>
                  <Badge
                    variant='outline'
                    className={cn('mt-1', getStatusStyle(ticket.status))}
                  >
                    <span className='mr-1'>
                      {renderStatusIcon(ticket.status)}
                    </span>
                    {ticket.status}
                  </Badge>
                </div>

                <div>
                  <p className='text-gray-500 text-xs'>Prioridad</p>
                  <Badge
                    variant='outline'
                    className={cn('mt-1', getPriorityStyle(ticket.priority))}
                  >
                    {ticket.priority}
                  </Badge>
                </div>

                <div className='col-span-2'>
                  <p className='text-gray-500 text-xs'>Fecha</p>
                  <p className='text-sm text-gray-600'>
                    {formatDate(ticket.date)}
                  </p>
                </div>
              </div>

              <div className='absolute bottom-2 right-2 text-xs text-primary flex items-center opacity-70'>
                <span className='mr-1'>Ver detalle</span>
                <ArrowRight className='h-3 w-3' />
              </div>

              <div className='absolute top-2 right-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6 rounded-full'
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreVertical className='h-3 w-3' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        onSelectTicket(ticket);
                      }}
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      Ver detalle
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <Card className='overflow-hidden rounded-lg shadow-sm'>
      <CardHeader className='bg-slate-50 px-6 py-4 justify-between flex-row flex items-center space-y-0'>
        <div>
          <CardTitle className='text-lg leading-normal font-semibold text-slate-800'>
            Tickets de Soporte
          </CardTitle>
          <CardDescription className='text-sm'>
            {isLoading ? (
              <span>Cargando...</span>
            ) : (
              <span>
                Gestiona las solicitudes de soporte de los usuarios
                {totalTickets > 0 && (
                  <>
                    <br />
                    Mostrando {tickets.length} de {totalTickets} tickets
                  </>
                )}
              </span>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='p-0'>{renderContent()}</CardContent>

      {/* Paginación - Solo mostrar si no estamos en modo sin paginación */}
      {!noPagination && totalPages > 1 && (
        <div className='p-4 bg-slate-50 border-t'>
          <TicketPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onPreviousPage={onPreviousPage}
            onNextPage={onNextPage}
          />
        </div>
      )}
    </Card>
  );
}
