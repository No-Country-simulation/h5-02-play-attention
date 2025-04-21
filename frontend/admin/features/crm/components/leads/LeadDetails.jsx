'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import {
  PhoneOutgoing,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Edit,
  PlusCircle,
  ArrowLeft,
  UserPlusIcon,
  MessageSquareIcon,
  UserCheckIcon,
  PhoneCall,
  XIcon
} from 'lucide-react';
import { ScrollArea } from '@/shared/ui/scroll-area';
import RegisterContactModal from './RegisterContactModal';

// Mapeo de estados a colores de badge
const STATUS_BADGES = {
  nuevo: {
    color: 'bg-green-50',
    textColor: 'text-green-700',
    icon: UserPlusIcon
  },
  proceso: {
    color: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: MessageSquareIcon
  },
  cliente: {
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: UserCheckIcon
  },
  contactado: {
    color: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    icon: PhoneCall
  },
  perdido: {
    color: 'bg-red-50',
    textColor: 'text-red-700',
    icon: XIcon
  }
};

export default function LeadDetails({ lead }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  if (!lead) {
    return (
      <Card className='w-full'>
        <CardContent className='pt-6'>
          <p className='text-center text-muted-foreground'>
            No se ha seleccionado ningún lead
          </p>
        </CardContent>
      </Card>
    );
  }

  // Formatear fecha a formato local
  const formatDate = date => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMMM yyyy', { locale: es });
  };

  // Obtener iniciales para el avatar
  const getInitials = name => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Registrar un nuevo contacto
  const handleRegisterContact = contactData => {
    console.log('Nuevo contacto registrado:', contactData);
    // Aquí se enviaría la información al backend
    setIsContactModalOpen(false);
  };

  return (
    <>
      <Card className='w-full'>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <Button
              variant='ghost'
              size='icon'
              className='mb-2'
              onClick={() => window.history.back()}
            >
              <ArrowLeft className='h-4 w-4' />
            </Button>
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsContactModalOpen(true)}
              >
                <PhoneOutgoing className='mr-2 h-4 w-4' />
                Registrar Contacto
              </Button>
              <Button variant='outline' size='sm'>
                <Edit className='mr-2 h-4 w-4' />
                Editar Lead
              </Button>
            </div>
          </div>
          <div className='flex items-center'>
            <Avatar className='h-16 w-16 mr-4'>
              <AvatarFallback className='bg-primary text-primary-foreground'>
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className='text-2xl'>{lead.name}</CardTitle>
              <CardDescription className='flex items-center mt-1'>
                <Badge
                  className={`mr-2 ${STATUS_BADGES[lead.status]?.color} ${
                    STATUS_BADGES[lead.status]?.textColor
                  }`}
                >
                  {getStatusName(lead.status)}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className='pt-4'>
          <Tabs defaultValue='info'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='info'>Información</TabsTrigger>
              <TabsTrigger value='history'>Historial de Contactos</TabsTrigger>
            </TabsList>

            <TabsContent value='info'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      Contacto
                    </h3>
                    <ul className='mt-2 space-y-2'>
                      <li className='flex items-center'>
                        <Mail className='h-4 w-4 mr-2 text-muted-foreground' />
                        <a
                          href={`mailto:${lead.email}`}
                          className='text-primary hover:underline'
                        >
                          {lead.email}
                        </a>
                      </li>
                      <li className='flex items-center'>
                        <PhoneOutgoing className='h-4 w-4 mr-2 text-muted-foreground' />
                        <a
                          href={`tel:${lead.phone}`}
                          className='text-primary hover:underline'
                        >
                          {lead.phone}
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      Origen
                    </h3>
                    <p className='mt-1'>{lead.source || 'No especificado'}</p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      Fechas
                    </h3>
                    <ul className='mt-2 space-y-2'>
                      <li className='flex items-center'>
                        <Calendar className='h-4 w-4 mr-2 text-muted-foreground' />
                        <span>Creado: {formatDate(lead.createdAt)}</span>
                      </li>
                      <li className='flex items-center'>
                        <Clock className='h-4 w-4 mr-2 text-muted-foreground' />
                        <span>
                          Último contacto:{' '}
                          {formatDate(lead.lastContact) || 'Sin contactos'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <h3 className='text-sm font-medium text-muted-foreground'>
                  Notas
                </h3>
                <div className='mt-2 p-3 bg-muted rounded-md'>
                  <p className='text-sm whitespace-pre-wrap'>
                    {lead.notes || 'No hay notas disponibles para este lead.'}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='history'>
              {lead.contactHistory && lead.contactHistory.length > 0 ? (
                <ScrollArea className='h-[300px] mt-4'>
                  <div className='space-y-4'>
                    {lead.contactHistory.map((contact, index) => (
                      <Card key={index} className='border-l-4 border-l-primary'>
                        <CardHeader className='p-4 pb-2'>
                          <div className='flex justify-between items-center'>
                            <CardTitle className='text-sm font-medium'>
                              {contact.type}
                            </CardTitle>
                            <Badge variant='outline'>
                              {formatDate(contact.date)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className='p-4 pt-0'>
                          <p className='text-sm'>{contact.notes}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className='flex flex-col items-center justify-center p-8'>
                  <p className='text-muted-foreground mb-4'>
                    No hay registros de contacto para este lead
                  </p>
                  <Button onClick={() => setIsContactModalOpen(true)}>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Registrar Contacto
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <RegisterContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmit={handleRegisterContact}
        lead={lead}
      />
    </>
  );
}
