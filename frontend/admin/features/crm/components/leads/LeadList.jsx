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
  leadUserTypeConfig
} from '../../lib/config/ui-config';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import Image from 'next/image';

// Mapeo simple y directo entre estados UI y backend
const ESTADOS_LEAD = [
  { value: 'nuevo', label: 'Nuevo', backend: 'Nuevo' },
  { value: 'proceso', label: 'Proceso', backend: 'Activo' },
  { value: 'cliente', label: 'Cliente', backend: 'Cliente' }
];

/**
 * Componente para listar leads
 * Realiza la paginación en el cliente
 */
export default function LeadList({
  leads = [],
  loading = false,
  onViewLead,
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  totalLeads = 0,
  onPageChange,
  onStatusChange = () => {},
  sortOrder = 'recent'
}) {
  const [leadStatuses, setLeadStatuses] = useState({});

  // Ordenar los leads según el criterio seleccionado
  const sortedLeads = [...leads].sort((a, b) => {
    if (sortOrder === 'alphabetical') {
      // Ordenar alfabéticamente por nombre
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'oldest') {
      // Ordenar por fecha de creación (más antiguo primero)
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
      // Por defecto, ordenar por fecha de creación (más reciente primero)
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Verificar estado de carga y mostrar mensajes apropiados
  if (loading) {
    return (
      <div className='bg-white border rounded-lg p-10 flex flex-col items-center justify-center min-h-[300px]'>
        <LoadingSpinner
          text='Cargando información de leads...'
          size={40}
          spinnerColor='border-primary'
        />
      </div>
    );
  }

  if (!loading && totalLeads === 0) {
    return (
      <div className='bg-white border rounded-lg p-8 text-center'>
        <p className='text-gray-500'>No se encontraron leads</p>
      </div>
    );
  }

  // Función para formatear la fecha
  const formatDate = date => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  // Función simplificada para obtener el estado UI de un lead
  const getLeadStatus = (leadId, apiStatus) => {
    // Si hay un cambio pendiente, usarlo primero
    if (leadStatuses[leadId]) {
      return leadStatuses[leadId];
    }

    // Normalizar el estado que viene de la API
    const statusLower = apiStatus?.toLowerCase() || '';

    // Mapeo simple y directo
    if (statusLower === 'activo') return 'proceso';
    if (statusLower === 'nuevo') return 'nuevo';
    if (statusLower === 'cliente') return 'cliente';

    // Si el estado ya es uno de los valores de UI, devolverlo tal cual
    if (['nuevo', 'proceso', 'cliente'].includes(statusLower)) {
      return statusLower;
    }

    // Valor por defecto
    return 'nuevo';
  };

  // Función para renderizar el badge de estado
  const renderStatusBadge = status => {
    const uiStatus = getLeadStatus(null, status);
    const config = leadStatusConfig[uiStatus] || leadStatusConfig.nuevo;

    return (
      <Badge
        variant={config.variant}
        className={cn(config.className, 'capitalize whitespace-nowrap')}
      >
        {config.label}
      </Badge>
    );
  };

  // Función para obtener clases del select de estado
  const getStatusSelectClass = (leadId, status) => {
    const uiStatus = getLeadStatus(leadId, status);
    const config = leadStatusConfig[uiStatus];

    if (!config) return '';

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

  // Función para renderizar el badge de tipo de usuario
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

  // Navegación de paginación
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

  // Convertir estado UI a formato backend para enviar a la API
  const getBackendStatus = uiStatus => {
    const estado = ESTADOS_LEAD.find(e => e.value === uiStatus);
    return estado ? estado.backend : 'Nuevo';
  };

  // Manejo simplificado de cambio de estado
  const handleStatusChange = (leadId, uiStatus) => {
    if (!leadId) {
      toast.error('No se pudo identificar el lead');
      return;
    }

    // Guardar localmente para UI inmediata
    setLeadStatuses(prev => ({
      ...prev,
      [leadId]: uiStatus
    }));

    // Para depuración
    console.log(
      `📊 Cambiando lead ${leadId} de UI:${uiStatus} a Backend:${getBackendStatus(
        uiStatus
      )}`
    );

    try {
      // Convertir y enviar al backend
      const backendStatus = getBackendStatus(uiStatus);
      onStatusChange(leadId, backendStatus);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);

      // Revertir cambio local si hay error
      setLeadStatuses(prev => {
        const updated = { ...prev };
        delete updated[leadId];
        return updated;
      });
    }
  };

  return (
    <div className='space-y-4'>
      {/* Vista de tabla - Desktop y tablets */}
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
            {sortedLeads.map(lead => (
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
                    value={getLeadStatus(lead.id, lead.status)}
                    onValueChange={value => handleStatusChange(lead.id, value)}
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
                      {ESTADOS_LEAD.map(estado => (
                        <SelectItem
                          key={estado.value}
                          value={estado.value}
                          className={cn(
                            'capitalize',
                            leadStatusConfig[estado.value]?.className
                          )}
                        >
                          {estado.label}
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
            {!loading && totalLeads > 0 && sortedLeads.length === 0 && (
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
        {sortedLeads.map(lead => (
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
                  value={getLeadStatus(lead.id, lead.status)}
                  onValueChange={value => handleStatusChange(lead.id, value)}
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
                    {ESTADOS_LEAD.map(estado => (
                      <SelectItem
                        key={estado.value}
                        value={estado.value}
                        className={cn(
                          'capitalize',
                          leadStatusConfig[estado.value]?.className
                        )}
                      >
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='text-xs text-muted-foreground'>
              {lead.email ? (
                <div className='flex items-center'>
                  <Mail className='h-4 w-4 mr-1 text-muted-foreground' />
                  <span>{lead.email}</span>
                </div>
              ) : (
                <div className='flex items-center'>
                  <Phone className='h-4 w-4 mr-1 text-muted-foreground' />
                  <span>{lead.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mt-6 px-2 gap-2'>
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
