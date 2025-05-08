'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import FAQ from './components/FAQ';
import SupportTabs from './components/SupportTabs';
import CreateTicketDialog from './components/CreateTicketDialog';
import useTickets from './hooks/useTickets';
import { Button } from '@/shared/ui/button';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';
import { toast } from 'sonner';

export default function SupportPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [ticketFilters, setTicketFilters] = useState({
    page: 1,
    take: 500,
    sort_by: 'created_at',
    order: 'desc'
  });

  const {
    tickets,
    meta,
    selectedTicket,
    loading,
    error,
    isCreating,
    createTicket,
    selectTicket,
    setSelectedTicket
  } = useTickets({ filters: ticketFilters });

  // Efecto para manejar parámetros de URL
  useEffect(() => {
    // Verificar si hay un ticketId en la URL
    const ticketId = searchParams.get('ticketId');
    const view = searchParams.get('view');

    if (ticketId && view === 'chat') {
      // Cargar el ticket específico y mostrar su detalle
      selectTicket(ticketId)
        .then(() => {
          setShowTicketDetail(true);
          // Asegurarse de que estamos en la pestaña de "Mis tickets"
          setActiveTab(1);
        })
        .catch(err => {
          console.error('Error al cargar el ticket:', err);
        });
    }
  }, [searchParams, selectTicket]);

  const handleCreateTicket = async data => {
    try {
      await createTicket(data);
      // Close modal immediately on success
      setIsCreateDialogOpen(false);
      // Show success toast
      toast.success('Ticket creado exitosamente', {
        description: 'Tu solicitud ha sido enviada al equipo de soporte'
      });
      return { success: true };
    } catch (error) {
      toast.error('Error al crear el ticket', {
        description:
          error.message || 'No se pudo crear el ticket, intenta nuevamente'
      });
      return {
        success: false,
        error: error.message || 'Error al crear el ticket'
      };
    }
  };

  const handleViewTicket = ticketId => {
    // Actualizar la URL cuando se ve un ticket específico
    const newUrl = `/support?view=chat&ticketId=${ticketId}`;
    router.push(newUrl, { scroll: false });

    selectTicket(ticketId);
    setShowTicketDetail(true);
  };

  const handleBackToList = () => {
    // Volver a la URL base al regresar a la lista
    router.push('/support', { scroll: false });

    setShowTicketDetail(false);
    setSelectedTicket(null);
  };

  const handleContactSupport = () => {
    setIsCreateDialogOpen(true);
  };

  const handleFilterChange = newFilters => {
    setTicketFilters(prev => ({
      ...prev,
      ...newFilters,
      take: 500
    }));
  };

  // Manejar cambio de pestaña
  const handleTabChange = index => {
    setActiveTab(index);
  };

  return (
    <div className='container mx-auto px-2 md:px-4 py-3 md:py-6 max-w-6xl'>
      <div className='mb-3 md:mb-6'>
        <h1 className='text-xl md:text-2xl font-bold'>Soporte</h1>
        <p className='text-sm md:text-base text-gray-500'>
          Tickets y preguntas frecuentes para asistencia técnica
        </p>
      </div>

      {showTicketDetail ? (
        <div className='md:mt-4'>
          <TicketDetail
            ticket={selectedTicket}
            onBack={handleBackToList}
            onEdit={() => {}} // Implement edit functionality if needed
          />
        </div>
      ) : (
        <>
          <SupportTabs defaultTab={activeTab} onTabChange={handleTabChange}>
            <SupportTabs.TabPanel label='Preguntas frecuentes'>
              <div className='mt-2 md:mt-4'>
                <FAQ onContactSupport={handleContactSupport} />
              </div>
            </SupportTabs.TabPanel>
            <SupportTabs.TabPanel label='Mis tickets'>
              <div className='mt-2 md:mt-4'>
                {loading ? (
                  <div className='flex justify-center items-center h-40'>
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <div className='text-center py-6 md:py-10'>
                    <p className='text-red-500'>{error}</p>
                    <Button
                      variant='outline'
                      onClick={() => window.location.reload()}
                      className='mt-4'
                    >
                      Reintentar
                    </Button>
                  </div>
                ) : (
                  <TicketList
                    tickets={tickets}
                    meta={meta}
                    onCreateTicket={() => setIsCreateDialogOpen(true)}
                    onViewTicket={handleViewTicket}
                    onFilterChange={handleFilterChange}
                    currentFilters={ticketFilters}
                  />
                )}
              </div>
            </SupportTabs.TabPanel>
          </SupportTabs>

          <CreateTicketDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={handleCreateTicket}
            isSubmitting={isCreating}
          />
        </>
      )}
    </div>
  );
}
