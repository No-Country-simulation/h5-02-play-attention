'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
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
    <div className='space-y-6'>
      {/* Información principal */}
      <Card className='w-full'>
        <CardHeader className='pb-3 border-b'>
          <div className='flex justify-between items-center'>
            <CardTitle className='text-lg'>Información de contacto</CardTitle>
            <div>
              <span className='text-sm text-muted-foreground'>Estado</span>
              <div className='mt-1 text-right'>
                {renderStatusBadge(lead.status)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          {/* Datos de contacto */}
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              <InfoItem
                icon={<Mail className='h-4 w-4' />}
                label='Email'
                value={lead.email}
              />
              {lead.phone && (
                <InfoItem
                  icon={<Phone className='h-4 w-4' />}
                  label='Teléfono'
                  value={lead.phone}
                />
              )}
              {lead.company && (
                <InfoItem
                  icon={<Building className='h-4 w-4' />}
                  label='Empresa'
                  value={lead.company}
                />
              )}
              {lead.position && (
                <InfoItem
                  icon={<User className='h-4 w-4' />}
                  label='Cargo'
                  value={lead.position}
                />
              )}
              {lead.location && (
                <InfoItem
                  icon={<MapPin className='h-4 w-4' />}
                  label='Ubicación'
                  value={lead.location}
                />
              )}
              {lead.source && (
                <InfoItem
                  icon={<User className='h-4 w-4' />}
                  label='Origen'
                  value={lead.source}
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Fechas */}
          <div className='p-6'>
            <h3 className='text-sm font-medium mb-3'>Fechas</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              <InfoItem
                icon={<Calendar className='h-4 w-4' />}
                label='Creado'
                value={formatDate(lead.createdAt)}
              />
              {lead.updatedAt && (
                <InfoItem
                  icon={<Calendar className='h-4 w-4' />}
                  label='Actualizado'
                  value={formatDate(lead.updatedAt)}
                />
              )}
              {lead.lastContact && (
                <InfoItem
                  icon={<Calendar className='h-4 w-4' />}
                  label='Último contacto'
                  value={formatDate(lead.lastContact)}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      {lead.notes && (
        <Card className='w-full'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg flex items-center gap-2'>
              <ClipboardList className='h-4 w-4' />
              Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='whitespace-pre-line'>{lead.notes}</div>
          </CardContent>
        </Card>
      )}

      {/* Etiquetas */}
      {lead.tags && lead.tags.length > 0 && (
        <Card className='w-full'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg'>Etiquetas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {lead.tags.map(tag => (
                <Badge key={tag} variant='outline' className='bg-muted'>
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Componente para mostrar cada elemento de información
function InfoItem({ icon, label, value }) {
  return (
    <div className='flex flex-col'>
      <span className='text-xs text-muted-foreground mb-1'>{label}</span>
      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground'>{icon}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}

// Skeleton para carga
function LeadSkeleton() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='pb-3 border-b'>
          <div className='flex justify-between'>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-6 w-20' />
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className='flex flex-col'>
                    <Skeleton className='h-3 w-16 mb-1' />
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-4 w-4 rounded-full' />
                      <Skeleton className='h-5 w-36' />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <Separator />

          <div className='p-6'>
            <Skeleton className='h-5 w-24 mb-3' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className='flex flex-col'>
                    <Skeleton className='h-3 w-16 mb-1' />
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-4 w-4 rounded-full' />
                      <Skeleton className='h-5 w-36' />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
