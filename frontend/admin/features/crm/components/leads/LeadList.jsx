'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';
import {
  leadStatusConfig,
  leadUserTypeConfig,
  leadStatusOptions
} from '../../lib/config/ui-config';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

/**
 * Componente para listar leads
 * Realiza la paginación en el cliente
 */
export default function LeadList({
  leads = [], // Recibe leads ya paginados desde LeadManager
  loading = false,
  onViewLead,
  currentPage = 1,
  pageSize = 10, // Cambiar a 10 para coincidir con LeadManager
  totalPages = 1, // Recibe totalPages calculado en el store
  totalLeads = 0,
  onPageChange,
  onStatusChange = () => {} // Nueva prop para manejar cambios de estado
}) {
  // Estado local para mantener los estados actualizados visualmente
  const [leadStatuses, setLeadStatuses] = useState({});

  // Ya no necesitamos calcular los leads de la página actual aquí
  // porque recibimos los leads ya paginados
  const currentLeads = leads;
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
      return 'Fecha inválida';
    }
  };

  // Función para normalizar el estado del lead
  const normalizeStatus = (leadId, status) => {
    // Si tenemos un estado actualizado en el estado local, usamos ese
    if (leadStatuses[leadId]) {
      return leadStatuses[leadId];
    }

    if (!status) return 'nuevo';

    const normalizedStatus = status.toLowerCase().trim();

    // Mapeo de posibles valores del backend a las claves de configuración
    const statusMapping = {
      nuevo: 'nuevo',
      'en proceso': 'proceso',
      proceso: 'proceso',
      cliente: 'cliente',
      convertido: 'cliente'
    };

    return statusMapping[normalizedStatus] || normalizedStatus;
  };

  // Renderizar el badge de estado según la configuración
  const renderStatusBadge = status => {
    // Normalizar status a minúsculas y quitar espacios
    const normalizedStatus = (status || '').toLowerCase().trim();

    // Mapeo de posibles valores del backend a las claves de configuración
    const statusMapping = {
      nuevo: 'nuevo',
      'en proceso': 'proceso',
      proceso: 'proceso',
      cliente: 'cliente',
      convertido: 'cliente'
    };

    // Usar el mapeo o el status normalizado directamente
    const configKey = statusMapping[normalizedStatus] || normalizedStatus;

    const config = leadStatusConfig[configKey] || {
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

  // Función para obtener el color del borde del select basado en el estado
  const getStatusSelectClass = (leadId, status) => {
    // Usamos el estado normalizado (con prioridad al estado local)
    const normalizedStatus = normalizeStatus(leadId, status);
    const config = leadStatusConfig[normalizedStatus];

    if (!config) return '';

    // Extraer el color del borde y texto de la clase
    const borderColorClass = config.className
      .split(' ')
      .find(cls => cls.startsWith('border-'));
    const textColorClass = config.className
      .split(' ')
      .find(cls => cls.startsWith('text-'));
    const bgColorClass = config.className
      .split(' ')
      .find(cls => cls.startsWith('bg-'));

    return `${borderColorClass} ${textColorClass} ${bgColorClass || ''}`;
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

  // Manejar cambio de estado
  const handleStatusChange = (leadId, newStatus) => {
    // Asegurarnos de que leadId no sea undefined o vacío
    if (!leadId) {
      toast.error('No se pudo identificar el lead para actualizar');
      return;
    }

    // Actualizamos el estado local para reflejar el cambio inmediatamente
    setLeadStatuses(prev => ({
      ...prev,
      [leadId]: newStatus
    }));

    try {
      // Llamamos al callback para actualizar el estado en el backend
      onStatusChange(leadId, newStatus);
    } catch (error) {
      console.error(`❌ Error al llamar onStatusChange: ${error.message}`);

      // Revertir el cambio local en caso de error
      setLeadStatuses(prev => {
        const updated = { ...prev };
        delete updated[leadId];
        return updated;
      });
    }
  };

  // Función reutilizable para manejar el cambio de estado desde el Select
  const handleSelectChange = (leadId, value) => {
    // Verificar que el ID exista
    if (!leadId) {
      toast.error('No se pudo identificar el lead para actualizar');
      return;
    }
    handleStatusChange(leadId, value);
  };

  return (
    <div className='space-y-4'>
      {/* Vista de tabla - Visible en desktop y tablets */}
      <div className='hidden md:block bg-white border rounded-lg overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='whitespace-nowrap'>Nombre</TableHead>
              <TableHead className='whitespace-nowrap'>Contacto</TableHead>
              <TableHead className='whitespace-nowrap hidden lg:table-cell'>
                Empresa
              </TableHead>
              <TableHead className='whitespace-nowrap'>Tipo</TableHead>
              <TableHead className='whitespace-nowrap'>Estado</TableHead>
              <TableHead className='whitespace-nowrap hidden lg:table-cell'>
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
                </TableCell>
                <TableCell>
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
                        <span className='truncate max-w-[120px] md:max-w-none'>
                          {lead.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className='hidden lg:table-cell'>
                  {lead.company || 'N/A'}
                </TableCell>
                <TableCell>{renderUserTypeBadge(lead.userType)}</TableCell>
                <TableCell>
                  <Select
                    value={normalizeStatus(lead.id, lead.status)}
                    onValueChange={value => handleSelectChange(lead.id, value)}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-8 px-2 text-xs sm:text-sm border capitalize',
                        getStatusSelectClass(lead.id, lead.status)
                      )}
                      aria-label='Cambiar estado'
                    >
                      <SelectValue placeholder='Cambiar estado' />
                    </SelectTrigger>
                    <SelectContent>
                      {leadStatusOptions.map(status => (
                        <SelectItem
                          key={status}
                          value={status}
                          className={cn(
                            'capitalize',
                            getStatusSelectClass('select-item', status)
                          )}
                        >
                          {leadStatusConfig[status]?.label || status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className='hidden lg:table-cell'>
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

      {/* Vista de tarjetas para móvil */}
      <div className='md:hidden space-y-3'>
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
                <Select
                  value={normalizeStatus(lead.id, lead.status)}
                  onValueChange={value => handleSelectChange(lead.id, value)}
                >
                  <SelectTrigger
                    className={cn(
                      'h-7 px-2 text-xs border capitalize min-w-[90px]',
                      getStatusSelectClass(lead.id, lead.status)
                    )}
                    aria-label='Cambiar estado'
                  >
                    <SelectValue placeholder='Estado' />
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatusOptions.map(status => (
                      <SelectItem
                        key={status}
                        value={status}
                        className={cn(
                          'capitalize text-xs',
                          getStatusSelectClass('select-item', status)
                        )}
                      >
                        {leadStatusConfig[status]?.label || status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <span className='text-muted-foreground mr-1'>Empresa:</span>
                  <span className='truncate'>{lead.company}</span>
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
