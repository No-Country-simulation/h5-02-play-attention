'use client';

import Sidebar from '@/shared/layout/sidebar/sidebar';
import { Toaster } from '@/shared/ui/toast';

/**
 * Layout para todas las páginas autenticadas
 * Se aplica a todas las rutas excepto login y otras públicas
 */
export default function AuthenticatedLayout({ children }) {
  return (
    <div className='flex min-h-screen flex-col md:flex-row'>
      <Sidebar />
      <main className='flex-1 overflow-auto px-4 pt-16 md:pt-6 pb-6 relative'>
        {children}
        <Toaster />
      </main>
    </div>
  );
}
