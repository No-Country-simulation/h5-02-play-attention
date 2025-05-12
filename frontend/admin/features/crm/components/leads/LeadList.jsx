'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowRight,
  ClipboardList,
  CheckCircle,
  CircleAlert
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';

// Mapeo simple y directo entre estados UI y backend
const ESTADOS_LEAD = [
  { value: 'nuevo', label: 'Nuevo', backend: 'Nuevo' },
  { value: 'proceso', label: 'Proceso', backend: 'Activo' },
  { value: 'no_interesado', label: 'No interesado', backend: 'No interesado' },
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
  onNewsletterChange = () => {},
  sortOrder = 'recent'
}) {
  const [leadStatuses, setLeadStatuses] = useState({});
  const [localNewsletterState, setLocalNewsletterState] = useState({});
  const [updatingNewsletterLeads, setUpdatingNewsletterLeads] = useState([]);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [validationCode, setValidationCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Los leads ya vienen ordenados del componente padre
  const sortedLeads = leads;

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
    if (statusLower === 'no interesado') return 'no_interesado';

    // Si el estado ya es uno de los valores de UI, devolverlo tal cual
    if (
      ['nuevo', 'proceso', 'cliente', 'no_interesado'].includes(statusLower)
    ) {
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

    // Verificar si el lead actual está en estado cliente
    const lead = leads.find(l => l.id === leadId);
    const currentStatus = getLeadStatus(leadId, lead?.status);

    // No permitir cambiar de cliente a otro estado
    if (currentStatus === 'cliente' && uiStatus !== 'cliente') {
      toast.error('No se puede cambiar un Lead desde Cliente a otro estado');
      return;
    }

    // Si el nuevo estado es "cliente", mostrar el modal de validación
    if (uiStatus === 'cliente') {
      setPendingStatusChange({ leadId, uiStatus });
      setValidationCode('');
      setIsCodeValid(false);
      setShowCodeModal(true);
      return;
    }

    // Para otros estados, proceder normalmente
    applyStatusChange(leadId, uiStatus);
  };

  // Función para aplicar el cambio de estado después de la validación
  const applyStatusChange = (leadId, uiStatus) => {
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

  // Verificar el código de validación (simularemos validación)
  const validateCode = () => {
    if (!validationCode) {
      toast.error('Ingrese un código de validación');
      return;
    }

    setIsValidating(true);

    // Simulamos una validación con el backend (código correcto: "123456")
    setTimeout(() => {
      const isValid = validationCode === '123456';
      setIsCodeValid(isValid);

      if (isValid) {
        toast.success('Código validado correctamente');
      } else {
        toast.error('Código de validación incorrecto');
      }

      setIsValidating(false);
    }, 1000);
  };

  // Confirmar el cambio de estado después de validar el código
  const confirmStatusChange = () => {
    if (!isCodeValid) {
      toast.error('Debe validar el código correctamente');
      return;
    }

    if (pendingStatusChange) {
      const { leadId, uiStatus } = pendingStatusChange;
      applyStatusChange(leadId, uiStatus);

      // Limpiar estado del modal
      setPendingStatusChange(null);
      setShowCodeModal(false);
      setValidationCode('');
      setIsCodeValid(false);

      toast.success('Lead actualizado a estado Cliente');
    }
  };

  // Cancelar el cambio de estado
  const cancelStatusChange = () => {
    setPendingStatusChange(null);
    setShowCodeModal(false);
    setValidationCode('');
    setIsCodeValid(false);
  };

  // Manejo del cambio de newsletter
  const handleNewsletterChange = (leadId, checked) => {
    if (!leadId) {
      toast.error('No se pudo identificar el lead');
      return;
    }

    // Actualizar estado local para UI inmediata
    setLocalNewsletterState(prev => ({
      ...prev,
      [leadId]: checked
    }));

    // Marcar este lead como en proceso de actualización
    setUpdatingNewsletterLeads(prev => [...prev, leadId]);

    // Encontrar el lead actual para obtener su estado
    const lead = leads.find(l => l.id === leadId);
    if (!lead) {
      toast.error('No se pudo encontrar el lead');
      setUpdatingNewsletterLeads(prev => prev.filter(id => id !== leadId));
      return;
    }

    // Obtener el estado actual en formato backend
    const currentStatus = getBackendStatus(getLeadStatus(leadId, lead.status));

    // Mostrar toast de carga
    const toastId = toast.loading(
      `${checked ? 'Activando' : 'Desactivando'} newsletter...`
    );

    // Crear un payload minimal con los campos requeridos
    const payload = {
      newsletter: checked,
      status: currentStatus // Incluir el estado actual para evitar validación
    };

    // Realizar la petición directamente al backend
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL ||
        'https://play-attention.onrender.com/api'
      }/leads/${leadId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    )
      .then(async response => {
        if (!response.ok) {
          let errorMessage = '';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
          } catch (e) {
            errorMessage = (await response.text()) || response.statusText;
          }
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then(() => {
        // Actualizar toast a éxito
        toast.success(`Newsletter ${checked ? 'activado' : 'desactivado'}`, {
          id: toastId
        });

        // Si existe onNewsletterChange, llamarlo también
        if (typeof onNewsletterChange === 'function') {
          onNewsletterChange(leadId, checked);
        }
      })
      .catch(error => {
        console.error('Error al actualizar newsletter:', error);

        // Revertir cambio local si hay error
        setLocalNewsletterState(prev => {
          const updated = { ...prev };
          delete updated[leadId];
          return updated;
        });

        // Actualizar toast a error
        toast.error('Error al actualizar suscripción', {
          id: toastId,
          description: error.message
        });
      })
      .finally(() => {
        // Quitar el lead de la lista de actualizaciones en progreso
        setUpdatingNewsletterLeads(prev => prev.filter(id => id !== leadId));
      });
  };

  // Obtener el estado local o remoto del newsletter
  const getNewsletterStatus = (leadId, remoteStatus) => {
    return localNewsletterState[leadId] !== undefined
      ? localNewsletterState[leadId]
      : !!remoteStatus;
  };

  return (
    <div className='space-y-4'>
      {/* Vista de tabla - Desktop y tablets */}
      <div className='hidden md:block bg-white border rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <Table className='w-full text-xs md:text-sm'>
            <TableHeader>
              <TableRow>
                <TableHead className='whitespace-nowrap w-[15%]'>
                  Nombre
                </TableHead>
                <TableHead className='whitespace-nowrap w-[20%]'>
                  Contacto
                </TableHead>
                <TableHead className='whitespace-nowrap hidden xl:table-cell w-[10%]'>
                  Empresa
                </TableHead>
                <TableHead className='whitespace-nowrap hidden xl:table-cell w-[10%]'>
                  Origen
                </TableHead>
                <TableHead className='whitespace-nowrap w-[10%]'>
                  Tipo
                </TableHead>
                <TableHead className='whitespace-nowrap w-[15%]'>
                  Estado
                </TableHead>
                <TableHead className='whitespace-nowrap hidden lg:table-cell w-[10%]'>
                  Fecha
                </TableHead>
                <TableHead className='whitespace-nowrap text-center w-[10%]'>
                  News
                </TableHead>
                <TableHead className='whitespace-nowrap text-right pr-4 w-[80px] md:w-[100px]'>
                  Acción
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.map(lead => (
                <TableRow key={lead.id} className='hover:bg-gray-50'>
                  <TableCell className='max-w-[100px] md:max-w-[150px]'>
                    <div className='font-medium truncate'>{lead.name}</div>
                    <div className='text-[10px] md:text-xs text-muted-foreground truncate'>
                      {lead.position}
                    </div>
                  </TableCell>
                  <TableCell className='max-w-[120px] md:max-w-[180px]'>
                    <div className='space-y-1'>
                      <div className='flex items-center text-[10px] md:text-xs'>
                        <Mail className='h-3 w-3 mr-1 text-muted-foreground flex-shrink-0' />
                        <span className='truncate'>{lead.email}</span>
                      </div>
                      {lead.phone && (
                        <div className='flex items-center text-[10px] md:text-xs'>
                          <Phone className='h-3 w-3 mr-1 text-muted-foreground flex-shrink-0' />
                          <span className='truncate'>{lead.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='hidden xl:table-cell'>
                    <span className='text-[10px] md:text-xs truncate block max-w-[100px]'>
                      {lead.company || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className='hidden xl:table-cell'>
                    <span className='text-[10px] md:text-xs truncate block max-w-[100px]'>
                      {lead.source || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='scale-90 origin-left transform md:scale-100'>
                      {renderUserTypeBadge(lead.userType)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={getLeadStatus(lead.id, lead.status)}
                      onValueChange={value =>
                        handleStatusChange(lead.id, value)
                      }
                      disabled={
                        getLeadStatus(lead.id, lead.status) === 'cliente'
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          'h-7 md:h-8 px-1 md:px-2 text-[10px] md:text-xs border capitalize',
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
                              'capitalize text-xs',
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
                    <div className='flex items-center text-[10px] md:text-xs'>
                      <Calendar className='h-3 w-3 mr-1 text-muted-foreground flex-shrink-0' />
                      {formatDate(lead.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='flex justify-center items-center'>
                      <input
                        type='checkbox'
                        id={`newsletter-${lead.id}`}
                        checked={getNewsletterStatus(lead.id, lead.newsletter)}
                        onChange={e =>
                          handleNewsletterChange(lead.id, e.target.checked)
                        }
                        className='h-3 w-3 md:h-4 md:w-4 cursor-pointer accent-primary'
                        disabled={updatingNewsletterLeads.includes(lead.id)}
                        aria-label='Suscripción a newsletter'
                      />
                      {updatingNewsletterLeads.includes(lead.id) && (
                        <span className='ml-1 inline-block h-3 w-3'>
                          <LoadingSpinner
                            size={10}
                            className='border-primary'
                          />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onViewLead(lead.id)}
                      className='px-2 h-7 md:h-8 text-[10px] md:text-xs whitespace-nowrap w-[40px] sm:w-auto min-w-[40px] sm:min-w-[60px]'
                    >
                      <span className='hidden sm:inline'>Ver</span>
                      <ArrowRight className='h-3 w-3 sm:ml-1' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && totalLeads > 0 && sortedLeads.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className='text-center text-gray-500 py-4'
                  >
                    No hay leads en esta página.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Vista de tarjetas para móvil */}
      <div className='md:hidden space-y-3'>
        {sortedLeads.map(lead => (
          <div
            key={lead.id}
            className='bg-white border rounded-lg p-3 shadow-sm relative cursor-pointer hover:bg-gray-50 transition-colors duration-150'
            onClick={() => onViewLead(lead.id)}
          >
            <div className='flex justify-between items-start mb-2'>
              <div className='w-[60%]'>
                <h3 className='font-medium text-sm truncate'>{lead.name}</h3>
                {lead.position && (
                  <p className='text-xs text-muted-foreground truncate'>
                    {lead.position}
                  </p>
                )}
              </div>
              <div className='flex items-center gap-2'>
                <div
                  className='flex items-center'
                  onClick={e => e.stopPropagation()}
                >
                  <label className='flex items-center cursor-pointer text-xs mr-1'>
                    <input
                      type='checkbox'
                      checked={getNewsletterStatus(lead.id, lead.newsletter)}
                      onChange={e =>
                        handleNewsletterChange(lead.id, e.target.checked)
                      }
                      className='h-3 w-3 mr-1 accent-primary'
                      aria-label='Suscripción a newsletter'
                    />
                    <span className='hidden xs:inline'>Newsletter</span>
                  </label>
                </div>
                <div
                  className='flex flex-shrink-0'
                  onClick={e => e.stopPropagation()} // Evitar que el click en el select propague al padre
                >
                  <Select
                    value={getLeadStatus(lead.id, lead.status)}
                    onValueChange={value => handleStatusChange(lead.id, value)}
                    disabled={getLeadStatus(lead.id, lead.status) === 'cliente'}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-7 px-1 text-xs border capitalize max-w-[100px]',
                        getStatusSelectClass(lead.id, lead.status)
                      )}
                      aria-label='Cambiar estado'
                    >
                      <SelectValue placeholder='Estado' />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_LEAD.map(estado => (
                        <SelectItem
                          key={estado.value}
                          value={estado.value}
                          className={cn(
                            'capitalize text-xs',
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
            </div>
            <div className='text-xs text-muted-foreground mb-6'>
              {lead.email && (
                <div className='flex items-center truncate'>
                  <Mail className='h-3 w-3 mr-1 text-muted-foreground flex-shrink-0' />
                  <span className='truncate'>{lead.email}</span>
                </div>
              )}
              {lead.phone && (
                <div className='flex items-center mt-1 truncate'>
                  <Phone className='h-3 w-3 mr-1 text-muted-foreground flex-shrink-0' />
                  <span className='truncate'>{lead.phone}</span>
                </div>
              )}
              {lead.source && (
                <div className='flex items-center mt-1 truncate'>
                  <ClipboardList className='h-3 w-3 mr-1 text-muted-foreground flex-shrink-0' />
                  <span className='truncate'>Origen: {lead.source}</span>
                </div>
              )}
            </div>
            <div className='absolute bottom-2 right-2 text-xs text-primary flex items-center opacity-70'>
              <span className='mr-1'>Ver detalle</span>
              <ArrowRight className='h-3 w-3 flex-shrink-0' />
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

      {/* Modal de validación de código */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Validación requerida</DialogTitle>
            <DialogDescription>
              Para cambiar el estado a Cliente, necesitas ingresar un código de
              validación dado por Play Attention.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='flex flex-col gap-2'>
              <Input
                id='validation-code'
                placeholder='Ingrese el código'
                className='col-span-3'
                value={validationCode}
                onChange={e => setValidationCode(e.target.value)}
                disabled={isValidating || isCodeValid}
              />
              {!isCodeValid && (
                <Button
                  type='button'
                  variant='secondary'
                  onClick={validateCode}
                  disabled={isValidating || !validationCode}
                  className='w-full'
                >
                  {isValidating ? (
                    <>
                      <LoadingSpinner size='sm' className='mr-2' />
                      Validando...
                    </>
                  ) : (
                    'Validar Código'
                  )}
                </Button>
              )}

              {isCodeValid && (
                <div className='flex items-center text-green-600 text-sm'>
                  <CheckCircle className='h-4 w-4 mr-1' />
                  Código validado correctamente
                </div>
              )}
            </div>
          </div>

          <DialogFooter className='flex space-x-2 justify-end'>
            <Button variant='outline' onClick={cancelStatusChange}>
              Cancelar
            </Button>
            <Button
              type='button'
              onClick={confirmStatusChange}
              disabled={!isCodeValid}
            >
              Confirmar Cambio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
