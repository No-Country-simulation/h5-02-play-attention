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
  ClipboardList,
  ArrowLeft
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { leadStatusConfig } from '../../lib/config/ui-config';
import { cn } from '@/shared/lib/utils';

/**
 * Componente para mostrar el detalle de un lead
 * Sigue SRP al encargarse solo de mostrar la información detallada de un lead
 */
export default function LeadDetail({ lead, onBack, isLoading }) {
  // Mostrar loading si estamos cargando el lead
  if (isLoading) {
    return (
      <Card className='w-full'>
        <CardHeader className='pb-4'>
          <CardTitle>Cargando información del lead...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Si no hay lead, mostrar mensaje
  if (!lead) {
    return (
      <Card className='w-full'>
        <CardHeader className='pb-4'>
          <CardTitle>Lead no encontrado</CardTitle>
          <CardDescription>
            No se pudo encontrar la información solicitada.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={onBack}
            variant='outline'
            className='w-full sm:w-auto'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver a la lista
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Formatear fecha
  const formatDate = date => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: es });
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
    <Card className='w-full'>
      <CardHeader className='pb-4'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
          <div>
            <CardTitle className='text-2xl'>{lead.name}</CardTitle>
            <CardDescription className='mt-1'>
              {lead.position} {lead.company ? `en ${lead.company}` : ''}
            </CardDescription>
          </div>
          <div className='flex flex-col sm:items-end gap-2'>
            <div className='pl-4 border-l'>
              <p className='text-sm text-muted-foreground'>Estado</p>
              <div className='mt-1'>{renderStatusBadge(lead.status)}</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Información de contacto */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Información de contacto</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <span>{lead.email}</span>
            </div>
            {lead.phone && (
              <div className='flex items-center gap-2'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <span>{lead.phone}</span>
              </div>
            )}
            {lead.company && (
              <div className='flex items-center gap-2'>
                <Building className='h-4 w-4 text-muted-foreground' />
                <span>{lead.company}</span>
              </div>
            )}
            {lead.location && (
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4 text-muted-foreground' />
                <span>{lead.location}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Detalles adicionales */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Detalles adicionales</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span>Creado: {formatDate(lead.createdAt)}</span>
            </div>
            {lead.updatedAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span>Actualizado: {formatDate(lead.updatedAt)}</span>
              </div>
            )}
            {lead.source && (
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4 text-muted-foreground' />
                <span>Origen: {lead.source}</span>
              </div>
            )}
            {lead.lastContact && (
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span>Último contacto: {formatDate(lead.lastContact)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notas */}
        {lead.notes && (
          <>
            <Separator />
            <div className='space-y-4'>
              <h3 className='text-lg font-medium flex items-center gap-2'>
                <ClipboardList className='h-4 w-4' />
                Notas
              </h3>
              <div className='bg-muted p-4 rounded-md whitespace-pre-line'>
                {lead.notes}
              </div>
            </div>
          </>
        )}

        {/* Etiquetas */}
        {lead.tags && lead.tags.length > 0 && (
          <Alert className='mt-4'>
            <AlertDescription>
              <span className='font-medium'>Etiquetas: </span>
              <div className='flex flex-wrap gap-2 mt-2'>
                {lead.tags.map(tag => (
                  <Badge key={tag} variant='outline' className='bg-muted'>
                    {tag}
                  </Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className='pt-6 flex flex-wrap gap-4'>
        <Button onClick={onBack} variant='outline'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver a la lista
        </Button>

        {/* Aquí pueden ir más botones de acciones */}
      </CardFooter>
    </Card>
  );
}
