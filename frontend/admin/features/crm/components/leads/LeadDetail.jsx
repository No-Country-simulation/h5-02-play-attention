'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  ClipboardList,
  MessageSquare,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { Input } from '@/shared/ui/input';
import { leadStatusConfig } from '../../lib/config/ui-config';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';
import { FaWhatsapp } from 'react-icons/fa';
import { useUpdateLead } from '../../lib/hooks/useLeads';

/**
 * Componente para mostrar el detalle de un lead
 * Sigue SRP al encargarse solo de mostrar la información detallada de un lead
 */
export default function LeadDetail({ lead, isLoading, onLeadUpdate }) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [localNotes, setLocalNotes] = useState('');

  // Estado para edición de información del lead
  const [editingInfo, setEditingInfo] = useState(false);
  const [leadInfo, setLeadInfo] = useState({
    email: '',
    phone: '',
    company: '',
    position: '',
    source: ''
  });

  // Inicializar el hook de mutación
  const updateLeadMutation = useUpdateLead(lead?.id);

  // Inicializar notas y datos locales cuando el lead cambia
  useEffect(() => {
    if (lead) {
      setLocalNotes(lead.notes || '');
      setLeadInfo({
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        position: lead.position || '',
        source: lead.source || ''
      });
    }
  }, [lead]);

  // Iniciar edición de notas
  const handleEditNotes = () => {
    setNotesValue(localNotes || lead?.notes || '');
    setEditingNotes(true);
  };

  // Iniciar edición de información del lead
  const handleEditInfo = () => {
    setLeadInfo({
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      position: lead.position || '',
      source: lead.source || ''
    });
    setEditingInfo(true);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingNotes(false);
  };

  // Cancelar edición de información
  const handleCancelEditInfo = () => {
    setEditingInfo(false);
  };

  // Guardar notas
  const handleSaveNotes = async () => {
    // Mostrar toast de carga
    const toastId = toast.loading('Guardando notas...');
    setIsSaving(true);

    try {
      // Mapear el estado del frontend al formato del backend
      const statusMap = {
        nuevo: 'Nuevo',
        proceso: 'Activo',
        cliente: 'Cliente'
      };

      // Asegurar que el estado sea uno de los valores aceptados por el backend
      const backendStatus = statusMap[lead.status] || 'Nuevo';

      // Preparar el payload con los campos necesarios para el backend
      const updateData = {
        fullname: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        service:
          lead.userType === 'persona'
            ? 'Persona individual'
            : lead.userType === 'profesional'
            ? 'Profesional'
            : 'Empresa',
        notes: notesValue, // El backend usa "notes" y no "message"
        status: backendStatus, // Debe ser Nuevo, Activo o Cliente
        origen: lead.source || '',
        relation: lead.position || ''
      };

      // Usar la mutación de React Query para actualizar
      await updateLeadMutation.mutateAsync(updateData);

      // Actualizar notas localmente
      setLocalNotes(notesValue);
      setEditingNotes(false);

      // Actualizar toast a éxito
      toast.success('Notas actualizadas correctamente', {
        id: toastId,
        description: 'Los cambios se han guardado en el sistema'
      });

      // Actualizar el lead en el componente padre si existe la función
      if (onLeadUpdate) {
        onLeadUpdate({ ...lead, notes: notesValue });
      }
    } catch (error) {
      console.error('Error al actualizar notas:', error);
      // Actualizar toast a error
      toast.error('Error al guardar las notas', {
        id: toastId,
        description:
          error.message || 'Ha ocurrido un error al procesar la solicitud'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar información del lead
  const handleSaveInfo = async () => {
    // Mostrar toast de carga
    const toastId = toast.loading('Guardando información...');
    setIsSaving(true);

    try {
      // Mapear el estado del frontend al formato del backend
      const statusMap = {
        nuevo: 'Nuevo',
        proceso: 'Activo',
        cliente: 'Cliente'
      };

      // Asegurar que el estado sea uno de los valores aceptados por el backend
      const backendStatus = statusMap[lead.status] || 'Nuevo';

      // Preparar el payload con los campos necesarios para el backend
      const updateData = {
        fullname: lead.name || '',
        email: leadInfo.email,
        phone: leadInfo.phone,
        company: leadInfo.company,
        service:
          lead.userType === 'persona'
            ? 'Persona individual'
            : lead.userType === 'profesional'
            ? 'Profesional'
            : 'Empresa',
        notes: lead.notes || '',
        status: backendStatus, // Debe ser Nuevo, Activo o Cliente
        origen: leadInfo.source,
        relation: leadInfo.position
      };

      // Usar la mutación de React Query para actualizar
      await updateLeadMutation.mutateAsync(updateData);

      setEditingInfo(false);

      // Actualizar el lead en el componente padre si existe la función
      if (onLeadUpdate) {
        onLeadUpdate({
          ...lead,
          email: leadInfo.email,
          phone: leadInfo.phone,
          company: leadInfo.company,
          position: leadInfo.position,
          source: leadInfo.source
        });
      }

      // Actualizar toast a éxito
      toast.success('Información actualizada correctamente', {
        id: toastId,
        description: 'Los cambios se han guardado en el sistema'
      });
    } catch (error) {
      console.error('Error al actualizar información:', error);
      // Actualizar toast a error
      toast.error('Error al guardar la información', {
        id: toastId,
        description:
          error.message || 'Ha ocurrido un error al procesar la solicitud'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Mostrar loading si estamos cargando el lead
  if (isLoading) {
    return <LeadSkeleton />;
  }

  // Si no hay lead, mostrar mensaje
  if (!lead) {
    return (
      <Card className='w-full'>
        <CardHeader className='pb-3'>
          <CardTitle>Lead no encontrado</CardTitle>
        </CardHeader>
        <CardContent>
          No se pudo encontrar la información solicitada.
        </CardContent>
      </Card>
    );
  }

  // Formatear fecha
  const formatDate = date => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  // Renderizar el badge de estado según la configuración
  const renderStatusBadge = status => {
    const config = leadStatusConfig[status] || {
      variant: 'outline',
      className: 'bg-neutral-light text-neutral border-neutral',
      label: status || 'Sin estado'
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

  return (
    <div className='space-y-0'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Información de contacto */}
        <Card className='w-full h-full lg:col-span-2'>
          <CardHeader className='pt-4 pb-4 px-6 flex justify-between items-center border-b'>
            <CardTitle className='text-base'>Información de contacto</CardTitle>
            <div className='flex items-center gap-2'>
              <div>
                <div className='text-xs text-muted-foreground'>Estado</div>
                <div className='text-right'>
                  {renderStatusBadge(lead.status)}
                </div>
              </div>
              {!editingInfo ? (
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-muted-foreground hover:text-white'
                  onClick={handleEditInfo}
                >
                  <Edit className='h-4 w-4' />
                  <span className='sr-only'>Editar información</span>
                </Button>
              ) : (
                <div className='flex gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-muted-foreground hover:text-destructive'
                    onClick={handleCancelEditInfo}
                    disabled={isSaving}
                  >
                    <X className='h-4 w-4' />
                    <span className='sr-only'>Cancelar</span>
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-muted-foreground hover:text-primary'
                    onClick={handleSaveInfo}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                    ) : (
                      <Save className='h-4 w-4' />
                    )}
                    <span className='sr-only'>Guardar</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {/* Email */}
            <div className='border-b'>
              <div className='flex py-4 px-6'>
                <div className='w-1/4 text-muted-foreground text-sm'>Email</div>
                <div className='w-3/4 flex'>
                  <Mail className='h-4 w-4 mr-2 text-muted-foreground' />
                  {editingInfo ? (
                    <Input
                      value={leadInfo.email}
                      onChange={e =>
                        setLeadInfo({ ...leadInfo, email: e.target.value })
                      }
                      className='h-8 px-2'
                      disabled={isSaving}
                    />
                  ) : (
                    <span>{lead.email}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div className='border-b'>
              <div className='flex py-4 px-6'>
                <div className='w-1/4 text-muted-foreground text-sm'>
                  Teléfono
                </div>
                <div className='w-3/4 flex'>
                  <Phone className='h-4 w-4 mr-2 text-muted-foreground' />
                  {editingInfo ? (
                    <Input
                      value={leadInfo.phone}
                      onChange={e =>
                        setLeadInfo({ ...leadInfo, phone: e.target.value })
                      }
                      className='h-8 px-2'
                      disabled={isSaving}
                    />
                  ) : (
                    <span>{lead.phone || 'No disponible'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Empresa */}
            <div className='border-b'>
              <div className='flex py-4 px-6'>
                <div className='w-1/4 text-muted-foreground text-sm'>
                  Empresa
                </div>
                <div className='w-3/4 flex'>
                  <Building className='h-4 w-4 mr-2 text-muted-foreground' />
                  {editingInfo ? (
                    <Input
                      value={leadInfo.company}
                      onChange={e =>
                        setLeadInfo({ ...leadInfo, company: e.target.value })
                      }
                      className='h-8 px-2'
                      disabled={isSaving}
                    />
                  ) : (
                    <span>{lead.company || 'No disponible'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Cargo */}
            <div className='border-b'>
              <div className='flex py-4 px-6'>
                <div className='w-1/4 text-muted-foreground text-sm'>Cargo</div>
                <div className='w-3/4 flex'>
                  <User className='h-4 w-4 mr-2 text-muted-foreground' />
                  {editingInfo ? (
                    <Input
                      value={leadInfo.position}
                      onChange={e =>
                        setLeadInfo({ ...leadInfo, position: e.target.value })
                      }
                      className='h-8 px-2'
                      disabled={isSaving}
                    />
                  ) : (
                    <span>{lead.position || 'No disponible'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Origen */}
            <div className='border-b'>
              <div className='flex py-4 px-6'>
                <div className='w-1/4 text-muted-foreground text-sm'>
                  Origen
                </div>
                <div className='w-3/4 flex'>
                  <User className='h-4 w-4 mr-2 text-muted-foreground' />
                  {editingInfo ? (
                    <Input
                      value={leadInfo.source}
                      onChange={e =>
                        setLeadInfo({ ...leadInfo, source: e.target.value })
                      }
                      className='h-8 px-2'
                      disabled={isSaving}
                    />
                  ) : (
                    <span>{lead.source || 'No disponible'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className='px-6 pt-4 pb-4'>
              <div className='font-medium text-sm mb-4'>Fechas</div>

              {/* Creado */}
              <div className='mb-4'>
                <div className='flex'>
                  <div className='w-1/4 text-muted-foreground text-sm'>
                    Creado
                  </div>
                  <div className='w-3/4 flex'>
                    <Calendar className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actualizado */}
              {lead.updatedAt && (
                <div>
                  <div className='flex'>
                    <div className='w-1/4 text-muted-foreground text-sm'>
                      Actualizado
                    </div>
                    <div className='w-3/4 flex'>
                      <Calendar className='h-4 w-4 mr-2 text-muted-foreground' />
                      <span>{formatDate(lead.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Panel lateral */}
        <div className='space-y-6'>
          {/* Notas */}
          <Card className='w-full'>
            <CardHeader className='pt-4 pb-4 px-6 border-b'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <ClipboardList className='h-4 w-4 mr-2 text-muted-foreground' />
                  <CardTitle className='text-base'>Notas</CardTitle>
                </div>
                {!editingNotes ? (
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-muted-foreground hover:text-white'
                    onClick={handleEditNotes}
                  >
                    <Edit className='h-4 w-4' />
                    <span className='sr-only'>Editar notas</span>
                  </Button>
                ) : (
                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-muted-foreground hover:text-destructive'
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      <X className='h-4 w-4' />
                      <span className='sr-only'>Cancelar</span>
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-muted-foreground hover:text-primary'
                      onClick={handleSaveNotes}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <span className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                      ) : (
                        <Save className='h-4 w-4' />
                      )}
                      <span className='sr-only'>Guardar</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className='p-6'>
              {editingNotes ? (
                <Textarea
                  value={notesValue}
                  onChange={e => setNotesValue(e.target.value)}
                  placeholder='Añade notas sobre este lead...'
                  className='min-h-[100px] resize-none'
                  disabled={isSaving}
                />
              ) : localNotes ? (
                <div>{localNotes}</div>
              ) : (
                <p className='text-muted-foreground'>
                  No hay notas disponibles para este lead.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card className='w-full'>
            <CardHeader className='pt-4 pb-4 px-6 border-b'>
              <CardTitle className='text-base'>Acciones rápidas</CardTitle>
            </CardHeader>
            <CardContent className='p-6'>
              <div className='space-y-3'>
                <Button
                  className='w-full justify-start bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                  variant='outline'
                  onClick={() => {
                    if (lead.email) {
                      const subject = `Seguimiento - ${lead.name}`;
                      const body = `Hola ${
                        lead.name
                      },\n\nGracias por tu interés en nuestros servicios.\n\nSaludos cordiales,\n${
                        window.localStorage.getItem('userName') ||
                        'Equipo de ventas'
                      }`;
                      window.location.href = `mailto:${
                        lead.email
                      }?subject=${encodeURIComponent(
                        subject
                      )}&body=${encodeURIComponent(body)}`;
                    }
                  }}
                  disabled={!lead.email}
                >
                  <Mail className='h-4 w-4 mr-2' />
                  Enviar email
                </Button>
                <Button
                  className='w-full justify-start bg-white text-green-600 hover:bg-green-50 hover:text-green-700 border border-gray-200'
                  variant='outline'
                  onClick={() => {
                    if (lead.phone) {
                      const formattedPhone = lead.phone
                        .replace(/\s+/g, '')
                        .replace(/[()-]/g, '');
                      window.open(`https://wa.me/${formattedPhone}`, '_blank');
                    }
                  }}
                  disabled={!lead.phone}
                >
                  <FaWhatsapp className='h-4 w-4 mr-2' />
                  WhatsApp
                </Button>
                <Button
                  className='w-full justify-start bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
                  variant='outline'
                >
                  <Calendar className='h-4 w-4 mr-2' />
                  Agendar reunión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Skeleton para carga
function LeadSkeleton() {
  return (
    <div className='space-y-0'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Skeleton para información principal */}
        <Card className='w-full h-full lg:col-span-2'>
          <CardHeader className='pt-4 pb-4 px-6 border-b'>
            <div className='flex justify-between'>
              <Skeleton className='h-5 w-48' />
              <Skeleton className='h-6 w-20' />
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {/* Campos principales */}
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className='border-b'>
                  <div className='flex py-4 px-6'>
                    <Skeleton className='h-4 w-24 mr-6' />
                    <div className='flex'>
                      <Skeleton className='h-4 w-4 rounded-full mr-2' />
                      <Skeleton className='h-4 w-36' />
                    </div>
                  </div>
                </div>
              ))}

            {/* Fechas */}
            <div className='px-6 pt-4 pb-4'>
              <Skeleton className='h-5 w-16 mb-4' />

              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className='mb-4'>
                    <div className='flex'>
                      <Skeleton className='h-4 w-24 mr-6' />
                      <div className='flex'>
                        <Skeleton className='h-4 w-4 rounded-full mr-2' />
                        <Skeleton className='h-4 w-36' />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Skeleton para panel lateral */}
        <div className='space-y-6'>
          {/* Skeleton para notas */}
          <Card>
            <CardHeader className='pt-4 pb-4 px-6 border-b'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <Skeleton className='h-4 w-4 rounded-full mr-2' />
                  <Skeleton className='h-5 w-24' />
                </div>
                <Skeleton className='h-8 w-8 rounded-full' />
              </div>
            </CardHeader>
            <CardContent className='p-6'>
              <Skeleton className='h-4 w-full mb-2' />
              <Skeleton className='h-4 w-5/6 mb-2' />
              <Skeleton className='h-4 w-4/6' />
            </CardContent>
          </Card>

          {/* Skeleton para acciones rápidas */}
          <Card>
            <CardHeader className='pt-4 pb-4 px-6 border-b'>
              <Skeleton className='h-5 w-32' />
            </CardHeader>
            <CardContent className='p-6'>
              <div className='space-y-3'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
