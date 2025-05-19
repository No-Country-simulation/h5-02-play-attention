'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { ArrowLeft } from 'lucide-react';
import LeadForm from '@/features/crm/components/leads/LeadForm';
import PageHeader from '@/shared/ui/page-header';

export default function EditLeadPage({ params }) {
  const router = useRouter();

  // En producción, aquí se obtendría el lead de la API
  const mockLead = {
    id: params.id,
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    phone: '+54 11 5555-1234',
    source: 'Sitio web',
    status: 'nuevo',
    priority: 'alta',
    notes: 'Interesado en el servicio premium para su empresa.'
  };

  const handleSubmit = async data => {
    // En producción, aquí se actualizaría el lead en la API

    // Simular retraso de API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Redirigir al detalle del lead
    router.push(`/crm/${params.id}`);
  };

  return (
    <div className='container mx-auto py-6 space-y-6'>
      <Button
        onClick={() => router.push(`/crm/${params.id}`)}
        variant='ghost'
        className='px-0'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Volver al detalle
      </Button>

      <PageHeader
        title='Editar Lead'
        description='Actualiza la información del lead'
      />

      <LeadForm lead={mockLead} onSubmit={handleSubmit} />
    </div>
  );
}
