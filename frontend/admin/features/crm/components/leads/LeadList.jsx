'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Mail, Phone, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  leadStatusConfig,
  leadUserTypeConfig
} from '../../lib/config/ui-config';
import { cn } from '@/shared/lib/utils';

/**
 * Componente para listar leads
 * Realiza la paginación en el cliente
 */
export default function LeadList({
  leads = [], // Recibe TODOS los leads filtrados
  loading = false,
  onViewLead,
  currentPage = 1,
  pageSize = 4, // Recibe pageSize
  totalPages = 1, // Recibe totalPages calculado en el store
  totalLeads = 0,
  onPageChange
}) {
  // Calcular los leads a mostrar para la página actual
  const getCurrentPageLeads = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return leads.slice(startIndex, endIndex);
  };

  const currentLeads = getCurrentPageLeads();
  const currentLeadsCount = currentLeads.length; // Contar los leads de la página actual

  // Verificar si tenemos leads para mostrar (basado en el total real)
  if (loading) {
    return (
      <div className='bg-white border rounded-lg p-8 text-center'>
        <p className='text-gray-500'>Cargando leads...</p>
      </div>
    );
  }

  // Si no hay leads después de cargar, mostrar mensaje
  if (!loading && totalLeads === 0) {
    return (
      <div className='bg-white border rounded-lg p-8 text-center'>
        <p className='text-gray-500'>No se encontraron leads</p>
      </div>
    );
  }

  // Formatear fecha
  const formatDate = date => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      console.error('Error al formatear fecha:', e);
      return 'Fecha inválida';
    }
  };

  // Renderizar el badge de estado según la configuración
  const renderStatusBadge = status => {
    const config = leadStatusConfig[status] || {
      variant: 'outline',
      className: 'bg-neutral-light text-neutral border-neutral',
      label: status || 'Desconocido'
    };

    return (
      <Badge
        variant={config.variant}
        className={cn(config.className, 'capitalize whitespace-nowrap')}
      >
        {config.label}
      </Badge>
    );
  };

  // Renderizar el badge de tipo de usuario según la configuración
  const renderUserTypeBadge = userType => {
    const config = leadUserTypeConfig[userType] || {
      variant: 'outline',
      className: 'bg-neutral-light text-neutral border-neutral',
      label: userType || 'No clasificado'
    };

    return (
      <Badge
        variant={config.variant}
        className={cn(config.className, 'capitalize whitespace-nowrap')}
      >
        {config.label}
      </Badge>
    );
  };

  // Manejar navegación entre páginas
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className='space-y-4'>
      {/* Vista de tabla - Oculta en pantallas extra pequeñas, visible en el resto */}
      <div className='hidden sm:block bg-white border rounded-lg overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='whitespace-nowrap'>Nombre</TableHead>
              <TableHead className='whitespace-nowrap hidden sm:table-cell'>
                Contacto
              </TableHead>
              <TableHead className='whitespace-nowrap hidden md:table-cell'>
                Empresa
              </TableHead>
              <TableHead className='whitespace-nowrap'>Tipo</TableHead>
              <TableHead className='whitespace-nowrap'>Estado</TableHead>
              <TableHead className='whitespace-nowrap hidden md:table-cell'>
                Fecha
              </TableHead>
              <TableHead className='whitespace-nowrap text-right'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLeads.map(lead => (
              <TableRow key={lead.id} className='hover:bg-gray-50'>
                <TableCell>
                  <div className='font-medium truncate max-w-[120px] sm:max-w-none'>
                    {lead.name}
                  </div>
                  <div className='text-xs sm:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none'>
                    {lead.position}
                  </div>
                  <div className='text-xs text-muted-foreground sm:hidden truncate'>
                    {lead.email}
                  </div>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <div className='space-y-1'>
                    <div className='flex items-center text-xs sm:text-sm'>
                      <Mail className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-muted-foreground' />
                      <span className='truncate max-w-[120px] md:max-w-none'>
                        {lead.email}
                      </span>
                    </div>
                    {lead.phone && (
                      <div className='flex items-center text-xs sm:text-sm'>
                        <Phone className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-muted-foreground' />
                        {lead.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {lead.company || 'N/A'}
                </TableCell>
                <TableCell>{renderUserTypeBadge(lead.userType)}</TableCell>
                <TableCell>{renderStatusBadge(lead.status)}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  <div className='flex items-center text-xs sm:text-sm'>
                    <Calendar className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-muted-foreground' />
                    {formatDate(lead.createdAt)}
                  </div>
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onViewLead(lead.id)}
                    className='px-2 h-8 text-xs sm:text-sm'
                  >
                    <span className='hidden sm:inline'>Ver detalle</span>
                    <span className='sm:hidden'>Ver</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {/* Mostrar fila vacía si no hay leads en la página actual pero sí en total */}
            {!loading && totalLeads > 0 && currentLeadsCount === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='text-center text-gray-500 py-4'
                >
                  No hay leads en esta página.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Vista de tarjetas para móvil - Vista en pantallas extra pequeñas */}
      <div className='sm:hidden space-y-3'>
        {currentLeads.map(lead => (
          <div
            key={lead.id}
            className='bg-white border rounded-lg p-3 shadow-sm'
          >
            <div className='flex justify-between items-start mb-2'>
              <div>
                <h3 className='font-medium text-sm'>{lead.name}</h3>
                {lead.position && (
                  <p className='text-xs text-muted-foreground'>
                    {lead.position}
                  </p>
                )}
              </div>
              <div className='flex flex-shrink-0'>
                {renderStatusBadge(lead.status)}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-x-2 gap-y-1 mb-2'>
              <div className='flex items-center text-xs'>
                <Mail className='h-3 w-3 mr-1 text-muted-foreground' />
                <span className='truncate'>{lead.email}</span>
              </div>
              {lead.phone && (
                <div className='flex items-center text-xs'>
                  <Phone className='h-3 w-3 mr-1 text-muted-foreground' />
                  <span className='truncate'>{lead.phone}</span>
                </div>
              )}
              {lead.company && (
                <div className='flex items-center text-xs'>
                  <span className='text-muted-foreground'>Empresa:</span>
                  <span className='truncate ml-1'>{lead.company}</span>
                </div>
              )}
              <div className='flex items-center text-xs'>
                <Calendar className='h-3 w-3 mr-1 text-muted-foreground' />
                <span className='truncate'>{formatDate(lead.createdAt)}</span>
              </div>
            </div>

            <div className='flex justify-between items-center mt-3 pt-2 border-t border-gray-100'>
              <div className='text-xs'>
                {renderUserTypeBadge(lead.userType)}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onViewLead(lead.id)}
                className='h-7 px-2 text-xs'
              >
                Ver
              </Button>
            </div>
          </div>
        ))}

        {/* Mensaje cuando no hay leads */}
        {!loading && totalLeads > 0 && currentLeadsCount === 0 && (
          <div className='bg-white border rounded-lg p-4 text-center'>
            <p className='text-gray-500 text-sm'>
              No hay leads en esta página.
            </p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className='flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-2'>
          <div className='text-xs sm:text-sm text-gray-500 order-2 sm:order-1 text-center sm:text-left'>
            Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
            {Math.min(currentPage * pageSize, totalLeads)} de {totalLeads} leads
          </div>
          <div className='flex space-x-2 justify-center sm:justify-end order-1 sm:order-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className='h-8 w-8 p-0'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='flex items-center text-xs sm:text-sm px-2 font-medium'>
              {currentPage} de {totalPages}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className='h-8 w-8 p-0'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
