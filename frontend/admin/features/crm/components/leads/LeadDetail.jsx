'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  ClipboardList,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { leadStatusConfig } from '../../lib/config/ui-config';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

/**
 * Componente para mostrar el detalle de un lead
 * Sigue SRP al encargarse solo de mostrar la información detallada de un lead
 */
export default function LeadDetail({ lead, isLoading }) {
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
            <div>
              <div className='text-xs text-muted-foreground'>Estado</div>
              <div className='text-right'>{renderStatusBadge(lead.status)}</div>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            {/* Email */}
            <div className='border-b'>
              <div className='flex py-4 px-6'>
                <div className='w-1/4 text-muted-foreground text-sm'>Email</div>
                <div className='w-3/4 flex'>
                  <Mail className='h-4 w-4 mr-2 text-muted-foreground' />
                  <span>{lead.email}</span>
                </div>
              </div>
            </div>

            {/* Teléfono */}
            {lead.phone && (
              <div className='border-b'>
                <div className='flex py-4 px-6'>
                  <div className='w-1/4 text-muted-foreground text-sm'>
                    Teléfono
                  </div>
                  <div className='w-3/4 flex'>
                    <Phone className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span>{lead.phone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Empresa */}
            {lead.company && (
              <div className='border-b'>
                <div className='flex py-4 px-6'>
                  <div className='w-1/4 text-muted-foreground text-sm'>
                    Empresa
                  </div>
                  <div className='w-3/4 flex'>
                    <Building className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span>{lead.company}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cargo */}
            {lead.position && (
              <div className='border-b'>
                <div className='flex py-4 px-6'>
                  <div className='w-1/4 text-muted-foreground text-sm'>
                    Cargo
                  </div>
                  <div className='w-3/4 flex'>
                    <User className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span>{lead.position}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Origen */}
            {lead.source && (
              <div className='border-b'>
                <div className='flex py-4 px-6'>
                  <div className='w-1/4 text-muted-foreground text-sm'>
                    Origen
                  </div>
                  <div className='w-3/4 flex'>
                    <User className='h-4 w-4 mr-2 text-muted-foreground' />
                    <span>{lead.source}</span>
                  </div>
                </div>
              </div>
            )}

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
              <div className='flex items-center'>
                <ClipboardList className='h-4 w-4 mr-2 text-muted-foreground' />
                <CardTitle className='text-base'>Notas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='p-6'>
              {lead.notes ? (
                <div>{lead.notes}</div>
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
                  <MessageSquare className='h-4 w-4 mr-2' />
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
              <div className='flex items-center'>
                <Skeleton className='h-4 w-4 rounded-full mr-2' />
                <Skeleton className='h-5 w-24' />
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
