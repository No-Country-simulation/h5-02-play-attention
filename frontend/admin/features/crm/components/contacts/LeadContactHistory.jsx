'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Mail,
  Phone,
  Users,
  MessageCircle,
  FileText,
  CalendarClock
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { contactTypeConfig } from '../../lib/config/ui-config';
import { cn } from '@/shared/lib/utils';
import { mockContactHistory } from '../../lib/config/mock-data';

/**
 * Componente para mostrar el historial de contactos de un lead
 * Sigue el principio de responsabilidad única (SRP) centrándose solo en mostrar contactos
 */
export default function LeadContactHistory({ leadId, onAddContact }) {
  const [contactHistory, setContactHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el historial de contactos al montar el componente
  useEffect(() => {
    const loadContactHistory = async () => {
      setIsLoading(true);
      try {
        // Simular carga con un retraso
        await new Promise(resolve => setTimeout(resolve, 500));

        // Filtrar contactos por leadId
        const filteredContacts = mockContactHistory.filter(
          contact => contact.leadId === leadId
        );

        setContactHistory(filteredContacts);
      } catch (error) {
        console.error('Error al cargar el historial de contactos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (leadId) {
      loadContactHistory();
    }
  }, [leadId]);

  // Formatear la fecha
  const formatDate = date => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  // Renderizar icono según tipo de contacto
  const renderContactIcon = type => {
    const iconMap = {
      email: Mail,
      call: Phone,
      meeting: Users,
      message: MessageCircle,
      note: FileText
    };

    const Icon = iconMap[type] || FileText;
    return <Icon className='h-4 w-4' />;
  };

  // Renderizar badge de tipo de contacto
  const renderContactType = type => {
    const config = contactTypeConfig[type] || {
      variant: 'outline',
      className: 'bg-neutral-light text-neutral border-neutral',
      label: type || 'Nota'
    };

    return (
      <Badge
        variant={config.variant}
        className={cn(config.className, 'capitalize')}
      >
        {renderContactIcon(type)}
        <span className='ml-1'>{config.label}</span>
      </Badge>
    );
  };

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de contactos</CardTitle>
          <CardDescription>Cargando historial...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[1, 2, 3].map(i => (
              <div key={i} className='flex flex-col space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div>
          <CardTitle>Historial de contactos</CardTitle>
          <CardDescription>
            Registro de comunicaciones con el lead
          </CardDescription>
        </div>
        <Button onClick={onAddContact} size='sm'>
          Registrar contacto
        </Button>
      </CardHeader>
      <CardContent>
        {contactHistory.length === 0 ? (
          <div className='py-6 text-center text-gray-500'>
            No hay registros de contactos
          </div>
        ) : (
          <div className='relative space-y-4'>
            {/* Línea de tiempo vertical */}
            <div className='absolute top-0 bottom-0 left-4 w-px bg-gray-200'></div>

            {contactHistory.map((contact, index) => (
              <div key={contact.id} className='relative pl-10'>
                {/* Punto en línea de tiempo */}
                <div className='absolute top-1 left-[9px] h-6 w-6 -translate-x-1/2 transform rounded-full border-4 border-white bg-gray-100'></div>

                <div className='rounded-lg border bg-card p-4'>
                  <div className='mb-2 flex items-center justify-between'>
                    <div>
                      {renderContactType(contact.type)}
                      <span className='ml-2 text-sm text-gray-500'>
                        por {contact.user}
                      </span>
                    </div>
                    <div className='flex items-center text-sm text-gray-500'>
                      <CalendarClock className='h-3.5 w-3.5 mr-1' />
                      {formatDate(contact.date)}
                    </div>
                  </div>

                  <div className='text-lg font-medium'>{contact.subject}</div>
                  <p className='mt-1 text-gray-600'>{contact.content}</p>

                  {contact.outcome && (
                    <div className='mt-2 text-sm'>
                      <span className='font-medium'>Resultado: </span>
                      {contact.outcome}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
