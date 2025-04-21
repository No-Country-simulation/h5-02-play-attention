'use client';

import Dashboard from '@/features/dashboard/Dashboard';

/**
 * Página principal - Dashboard Admin
 * Siguiendo el principio de Responsabilidad Única (SRP), esta página solo se encarga
 * de renderizar el componente principal del dashboard
 */
export default function HomePage() {
  return <Dashboard />;
}
