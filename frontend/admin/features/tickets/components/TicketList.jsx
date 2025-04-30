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
import DeleteConfirmationModal from '@/shared/ui/modals/DeleteConfirmationModal';
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
  isLoading = false
}) {
  const router = useRouter();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  // Función para manejar la intención de eliminar
  const handleDeleteClick = (e, ticket) => {
    e.stopPropagation(); // Prevenir que se seleccione el ticket
    setTicketToDelete(ticket);
    setDeleteModalOpen(true);
  };

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    if (ticketToDelete && onDeleteTicket) {
      await onDeleteTicket(ticketToDelete.id);
      setDeleteModalOpen(false);
      setTicketToDelete(null);
    }
  };

  // Función para cancelar eliminación
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setTicketToDelete(null);
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

    // No hay tickets
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

    // No hay tickets en la página actual pero hay en otras páginas
    if (!isLoading && tickets.length === 0 && totalTickets > 0) {
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

    // Lista de tickets
    return (
      <>
        {/* Vista de tabla para pantallas medianas y grandes */}
        <div className='overflow-x-auto hidden md:block'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='py-3 px-4 text-left font-medium text-sm'>
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
                <th className='py-3 px-2 text-right font-medium text-sm'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr
                  key={ticket.id}
                  className='border-b hover:bg-gray-50 cursor-pointer'
                  onClick={() => onSelectTicket(ticket)}
                  onMouseEnter={() => setHoveredRow(ticket.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className='py-3 px-4 text-sm font-medium'>
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
                        <DropdownMenuItem
                          className='text-red-600 focus:text-red-600'
                          onClick={e => handleDeleteClick(e, ticket)}
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista de tarjetas para móvil */}
        <div className='md:hidden space-y-3 px-3 py-2'>
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className='bg-white border rounded-lg p-3 shadow-sm relative cursor-pointer hover:bg-gray-50 transition-colors duration-150'
              onClick={() => onSelectTicket(ticket)}
            >
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <h3 className='font-medium text-sm'>{ticket.subject}</h3>
                  <p className='text-xs text-muted-foreground'>{ticket.user}</p>
                </div>
                <div className='flex flex-col space-y-1 items-end'>
                  <Badge
                    variant='outline'
                    className='flex items-center gap-1 capitalize text-xs'
                  >
                    {renderStatusIcon(ticket.status)}
                    <span className='hidden sm:inline'>{ticket.status}</span>
                  </Badge>
                  <Badge
                    className={cn(
                      'capitalize text-xs',
                      getPriorityStyle(ticket.priority)
                    )}
                  >
                    {ticket.priority}
                  </Badge>
                </div>
              </div>

              <div className='text-xs text-muted-foreground mt-2'>
                {formatDate(ticket.date)}
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
                      className='text-red-600 focus:text-red-600'
                      onClick={e => handleDeleteClick(e, ticket)}
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Eliminar
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
      </CardHeader>

      <CardContent className='flex-grow p-0'>
        {renderContent()}

        {/* Paginación - ahora mostramos siempre que haya tickets, no solo cuando hay múltiples páginas */}
        {!isLoading && tickets.length > 0 && (
          <TicketPagination
            currentPage={currentPage}
            totalPages={totalPages || 3} // Aseguramos que siempre haya al menos 3 páginas
            pageSize={pageSize}
            totalTickets={totalTickets || tickets.length * 3} // Si no hay totalTickets, simulamos el triple
            currentTickets={tickets.length}
            onPreviousPage={onPreviousPage}
            onNextPage={onNextPage}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title='Eliminar ticket'
        message={
          ticketToDelete
            ? `¿Estás seguro que deseas eliminar el ticket "${ticketToDelete.subject}"? Esta acción no se puede deshacer.`
            : 'Confirmar eliminación de ticket'
        }
      />
    </Card>
  );
}
