import React from 'react';
import PageHeader from '@/shared/ui/page-header';

/**
 * Página de dashboard protegida
 */
export default function DashboardPage() {
  return (
    <div className='container py-8'>
      <PageHeader
        title='Panel de Control'
        description='Vista general del sistema y acciones rápidas'
      />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
        {/* Contenido del dashboard */}
      </div>
    </div>
  );
}
