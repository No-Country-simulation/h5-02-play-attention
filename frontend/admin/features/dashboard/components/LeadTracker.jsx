'use client';

import { mockLeads } from '@/features/crm/lib/config/mock-data';
import LeadTrackerComponent from '@/features/crm/components/LeadTracker';

/**
 * Componente wrapper para mostrar el LeadTracker en el dashboard
 * Sigue el principio de DRY reutilizando el componente base de leads
 */
export default function LeadTracker() {
  // Pasa los datos mock y habilita el enlace para ver todos los leads
  return <LeadTrackerComponent leads={mockLeads} showDetailLink={true} />;
}
