'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Info,
  MessageSquare,
  Calendar,
  Mail,
  Phone,
  User,
  Building,
  MapPin
} from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';

import LeadContactHistory from '../contacts/LeadContactHistory';
import RegisterContactModal from '../contacts/RegisterContactModal';
import LeadDetail from './LeadDetail';
import { useLead } from '../../lib/hooks/useLeads';

export default function LeadDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Obtener datos del lead desde el backend usando React Query
  const { data: lead, isLoading, isError, error } = useLead(id);

  // Navegar hacia atrás
  const handleBack = () => {
    router.push('/crm?tab=list');
  };

  // Abrir modal para registrar contacto
  const handleOpenContactModal = () => {
    setIsContactModalOpen(true);
  };

  // Cerrar modal
  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  // Funcionalidad para guardar el contacto
  const handleSaveContact = contactData => {
    console.log('Guardando nuevo contacto:', contactData);
    // Aquí se implementaría la lógica para guardar el contacto en la API
    setIsContactModalOpen(false);
  };

  // Formatear fecha
  const formatDate = date => {
    if (!date) return '';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: es });
    } catch (e) {
      return '';
    }
  };

  // Mostrar error si no se pudo cargar el lead
  if (isError) {
    return (
      <div className='container p-6 max-w-7xl mx-auto'>
        <Button variant='ghost' size='sm' onClick={handleBack} className='mb-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver a leads
        </Button>

        <Card className='p-6 bg-red-50 border-red-200'>
          <div className='flex flex-col items-center text-center gap-4'>
            <h2 className='text-xl font-semibold text-red-600'>
              Error al cargar el lead
            </h2>
            <p className='text-red-500'>
              {error?.message || 'No se pudo obtener la información del lead'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='container py-4 px-2 md:p-6 max-w-7xl mx-auto'>
      {/* Encabezado con nombre y botón de volver */}
      <div className='flex flex-col mb-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleBack}
          className='mb-2 w-fit'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver a leads
        </Button>

        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
          <div>
            <h1 className='text-2xl font-semibold'>
              {isLoading ? (
                <LoadingSpinner
                  text=''
                  showText={false}
                  size={16}
                  spinnerColor='border-primary/50'
                  className='inline mr-2'
                />
              ) : (
                lead?.name || 'Detalle de lead'
              )}
            </h1>
            {!isLoading && lead && (
              <p className='text-muted-foreground text-sm mt-0.5'>
                {formatDate(lead.createdAt)}
                {lead.status && (
                  <span className='ml-2 inline-flex'>
                    • <span className='ml-1'>{lead.status}</span>
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs para secciones de detalle */}
      <Tabs defaultValue='información' className='w-full'>
        <TabsList className='mb-6'>
          <TabsTrigger
            value='información'
            className='flex items-center gap-1.5'
          >
            <Info className='h-4 w-4' />
            <span>Información</span>
          </TabsTrigger>
          <TabsTrigger value='contactos' className='flex items-center gap-1.5'>
            <MessageSquare className='h-4 w-4' />
            <span>Contactos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='información' className='space-y-4 mt-2'>
          <LeadDetail lead={lead} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value='contactos' className='space-y-4 mt-2'>
          <LeadContactHistory
            leadId={id}
            onAddContact={handleOpenContactModal}
          />
        </TabsContent>
      </Tabs>

      {/* Modal para registrar contacto */}
      {lead && (
        <RegisterContactModal
          isOpen={isContactModalOpen}
          onClose={handleCloseContactModal}
          onSave={handleSaveContact}
          leadName={lead.name}
          leadId={lead.id}
        />
      )}
    </div>
  );
}
