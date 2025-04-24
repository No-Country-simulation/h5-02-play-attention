'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  User,
  ClipboardList,
  ArrowLeft,
  CheckSquare,
  UserPlus
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import LeadContactHistory from '../contacts/LeadContactHistory';
import RegisterContactModal from '../contacts/RegisterContactModal';
import { mockLeads } from '../../lib/config/mock-data';
import PageHeader from '@/shared/ui/page-header';
import LeadDetail from './LeadDetail';

const statusMessages = {
  nuevo: { label: 'Nuevo', color: 'blue' },
  contactado: { label: 'Contactado', color: 'purple' },
  interesado: { label: 'Interesado', color: 'green' },
  no_interesado: { label: 'No interesado', color: 'red' },
  cliente: { label: 'Cliente', color: 'yellow' },
  inactivo: { label: 'Inactivo', color: 'gray' }
};

export default function LeadDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Cargar datos del lead al montar el componente
  useEffect(() => {
    const fetchLeadData = async () => {
      setIsLoading(true);
      try {
        // Simular carga de datos con una promesa
        await new Promise(resolve => setTimeout(resolve, 500));

        // Buscar el lead en los datos mock
        const foundLead = mockLeads.find(lead => lead.id === id);
        setLead(foundLead || null);
      } catch (error) {
        console.error('Error al cargar los datos del lead:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLeadData();
    }
  }, [id]);

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
    // Por ahora solo cerramos el modal
    setIsContactModalOpen(false);
  };

  return (
    <div className='container p-6 max-w-7xl mx-auto'>
      {/* Encabezado */}
      <div className='mb-6'>
        <Button variant='ghost' size='sm' onClick={handleBack} className='mb-4'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver a leads
        </Button>

        <PageHeader
          title={lead?.name || 'Detalle de lead'}
          description='Información detallada del lead y su historial de contactos'
        />
      </div>

      {/* Contenido principal */}
      <div className='space-y-6'>
        {/* Tabs para secciones de detalle */}
        <Tabs defaultValue='info' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='info'>Información</TabsTrigger>
            <TabsTrigger value='contacts'>Historial de contactos</TabsTrigger>
          </TabsList>

          <TabsContent value='info' className='space-y-6'>
            <LeadDetail lead={lead} onBack={handleBack} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value='contacts' className='space-y-6'>
            <LeadContactHistory
              leadId={id}
              onAddContact={handleOpenContactModal}
            />
          </TabsContent>
        </Tabs>
      </div>

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
