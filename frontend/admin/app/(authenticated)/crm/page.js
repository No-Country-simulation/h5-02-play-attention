'use client';

import { Suspense } from 'react';
import LeadManager from '@/features/crm/LeadManager';

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className='p-4 text-center'>Cargando...</div>}>
      <LeadManager />
    </Suspense>
  );
}
