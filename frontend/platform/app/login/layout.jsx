'use client';

import { Toaster } from "@/shared/ui/sonner";


/**
 * Layout específico para la página de login
 * No muestra el sidebar y ocupa toda la pantalla
 */
export default function LoginLayout({ children }) {
  return (
    <div className='min-h-screen'>
      {children}
      <Toaster />
    </div>
  );
}