'use client';
import React, { useState } from 'react';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import FAQ from './components/FAQ';
import SupportTabs from './components/SupportTabs';
import CreateTicketDialog from './components/CreateTicketDialog';
import useTickets from './hooks/useTickets';
import { Button } from '@/shared/ui/button';
import { LoadingSpinner } from '@/shared/ui/loading-spinner';

export default function SupportPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const {
    tickets,
    selectedTicket,
    loading,
    error,
    createTicket,
    selectTicket,
    setSelectedTicket
  } = useTickets();

  const handleCreateTicket = async data => {
    const result = await createTicket(data);
    if (result.success) {
      setIsCreateDialogOpen(false);
    }
    return result;
  };

  const handleViewTicket = ticketId => {
    selectTicket(ticketId);
    setShowTicketDetail(true);
  };

  const handleBackToList = () => {
    setShowTicketDetail(false);
    setSelectedTicket(null);
  };

  const handleContactSupport = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <div className='container mx-auto px-4 py-6 max-w-6xl'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Soporte</h1>
        <p className='text-gray-500'>
          Tickets y preguntas frecuentes para asistencia técnica
        </p>
      </div>

      {showTicketDetail ? (
        <TicketDetail
          ticket={selectedTicket}
          onBack={handleBackToList}
          onEdit={() => {}} // Implement edit functionality if needed
        />
      ) : (
        <>
          <SupportTabs defaultTab={0}>
            <SupportTabs.TabPanel label='Preguntas frecuentes'>
              <div className='mt-4'>
                <FAQ onContactSupport={handleContactSupport} />
              </div>
            </SupportTabs.TabPanel>
            <SupportTabs.TabPanel label='Mis tickets'>
              <div className='mt-4'>
                {loading ? (
                  <div className='flex justify-center items-center h-40'>
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <div className='text-center py-10'>
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
                    onCreateTicket={() => setIsCreateDialogOpen(true)}
                    onViewTicket={handleViewTicket}
                  />
                )}
              </div>
            </SupportTabs.TabPanel>
          </SupportTabs>

          <CreateTicketDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={handleCreateTicket}
          />
        </>
      )}
    </div>
  );
}
