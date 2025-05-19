'use client';

import { Toaster as SonnerToaster } from 'sonner';

/**
 * Componente Toaster para mostrar notificaciones
 * Utiliza la librería Sonner para mostrar toasts modernos y accesibles
 */
export function Toaster() {
  return (
    <SonnerToaster
      position='top-right'
      toastOptions={{
        duration: 5000,
        className: 'bg-background text-foreground border-border',
        descriptionClassName: 'text-muted-foreground'
      }}
    />
  );
}

// Exportamos la función toast de sonner para usarla en la aplicación
export { toast } from 'sonner';
