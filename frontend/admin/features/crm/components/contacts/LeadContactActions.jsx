'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import RegisterContactModal from './RegisterContactModal';

export default function LeadContactActions({ leadId, onContactRegistered }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContactSubmit = contactData => {
    onContactRegistered(contactData);
    setIsModalOpen(false);
  };

  return (
    <div className='flex justify-end mb-4'>
      <Button size='sm' onClick={() => setIsModalOpen(true)} className='gap-1'>
        <Plus className='h-4 w-4' />
        Registrar contacto
      </Button>

      <RegisterContactModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        leadId={leadId}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
}
